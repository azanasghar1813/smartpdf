import React from 'react';
import { Check, Sparkles, Shield, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { upgradeToPro } = useAuth();
  const plans = [
    {
      name: 'Free / Guest',
      price: '$0',
      period: 'Forever free',
      description: 'Everything you need for everyday individual document tasks with in-browser privacy.',
      badge: 'Default',
      badgeColor: 'bg-slate-100 text-slate-700',
      cta: 'Start Free Now',
      ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
      features: [
        'All essential PDF tools (Merge, Split, Rotate, etc.)',
        'Up to 50MB file size per document',
        '100% In-Browser Edge Processing',
        'Standard processing queue',
        'Zero-retention privacy assurance',
        'Mobile & desktop browser support',
        'Supported by non-intrusive ads',
      ],
      notIncluded: ['Unlimited batch conversions', 'Priority dedicated OCR servers', 'Ad-free experience'],
    },
    {
      name: 'Premium Pro',
      price: '$4.99',
      period: 'per month',
      description: 'For professionals, freelancers, and students requiring high-volume productivity & AI.',
      badge: 'Most Popular',
      badgeColor: 'bg-brand-600 text-white shadow-sm',
      popular: true,
      cta: 'Upgrade to Pro',
      ctaStyle: 'bg-brand-600 hover:bg-brand-700 text-white shadow-soft-lg shadow-brand-500/30',
      features: [
        'Everything in Free Plan',
        'Up to 200MB per file allowance',
        'Unlimited simultaneous batch files',
        'Priority high-speed cloud processing',
        'Full OCR scanned PDF to searchable text',
        'AI Summarizer & Document Translation credits',
        '100% Ad-Free clean interface',
        'Continuous customer support',
      ],
      notIncluded: [],
    },
    {
      name: 'Business & Teams',
      price: 'Custom',
      period: 'per team / month',
      description: 'Centralized document infrastructure for enterprises, law firms, and institutions.',
      badge: 'Enterprise',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      cta: 'Contact Sales',
      ctaStyle: 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200',
      features: [
        'Everything in Premium Pro',
        'Team account management & role-based seats',
        'Shared company workflow presets',
        'Custom maximum file limits (1GB+)',
        'REST API Developer Access (PDF automation)',
        'Dedicated SLA & 99.9% uptime guarantee',
        'SOC2 & HIPAA compliance documentation',
        'Centralized billing & invoicing',
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Transparent, Scalable Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Simple Plans for Every PDF Need
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Start completely free without creating an account, or upgrade to Premium for heavy batch workloads, OCR, and AI intelligence.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-200 ${
                p.popular
                  ? 'border-2 border-brand-500 shadow-soft-lg scale-[1.02]'
                  : 'border-slate-200 shadow-soft hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${p.badgeColor}`}
                  >
                    {p.badge}
                  </span>
                  {p.popular && (
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-600">
                      <Sparkles className="w-3.5 h-3.5" /> Recommended
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900">{p.name}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed min-h-[40px]">
                  {p.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    {p.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    / {p.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What's Included:
                  </span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (p.name === 'Premium Pro') {
                      upgradeToPro();
                      alert('🎉 Congratulations! Your account has been upgraded to Premium Pro ($4.99/mo). Unlimited quota and cloud OCR/AI features are now unlocked!');
                      onNavigate('/dashboard');
                    } else if (p.name === 'Business & Teams') {
                      onNavigate('/contact');
                    } else {
                      onNavigate('/');
                    }
                  }}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all ${p.ctaStyle}`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Money-Back Guarantee */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-slate-900">
              Risk-Free Guarantee & Instant Cancellation
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No long-term contracts. Cancel anytime directly in your account dashboard with a single click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
