import React from 'react';
import { ALL_TOOLS, POPULAR_TOOL_IDS } from '../../data/tools';
import { ToolCard } from './ToolCard';
import { Sparkles } from 'lucide-react';

interface PopularToolsProps {
  onSelectTool: (path: string) => void;
}

export const PopularTools: React.FC<PopularToolsProps> = ({ onSelectTool }) => {
  const popularTools = ALL_TOOLS.filter((t) => POPULAR_TOOL_IDS.includes(t.id));

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Most Used Everyday</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular PDF Tools
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            The quickest way to solve your common document tasks. 100% free, fast, and secure.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
          ))}
        </div>
      </div>
    </section>
  );
};
