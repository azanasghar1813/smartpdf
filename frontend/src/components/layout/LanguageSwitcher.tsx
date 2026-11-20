import React, { useState, useRef, useEffect } from 'react';
import { ALL_LANGUAGES, getPublishedLanguages, isRTL } from '../../i18n/languages';
import { parsePath, getEquivalentPath } from '../../utils/url';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  currentPath: string;
  onNavigate: (newPath: string) => void;
  className?: string;
  align?: 'left' | 'right';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentPath,
  onNavigate,
  className = '',
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { lang: currentLang } = parsePath(currentPath);
  const publishedLangs = getPublishedLanguages();
  const currentLangDef = ALL_LANGUAGES[currentLang] || ALL_LANGUAGES.en;
  const isCurrentRtl = isRTL(currentLang);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (targetLang: string) => {
    setIsOpen(false);
    if (targetLang === currentLang) return;

    // Persist user explicit selection
    try {
      localStorage.setItem('simplepdf_preferred_lang', targetLang);
    } catch (_) {}

    const equivalentPath = getEquivalentPath(currentPath, targetLang);
    onNavigate(equivalentPath);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select language. Current language is ${currentLangDef.nativeName}`}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs hover:border-brand-300 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <Globe className="w-4 h-4 text-brand-600" />
        <span className="font-semibold">{currentLangDef.nativeName}</span>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
          {currentLangDef.countryCode}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-2xl bg-white shadow-soft-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 focus:outline-none ${isCurrentRtl ? 'rtl' : 'ltr'}`}
        >
          <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Languages / زبانیں / اللغات
          </div>

          <div className="max-h-72 overflow-y-auto space-y-0.5 px-1">
            {publishedLangs.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono font-bold w-6 text-slate-400">
                      {lang.code.toUpperCase()}
                    </span>
                    <span className="text-slate-900 font-semibold">{lang.nativeName}</span>
                    <span className="text-[11px] text-slate-400">({lang.name})</span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
