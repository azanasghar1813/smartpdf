import React from 'react';
import { Cookie, ShieldCheck, EyeOff, Globe2, Lock, ExternalLink, Settings, CheckCircle2 } from 'lucide-react';

export const CookiesPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <a href="/" className="hover:text-brand-600">Home</a>
            <span>/</span>
            <span className="text-slate-900 font-bold">Cookie Policy</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Cookie className="w-3.5 h-3.5 text-amber-600" />
              <span>Cookie &amp; Storage Transparency</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ePrivacy Directive &amp; GDPR Compliant</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>CCPA / CPRA Ready</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Cookie Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Effective Date: November 2026 • Last Reviewed: November 2026 • SimplePDF Platform (<a href="https://simplepdf.me" className="text-brand-600 hover:underline">https://simplepdf.me</a>)
          </p>
        </div>

        {/* Quick Executive Summary */}
        <div className="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-blue-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <EyeOff className="w-5 h-5 text-amber-600" />
            <span>Zero Document Tracking Commitment</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            At <strong>SimplePDF</strong>, we believe that transparency is paramount. 
            We use minimal cookies and local device storage strictly to remember your interface preferences (such as selected language and theme), ensure infrastructure security, measure anonymized traffic velocity, and deliver non-intrusive digital advertisements to keep our 32+ tools 100% free for everyone.
            <strong> Your PDF files, document text, and uploaded data are NEVER tracked, indexed, or stored in cookies.</strong>
          </p>
        </div>

        {/* Quick Table of Contents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Table of Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <a href="#what-are-cookies" className="hover:text-brand-600 flex items-center gap-1.5">• 1. What Are Cookies &amp; Local Storage?</a>
            <a href="#zero-doc-tracking" className="hover:text-brand-600 flex items-center gap-1.5">• 2. Zero Document Tracking Guarantee</a>
            <a href="#cookie-inventory" className="hover:text-brand-600 flex items-center gap-1.5">• 3. Comprehensive Cookie &amp; Storage Inventory</a>
            <a href="#adsense-cookies" className="hover:text-brand-600 flex items-center gap-1.5">• 4. Google AdSense &amp; Advertising Cookies</a>
            <a href="#analytics-telemetry" className="hover:text-brand-600 flex items-center gap-1.5">• 5. Analytics &amp; Anonymized Telemetry</a>
            <a href="#browser-controls" className="hover:text-brand-600 flex items-center gap-1.5">• 6. How to Manage &amp; Disable Cookies</a>
            <a href="#opt-out-portals" className="hover:text-brand-600 flex items-center gap-1.5">• 7. Direct Industry Opt-Out Portals</a>
            <a href="#gpc-signals" className="hover:text-brand-600 flex items-center gap-1.5">• 8. Global Privacy Control (GPC) &amp; DNT</a>
            <a href="#contact-dpo" className="hover:text-brand-600 flex items-center gap-1.5">• 9. Policy Updates &amp; Privacy Contact</a>
          </div>
        </div>

        {/* Full Cookie Policy Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-10 text-sm text-slate-700 leading-relaxed shadow-soft">
          
          {/* Section 1 */}
          <section id="what-are-cookies" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">1</span>
              <span>What Are Cookies and Local Web Storage?</span>
            </h2>
            <p>
              Cookies are small alphanumeric text files placed onto your computer, tablet, or smartphone by web servers when you navigate across internet websites. They are widely utilized by web services to remember user sessions, retain interface settings, ensure cybersecurity, and measure audience interactions.
            </p>
            <p>
              In addition to standard HTTP cookies, modern web applications utilize <strong>HTML5 Web Storage (LocalStorage and SessionStorage)</strong>. Unlike cookies, Web Storage data is kept strictly inside your browser client and is never automatically sent across the network with every HTTP request. SimplePDF utilizes local storage to remember your chosen language and recent tasks locally on your own machine.
            </p>
          </section>

          {/* Section 2 */}
          <section id="zero-doc-tracking" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">2</span>
              <span>Zero Document Tracking Guarantee</span>
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-950 font-medium">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strict Separation of Identity and Document Content</span>
              </div>
              <p>
                Under no circumstances are the contents of your documents, uploaded files, extracted texts, cryptographic signatures, or exported PDFs saved into cookies or transmitted to advertising or telemetry trackers.
              </p>
            </div>
            <p>
              Cookies on SimplePDF relate solely to technical network health, browser interface states, and third-party advertising delivery necessary to fund free hosting.
            </p>
          </section>

          {/* Section 3 */}
          <section id="cookie-inventory" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">3</span>
              <span>Comprehensive Cookie &amp; Local Storage Inventory</span>
            </h2>
            <p>
              Below is an itemized breakdown of every cookie and client-side storage element utilized across the SimplePDF platform:
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Identifier / Key</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Lifespan</th>
                    <th className="py-3 px-4">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">simplepdf_lang</td>
                    <td className="py-3 px-4">SimplePDF</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">Functional</span></td>
                    <td className="py-3 px-4">Stores your selected UI language (e.g., English, Spanish, German, French, etc.)</td>
                    <td className="py-3 px-4">Persistent</td>
                    <td className="py-3 px-4">LocalStorage</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">simplepdf_history</td>
                    <td className="py-3 px-4">SimplePDF</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">Functional</span></td>
                    <td className="py-3 px-4">Saves your recent local tool actions on your device for rapid redownload (never sent to server)</td>
                    <td className="py-3 px-4">Persistent</td>
                    <td className="py-3 px-4">LocalStorage</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">simplepdf_theme</td>
                    <td className="py-3 px-4">SimplePDF</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">Functional</span></td>
                    <td className="py-3 px-4">Remembers your light/dark aesthetic visual display preference</td>
                    <td className="py-3 px-4">Persistent</td>
                    <td className="py-3 px-4">LocalStorage</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">cf_clearance / __cf_bm</td>
                    <td className="py-3 px-4">Cloudflare Inc.</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">Strictly Necessary</span></td>
                    <td className="py-3 px-4">Bot mitigation, anti-DDoS challenge resolution, rate-limiting protection</td>
                    <td className="py-3 px-4">30 min to 1 year</td>
                    <td className="py-3 px-4">HTTP Cookie</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">_ga / _ga_*</td>
                    <td className="py-3 px-4">Google LLC (GA4)</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Analytics</span></td>
                    <td className="py-3 px-4">Aggregated, anonymous audience telemetry to understand tool load and optimize UX</td>
                    <td className="py-3 px-4">1 to 2 years</td>
                    <td className="py-3 px-4">HTTP Cookie</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">__gads / __gpi / IDE</td>
                    <td className="py-3 px-4">Google AdSense</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold">Advertising</span></td>
                    <td className="py-3 px-4">Serves non-intrusive advertisements, limits ad frequency, and prevents ad fraud</td>
                    <td className="py-3 px-4">13 months</td>
                    <td className="py-3 px-4">HTTP Cookie</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section id="adsense-cookies" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">4</span>
              <span>Google AdSense &amp; Advertising Cookies</span>
            </h2>
            <p>
              To maintain our infrastructure without subscription paywalls, SimplePDF partners with <strong>Google AdSense</strong> to display advertisements. 
              Google uses cookies to serve ads based on a user&apos;s prior visits to SimplePDF or other websites on the internet.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Google&apos;s DART Cookie:</strong> Enables Google and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.</li>
              <li><strong>Personalized vs. Non-Personalized Ads:</strong> Depending on your location and consent choices (such as under the EU ePrivacy/GDPR framework), you may receive contextual non-personalized ads or personalized ads.</li>
              <li><strong>Third-Party Ad Networks:</strong> Third-party ad vendors and ad networks may also serve advertisements on SimplePDF. You can review the list of Google-certified ad networks at <a href="https://support.google.com/adsense/answer/94149" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline inline-flex items-center gap-0.5">Google AdSense Certified Ad Networks <ExternalLink className="w-3 h-3" /></a>.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="analytics-telemetry" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">5</span>
              <span>Analytics &amp; Anonymized Telemetry</span>
            </h2>
            <p>
              We utilize Google Analytics 4 (GA4) with <strong>IP Anonymization enabled</strong> by default. This tool aggregates non-identifiable telemetry such as:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li>Which PDF tool categories are most frequently accessed (e.g., Merge PDF vs. Compress PDF);</li>
              <li>Average tool conversion latency and execution success rates;</li>
              <li>Operating system and screen resolution distributions to optimize responsive UI styling;</li>
              <li>Referring sources and search queries directing users to SimplePDF.</li>
            </ul>
            <p className="text-xs text-slate-500">
              GA4 data is strictly unlinked from any personally identifiable information and is governed by Google&apos;s Privacy Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section id="browser-controls" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">6</span>
              <span>How to Manage, Control &amp; Disable Cookies in Your Browser</span>
            </h2>
            <p>
              Most web browsers automatically accept cookies by default. You can modify your browser settings to decline all cookies, block third-party cookies, or receive an alert whenever a cookie is offered:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-brand-600" />
                  Google Chrome
                </span>
                <p className="text-slate-600">
                  Settings &gt; Privacy and Security &gt; Third-party cookies &gt; Select &quot;Block third-party cookies&quot;.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-brand-600" />
                  Mozilla Firefox
                </span>
                <p className="text-slate-600">
                  Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection &gt; Select &quot;Strict&quot;.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-brand-600" />
                  Apple Safari
                </span>
                <p className="text-slate-600">
                  Settings &gt; Safari &gt; Advanced &gt; Privacy &gt; Enable &quot;Block All Cookies&quot; or &quot;Prevent Cross-Site Tracking&quot;.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-brand-600" />
                  Microsoft Edge
                </span>
                <p className="text-slate-600">
                  Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data &gt; Block third-party cookies.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              <em>Note: Disabling cookies will not hinder the in-browser execution of our WebAssembly PDF tools, though your language preference may reset upon browser closure.</em>
            </p>
          </section>

          {/* Section 7 */}
          <section id="opt-out-portals" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">7</span>
              <span>Direct Industry Advertising Opt-Out Portals</span>
            </h2>
            <p>
              You can opt out of personalized interest-based advertising from Google and hundreds of participating ad networks by visiting any of the official regulatory opt-out portals:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a 
                href="https://adssettings.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-brand-600">Google Ads Settings</h4>
                  <p className="text-[11px] text-slate-500">Manage Google Ad personalization controls</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
              </a>

              <a 
                href="https://optout.aboutads.info" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-brand-600">Digital Advertising Alliance (DAA)</h4>
                  <p className="text-[11px] text-slate-500">United States consumer choice portal</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
              </a>

              <a 
                href="https://www.youronlinechoices.eu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-brand-600">Your Online Choices (EDAA)</h4>
                  <p className="text-[11px] text-slate-500">European interactive advertising opt-out</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
              </a>

              <a 
                href="https://optout.networkadvertising.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-brand-600">Network Advertising Initiative (NAI)</h4>
                  <p className="text-[11px] text-slate-500">Multi-network advertising opt-out tool</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
              </a>
            </div>
          </section>

          {/* Section 8 */}
          <section id="gpc-signals" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">8</span>
              <span>Global Privacy Control (GPC) &amp; Do Not Track</span>
            </h2>
            <p>
              SimplePDF respects browser privacy standards. If your browser broadcasts a <strong>Global Privacy Control (GPC)</strong> or Do Not Track (DNT) signal, we interpret this as a valid consumer opt-out request under the California Consumer Privacy Act (CCPA/CPRA). When detected, personalized advertising signals are suppressed in favor of non-personalized contextual ads.
            </p>
          </section>

          {/* Section 9 */}
          <section id="contact-dpo" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">9</span>
              <span>Policy Updates &amp; Contact Details</span>
            </h2>
            <p>
              We may revise this Cookie Policy periodically to accommodate technical advancements, new browser storage mechanisms, or regulatory mandates. 
              The revised date at the top of this page reflects the most recent version.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-700">
              <p className="font-bold text-slate-900">Have questions about our cookie usage?</p>
              <p>Email our Data Protection Officer at: <code className="text-brand-600 font-mono font-semibold">privacy@simplepdf.me</code></p>
            </div>
          </section>

        </div>

        {/* Footer Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
          <div>
            Need privacy or terms information? Read our{' '}
            <a href="/privacy" className="text-brand-600 font-semibold hover:underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms" className="text-brand-600 font-semibold hover:underline">Terms of Service</a>.
          </div>
          <div className="mt-2 sm:mt-0">
            <a href="/" className="text-brand-600 font-bold hover:underline">Back to SimplePDF Home →</a>
          </div>
        </div>

      </div>
    </div>
  );
};
