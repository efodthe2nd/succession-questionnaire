'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { questions } from '@/lib/questions';

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
  // Try to find a story or meaningful text answer
  const storyAnswer = answers.find((a: any) => a.answer_text && a.answer_text.length > 50);
  if (storyAnswer) {
    const text = storyAnswer.answer_text;
    return text.length > 120 ? text.substring(0, 120) + '..' : text;
  }
  // Fallback to first non-empty answer
  const firstAnswer = answers.find((a: any) => a.answer_text);
  if (firstAnswer) {
    const text = firstAnswer.answer_text;
    return text.length > 120 ? text.substring(0, 120) + '..' : text;
  }
  return '';
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data } = await supabase
        .from('submissions')
        .select('*, answers(*)')
        .order('created_at', { ascending: false });
      setSubmissions(data || []);
    };
    fetchSubmissions();
  }, [supabase]);

  const viewSubmission = (submission: any) => {
    setSelectedSubmission(submission);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
  };

  const exportAll = () => {
    // Export functionality placeholder
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'submissions.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get name from submission answers
  const getSubmissionName = (submission: any) => {
    const signatureAnswer = submission.answers?.find((a: any) => a.question_id === 'q7_5');
    return signatureAnswer?.answer_text || 'Anonymous';
  };

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
        <button
          onClick={exportAll}
          className="px-8 py-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors text-lg font-medium"
        >
          Export All
        </button>
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

          return (
            <div
              key={sub.id}
              onClick={() => viewSubmission(sub)}
              className="bg-[#1a1a1a] rounded-xl p-6 cursor-pointer hover:bg-[#222] transition-colors"
            >
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
              {/* Preview text */}
              {preview && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {preview}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for viewing submission details */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a1a1a] rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1a1a1a] p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>
                    {getSubmissionName(selectedSubmission)}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Submitted on {formatDate(selectedSubmission.submitted_at || selectedSubmission.created_at)}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-2xl font-light transition-colors"
                >
                  X
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {(() => {
                const answerMap = new Map(selectedSubmission.answers.map((a: any) => [a.question_id, a.answer_text]));

                // Only show questions that have answers
                const answeredQuestions = questions.filter(q => {
                  const answer = answerMap.get(q.id);
                  return answer && answer.toString().trim() !== '';
                });

                return answeredQuestions.map((q) => (
                  <div key={q.id}>
                    <h3 className="text-white text-lg font-medium mb-3">
                      {q.text}
                    </h3>
                    <div className="border-l-2 border-gray-600 pl-4">
                      <p className="text-gray-400 leading-relaxed">
                        {String(answerMap.get(q.id))}
                      </p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
