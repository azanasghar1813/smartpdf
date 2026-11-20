import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Last Updated: November 2026 • Please read carefully before using SimplePDF
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong>SimplePDF</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Permitted Use</h2>
            <p>
              You agree to use SimplePDF solely for lawful purposes. You must not upload or process any files that contain malicious software, violate intellectual property rights, or infringe on personal privacy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Intellectual Property of Documents</h2>
            <p>
              You retain 100% full ownership, copyright, and title to all documents processed on SimplePDF. We do not claim any rights, licensing, or intellectual ownership over user files.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" and "as available". While we strive for 100% conversion precision, complex document layouts (e.g. OCR and damaged PDF repairs) may experience formatting variations depending on the source document structure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
