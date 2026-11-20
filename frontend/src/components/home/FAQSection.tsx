import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getLocalizedGlobalFaqs } from '../../data/faqs';
import { getTranslations } from '../../i18n/translations';
import { parsePath } from '../../utils/url';

interface FAQSectionProps {
  currentLang?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ currentLang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);
  const faqs = getLocalizedGlobalFaqs(activeLang);

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{t.faqBadge}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.faqHeading}
          </h2>
          <p className="text-sm text-slate-500">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-base text-slate-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.a}
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
