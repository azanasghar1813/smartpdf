import React from 'react';
import { ShieldCheck, Lock, Trash2, Database } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy First Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Last Updated: November 2026 • Compliance: GDPR, CCPA, and ISO-standard document processing
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Overview & Core Privacy Guarantee</h2>
            <p>
              At <strong>SimplePDF</strong>, we recognize that your documents often contain sensitive personal, financial, academic, or corporate information. Our architecture is deliberately designed to minimize or entirely eliminate the storage and transmission of your files.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. In-Browser (Client-Side) Processing</h2>
            <p>
              Whenever technically possible, operations such as <strong>Merge PDF, Split PDF, Rotate PDF, JPG to PDF, Add Watermark, and Page Numbering</strong> execute 100% inside your web browser using WebAssembly and client-side JavaScript. 
              Under this mode, your documents are never uploaded to any remote server or third-party cloud.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Ephemeral Cloud Storage & Automatic Deletion</h2>
            <p>
              For conversions that require heavy server-side processing (such as OCR, Microsoft Office conversions, and document repair), files are transferred via end-to-end 256-bit encrypted TLS channels.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Files are stored temporarily on isolated volumes with randomized cryptographic identifiers.</li>
              <li>All uploaded and processed documents are automatically shredded and unlinked within <strong>60 minutes</strong> or immediately after you download them.</li>
              <li>We never inspect, read, copy, or index the contents of your documents.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Advertising & Google AdSense Disclosures</h2>
            <p>
              To maintain our free tools, we partner with advertising networks such as Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on prior visits to our website or other websites on the internet.
              Users may opt out of personalized advertising by visiting Google Ads Settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Contact Our Data Protection Officer</h2>
            <p>
              If you have any questions or data protection inquiries, you can contact our privacy team at: <code className="bg-slate-100 px-2 py-0.5 rounded text-brand-600 font-semibold">privacy@simplepdf.com</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
