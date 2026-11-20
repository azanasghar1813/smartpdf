import React from 'react';
import { ALL_TOOLS, CATEGORIES_CONFIG } from '../../data/tools';
import { FileText, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Simple<span className="text-brand-500">PDF</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Every PDF tool you need to manage, edit, convert, and secure documents. 100% free, browser-optimized, and built with uncompromising privacy.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero-Retention Ephemeral Storage
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                TLS 256-bit Encryption
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Edge In-Browser Processing
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3">
              Company & Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-brand-400 transition-colors">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/blog')} className="hover:text-brand-400 transition-colors">
                  Blog & Tutorials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-brand-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-brand-400 transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-brand-400 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-brand-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/security')} className="hover:text-brand-400 transition-colors">
                  Security Architecture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cookies')} className="hover:text-brand-400 transition-colors">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Categorized Tools Directory */}
        <div className="py-12 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {CATEGORIES_CONFIG.map((cat) => (
            <div key={cat.id} className="space-y-2.5">
              <h5 className="text-white font-semibold text-xs uppercase tracking-wider">
                {cat.name}
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {ALL_TOOLS.filter((t) => t.category === cat.id).map((tool) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => onNavigate(tool.path)}
                      className="hover:text-brand-400 transition-colors text-left"
                    >
                      {tool.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SimplePDF. All rights reserved. Built for document productivity.</p>
          <p className="flex items-center gap-1">
            Made with <Sparkles className="w-3.5 h-3.5 text-brand-500" /> for users worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
