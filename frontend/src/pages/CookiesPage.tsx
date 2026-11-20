import React from 'react';
import { Cookie } from 'lucide-react';

export const CookiesPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-3">
            <Cookie className="w-3.5 h-3.5 text-amber-600" />
            <span>Policy & Cookie Preferences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Last Updated: November 2026 • Transparency regarding cookies and local storage
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. What Are Cookies?</h2>
            <p>
              Cookies are small text fragments stored on your device by websites you visit. They help the platform remember preferences and ensure security during authentication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Cookies We Use</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Essential Cookies:</strong> Required for user session management, theme preferences, and security token validation.</li>
              <li><strong>Analytical Cookies:</strong> Anonymous aggregated telemetry to understand tool usage patterns and improve platform performance.</li>
              <li><strong>Advertising Cookies (Google AdSense):</strong> Used by third-party advertising partners to serve non-intrusive advertisements on free tiers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Managing Your Preferences</h2>
            <p>
              You can configure your browser to block or alert you about cookies. Please note that disabling essential cookies may impact certain account and session functions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
