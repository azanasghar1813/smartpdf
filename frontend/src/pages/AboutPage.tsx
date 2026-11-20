import React from 'react';
import { Sparkles, ShieldCheck, Zap, Globe2, Users } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Our Mission & Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Document Productivity. Made Simple.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            SimplePDF was created to solve everyday document frustration. We believe essential productivity tools should be fast, elegant, and uncompromisingly private.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <Zap className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-slate-900">Zero Server Lag</h3>
              <p className="text-xs text-slate-500">Core operations process directly inside your browser via WebAssembly.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-900">Guaranteed Privacy</h3>
              <p className="text-xs text-slate-500">Zero retention. No file hoarding. Ephemeral automatic shredding.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <Globe2 className="w-8 h-8 text-blue-500 mx-auto" />
              <h3 className="font-bold text-slate-900">Global Accessibility</h3>
              <p className="text-xs text-slate-500">Free access for students, teachers, freelancers, and businesses worldwide.</p>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
            <h2 className="text-xl font-bold text-slate-900">Why SimplePDF?</h2>
            <p>
              Millions of people deal with PDF documents every day: compiling resumes, signing agreements, merging study notes, or shrinking file sizes for email. Yet traditional desktop software is expensive, slow, and bloated.
            </p>
            <p>
              We re-engineered the PDF suite from the ground up: combining instant client-side execution for everyday privacy with high-speed cloud clusters for deep document conversions.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Ready to explore our tools?</span>
            <button
              onClick={() => onNavigate('/')}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
            >
              Explore All Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
