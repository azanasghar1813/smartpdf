import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Is SimplePDF really free to use?',
      answer: 'Yes! All essential PDF tools (including Merge PDF, Split PDF, Rotate, JPG to PDF, Watermark, and Page Numbers) are 100% free with generous file size limits. There are no surprise watermarks or mandatory signups required to use our essential tools.',
    },
    {
      question: 'How do you guarantee my files remain private and secure?',
      answer: 'We utilize a unique hybrid processing model. For operations like merging, splitting, rotating, and numbering pages, the processing happens 100% inside your browser using WebAssembly. That means your documents never even leave your device! For complex server conversions, files are encrypted during transit (TLS 256-bit) and permanently destroyed within 60 minutes.',
    },
    {
      question: 'What is the maximum file size limit for free users?',
      answer: 'Free guest users can process files up to 50MB for in-browser tools and up to 25MB for cloud conversions. Premium subscribers unlock enlarged allowances up to 200MB per file and unlimited batch processing queues.',
    },
    {
      question: 'Can I use SimplePDF on my smartphone or tablet?',
      answer: 'Absolutely. SimplePDF is fully responsive and designed to work seamlessly on all iOS (iPhone/iPad) and Android mobile browsers without installing any third-party app.',
    },
    {
      question: 'What are the benefits of upgrading to Premium?',
      answer: 'Premium unlocks batch conversion, high-speed priority servers, AI Document Intelligence credits, full OCR scanned-PDF text extraction, increased file size limits, and an ad-free clean experience.',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to know about SimplePDF, file security, and our tools.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-base text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
