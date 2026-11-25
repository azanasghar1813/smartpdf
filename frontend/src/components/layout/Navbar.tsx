import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ALL_TOOLS, CATEGORIES_CONFIG } from '../../data/tools';
import { getLocalizedAllTools, getLocalizedCategories, getLocalizedTool } from '../../data/localizedTools';
import { getTranslations } from '../../i18n/translations';
import { parsePath, formatLocalizedPath } from '../../utils/url';
import { Icon } from '../common/Icon';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  FileText,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  LayoutDashboard,
  PenTool,
  Search,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPath }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  // URL & Language awareness
  const { lang, cleanPath } = parsePath(currentPath);
  const t = getTranslations(lang);

  // Localized tools & categories
  const localizedTools = useMemo(() => getLocalizedAllTools(lang), [lang]);
  const localizedCategories = useMemo(() => getLocalizedCategories(lang), [lang]);

  // Language-aware navigation helper
  const nav = (rawPath: string) => {
    onNavigate(formatLocalizedPath(rawPath, lang));
  };

  // Mobile drawer filter & search state
  const [mobileSearch, setMobileSearch] = useState('');
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string>('all');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setToolsDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools for mobile drawer
  const mobileFilteredTools = useMemo(() => {
    let list = localizedTools;
    if (selectedMobileCategory !== 'all') {
      list = list.filter((t) => t.category === selectedMobileCategory);
    }
    if (mobileSearch.trim()) {
      const q = mobileSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.seoKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [localizedTools, mobileSearch, selectedMobileCategory]);

  // Find quick tool definitions with localized names
  const quickMerge = localizedTools.find((t) => t.id === 'merge-pdf') || ALL_TOOLS[0];
  const quickSplit = localizedTools.find((t) => t.id === 'split-pdf') || ALL_TOOLS[1];
  const quickCompress = localizedTools.find((t) => t.id === 'compress-pdf') || ALL_TOOLS[5];
  const quickSign = localizedTools.find((t) => t.id === 'sign-pdf') || ALL_TOOLS[26];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => {
              nav('/');
              setToolsDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Simple<span className="text-brand-600">PDF</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* All Tools Mega Dropdown Trigger */}
            <button
              ref={buttonRef}
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm transition-colors ${
                toolsDropdownOpen || (cleanPath.startsWith('/') && cleanPath !== '/' && cleanPath !== '/pricing' && cleanPath !== '/blog')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              <span>{t.allPdfTools}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  toolsDropdownOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Direct Quick Tools */}
            <button
              onClick={() => {
                nav('/merge-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                cleanPath === '/merge-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              {quickMerge.name || t.mergePdf}
            </button>
            <button
              onClick={() => {
                nav('/split-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                cleanPath === '/split-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              {quickSplit.name || t.splitPdf}
            </button>
            <button
              onClick={() => {
                nav('/compress-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                cleanPath === '/compress-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              {quickCompress.name || t.compressPdf}
            </button>
            <button
              onClick={() => {
                nav('/sign-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors ${
                cleanPath === '/sign-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-brand-600" />
              <span>{quickSign.name || t.signPdf}</span>
            </button>
            <button
              onClick={() => {
                nav('/pricing');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                cleanPath === '/pricing'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              {t.pricing}
            </button>
            <button
              onClick={() => {
                nav('/blog');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                cleanPath === '/blog'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              {t.blog}
            </button>
          </nav>

          {/* Right Action Buttons: Free Tools CTA & Language Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {user?.role === 'admin' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    nav('/admin');
                    setToolsDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    cleanPath === '/admin'
                      ? 'bg-amber-400 text-slate-900 shadow-sm'
                      : 'bg-slate-900 text-amber-400 hover:bg-slate-800'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{t.admin}</span>
                </button>

                <button
                  onClick={() => {
                    nav('/dashboard');
                    setToolsDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    cleanPath === '/dashboard'
                      ? 'border-brand-500 bg-rose-50 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-brand-600" />
                  <span>{t.dashboard}</span>
                </button>

                <button
                  onClick={logout}
                  title={t.logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-soft shadow-brand-500/20 hover:from-brand-700 hover:to-rose-600 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-100" />
                <span>{t.allPdfTools}</span>
              </button>
            )}

            {/* Global Language Selector Dropdown */}
            <LanguageSwitcher currentPath={currentPath} onNavigate={onNavigate} />
          </div>

          {/* Mobile Actions: Language Switcher + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher currentPath={currentPath} onNavigate={onNavigate} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* DESKTOP MEGA DROPDOWN PANEL */}
        {toolsDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[0.5px]"
              onClick={() => setToolsDropdownOpen(false)}
            />

            <div
              ref={dropdownRef}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
              className="absolute left-2 right-2 sm:left-4 sm:right-4 lg:left-6 lg:right-6 xl:left-1/2 xl:-translate-x-1/2 xl:w-[940px] xl:right-auto top-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 lg:p-7 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              {/* Category Columns Row 1 (4 Columns) */}
              <div className="grid grid-cols-4 gap-6">
                {localizedCategories.slice(0, 4).map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        {cat.name}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {localizedTools.filter((t) => t.category === cat.id).map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            nav(tool.path);
                            setToolsDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-brand-600 transition-colors group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-rose-100 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shrink-0">
                            <Icon name={tool.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{tool.name}</span>
                          {tool.badge === 'Popular' && (
                            <span className="ml-auto text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 shrink-0">
                              HOT
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Columns Row 2 (3 Columns) */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-6">
                {localizedCategories.slice(4).map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        {cat.name}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {localizedTools.filter((t) => t.category === cat.id).map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            nav(tool.path);
                            setToolsDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-brand-600 transition-colors group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-rose-100 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shrink-0">
                            <Icon name={tool.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{tool.name}</span>
                          {tool.badge === 'AI' && (
                            <span className="ml-auto text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 shrink-0">
                              AI
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mega Dropdown Footer Banner */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{t.clientPrivacyBadge}</span>
                </div>
                <button
                  onClick={() => {
                    nav('/pricing');
                    setToolsDropdownOpen(false);
                  }}
                  className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>{t.pricingPlans}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-8 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User Status / Quick Auth Banner */}
          {user?.role === 'admin' ? (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{user.name || 'Administrator'}</span>
                  <span className="text-[11px] text-slate-500 capitalize">{user.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    nav('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-amber-400"
                >
                  {t.admin}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gradient-to-r from-rose-50 to-brand-50 rounded-2xl border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-slate-800">100% Free Online PDF Suite</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                No Signup
              </span>
            </div>
          )}

          {/* Quick Primary Tool Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: quickMerge.name, path: '/merge-pdf', icon: 'Files' },
              { name: quickSplit.name, path: '/split-pdf', icon: 'Scissors' },
              { name: quickCompress.name, path: '/compress-pdf', icon: 'Minimize2' },
              { name: quickSign.name, path: '/sign-pdf', icon: 'PenTool' },
            ].map((btn) => (
              <button
                key={btn.path}
                onClick={() => {
                  nav(btn.path);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 text-left rounded-xl border transition-all flex items-center gap-2.5 ${
                  cleanPath === btn.path
                    ? 'border-brand-500 bg-rose-50 text-brand-700'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <Icon name={btn.icon} className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-bold text-xs truncate">{btn.name}</span>
              </button>
            ))}
          </div>

          {/* Search Bar inside Mobile Drawer */}
          <div className="relative pt-1">
            <Search className="absolute left-3.5 top-4 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder={t.searchToolsPlaceholder}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
            {mobileSearch && (
              <button
                onClick={() => setMobileSearch('')}
                className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Chips for Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedMobileCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedMobileCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.allCategories} ({localizedTools.length})
            </button>
            {localizedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedMobileCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                  selectedMobileCategory === cat.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Tool List in Mobile Drawer */}
          <div className="border-t border-slate-100 pt-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              <span>{mobileSearch ? 'Search Results' : t.allTools}</span>
              <span>{mobileFilteredTools.length} tools</span>
            </div>

            {mobileFilteredTools.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No tools found matching &quot;{mobileSearch}&quot;
              </div>
            ) : (
              mobileFilteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    nav(tool.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                    cleanPath === tool.path
                      ? 'bg-brand-50 text-brand-700'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Icon name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate text-slate-900">{tool.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{tool.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    {tool.badge === 'Popular' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                        HOT
                      </span>
                    )}
                    {tool.badge === 'AI' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        AI
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Mobile Footer Links */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => {
                nav('/pricing');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.pricingPlans}</span>
            </button>
            <button
              onClick={() => {
                nav('/blog');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {t.blogAndTutorials}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
