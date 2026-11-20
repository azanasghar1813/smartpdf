import React from 'react';
import { UploadCloud, Sliders, DownloadCloud } from 'lucide-react';
import { getTranslations } from '../../i18n/translations';
import { parsePath } from '../../utils/url';

interface HowItWorksProps {
  currentLang?: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ currentLang }) => {
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);

  const steps = [
    {
      step: '01',
      title: t.step1Title,
      description: t.step1Desc,
      icon: UploadCloud,
    },
    {
      step: '02',
      title: t.step2Title,
      description: t.step2Desc,
      icon: Sliders,
    },
    {
      step: '03',
      title: t.step3Title,
      description: t.step3Desc,
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            {t.howItWorksBadge}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.howItWorksHeading}
          </h2>
          <p className="text-sm text-slate-500">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-slate-50/80 rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:border-brand-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 select-none">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
