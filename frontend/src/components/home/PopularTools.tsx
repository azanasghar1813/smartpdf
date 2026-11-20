import React, { useMemo } from 'react';
import { POPULAR_TOOL_IDS } from '../../data/tools';
import { getLocalizedAllTools } from '../../data/localizedTools';
import { getTranslations } from '../../i18n/translations';
import { parsePath } from '../../utils/url';
import { ToolCard } from './ToolCard';
import { Sparkles } from 'lucide-react';

interface PopularToolsProps {
  onSelectTool: (path: string) => void;
  currentLang?: string;
}

export const PopularTools: React.FC<PopularToolsProps> = ({ onSelectTool, currentLang }) => {
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);

  const localizedTools = useMemo(() => getLocalizedAllTools(activeLang), [activeLang]);
  const popularTools = useMemo(() => {
    return localizedTools.filter((tool) => POPULAR_TOOL_IDS.includes(tool.id));
  }, [localizedTools]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{t.mostUsedEveryday}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.popularPdfTools}
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            {t.popularSubtitle}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} currentLang={activeLang} />
          ))}
        </div>
      </div>
    </section>
  );
};
