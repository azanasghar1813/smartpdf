import React from 'react';
import { BlogPost } from '../data/blogPosts';
import { Clock, User, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface BlogPostPageProps {
  post: BlogPost;
  onNavigate: (path: string) => void;
  onBack: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onNavigate, onBack }) => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </button>

        {/* Post Container */}
        <article className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft space-y-8">
          {/* Header */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{post.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
              <span>•</span>
              <span>{post.publishedDate}</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
            {post.content.map((paragraph, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {paragraph}
              </div>
            ))}
          </div>

          {/* Action CTA to Relevant Tool */}
          <div className="mt-8 p-6 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">Ready to try this tool now?</h4>
              <p className="text-xs text-slate-600 mt-0.5">100% free, browser-powered with zero file retention.</p>
            </div>
            <button
              onClick={() => onNavigate(post.targetToolPath)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs flex items-center gap-1.5 transition-all flex-shrink-0"
            >
              <span>Launch Tool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
