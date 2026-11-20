import React, { useState, useMemo } from 'react';
import { ALL_TOOLS } from '../../data/tools';
import { getLocalizedAllTools } from '../../data/localizedTools';
import { getTranslations } from '../../i18n/translations';
import { parsePath, formatLocalizedPath } from '../../utils/url';
import { Icon } from '../common/Icon';
import { Search, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { ToolMeta } from '../../types';

interface HeroProps {
  onSelectTool: (path: string) => void;
  currentLang?: string;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTool, currentLang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);

  const localizedTools = useMemo(() => getLocalizedAllTools(activeLang), [activeLang]);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return localizedTools
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.seoKeywords.some((k) => k.toLowerCase().includes(query))
      )
      .slice(0, 6);
  }, [localizedTools, searchQuery]);

  // Quick pills with localized names
  const quickPillIds = [
    'merge-pdf',
    'compress-pdf',
    'pdf-to-word',
    'jpg-to-pdf',
    'rotate-pdf',
    'protect-pdf',
  ];

  const quickPills = useMemo(() => {
    return quickPillIds.map((id) => {
      const tool = localizedTools.find((t) => t.id === id) || ALL_TOOLS.find((t) => t.id === id);
      return {
        label: tool ? tool.name : id,
        path: formatLocalizedPath(tool ? tool.path : `/${id}`, activeLang),
      };
    });
  }, [localizedTools, activeLang]);

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 border-b border-slate-200">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold tracking-wide shadow-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
          {t.heroTitle} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            {t.heroTitleGradient}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Search Bar Container */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white shadow-soft focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-800 placeholder-slate-400 text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                {t.clear}
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Search Results */}
          {filteredTools.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-soft-lg border border-slate-200 divide-y divide-slate-100 z-30 text-left overflow-hidden">
              {filteredTools.map((tool: ToolMeta) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(formatLocalizedPath(tool.path, activeLang));
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-rose-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-brand-100 text-slate-600 group-hover:text-brand-600 flex items-center justify-center transition-colors">
                      <Icon name={tool.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 group-hover:text-brand-600">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[220px] sm:max-w-md">
                        {tool.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              {t.popularTools}:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill.path}
                onClick={() => onSelectTool(pill.path)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-semibold shadow-xs transition-all"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {t.clientPrivacyBadge}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-brand-500" />
            {t.freeLimitNotice}
          </span>
        </div>
      </div>
    </section>
  );
};
