import React from 'react';
import { Home, ArrowRight, HelpCircle, FileText, Search } from 'lucide-react';
import { ALL_TOOLS } from '../data/tools';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const popularTools = ALL_TOOLS.filter((t) => t.badge === 'Popular').slice(0, 6);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Badge & Code */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          <span>Error 404</span>
          <span>•</span>
          <span>Resource Not Found</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            The link you followed may be broken, or the page may have been moved or removed.
            Choose one of our popular PDF productivity tools below or head back to the home page.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-soft transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => onNavigate('/#tools')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-sm shadow-2xs transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Explore All 32 Tools</span>
          </button>
        </div>

        {/* Popular Tools Grid */}
        <div className="pt-8 border-t border-slate-200/80 text-left space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
            Popular PDF Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.path)}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-soft transition-all text-left flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                    {tool.name}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">
                    {tool.description}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transform group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
