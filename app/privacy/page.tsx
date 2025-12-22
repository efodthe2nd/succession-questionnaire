'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function PrivacyPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDeleteData = async () => {
    setIsDeleting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Get user's submissions
        const { data: submissions } = await supabase
          .from('submissions')
          .select('id')
          .eq('user_id', user.id);

        if (submissions && submissions.length > 0) {
          // Delete all answers for user's submissions
          for (const submission of submissions) {
            await supabase
              .from('answers')
              .delete()
              .eq('submission_id', submission.id);
          }

          // Delete all submissions
          await supabase
            .from('submissions')
            .delete()
            .eq('user_id', user.id);
        }

        // Sign out user
        await supabase.auth.signOut();

        setDeleteSuccess(true);

        // Redirect after showing success message
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('An error occurred while deleting your data. Please try again.');
    }

    setIsDeleting(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('/bg-succession.png')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Logo - Fixed top left */}
      <div className="fixed top-8 left-8 z-20">
        <Link href="/" className="text-white text-sm tracking-wide font-medium hover:text-[#B5A692] transition-colors">
          Succession Story
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mt-16 pb-24">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center">
          <span className="text-white">Privacy </span>
          <span className="text-[#B5A692]">Policy</span>
        </h1>

        {/* Content Container */}
        <div className="bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <p className="text-white/60 text-sm mb-6">
            Last Updated: December 2025
          </p>

          <p className="text-white/80 leading-relaxed mb-6">
            Succession Story values your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and digital services.
          </p>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
              <p className="leading-relaxed mb-3">We may collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Personal information you voluntarily provide, such as your name and email address</li>
                <li>Written responses you enter into the Succession Story questionnaire</li>
                <li>Optional information you choose to include in your story</li>
                <li>Basic technical data, such as browser type, device type, or IP address</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We strongly discourage that you enter and we do not require any sensitive personal identifiers such as Social Security numbers, government identification numbers, or financial account numbers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">Your information is used solely to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Generate your Succession Story</li>
                <li>Deliver your completed letter to you</li>
                <li>Provide customer support</li>
                <li>Improve the quality and experience of the product</li>
              </ul>
              <p className="leading-relaxed mt-3 font-semibold">
                We will never sell or share your personal information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Legal Basis for Processing</h2>
              <p className="leading-relaxed mb-3">
                If you are located in the European Union, we process your personal information based on one or more of the following legal grounds:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Your consent</li>
                <li>The performance of a contract, meaning providing the services you request</li>
                <li>Our legitimate interest in operating and improving the service in a secure and reliable manner</li>
              </ul>
              <p className="leading-relaxed mt-3">
                You may withdraw your consent at any time by deleting your information or contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">AI Processing</h2>
              <p className="leading-relaxed">
                Your questionnaire responses may be processed by AI systems for the sole purpose of generating your Succession Story. These systems function only as writing tools and do not provide legal, tax, or financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Storage and Retention</h2>
              <p className="leading-relaxed mb-3">
                Your information is stored securely and only for as long as necessary to provide the Succession Story service.
              </p>
              <p className="leading-relaxed mb-3">
                You are always in control of your data. At any time, you may permanently delete your information by using the "Delete My Information" button available below.
              </p>
              <p className="leading-relaxed">
                Your data is stored securely. You may request deletion of your information at any time. Unless otherwise required for operational purposes, we do not retain your data longer than necessary to provide the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Your Privacy Rights</h2>
              <p className="leading-relaxed mb-3">Depending on where you live, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information</li>
                <li>Restrict or object to certain data processing</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We will respond to verified requests within the timeframes required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">California Privacy Rights</h2>
              <p className="leading-relaxed mb-3">
                If you are a California resident, you have rights under the California Consumer Privacy Act, as amended by the California Privacy Rights Act. These include the right to know, delete, correct, and opt out of the sale or sharing of personal information.
              </p>
              <p className="leading-relaxed">
                Succession Story does not sell or share personal information as defined by California law. We do not discriminate against users for exercising their privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Texas Privacy Rights</h2>
              <p className="leading-relaxed">
                If you are a Texas resident, you have rights under the Texas Data Privacy and Security Act, including the right to access, correct, delete, and opt out of certain processing of your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">European Union Privacy Rights</h2>
              <p className="leading-relaxed mb-3">
                If you are located in the European Union, you have the following rights under the General Data Protection Regulation:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>The right to access your personal data</li>
                <li>The right to rectification of inaccurate data</li>
                <li>The right to erasure of your personal data</li>
                <li>The right to restrict processing</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
                <li>The right to lodge a complaint with a supervisory authority</li>
              </ul>
              <p className="leading-relaxed mt-3">
                You may exercise these rights by using the tools on our website or contacting us at successionstory.now@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">International Data Transfers</h2>
              <p className="leading-relaxed">
                If you are located outside the United States, your information may be transferred to and processed in the United States. We take reasonable steps to ensure appropriate safeguards are in place for such transfers, consistent with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Security</h2>
              <p className="leading-relaxed">
                We take reasonable administrative and technical measures to protect your information from unauthorized access, loss, or misuse. However, no digital system can be guaranteed to be completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Children's Privacy</h2>
              <p className="leading-relaxed">
                Succession Story is intended for adults. We do not knowingly collect personal information from individuals under the age of 13. If you believe a child has provided personal information, please contact us so we can promptly delete it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. Continued use of the service constitutes acceptance of any updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p className="leading-relaxed">
                For privacy related questions or requests, contact us at{' '}
                <a href="mailto:successionstory.now@gmail.com" className="text-[#B5A692] hover:underline">
                  successionstory.now@gmail.com
                </a>.
              </p>
            </section>
          </div>

          {/* Delete My Information Section */}
          <div className="mt-10 pt-8 border-t border-white/20">
            <h2 className="text-xl font-semibold text-white mb-3">Delete My Information</h2>
            <p className="text-white/60 mb-4">
              If you want to delete your information, click the button below. This permanently removes all data associated with your account. This action cannot be undone.
            </p>
            <p className="text-white/60 mb-4">
              If you click this button, all of your data, including your answers to the questionnaire, any stories you wrote, will be permanently erased. Only your login information will remain.
            </p>
            <p className="text-white/60 mb-4 font-semibold">
              This action is final. It cannot be reversed.
            </p>
            <p className="text-white/60 mb-6">
              After you click the button, you will have to start over from scratch. Once deleted, your information cannot be recovered. Deletion removes your questionnaire responses, generated content, and associated personal data from our active systems, except where limited retention is required for legal, security, or operational purposes.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-300"
            >
              Delete My Information
            </button>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>

      {/* Footer links */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-sm z-20">
        <a href="/terms" className="hover:text-[#B5A692] transition-colors">Terms</a>
        <span className="text-[#B5A692]">Privacy</span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border border-white/10">
            {deleteSuccess ? (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Data Deleted</h3>
                  <p className="text-white/60">
                    All your information has been permanently deleted. You will be redirected to the homepage.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">Are you sure?</h3>
                <p className="text-white/60 mb-6">
                  This will permanently delete all your personal information, including your questionnaire responses and any saved progress. This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 bg-transparent border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteData}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : "Yes, I'm sure"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
