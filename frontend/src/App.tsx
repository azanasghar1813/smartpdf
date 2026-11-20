import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { PopularTools } from './components/home/PopularTools';
import { CategorySection } from './components/home/CategorySection';
import { HowItWorks } from './components/home/HowItWorks';
import { SecurityBanner } from './components/home/SecurityBanner';
import { FAQSection } from './components/home/FAQSection';
import { AdPlacement } from './components/ads/AdPlacement';
import { SEOHead } from './components/common/SEOHead';
import { ALL_TOOLS } from './data/tools';
import { BlogPost } from './data/blogPosts';

// Dynamic Code Splitting for Production Scalability & High Lighthouse Scores
const ToolWorkspace = lazy(() => import('./components/tools/ToolWorkspace').then(m => ({ default: m.ToolWorkspace })));
const PDFEditorWorkspace = lazy(() => import('./components/editor/PDFEditorWorkspace').then(m => ({ default: m.PDFEditorWorkspace })));
const OrganizePdfWorkspace = lazy(() => import('./components/tools/OrganizePdfWorkspace').then(m => ({ default: m.OrganizePdfWorkspace })));
const AiIntelligenceWorkspace = lazy(() => import('./components/tools/AiIntelligenceWorkspace').then(m => ({ default: m.AiIntelligenceWorkspace })));
const PdfToMarkdownWorkspace = lazy(() => import('./components/tools/PdfToMarkdownWorkspace').then(m => ({ default: m.PdfToMarkdownWorkspace })));
const ComparePdfWorkspace = lazy(() => import('./components/tools/ComparePdfWorkspace').then(m => ({ default: m.ComparePdfWorkspace })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const SecurityPage = lazy(() => import('./pages/SecurityPage').then(m => ({ default: m.SecurityPage })));
const CookiesPage = lazy(() => import('./pages/CookiesPage').then(m => ({ default: m.CookiesPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));

const WorkspaceFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-brand-600 animate-spin" />
    <span className="text-xs font-semibold tracking-wide text-slate-400 animate-pulse">Initializing SimplePDF Engine...</span>
  </div>
);

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSelectedPost(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTool = ALL_TOOLS.find((t) => t.path === currentPath);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SEOHead tool={currentTool} />
      <Navbar onNavigate={navigateTo} currentPath={currentPath} />

      <main className="flex-1">
        <Suspense fallback={<WorkspaceFallback />}>
          {/* INTERACTIVE WORKSPACES */}
          {currentPath === '/sign-pdf' ? (
            <PDFEditorWorkspace toolName="Sign PDF Document" />
          ) : currentPath === '/edit-pdf' ? (
            <PDFEditorWorkspace toolName="Edit & Annotate PDF" />
          ) : currentPath === '/organize-pdf' ? (
            <OrganizePdfWorkspace />
          ) : currentPath === '/ai-summarizer' ? (
            <AiIntelligenceWorkspace mode="summarize" />
          ) : currentPath === '/translate-pdf' ? (
            <AiIntelligenceWorkspace mode="translate" />
          ) : currentPath === '/pdf-to-markdown' ? (
            <PdfToMarkdownWorkspace />
          ) : currentPath === '/compare-pdf' ? (
            <ComparePdfWorkspace />
          ) : currentPath === '/dashboard' ? (
            <DashboardPage onNavigate={navigateTo} />
          ) : currentPath === '/admin' ? (
            <AdminPage />
          ) : currentPath === '/blog' ? (
            selectedPost ? (
              <BlogPostPage
                post={selectedPost}
                onNavigate={navigateTo}
                onBack={() => setSelectedPost(null)}
              />
            ) : (
              <BlogPage onNavigate={navigateTo} onSelectPost={setSelectedPost} />
            )
          ) : currentTool ? (
            <ToolWorkspace tool={currentTool} onNavigate={navigateTo} />
          ) : currentPath === '/pricing' ? (
            <PricingPage onNavigate={navigateTo} />
          ) : currentPath === '/privacy' ? (
            <PrivacyPage />
          ) : currentPath === '/about' ? (
            <AboutPage onNavigate={navigateTo} />
          ) : currentPath === '/contact' ? (
            <ContactPage />
          ) : currentPath === '/terms' ? (
            <TermsPage />
          ) : currentPath === '/security' ? (
            <SecurityPage />
          ) : currentPath === '/cookies' ? (
            <CookiesPage />
          ) : currentPath === '/faq' ? (
            <FaqPage />
          ) : (
            <div>
              <Hero onSelectTool={navigateTo} />
              <PopularTools onSelectTool={navigateTo} />
              <AdPlacement format="horizontal" />
              <CategorySection onSelectTool={navigateTo} />
              <HowItWorks />
              <SecurityBanner />
              <FAQSection />
            </div>
          )}
        </Suspense>
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
