import React from 'react';
import { Check, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTranslations } from '../i18n/translations';
import { parsePath, formatLocalizedPath } from '../utils/url';

interface PricingPageProps {
  onNavigate: (path: string) => void;
  currentLang?: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, currentLang }) => {
  const { upgradeToPro } = useAuth();
  const activeLang = currentLang || (typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : 'en');
  const t = getTranslations(activeLang);

  const nav = (p: string) => onNavigate(formatLocalizedPath(p, activeLang));

  const plans = [
    {
      name: t.freePlanTitle,
      price: t.freePlanPrice,
      period: t.freePlanPeriod,
      description: 'Zero cost, no credit card, no account or signup required. Access all 32+ PDF tools with full privacy directly in your browser.',
      badge: '100% Free Forever',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-extrabold',
      cta: 'Explore All Tools Free',
      ctaStyle: 'bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md shadow-brand-500/20',
      features: [
        'All 32+ PDF tools (Merge, Split, Rotate, Convert, etc.)',
        'Up to 50MB file size per document',
        '100% In-Browser Edge Processing with Zero Retention',
        'Instant client-side conversions without signup',
        'No credit card or personal details ever required',
        'Mobile & desktop browser support',
        'Supported by clean non-intrusive ads',
      ],
      notIncluded: ['Ad-free experience'],
    },
    {
      name: t.proPlanTitle,
      price: t.proPlanPrice,
      period: t.proPlanPeriod,
      description: t.proPlanDesc,
      badge: 'Most Popular',
      badgeColor: 'bg-brand-600 text-white shadow-sm',
      popular: true,
      cta: t.proPlanCta,
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
      name: t.enterprisePlanTitle,
      price: t.enterprisePlanPrice,
      period: t.enterprisePlanPeriod,
      description: t.enterprisePlanDesc,
      badge: 'Enterprise',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      cta: t.enterprisePlanCta,
      ctaStyle: 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200',
      features: [
        'Everything in Premium Pro',
        'Team account management & role-based seats',
        'Shared company workflow presets',
        'Custom maximum file limits (1GB+)',
        'REST API Developer Access (PDF automation)',
        'Dedicated SLA & 99.9% uptime guarantee',
        'Zero-retention privacy architecture',
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
            <span>{t.pricingBadge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.pricingHeading}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t.pricingSubtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
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
                    Features:
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
                    if (idx === 1) {
                      alert('⚡ Premium Pro subscriptions are currently in closed beta. In the meantime, you have 100% free unlimited access to all 32 client-side PDF tools with up to 50MB per file!');
                    } else if (idx === 2) {
                      nav('/contact');
                    } else {
                      nav('/');
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
