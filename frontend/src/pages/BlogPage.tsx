import React from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogPosts';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { getTranslations } from '../i18n/translations';
import { parsePath } from '../utils/url';

interface BlogPageProps {
  onNavigate: (path: string) => void;
  onSelectPost: (post: BlogPost) => void;
  currentLang?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectPost, currentLang }) => {
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.blogBadge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.blogHeading}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.blogSubtitle}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.slug}
              onClick={() => onSelectPost(post)}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
                <span>{t.readTutorial}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
