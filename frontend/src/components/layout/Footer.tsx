import React, { useMemo } from 'react';
import { ALL_TOOLS, CATEGORIES_CONFIG } from '../../data/tools';
import { getLocalizedAllTools, getLocalizedCategories } from '../../data/localizedTools';
import { getTranslations } from '../../i18n/translations';
import { parsePath, formatLocalizedPath } from '../../utils/url';
import { FileText, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  currentPath?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentPath }) => {
  const activePath = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const { lang } = parsePath(activePath);
  const t = getTranslations(lang);

  const localizedTools = useMemo(() => getLocalizedAllTools(lang), [lang]);
  const localizedCategories = useMemo(() => getLocalizedCategories(lang), [lang]);

  const formatPath = (rawPath: string) => formatLocalizedPath(rawPath, lang);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <a
              href={formatPath('/')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(formatPath('/'));
              }}
              className="inline-flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Simple<span className="text-brand-500">PDF</span>
              </span>
            </a>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {t.footerTagline}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {t.footerPillZeroRetention}
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                {t.footerPillEncryption}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                {t.footerPillEdge}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3">
              {t.companyAndHelp}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={formatPath('/pricing')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/pricing')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.pricingPlans}
                </a>
              </li>
              <li>
                <a
                  href={formatPath('/blog')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/blog')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.blogAndTutorials}
                </a>
              </li>
              <li>
                <a
                  href={formatPath('/about')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/about')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.aboutUs}
                </a>
              </li>
              <li>
                <a
                  href={formatPath('/contact')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/contact')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.contactSupport}
                </a>
              </li>
              <li>
                <a
                  href={formatPath('/faq')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/faq')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.faq}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3">
              {t.legalAndPrivacy}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={formatPath('/privacy')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/privacy')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.privacy}
                </a>
              </li>
              <li>
                <a
                  href={formatPath('/terms')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/terms')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.terms}
                </a>
              </li>
              <li>
                <a
                  href={formatPath('/security')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/security')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.security}
                </a>
              </li>
              <li>
                <a
                  href={formatPath('/cookies')}
                  onClick={(e) => { e.preventDefault(); onNavigate(formatPath('/cookies')); }}
                  className="hover:text-brand-400 transition-colors"
                >
                  {t.cookies}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Categorized Tools Directory (Crawlable Anchor Links) */}
        <div className="py-12 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {localizedCategories.map((cat) => (
            <div key={cat.id} className="space-y-2.5">
              <h5 className="text-white font-semibold text-xs uppercase tracking-wider">
                {cat.name}
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {localizedTools.filter((t) => t.category === cat.id).map((tool) => (
                  <li key={tool.id}>
                    <a
                      href={formatPath(tool.path)}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(formatPath(tool.path));
                      }}
                      className="hover:text-brand-400 transition-colors text-left block truncate"
                    >
                      {tool.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t.copyright}</p>
          <p className="flex items-center gap-1">
            Made with <Sparkles className="w-3.5 h-3.5 text-brand-500" /> for users worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
