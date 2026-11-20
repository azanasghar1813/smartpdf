import React from 'react';
import { ShieldCheck, Lock, Trash2, Cpu } from 'lucide-react';
import { getTranslations } from '../../i18n/translations';
import { parsePath } from '../../utils/url';

interface SecurityBannerProps {
  currentLang?: string;
}

export const SecurityBanner: React.FC<SecurityBannerProps> = ({ currentLang }) => {
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);

  const securityPillars = [
    {
      title: 'In-Browser Privacy First',
      description: 'Core tools (Merge, Split, Rotate, Image-to-PDF, Watermark) run entirely inside your browser via WebAssembly. Your files never leave your computer.',
      icon: Cpu,
    },
    {
      title: 'Zero-Retention Ephemeral Storage',
      description: 'Files uploaded for heavy server conversions are permanently destroyed via automated shredding within 60 minutes or immediately upon download.',
      icon: Trash2,
    },
    {
      title: 'End-to-End TLS 256-Bit SSL',
      description: 'All server data exchanges occur over banking-grade encrypted HTTPS pipelines, protecting your documents against interception.',
      icon: Lock,
    },
    {
      title: 'No Data Harvesting or Selling',
      description: 'We do not inspect, index, train AI on, or share user documents. Your documents and intellectual property belong strictly to you.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.securityBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.securityHeading}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.securitySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPillars.map((p) => {
            const IconComp = p.icon;
            return (
              <div
                key={p.title}
                className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/60 hover:border-brand-500/40 transition-colors space-y-3"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
