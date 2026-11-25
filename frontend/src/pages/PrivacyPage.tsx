import React from 'react';
import { ShieldCheck, Lock, Trash2, Cpu, EyeOff, Globe2, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <a href="/" className="hover:text-brand-600">Home</a>
            <span>/</span>
            <span className="text-slate-900 font-bold">Privacy Policy</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Retention Architecture</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>GDPR & CCPA Compliant</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>TLS 1.3 Encryption</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Effective Date: November 2026 • Last Reviewed: November 2026 • SimplePDF Platform (<a href="https://simplepdf.me" className="text-brand-600 hover:underline">https://simplepdf.me</a>)
          </p>
        </div>

        {/* Quick Summary Notice */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-blue-500/10 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <EyeOff className="w-5 h-5 text-emerald-600" />
            <span>Executive Privacy Commitment</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            At <strong>SimplePDF</strong>, we believe that everyday document tools should never compromise personal or corporate privacy. 
            Over 70% of our operations execute <strong>100% in your local web browser</strong> using client-side WebAssembly—your files never reach any server.
            For server-rendered conversions (such as OCR or Word conversion), files are automatically shredded and permanently unlinked within <strong>60 minutes</strong>. 
            We do not sell, monetize, inspect, or feed your documents into artificial intelligence training sets.
          </p>
        </div>

        {/* Quick Table of Contents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Table of Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <a href="#overview" className="hover:text-brand-600 flex items-center gap-1.5">• 1. Overview & Data Controller</a>
            <a href="#client-processing" className="hover:text-brand-600 flex items-center gap-1.5">• 2. In-Browser Client Execution</a>
            <a href="#ephemeral-storage" className="hover:text-brand-600 flex items-center gap-1.5">• 3. Ephemeral Cloud Storage & Auto-Shred</a>
            <a href="#adsense-disclosures" className="hover:text-brand-600 flex items-center gap-1.5">• 4. Advertising & Google AdSense Disclosures</a>
            <a href="#analytics-telemetry" className="hover:text-brand-600 flex items-center gap-1.5">• 5. Analytics & Performance Cookies</a>
            <a href="#gdpr-rights" className="hover:text-brand-600 flex items-center gap-1.5">• 6. European GDPR Rights</a>
            <a href="#ccpa-rights" className="hover:text-brand-600 flex items-center gap-1.5">• 7. California CCPA / CPRA Disclosures</a>
            <a href="#coppa" className="hover:text-brand-600 flex items-center gap-1.5">• 8. Children&apos;s Online Privacy (COPPA)</a>
            <a href="#security-measures" className="hover:text-brand-600 flex items-center gap-1.5">• 9. Technical Security Safeguards</a>
            <a href="#contact-dpo" className="hover:text-brand-600 flex items-center gap-1.5">• 10. Data Protection Officer Contact</a>
          </div>
        </div>

        {/* Full Policy Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-10 text-sm text-slate-700 leading-relaxed shadow-soft">
          {/* Section 1 */}
          <section id="overview" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">1</span>
              <span>Overview & Data Controller Information</span>
            </h2>
            <p>
              This Privacy Policy explains how <strong>SimplePDF</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible via 
              <a href="https://simplepdf.me" className="text-brand-600 hover:underline mx-1">https://simplepdf.me</a>, collects, handles, processes, and protects your information when you interact with our online PDF productivity tools, web landing pages, and associated features.
            </p>
            <p>
              The data controller responsible for your personal data under the EU General Data Protection Regulation (GDPR) and UK Data Protection Act is the SimplePDF Privacy &amp; Security Team. For all data privacy inquiries, please contact:
              <code className="bg-slate-100 text-brand-600 px-2 py-0.5 rounded font-mono ml-1 font-semibold">privacy@simplepdf.me</code>.
            </p>
          </section>

          {/* Section 2 */}
          <section id="client-processing" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">2</span>
              <span>In-Browser (Client-Side) Processing Engine</span>
            </h2>
            <p>
              SimplePDF is built on an edge-native paradigm. For operations including but not limited to 
              <strong> Merge PDF, Split PDF, Remove Pages, Extract Pages, Organize PDF, Rotate PDF, Add Watermark, Add Page Numbers, Crop PDF, Edit PDF, Protect PDF (AES-256 Encryption), Unlock PDF, Sign PDF, Redact PDF, JPG to PDF, PDF to JPG, and PDF Forms</strong>:
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-900 font-medium">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Upload Guarantee</span>
              </div>
              <p>
                The document rendering, parsing, modification, and output generation take place entirely within your browser&apos;s sandboxed memory using compiled WebAssembly (WASM). At no point during client-side operations are your files or file names transmitted across the network to our servers or any third-party infrastructure.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="ephemeral-storage" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">3</span>
              <span>Ephemeral Cloud Storage &amp; Automated Cryptographic Shredding</span>
            </h2>
            <p>
              Certain advanced conversions (such as Optical Character Recognition [OCR], Microsoft Word/Excel/PowerPoint conversions, HTML to PDF, and corrupted PDF repair) require high-performance backend rendering binaries (e.g., LibreOffice headless clusters, Tesseract OCR engines). When you initiate these operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>Encrypted In Flight:</strong> Files are transferred over the public network via TLS 1.3 protocol with 256-bit encryption.
              </li>
              <li>
                <strong>Anonymized UUID Storage:</strong> Files are written to ephemeral disk partitions using cryptographically randomized UUID identifiers without any association to your personal identity.
              </li>
              <li>
                <strong>Strict 60-Minute Retention Cap:</strong> A dedicated cleanup worker runs every 15 minutes, permanently unlinking and zero-filling (DoD 5220.22-M specification) all files older than <strong>60 minutes</strong>.
              </li>
              <li>
                <strong>Zero Human Review:</strong> No human ever reviews, opens, inspects, or manually accesses user files.
              </li>
              <li>
                <strong>Zero AI Training:</strong> Your files are never fed into large language models (LLMs) or used to train artificial intelligence algorithms.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="adsense-disclosures" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">4</span>
              <span>Advertising &amp; Google AdSense Compliance Disclosures</span>
            </h2>
            <p>
              SimplePDF provides free access to all 32 PDF tools funded by non-intrusive online advertisements. In accordance with Google AdSense terms and policies, we disclose the following:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs leading-relaxed">
              <p>
                <strong>Third-Party Vendors &amp; Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to SimplePDF or other websites on the internet.
              </p>
              <p>
                <strong>Google&apos;s Advertising Cookies:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites across the World Wide Web.
              </p>
              <p>
                <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting:
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold hover:underline mx-1">
                  Google Ads Settings
                </a>.
                Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold hover:underline mx-1">
                  aboutads.info
                </a> 
                or the Network Advertising Initiative at
                <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold hover:underline mx-1">
                  optout.networkadvertising.org
                </a>.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="analytics-telemetry" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">5</span>
              <span>Analytics &amp; Performance Telemetry</span>
            </h2>
            <p>
              We utilize Google Analytics 4 (GA4) solely to collect anonymous operational statistics (e.g., page views, language selections, device categories, conversion failure rates).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>IP addresses are automatically anonymized before storage.</li>
              <li>We never log, send, or associate document names, document contents, or extracted text with analytics events.</li>
              <li>Users can disable Google Analytics across all websites by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="gdpr-rights" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">6</span>
              <span>European Union &amp; UK User Rights (GDPR)</span>
            </h2>
            <p>
              If you reside in the European Economic Area (EEA) or the United Kingdom, you possess statutory rights regarding your personal information under the General Data Protection Regulation:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Right of Access (Art. 15):</strong> The right to request copies of your personal data.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Right to Rectification (Art. 16):</strong> The right to request correction of inaccurate data.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Right to Erasure (Art. 17):</strong> The right to request permanent deletion of your data.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Right to Restrict Processing (Art. 18):</strong> The right to limit how we handle your data.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Right to Data Portability (Art. 20):</strong> The right to receive your data in machine-readable format.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Right to Object (Art. 21):</strong> The right to object to automated processing or profiling.
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Because SimplePDF does not require account registration to use our 32 PDF tools, we do not maintain personal profiles on anonymous visitors. To exercise any data protection request, email: <code className="text-brand-600 font-semibold font-mono">privacy@simplepdf.me</code>.
            </p>
          </section>

          {/* Section 7 */}
          <section id="ccpa-rights" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">7</span>
              <span>California Consumer Privacy Act (CCPA / CPRA)</span>
            </h2>
            <p>
              Under the California Consumer Privacy Act and California Privacy Rights Act, California consumers have specific rights:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Notice of Collection:</strong> We collect only minimal technical identifiers (browser user-agent, IP address) necessary to serve the web application and prevent malicious DDoS traffic.</li>
              <li><strong>Do Not Sell or Share My Personal Information:</strong> We do NOT sell, trade, or exchange your personal information, documents, or data with data brokers for monetary consideration.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will never deny services, charge different prices, or provide a lower quality of service if you exercise your privacy rights.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="coppa" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">8</span>
              <span>Children&apos;s Online Privacy Protection Act (COPPA)</span>
            </h2>
            <p>
              SimplePDF is a general audience document utility and is not directed at children under the age of 13 (or under 16 in the European Union). We do not knowingly collect personal identifiable information from children. If you believe a child has provided us with personal information, please notify us immediately at <code className="text-brand-600 font-semibold font-mono">privacy@simplepdf.me</code> so we can promptly delete the data.
            </p>
          </section>

          {/* Section 9 */}
          <section id="security-measures" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">9</span>
              <span>Technical &amp; Operational Security Measures</span>
            </h2>
            <p>
              We maintain multiple defense-in-depth security layers to protect the integrity of our platform:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>HSTS Enforcement:</strong> Strict-Transport-Security enforced across all subdomains with preload.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>SSRF Guard:</strong> Network guards blocking internal IP ranges, loopbacks, and cloud metadata endpoints.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Deep Magic Byte Validation:</strong> Deep packet inspection preventing disguised executable or polyglot files.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong>Rate Limiting:</strong> Dynamic token bucket rate limiting defending against automated scraping and brute-force attacks.
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="contact-dpo" className="space-y-3 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">10</span>
              <span>Updates to this Policy &amp; Contact Information</span>
            </h2>
            <p>
              We may revise this Privacy Policy periodically to reflect technological enhancements, operational changes, or statutory updates. The &quot;Last Reviewed&quot; date at the top of this document indicates the latest revision.
            </p>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-slate-900">SimplePDF Privacy &amp; Data Protection Office:</div>
              <p>Email: <a href="mailto:privacy@simplepdf.me" className="text-brand-600 font-bold hover:underline">privacy@simplepdf.me</a></p>
              <p>General Support: <a href="mailto:support@simplepdf.me" className="text-brand-600 font-bold hover:underline">support@simplepdf.me</a></p>
              <p>Website: <a href="https://simplepdf.me" className="text-brand-600 font-bold hover:underline">https://simplepdf.me</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
