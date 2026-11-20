import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const fullFaqs = [
    {
      q: 'Is SimplePDF really 100% free?',
      a: 'Yes! All core tools (including Merge PDF, Split PDF, Rotate PDF, JPG to PDF, Add Watermark, and Page Numbers) are completely free with generous file allowances. You do not need to enter a credit card or create an account for essential tasks.',
    },
    {
      q: 'How does in-browser client-side processing protect my privacy?',
      a: 'We leverage WebAssembly and modern browser capabilities so that your documents never leave your computer or phone for essential tasks. The merging, splitting, and rotating happen directly in your device’s local memory.',
    },
    {
      q: 'How long are uploaded files retained on your servers?',
      a: 'For tasks that require cloud conversion (such as OCR or Microsoft Office formats), files are permanently destroyed within 60 minutes via an automated cryptographic zero-fill shredder daemon, or deleted immediately upon download.',
    },
    {
      q: 'Can I use SimplePDF on mobile devices (iPhone, iPad, Android)?',
      a: 'Yes, our platform is fully responsive and optimized for mobile touchscreens. You can merge, convert, and sign PDF documents directly from your smartphone browser.',
    },
    {
      q: 'What is included in the Premium Pro ($4.99/mo) plan?',
      a: 'Pro unlocks 200MB file allowances, unlimited simultaneous batch queues, high-speed priority servers, AI Document Intelligence credits, full OCR scanned-PDF text extraction, and an ad-free clean experience.',
    },
    {
      q: 'How do I cancel my Premium subscription?',
      a: 'You can cancel anytime directly from your User Dashboard with a single click. You will retain access until the end of your billing cycle with zero cancellation fees.',
    },
  ];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Answers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Find answers to commonly asked questions about tools, file security, and subscription plans.
          </p>
        </div>

        <div className="space-y-4">
          {fullFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-base text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
