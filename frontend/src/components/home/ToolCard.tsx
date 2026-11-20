import React from 'react';
import { ToolMeta } from '../../types';
import { Icon } from '../common/Icon';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';
import { getTranslations } from '../../i18n/translations';
import { parsePath, formatLocalizedPath } from '../../utils/url';

interface ToolCardProps {
  tool: ToolMeta;
  onSelect: (path: string) => void;
  currentLang?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, currentLang }) => {
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);

  return (
    <div
      onClick={() => onSelect(formatLocalizedPath(tool.path, activeLang))}
      className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-soft-lg hover:border-brand-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Icon + Badge */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-600 text-slate-700 flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-xs">
            <Icon name={tool.icon} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isClientSide && (
              <span
                title={t.clientPrivacyBadge}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
              >
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>Private</span>
              </span>
            )}
            {tool.badge === 'Popular' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                HOT
              </span>
            )}
            {tool.badge === 'AI' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            )}
            {tool.badge === 'Pro' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                Pro
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Card Action Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-brand-600 transition-colors">
        <span>{t.openTool}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
