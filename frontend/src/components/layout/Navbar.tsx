import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ALL_TOOLS, CATEGORIES_CONFIG } from '../../data/tools';
import { Icon } from '../common/Icon';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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
    let list = ALL_TOOLS;
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
  }, [mobileSearch, selectedMobileCategory]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Relative positioning context for mega menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => {
              onNavigate('/');
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
                toolsDropdownOpen || (currentPath.startsWith('/') && currentPath !== '/' && currentPath !== '/pricing' && currentPath !== '/blog')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              <span>All PDF Tools</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  toolsDropdownOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Direct Quick Tools */}
            <button
              onClick={() => {
                onNavigate('/merge-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                currentPath === '/merge-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              Merge PDF
            </button>
            <button
              onClick={() => {
                onNavigate('/split-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                currentPath === '/split-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              Split PDF
            </button>
            <button
              onClick={() => {
                onNavigate('/compress-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                currentPath === '/compress-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              Compress PDF
            </button>
            <button
              onClick={() => {
                onNavigate('/sign-pdf');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors ${
                currentPath === '/sign-pdf'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-brand-600" />
              <span>Sign PDF</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/pricing');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                currentPath === '/pricing'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => {
                onNavigate('/blog');
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                currentPath === '/blog'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
              }`}
            >
              Blog
            </button>
          </nav>

          {/* Right Action Buttons / User Auth State */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('/admin');
                      setToolsDropdownOpen(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentPath === '/admin'
                        ? 'bg-amber-400 text-slate-900 shadow-sm'
                        : 'bg-slate-900 text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onNavigate('/dashboard');
                    setToolsDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    currentPath === '/dashboard'
                      ? 'border-brand-500 bg-rose-50 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-brand-600" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                    setToolsDropdownOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                    setToolsDropdownOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={() => {
                onNavigate('/pricing');
                setToolsDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Go Pro</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ========================================================
            DESKTOP MEGA DROPDOWN PANEL (Anchored inside container)
            Positioned cleanly with zero off-screen bleeding
           ======================================================== */}
        {toolsDropdownOpen && (
          <>
            {/* Click-away backdrop overlay */}
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
                {CATEGORIES_CONFIG.slice(0, 4).map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        {cat.name}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {ALL_TOOLS.filter((t) => t.category === cat.id).map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onNavigate(tool.path);
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
                {CATEGORIES_CONFIG.slice(4).map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        {cat.name}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {ALL_TOOLS.filter((t) => t.category === cat.id).map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onNavigate(tool.path);
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
                  <span>100% In-Browser Privacy • Zero Server File Retention</span>
                </div>
                <button
                  onClick={() => {
                    onNavigate('/pricing');
                    setToolsDropdownOpen(false);
                  }}
                  className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>Explore Pro Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================================
          MOBILE NAVIGATION DRAWER (Fully Responsive & Feature-Packed)
         ======================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-8 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User Status / Quick Auth Banner */}
          {user ? (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{user.name}</span>
                  <span className="text-[11px] text-slate-500 capitalize">{user.role} Account</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('/admin');
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-amber-400"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-600"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 shadow-2xs"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-xs"
              >
                Sign Up Free
              </button>
            </div>
          )}

          {/* Quick Primary Tool Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Merge PDF', path: '/merge-pdf', icon: 'Files' },
              { name: 'Split PDF', path: '/split-pdf', icon: 'Scissors' },
              { name: 'Compress PDF', path: '/compress-pdf', icon: 'Minimize2' },
              { name: 'Sign PDF', path: '/sign-pdf', icon: 'PenTool' },
            ].map((btn) => (
              <button
                key={btn.path}
                onClick={() => {
                  onNavigate(btn.path);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 text-left rounded-xl border transition-all flex items-center gap-2.5 ${
                  currentPath === btn.path
                    ? 'border-brand-500 bg-rose-50 text-brand-700'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <Icon name={btn.icon} className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-bold text-xs">{btn.name}</span>
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
              placeholder="Search all 31 PDF tools..."
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
              All ({ALL_TOOLS.length})
            </button>
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedMobileCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                  selectedMobileCategory === cat.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name.replace(' PDF', '')}
              </button>
            ))}
          </div>

          {/* Tool List in Mobile Drawer */}
          <div className="border-t border-slate-100 pt-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              <span>{mobileSearch ? 'Search Results' : 'Available Tools'}</span>
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
                    onNavigate(tool.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                    currentPath === tool.path
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
                onNavigate('/pricing');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Go Pro / Pricing</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/blog');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Blog & Tutorials
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};
