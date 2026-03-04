'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { questions } from '@/lib/questions';

// Admin credentials - in production, use environment variables
const ADMIN_EMAIL = 'admin@successionstory.now';
const ADMIN_PASSWORD = 'admin123';
// Must match ADMIN_SECRET_TOKEN in your .env.local
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || '';

// Helper to generate initials from name
const getInitials = (name: string) => {
  if (!name) return 'NA';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper to format date
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                 day === 2 || day === 22 ? 'nd' :
                 day === 3 || day === 23 ? 'rd' : 'th';
  return `${day}${suffix} ${month} ${year}`;
};

// Helper to get a preview snippet from answers
const getPreviewText = (answers: any[]) => {
  if (!answers || answers.length === 0) return '';
  const storyAnswer = answers.find((a: any) => a.answer_text && a.answer_text.length > 50);
  if (storyAnswer) {
    const text = storyAnswer.answer_text;
    return text.length > 120 ? text.substring(0, 120) + '..' : text;
  }
  const firstAnswer = answers.find((a: any) => a.answer_text);
  if (firstAnswer) {
    const text = firstAnswer.answer_text;
    return text.length > 120 ? text.substring(0, 120) + '..' : text;
  }
  return '';
};

/**
 * DYNAMIC ANSWER RESOLUTION
 * -------------------------
 * These helpers handle question IDs that are generated dynamically in the frontend
 * (e.g. q3_child_0_message, q5_asset_1_story) and thus don't exist in the static
 * questions library.
 */

interface DynamicGroup {
  title: string;
  fields: { label: string; value: string }[];
}

const groupDynamicAnswers = (answerMap: Map<string, any>, staticQuestionIds: Set<string>): DynamicGroup[] => {
  const unmatchedKeys = Array.from(answerMap.keys()).filter(key => !staticQuestionIds.has(key));
  console.log('[groupDynamicAnswers] Unmatched keys found:', unmatchedKeys);
  const groups: Record<string, DynamicGroup> = {};

  unmatchedKeys.forEach(key => {
    let groupKey = '';
    let groupTitle = '';
    let fieldLabel = '';
    const value = answerMap.get(key);

    if (!value || value.toString().trim() === '') {
      return;
    }

    // Pattern: q3_child_{index}_{field}
    const childMatch = key.match(/^q3_child_(\d+)_(.+)$/);
    if (childMatch) {
      const index = parseInt(childMatch[1], 10);
      groupKey = `child_${index}`;
      const childName = answerMap.get(`q3_child_${index}_name`);
      groupTitle = childName ? `Child: ${childName}` : `Child ${index + 1}`;
      fieldLabel = childMatch[2].charAt(0).toUpperCase() + childMatch[2].slice(1).replace(/_/g, ' ');
    }
    // Pattern: q3_spouse_{index}_{field}
    else if (key.match(/^q3_spouse_/)) {
      const spouseMatch = key.match(/^q3_spouse_(\d+)_(.+)$/);
      if (spouseMatch) {
        const index = parseInt(spouseMatch[1], 10);
        groupKey = `spouse_${index}`;
        const spouseName = answerMap.get(`q3_spouse_${index}_name`);
        groupTitle = spouseName ? `Spouse: ${spouseName}` : `Significant Other ${index + 1}`;
        fieldLabel = spouseMatch[2].charAt(0).toUpperCase() + spouseMatch[2].slice(1).replace(/_/g, ' ');
      }
    }
    // Pattern: q5_asset_{index}_{field}
    else if (key.match(/^q5_asset_/)) {
      const assetMatch = key.match(/^q5_asset_(\d+)_(.+)$/);
      if (assetMatch) {
        const index = parseInt(assetMatch[1], 10);
        groupKey = `asset_${index}`;
        const assetName = answerMap.get(`q5_asset_${index}_name`);
        groupTitle = assetName ? `Asset: ${assetName}` : `Asset ${index + 1}`;
        fieldLabel = assetMatch[2].charAt(0).toUpperCase() + assetMatch[2].slice(1).replace(/_/g, ' ');
      }
    }
    // Pattern: additional stories
    else if (key.includes('_additional_')) {
      groupKey = 'additional_stories';
      groupTitle = 'Additional Stories';
      fieldLabel = 'Story';
    }
    // Fallback
    else {
      groupKey = 'other';
      groupTitle = 'Additional Information';
      fieldLabel = key.replace(/_/g, ' ');
    }

    if (!groups[groupKey]) {
      groups[groupKey] = { title: groupTitle, fields: [] };
    }
    groups[groupKey].fields.push({ label: fieldLabel, value: String(value) });
  });

  return Object.values(groups);
};

// ─── Send Letter State per submission ────────────────────────────────────────
interface SendLetterState {
  isOpen: boolean;
  file: File | null;
  isSending: boolean;
  success: boolean;
  error: string | null;
}

const defaultSendState = (): SendLetterState => ({
  isOpen: false,
  file: null,
  isSending: false,
  success: false,
  error: null,
});

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  // Map of submissionId -> send letter state
  const [sendStates, setSendStates] = useState<Record<string, SendLetterState>>({});
  const supabase = createClient();

  // Check if admin is already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = sessionStorage.getItem('adminAuthenticated');
      if (adminAuth === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Fetch submissions when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/submissions', {
          headers: { 'x-admin-token': ADMIN_TOKEN },
        });
        const result = await response.json();

        if (response.ok) {
          setSubmissions(result.submissions || []);
        } else {
          console.error('Failed to fetch submissions:', result.error);
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      }
    };

    fetchSubmissions();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid admin credentials');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const viewSubmission = (submission: any) => {
    setSelectedSubmission(submission);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
  };

  // Get name from submission answers
  const getSubmissionName = (submission: any) => {
    const signatureAnswer = submission.answers?.find((a: any) => a.question_id === 'q7_5');
    return signatureAnswer?.answer_text || 'Anonymous';
  };

  // ─── Send Letter Helpers ────────────────────────────────────────────────────

  const getSendState = (submissionId: string): SendLetterState =>
    sendStates[submissionId] || defaultSendState();

  const updateSendState = (submissionId: string, patch: Partial<SendLetterState>) => {
    setSendStates(prev => ({
      ...prev,
      [submissionId]: { ...getSendState(submissionId), ...patch },
    }));
  };

  const handleSendLetter = async (submissionId: string) => {
    const state = getSendState(submissionId);
    if (!state.file) return;

    updateSendState(submissionId, { isSending: true, error: null });

    try {
      const formData = new FormData();
      formData.append('submission_id', submissionId);
      formData.append('pdf', state.file);

      const response = await fetch('/api/admin/send-letter', {
        method: 'POST',
        headers: { 'x-admin-token': ADMIN_TOKEN },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        updateSendState(submissionId, { isSending: false, success: true, file: null });
      } else {
        updateSendState(submissionId, {
          isSending: false,
          error: result.error || 'Failed to send letter',
        });
      }
    } catch (err) {
      updateSendState(submissionId, {
        isSending: false,
        error: 'Network error. Please try again.',
      });
    }
  };

  // Format submission as readable text for export
  const formatSubmissionAsText = (submission: any) => {
    const name = getSubmissionName(submission);
    const date = formatDate(submission.submitted_at || submission.created_at);
    const answerMap = new Map<string, any>(
      submission.answers?.map((a: any) => [a.question_id, a.answer_text]) || []
    );

    let text = `SUCCESSION STORY - LEGACY LETTER\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Name: ${name}\n`;
    text += `Submitted: ${date}\n\n`;
    text += `${'='.repeat(50)}\n\n`;

    const answeredQuestions = questions.filter(q => {
      const answer = answerMap.get(q.id);
      return answer && answer.toString().trim() !== '';
    });

    answeredQuestions.forEach((q) => {
      text += `${q.text}\n`;
      text += `${'-'.repeat(40)}\n`;
      text += `${answerMap.get(q.id)}\n\n`;
    });

    const staticIds = new Set(questions.map(q => q.id));
    const dynamicGroups = groupDynamicAnswers(answerMap, staticIds);

    if (dynamicGroups.length > 0) {
      text += `DYNAMIC DATA\n`;
      text += `${'-'.repeat(40)}\n\n`;
      dynamicGroups.forEach(group => {
        text += `[ ${group.title.toUpperCase()} ]\n`;
        group.fields.forEach(field => {
          text += `${field.label}: ${field.value}\n`;
        });
        text += `\n`;
      });
    }

    text += `\n${'='.repeat(50)}\n`;
    text += `Generated by Succession Story\n`;

    return text;
  };

  // Export individual submission as TXT
  const exportSubmission = (submission: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = formatSubmissionAsText(submission);
    const name = getSubmissionName(submission);
    const fileName = `${name.replace(/[^a-z0-9]/gi, '_')}_legacy_letter.txt`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export all submissions
  const exportAll = () => {
    if (submissions.length === 0) {
      alert('No submissions to export');
      return;
    }

    let allText = `SUCCESSION STORY - ALL SUBMISSIONS\n`;
    allText += `${'='.repeat(50)}\n`;
    allText += `Total Submissions: ${submissions.length}\n`;
    allText += `Export Date: ${new Date().toLocaleDateString()}\n\n`;

    submissions.forEach((submission, index) => {
      allText += `\n${'#'.repeat(50)}\n`;
      allText += `SUBMISSION ${index + 1} of ${submissions.length}\n`;
      allText += `${'#'.repeat(50)}\n\n`;
      allText += formatSubmissionAsText(submission);
    });

    const blob = new Blob([allText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_submissions_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-[#B5A692] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/bg-succession.png')" }}
        />
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="fixed top-8 left-8 z-20">
          <p className="text-white text-sm tracking-wide font-medium">Succession Story</p>
        </div>
        <div className="relative z-10 w-full max-w-md">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-center leading-tight">
            <span className="text-white">Admin </span>
            <span className="text-[#B5A692]">Panel</span>
          </h1>
          <p className="text-white/60 text-center mb-8">
            Secure access for administrators only
          </p>
          <div className="bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-white text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50 focus:outline-none focus:border-[#B5A692] transition-colors"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50 focus:outline-none focus:border-[#B5A692] transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 mt-2"
              >
                {loginLoading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[#0d0d0d] p-8 md:p-12 lg:p-16">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Lora, serif' }}>
            Submissions
          </h1>
          <p className="text-gray-400 text-lg">
            Every story deserves care. Click to view details.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportAll}
            className="px-8 py-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors text-lg font-medium"
          >
            Export All
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-4 bg-transparent border border-white/30 hover:border-white/50 text-white rounded-lg transition-colors text-lg font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Submissions count */}
      <p className="text-gray-400 text-lg mb-8">
        <span className="text-white font-semibold">{submissions.length}</span> submissions received
      </p>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((sub) => {
          const name = getSubmissionName(sub);
          const initials = getInitials(name);
          const date = formatDate(sub.submitted_at || sub.created_at);
          const preview = getPreviewText(sub.answers);
          const sendState = getSendState(sub.id);

          return (
            <div
              key={sub.id}
              className="bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#222] transition-colors relative group"
            >
              {/* Action buttons — export + send letter */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => exportSubmission(sub, e)}
                  className="p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg"
                  title="Export this letter"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSendState(sub.id, { isOpen: !sendState.isOpen, success: false, error: null });
                  }}
                  className="p-2 bg-[#B5A692] hover:bg-[#a59682] rounded-lg"
                  title="Send letter to client"
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <div onClick={() => viewSubmission(sub)} className="cursor-pointer">
                {/* Header with avatar and name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#4a4a4a] flex items-center justify-center text-white font-medium text-sm">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{name}</h3>
                    <p className="text-gray-500 text-sm">{date}</p>
                  </div>
                </div>
                {preview && (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {preview}
                  </p>
                )}
              </div>

              {/* Send Letter Inline Panel */}
              {sendState.isOpen && (
                <div
                  className="mt-4 pt-4 border-t border-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sendState.success ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Letter sent successfully
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Send Letter to Client</p>

                      {/* File input */}
                      <label className="block">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg cursor-pointer transition-colors border border-dashed border-gray-600 hover:border-[#B5A692]">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-gray-400 text-xs truncate">
                            {sendState.file ? sendState.file.name : 'Attach PDF...'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            updateSendState(sub.id, { file, error: null });
                          }}
                        />
                      </label>

                      {/* Error message */}
                      {sendState.error && (
                        <p className="text-red-400 text-xs">{sendState.error}</p>
                      )}

                      {/* Send button */}
                      <button
                        onClick={() => handleSendLetter(sub.id)}
                        disabled={!sendState.file || sendState.isSending}
                        className="w-full py-2 bg-[#B5A692] hover:bg-[#a59682] disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-semibold rounded-lg transition-colors"
                      >
                        {sendState.isSending ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          'Send to Client'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {submissions.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-xl">No submissions yet</p>
          <p className="text-gray-600 mt-2">Submissions will appear here once users complete the questionnaire</p>
        </div>
      )}

      {/* Modal for viewing submission details */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a1a1a] rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1a1a1a] p-6 border-b border-gray-800 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>
                    {getSubmissionName(selectedSubmission)}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Submitted on {formatDate(selectedSubmission.submitted_at || selectedSubmission.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Send Letter button in modal */}
                  <button
                    onClick={() => {
                      const state = getSendState(selectedSubmission.id);
                      updateSendState(selectedSubmission.id, { isOpen: !state.isOpen, success: false, error: null });
                    }}
                    className="px-4 py-2 bg-[#B5A692] hover:bg-[#a59682] text-black rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Letter
                  </button>
                  <button
                    onClick={() => exportSubmission(selectedSubmission)}
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Send Letter inline panel in modal */}
              {getSendState(selectedSubmission.id).isOpen && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  {getSendState(selectedSubmission.id).success ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Letter sent successfully
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <label className="flex-1">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg cursor-pointer transition-colors border border-dashed border-gray-600 hover:border-[#B5A692]">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-gray-400 text-xs truncate">
                            {getSendState(selectedSubmission.id).file
                              ? getSendState(selectedSubmission.id).file!.name
                              : 'Attach PDF...'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            updateSendState(selectedSubmission.id, { file, error: null });
                          }}
                        />
                      </label>
                      <button
                        onClick={() => handleSendLetter(selectedSubmission.id)}
                        disabled={!getSendState(selectedSubmission.id).file || getSendState(selectedSubmission.id).isSending}
                        className="px-4 py-2 bg-[#B5A692] hover:bg-[#a59682] disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        {getSendState(selectedSubmission.id).isSending ? 'Sending...' : 'Send to Client'}
                      </button>
                    </div>
                  )}
                  {getSendState(selectedSubmission.id).error && (
                    <p className="text-red-400 text-xs mt-2">{getSendState(selectedSubmission.id).error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div
              className="p-6 space-y-8 overflow-y-auto max-h-[calc(80vh-100px)] scrollbar-thin"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a3a3a #1a1a1a' }}
            >
              <style jsx>{`
                div::-webkit-scrollbar { width: 8px; }
                div::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
                div::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 4px; }
                div::-webkit-scrollbar-thumb:hover { background: #4a4a4a; }
              `}</style>
              {(() => {
                const answerMap = new Map<string, any>(
                  selectedSubmission.answers.map((a: any) => [a.question_id, a.answer_text])
                );

                const answeredQuestions = questions.filter(q => {
                  const answer = answerMap.get(q.id);
                  return answer && answer.toString().trim() !== '';
                });

                const staticIds = new Set(questions.map(q => q.id));
                const dynamicGroups = groupDynamicAnswers(answerMap, staticIds);

                return (
                  <>
                    {answeredQuestions.map((q) => (
                      <div key={q.id}>
                        <h3 className="text-white text-lg font-medium mb-3">{q.text}</h3>
                        <div className="border-l-2 border-[#B5A692] pl-4">
                          <p className="text-gray-400 leading-relaxed">
                            {String(answerMap.get(q.id))}
                          </p>
                        </div>
                      </div>
                    ))}

                    {dynamicGroups.length > 0 && (
                      <div className="pt-8 border-t border-gray-800">
                        <h2 className="text-[#B5A692] text-xl font-bold mb-8 uppercase tracking-wider">
                          Dynamic Detail Information
                        </h2>
                        <div className="space-y-10">
                          {dynamicGroups.map((group, gIdx) => (
                            <div key={gIdx} className="space-y-4">
                              <h3 className="text-white text-lg font-semibold border-b border-gray-800 pb-2">
                                {group.title}
                              </h3>
                              <div className="grid grid-cols-1 gap-4">
                                {group.fields.map((field, fIdx) => (
                                  <div key={fIdx} className="bg-[#2a2a2a] p-4 rounded-xl">
                                    <p className="text-[#B5A692] text-xs font-bold uppercase mb-1">{field.label}</p>
                                    <p className="text-gray-300 whitespace-pre-wrap">{field.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}