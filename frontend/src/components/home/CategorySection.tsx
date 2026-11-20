import React, { useState } from 'react';
import { ALL_TOOLS, CATEGORIES_CONFIG } from '../../data/tools';
import { ToolCard } from './ToolCard';
import { ToolCategory } from '../../types';

interface CategorySectionProps {
  onSelectTool: (path: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectTool }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');

  const displayedCategories =
    activeCategory === 'all'
      ? CATEGORIES_CONFIG
      : CATEGORIES_CONFIG.filter((c) => c.id === activeCategory);

  return (
    <section className="py-14 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore All 30+ PDF Tools
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From essential page merging and compression to OCR, electronic signatures, and AI document intelligence.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-brand-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories and Cards */}
        <div className="space-y-12">
          {displayedCategories.map((cat) => {
            const toolsInCat = ALL_TOOLS.filter((t) => t.category === cat.id);
            if (toolsInCat.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>{cat.name}</span>
                      <span className="text-xs font-medium text-slate-400">
                        ({toolsInCat.length} tools)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {toolsInCat.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
