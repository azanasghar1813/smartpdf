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
import { BLOG_POSTS, BlogPost } from './data/blogPosts';
import { parsePath, formatLocalizedPath } from './utils/url';

// Dynamic Code Splitting for Production Scalability & High Lighthouse Scores
const ToolLandingPage = lazy(() => import('./components/tools/ToolLandingPage').then(m => ({ default: m.ToolLandingPage })));
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
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

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

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Multilingual route resolution
  const { lang, cleanPath } = parsePath(currentPath);
  const currentTool = ALL_TOOLS.find((t) => t.path === cleanPath);

  // Blog route resolution
  const isBlogPost = cleanPath.startsWith('/blog/') && cleanPath.length > 6;
  const blogSlug = isBlogPost ? cleanPath.replace('/blog/', '').replace(/\/+$/, '') : null;
  const currentBlogPost = blogSlug ? BLOG_POSTS.find((p) => p.slug === blogSlug) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SEOHead
        tool={currentTool}
        blogPost={currentBlogPost || undefined}
        currentPath={currentPath}
      />
      <Navbar onNavigate={navigateTo} currentPath={currentPath} />

      <main className="flex-1">
        <Suspense fallback={<WorkspaceFallback />}>
          {currentTool ? (
            /* DEDICATED TOOL SEO LANDING PAGE WITH EMBEDDED WORKSPACE */
            <ToolLandingPage
              tool={currentTool}
              currentLang={lang}
              onNavigate={navigateTo}
            />
          ) : currentBlogPost ? (
            /* DEDICATED BLOG POST PAGE */
            <BlogPostPage
              post={currentBlogPost}
              onNavigate={navigateTo}
              onBack={() => navigateTo(formatLocalizedPath('/blog', lang))}
            />
          ) : isBlogPost && !currentBlogPost ? (
            /* 404 for unknown blog slug */
            <NotFoundPage onNavigate={navigateTo} />
          ) : cleanPath === '/blog' ? (
            <BlogPage
              onNavigate={navigateTo}
              onSelectPost={(post) => navigateTo(formatLocalizedPath(`/blog/${post.slug}`, lang))}
              currentLang={lang}
            />
          ) : cleanPath === '/' ? (
            <div>
              <Hero onSelectTool={navigateTo} currentLang={lang} />
              <PopularTools onSelectTool={navigateTo} currentLang={lang} />
              <AdPlacement format="horizontal" />
              <CategorySection onSelectTool={navigateTo} currentLang={lang} />
              <HowItWorks currentLang={lang} />
              <SecurityBanner currentLang={lang} />
              <FAQSection currentLang={lang} />
            </div>
          ) : cleanPath === '/dashboard' ? (
            <DashboardPage onNavigate={navigateTo} />
          ) : cleanPath === '/admin' ? (
            <AdminPage />
          ) : cleanPath === '/pricing' ? (
            <PricingPage onNavigate={navigateTo} currentLang={lang} />
          ) : cleanPath === '/privacy' ? (
            <PrivacyPage />
          ) : cleanPath === '/about' ? (
            <AboutPage onNavigate={navigateTo} />
          ) : cleanPath === '/contact' ? (
            <ContactPage />
          ) : cleanPath === '/terms' ? (
            <TermsPage />
          ) : cleanPath === '/security' ? (
            <SecurityPage />
          ) : cleanPath === '/cookies' ? (
            <CookiesPage />
          ) : cleanPath === '/faq' ? (
            <FaqPage currentLang={lang} />
          ) : (
            /* REAL 404 PAGE FOR ANY UNMAPPED ROUTE */
            <NotFoundPage onNavigate={navigateTo} />
          )}
        </Suspense>
      </main>

      <Footer onNavigate={navigateTo} currentPath={currentPath} />
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
