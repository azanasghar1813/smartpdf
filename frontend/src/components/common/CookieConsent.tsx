import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('simplepdf_cookie_consent');
      if (!consent) {
        setVisible(true);
      }
    } catch (_) {}
  }, []);

  const handleChoice = (choice: 'accepted' | 'declined') => {
    try {
      localStorage.setItem('simplepdf_cookie_consent', choice);
      window.dispatchEvent(new CustomEvent('simplepdf:cookie-consent', { detail: choice }));
    } catch (_) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-soft-lg border border-slate-700/80 animate-in"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Privacy &amp; Cookie Preferences</h4>
            <button
              type="button"
              onClick={() => handleChoice('declined')}
              aria-label="Dismiss cookie banner"
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            SimplePDF processes files locally in your browser. We only load optional analytics or advertising cookies if you accept.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleChoice('accepted')}
              className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => handleChoice('declined')}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
