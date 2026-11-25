import React from 'react';
import { ShieldCheck, Scale, FileText, CheckCircle2, AlertTriangle, HelpCircle, Lock, Ban, Globe2, Sparkles } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <a href="/" className="hover:text-brand-600">Home</a>
            <span>/</span>
            <span className="text-slate-900 font-bold">Terms of Service</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free Online Suite</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% User Document Ownership</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Document Licensing</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">
            Effective Date: November 2026 • Last Reviewed: November 2026 • SimplePDF Platform (<a href="https://simplepdf.me" className="text-brand-600 hover:underline">https://simplepdf.me</a>)
          </p>
        </div>

        {/* Quick Executive Summary */}
        <div className="bg-gradient-to-r from-blue-500/10 via-brand-500/10 to-emerald-500/10 border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
            <Scale className="w-5 h-5 text-blue-600" />
            <span>Plain-English Summary of Your Rights</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Welcome to <strong>SimplePDF</strong>. We provide all 32+ PDF editing, conversion, compression, and security tools completely free without requiring an account, subscription, or credit card.
            You retain <strong>100% absolute ownership and copyright</strong> over all documents and files processed on SimplePDF. 
            We claim zero rights or license to your files, do not inspect their contents, and never feed your data into AI models. 
            In return, you agree not to abuse our free platform, upload malicious payloads, or attempt to disrupt availability for other users.
          </p>
        </div>

        {/* Quick Table of Contents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Table of Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <a href="#acceptance" className="hover:text-brand-600 flex items-center gap-1.5">• 1. Acceptance &amp; Eligibility</a>
            <a href="#service-model" className="hover:text-brand-600 flex items-center gap-1.5">• 2. Free Service Model &amp; No Registration</a>
            <a href="#ip-ownership" className="hover:text-brand-600 flex items-center gap-1.5">• 3. Document Ownership &amp; Zero License</a>
            <a href="#processing-architecture" className="hover:text-brand-600 flex items-center gap-1.5">• 4. Edge WebAssembly &amp; Ephemeral Processing</a>
            <a href="#acceptable-use" className="hover:text-brand-600 flex items-center gap-1.5">• 5. Acceptable Use Policy (AUP)</a>
            <a href="#fair-use-limits" className="hover:text-brand-600 flex items-center gap-1.5">• 6. Fair Use Limits &amp; Automated Protection</a>
            <a href="#advertising" className="hover:text-brand-600 flex items-center gap-1.5">• 7. Third-Party Advertising &amp; Links</a>
            <a href="#warranties" className="hover:text-brand-600 flex items-center gap-1.5">• 8. Disclaimer of Warranties (&quot;As-Is&quot;)</a>
            <a href="#liability" className="hover:text-brand-600 flex items-center gap-1.5">• 9. Limitation of Liability</a>
            <a href="#indemnification" className="hover:text-brand-600 flex items-center gap-1.5">• 10. User Indemnification</a>
            <a href="#modifications" className="hover:text-brand-600 flex items-center gap-1.5">• 11. Service Modifications &amp; Uptime</a>
            <a href="#governing-law" className="hover:text-brand-600 flex items-center gap-1.5">• 12. Governing Law &amp; Legal Contact</a>
          </div>
        </div>

        {/* Full Terms Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-10 text-sm text-slate-700 leading-relaxed shadow-soft">
          
          {/* Section 1 */}
          <section id="acceptance" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">1</span>
              <span>Acceptance of Terms &amp; Eligibility</span>
            </h2>
            <p>
              These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and 
              <strong> SimplePDF</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) concerning your access to and use of the website located at 
              <a href="https://simplepdf.me" className="text-brand-600 hover:underline mx-1">https://simplepdf.me</a>, including all associated subdomains, tools, and services.
            </p>
            <p>
              By accessing, browsing, or utilizing any of our tools, you acknowledge that you have read, understood, and agree to be bound by these Terms and our 
              <a href="/privacy" className="text-brand-600 hover:underline mx-1">Privacy Policy</a>. 
              If you do not agree to all terms and conditions set forth herein, you are expressly prohibited from using SimplePDF and must cease use immediately.
            </p>
            <p className="text-xs text-slate-500">
              <strong>Age Requirement:</strong> You must be at least 13 years of age (or the minimum legal age required in your jurisdiction) to use SimplePDF. If you are under the age of majority in your jurisdiction, you represent that you have received permission from your parent or legal guardian to access the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section id="service-model" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">2</span>
              <span>Free Service Model &amp; No Registration Mandate</span>
            </h2>
            <p>
              SimplePDF provides a comprehensive suite of 32+ document productivity tools available to the global public free of charge.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>No Compulsory Sign-up:</strong> You do not need to create an account, register an email address, or provide personal credentials to use our PDF tools.</li>
              <li><strong>No Financial Commitments:</strong> All core productivity workflows—including Merge, Split, Compress, Convert, OCR, Rotate, Protect, Sign, and Edit—are accessible without subscription paywalls or credit card details.</li>
              <li><strong>Universal Browser Compatibility:</strong> Our web software is engineered to function across modern desktop, tablet, and mobile browsers (Chromium, Firefox, Safari, Edge).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="ip-ownership" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">3</span>
              <span>Document Ownership &amp; Absolute Zero-License Guarantee</span>
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-950 font-medium">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your Documents Remain 100% Yours</span>
              </div>
              <p>
                <strong>You retain 100% sole ownership, title, copyright, and intellectual property rights</strong> to all files, graphics, texts, signatures, and documents you process, convert, or manipulate using SimplePDF.
              </p>
            </div>
            <p>
              SimplePDF claims <strong>zero intellectual property rights, licenses, or ownership interest</strong> in your files. 
              We do not copy, index, inspect, catalogue, sell, license, or distribute your files. 
              Furthermore, we strictly guarantee that <strong>no user files or document contents are ever used to train, fine-tune, or benchmark artificial intelligence (AI) or machine learning models</strong>.
            </p>
          </section>

          {/* Section 4 */}
          <section id="processing-architecture" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">4</span>
              <span>Edge WebAssembly &amp; Ephemeral Processing Architecture</span>
            </h2>
            <p>
              SimplePDF operates on a dual privacy-first architectural foundation:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-brand-600">Client-Side WASM (Edge)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Over 70% of operations (Merge, Split, Rotate, Organize, Watermark, Page Numbers, Unlock, Protect, Sign, Crop, Form Fill) execute entirely in your local browser sandbox via WebAssembly. Your files never leave your device.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600">Ephemeral Cloud Pipeline</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For compute-intensive operations (OCR text extraction, Office document conversions, corrupted PDF repair), files are encrypted in flight via TLS 1.3 and held in RAM/temporary storage only as long as necessary, permanently auto-shredded within <strong>60 minutes</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="acceptable-use" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">5</span>
              <span>Acceptable Use Policy (AUP)</span>
            </h2>
            <p>
              To maintain service integrity, security, and global availability, you agree not to use SimplePDF for any unlawful, abusive, or harmful purpose. Specifically, you agree NOT to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Upload or process any document containing malware, viruses, worms, trojans, ransomware, or malicious script payloads intended to exploit PDF viewers or server runtimes.</li>
              <li>Upload or distribute content that depicts child sexual abuse material (CSAM), promotes terrorism, incites violence, or violates international human rights laws.</li>
              <li>Process documents in violation of third-party copyrights, patents, trade secrets, trademarks, or confidentiality obligations without proper authorization.</li>
              <li>Deploy automated scripts, bots, scrapers, spiders, or headless crawlers to bombard our API endpoints or bypass rate limiters, resulting in service denial for other users.</li>
              <li>Attempt to decompile, reverse-engineer, probe, scan, or breach our server infrastructure, firewalls, or network boundaries.</li>
              <li>Resell, white-label, or embed SimplePDF tools in commercial iframe wrappers without prior written authorization from SimplePDF.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="fair-use-limits" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">6</span>
              <span>Fair Use Limits &amp; Automated Protection</span>
            </h2>
            <p>
              While SimplePDF offers generous free access, reasonable technical thresholds exist to ensure server stability and equitable resource distribution:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>File Size Constraints:</strong> Client-side tools support files up to 100MB (constrained primarily by your device&apos;s available RAM). Server-assisted conversions enforce individual file caps (typically up to 50MB per task).</li>
              <li><strong>Automated Rate Limiting:</strong> Requests exceeding standard human interaction velocity (e.g., hundreds of conversion tasks per minute from a single IP address) will be automatically throttled with HTTP 429 &quot;Too Many Requests&quot; responses.</li>
              <li><strong>DDoS &amp; Bot Defense:</strong> We employ Cloudflare and Nginx edge firewalls to mitigate volumetric attacks and automated brute-force attempts.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="advertising" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">7</span>
              <span>Third-Party Advertising &amp; External Links</span>
            </h2>
            <p>
              To maintain our infrastructure, server compute, bandwidth, and ongoing software development without charging user subscription fees, SimplePDF displays digital advertisements served by reputable third-party advertising partners, including <strong>Google AdSense</strong>.
            </p>
            <p>
              Advertisers may use cookies or device identifiers in accordance with our <a href="/cookies" className="text-brand-600 hover:underline">Cookie Policy</a>. 
              SimplePDF does not endorse, guarantee, or assume responsibility for any third-party products, services, claims, or websites advertised on our pages. 
              Clicking on external sponsor links is done solely at your own discretion and risk.
            </p>
          </section>

          {/* Section 8 */}
          <section id="warranties" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">8</span>
              <span>Disclaimer of Warranties (&quot;As-Is&quot; Provision)</span>
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Statutory Warranty Disclaimer</span>
              </div>
              <p>
                SIMPLEPDF IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. 
                TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
            </div>
            <p>
              While we utilize high-precision PDF parsing and rendering engines (e.g., PDF.js, pdf-lib, LibreOffice, Tesseract OCR), PDF specifications vary widely. 
              We do not guarantee that document formatting, font embedding, rasterization, or OCR character recognition will be 100% identical in every corrupted, scanned, or complex document layout. 
              Users are advised to review downloaded outputs prior to critical legal, academic, or financial distribution.
            </p>
          </section>

          {/* Section 9 */}
          <section id="liability" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">9</span>
              <span>Limitation of Liability</span>
            </h2>
            <p>
              TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, IN NO EVENT SHALL SIMPLEPDF, ITS FOUNDERS, OPERATORS, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES ARISING OUT OF OR IN CONNECTION WITH:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li>Your use of or inability to use the service;</li>
              <li>Any unauthorized access to, alteration of, or temporary corruption of transmissions or files;</li>
              <li>Any conversion inaccuracies or formatting variations resulting from corrupt source documents;</li>
              <li>Temporary downtime, routine maintenance outages, or unexpected cloud provider service interruptions.</li>
            </ul>
            <p className="text-xs text-slate-500">
              BECAUSE SIMPLEPDF IS PROVIDED TO YOU FREE OF CHARGE, OUR AGGREGATE LIABILITY FOR ALL CLAIMS UNDER THESE TERMS SHALL NOT EXCEED FIFTY UNITED STATES DOLLARS ($50.00 USD) OR THE AMOUNT YOU PAID TO SIMPLEPDF IN THE PAST TWELVE MONTHS (WHICHEVER IS LESS).
            </p>
          </section>

          {/* Section 10 */}
          <section id="indemnification" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">10</span>
              <span>User Indemnification</span>
            </h2>
            <p>
              You agree to defend, indemnify, and hold harmless SimplePDF and its operators from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or legal fees arising out of or relating to your violation of these Terms of Service or your unauthorized, unlawful, or infringing use of documents processed through SimplePDF.
            </p>
          </section>

          {/* Section 11 */}
          <section id="modifications" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">11</span>
              <span>Service Modifications &amp; Updates</span>
            </h2>
            <p>
              We reserve the right at any time to modify, enhance, update, or temporarily suspend any tool or feature within SimplePDF with or without notice. We periodically update these Terms to reflect legal, regulatory, or operational improvements. Continued use of SimplePDF following the posting of revised Terms constitutes your explicit acceptance of the updated terms.
            </p>
          </section>

          {/* Section 12 */}
          <section id="governing-law" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">12</span>
              <span>Governing Law &amp; Legal Inquiries</span>
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with standard international commercial and consumer protection principles, without giving effect to any principles of conflicts of law. 
              In the event of any dispute, the parties agree to first seek an informal, amicable resolution in good faith.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <p className="font-bold text-slate-900">Legal &amp; Abuse Contact Channels:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">General Legal Inquiries:</span>{' '}
                  <code className="text-brand-600 font-mono">legal@simplepdf.me</code>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Abuse &amp; DMCA Copyright:</span>{' '}
                  <code className="text-brand-600 font-mono">abuse@simplepdf.me</code>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
          <div>
            Need privacy or cookie information? Read our{' '}
            <a href="/privacy" className="text-brand-600 font-semibold hover:underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="/cookies" className="text-brand-600 font-semibold hover:underline">Cookie Policy</a>.
          </div>
          <div className="mt-2 sm:mt-0">
            <a href="/" className="text-brand-600 font-bold hover:underline">Back to SimplePDF Home →</a>
          </div>
        </div>

      </div>
    </div>
  );
};
