'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { questions } from '@/lib/questions';

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

  if (selectedSubmission) {
    const answerMap = new Map(selectedSubmission.answers.map((a: any) => [a.question_id, a.answer_text]));
    
    return (
      <div className="p-8">
        <button onClick={() => setSelectedSubmission(null)} className="mb-4 text-blue-600">← Back</button>
        <h1 className="text-2xl font-bold mb-6">Submission Details</h1>
        {questions.map((q) => (
          <div key={q.id} className="mb-6 border-b pb-4">
            <p className="font-semibold">{q.text}</p>
            <p className="text-gray-700">{String(answerMap.get(q.id) || '(No answer)')}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin - All Submissions</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Submitted At</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              <td className="p-2 border">{sub.user_id}</td>
              <td className="p-2 border">{sub.status}</td>
              <td className="p-2 border">{sub.submitted_at || 'In progress'}</td>
              <td className="p-2 border">
                <button onClick={() => viewSubmission(sub)} className="text-blue-600">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
