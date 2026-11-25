import React, { useState } from 'react';
import { ToolMeta } from '../../types';
import { ALL_TOOLS } from '../../data/tools';
import { getLocalizedTool, getLocalizedToolSeo } from '../../data/localizedTools';
import { getTranslations } from '../../i18n/translations';
import { isRTL } from '../../i18n/languages';
import { formatLocalizedPath } from '../../utils/url';
import { Icon } from '../common/Icon';
import { AdPlacement } from '../ads/AdPlacement';
import { ToolWorkspace } from './ToolWorkspace';
import { PDFEditorWorkspace } from '../editor/PDFEditorWorkspace';
import { OrganizePdfWorkspace } from './OrganizePdfWorkspace';
import { AiIntelligenceWorkspace } from './AiIntelligenceWorkspace';
import { PdfToMarkdownWorkspace } from './PdfToMarkdownWorkspace';
import { ComparePdfWorkspace } from './ComparePdfWorkspace';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ToolLandingPageProps {
  tool: ToolMeta;
  currentLang?: string;
  onNavigate: (path: string) => void;
}

export const ToolLandingPage: React.FC<ToolLandingPageProps> = ({
  tool,
  currentLang = 'en',
  onNavigate,
}) => {
  const t = getTranslations(currentLang);
  const localizedTool = getLocalizedTool(tool, currentLang);
  const localizedSeo = getLocalizedToolSeo(tool.id, currentLang);
  const rtl = isRTL(currentLang);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Internal link resolution for related tools
  const relatedTools = ALL_TOOLS.filter(
    (item) => item.category === tool.category && item.id !== tool.id
  )
    .slice(0, 3)
    .map((rt) => getLocalizedTool(rt, currentLang));

  // Helper to format localized path
  const formatPath = (rawPath: string) => formatLocalizedPath(rawPath, currentLang);

  const BreadcrumbArrow = rtl ? ArrowLeft : ArrowRight;

  return (
    <div className={`min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 ${rtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 1. BREADCRUMBS NAVIGATION */}
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <a
            href={formatPath('/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(formatPath('/'));
            }}
            className="hover:text-brand-600 transition-colors"
          >
            {t.home}
          </a>
          <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
          <span className="capitalize text-slate-600">{tool.category.replace('-', ' ')}</span>
          <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{localizedTool.name}</span>
        </nav>

        {/* 2. DEDICATED TOOL HEADER BANNER */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>{tool.isClientSide ? t.clientPrivacyBadge : t.serverPrivacyBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {localizedTool.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {localizedTool.longDescription || localizedTool.description}
          </p>
        </header>

        {/* 3. FUNCTIONAL TOOL WORKSPACE INTERFACE */}
        <section aria-label="Tool Workspace" className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden p-6 sm:p-8">
          {tool.id === 'sign-pdf' ? (
            <PDFEditorWorkspace toolName={localizedTool.name} />
          ) : tool.id === 'edit-pdf' ? (
            <PDFEditorWorkspace toolName={localizedTool.name} />
          ) : tool.id === 'organize-pdf' ? (
            <OrganizePdfWorkspace />
          ) : tool.id === 'ai-summarizer' ? (
            <AiIntelligenceWorkspace mode="summarize" />
          ) : tool.id === 'translate-pdf' ? (
            <AiIntelligenceWorkspace mode="translate" />
          ) : tool.id === 'pdf-to-markdown' ? (
            <PdfToMarkdownWorkspace />
          ) : tool.id === 'compare-pdf' ? (
            <ComparePdfWorkspace />
          ) : (
            <ToolWorkspace key={tool.id} tool={localizedTool} onNavigate={onNavigate} />
          )}
        </section>

        {/* 4. ADSENSE BANNER PLACEMENT (Non-intrusive) */}
        <AdPlacement format="horizontal" />

        {/* 5. PRACTICAL HOW-TO-USE STEPS */}
        <section aria-labelledby="how-to-heading" className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-2xs">
          <h2 id="how-to-heading" className="text-2xl font-extrabold text-slate-900">
            {t.howToUseTitle.replace('{tool}', localizedTool.name)}
          </h2>

          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {localizedTool.howToSteps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-colors"
              >
                <span className="w-8 h-8 rounded-xl bg-brand-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-slate-700 leading-relaxed pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* 6. FEATURES & USE CASES GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Features */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-2xs">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>{t.featuresTitle}</span>
            </h3>

            <ul className="space-y-3.5">
              {localizedSeo.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Common Use Cases */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-2xs">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-brand-600" />
              <span>{t.useCasesTitle}</span>
            </h3>

            <ul className="space-y-3.5">
              {localizedSeo.useCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    •
                  </div>
                  <span className="leading-relaxed">{useCase}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 7. FORMATS & LIMITATIONS + PRIVACY GUARANTEE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Limitations & Formats */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5 shadow-2xs">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <span>{t.limitationsTitle}</span>
            </h3>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Supported File Types
              </p>
              <div className="flex flex-wrap gap-2">
                {tool.acceptedFileTypes.map((ext) => (
                  <span
                    key={ext}
                    className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold font-mono"
                  >
                    {ext.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <ul className="space-y-2.5 pt-2">
              {localizedSeo.limitations.map((limit, idx) => (
                <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{limit}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 font-medium">
              {t.freeLimitNotice}
            </div>
          </section>

          {/* Privacy & File Security Guarantee */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-brand-600" />
                <span>{t.privacyTitle}</span>
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed pt-3">
                {localizedSeo.privacyNote || t.privacyTitle}
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>TLS 1.3 256-bit cryptographic transit encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Automated zero-byte ephemeral shredder daemon (60 mins)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Strict zero-logs policy: documents are never mined or sold</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Verified compliant with GDPR, CCPA, and strict document privacy standards.
            </div>
          </section>
        </div>

        {/* 8. TOOL-SPECIFIC FAQ ACCORDION */}
        {localizedSeo.faqs && localizedSeo.faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-2xs">
            <h2 id="faq-heading" className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-brand-600" />
              <span>{t.faqTitle}</span>
            </h2>

            <div className="space-y-3">
              {localizedSeo.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 8.5 POPULAR SEARCHES & RANKED KEYWORDS */}
        {tool.seoKeywords && tool.seoKeywords.length > 0 && (
          <section aria-label="Popular Searches" className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Popular Searches &amp; Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {tool.seoKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 9. CRAWLABLE INTERNAL LINKS TO RELATED TOOLS */}
        {relatedTools.length > 0 && (
          <section aria-labelledby="related-heading" className="space-y-4 pt-4">
            <h3 id="related-heading" className="text-lg font-bold text-slate-800">
              {t.relatedToolsTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((rt) => (
                <a
                  key={rt.id}
                  href={formatPath(rt.path)}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(formatPath(rt.path));
                  }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-soft transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon name={rt.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                      {rt.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {rt.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
