import React from 'react';
import { ShieldCheck, Lock, Trash2, Cpu, FileCheck } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Architecture & Document Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Security & Data Protection Architecture
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Detailed technical overview of encryption protocols, ephemeral storage, and client-side processing.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">1. Client-Side WebAssembly Processing (Edge Privacy)</h2>
            </div>
            <p>
              Unlike traditional PDF portals where every file is transmitted over the public internet to a backend server,
              SimplePDF utilizes <strong>in-browser WebAssembly and JavaScript compilation</strong>.
              Operations such as <strong>Merge, Split, Rotate, Organize, Watermark, and Page Numbers</strong> execute 100% inside your browser runtime.
              Your files never leave your device.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-900">2. Ephemeral Storage with Automated Cryptographic Shredding</h2>
            </div>
            <p>
              When a conversion requires server-side rendering (e.g. OCR and Microsoft Office conversions):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Documents are written to isolated temporary volumes using non-deterministic UUIDv4 identifiers.</li>
              <li>A background shredder daemon executes every 15 minutes, permanently unlinking and zero-filling all files older than <strong>60 minutes</strong>.</li>
              <li>Files are also flagged for immediate deletion the instant you complete your download.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">3. End-to-End Transport Layer Security (TLS 256-Bit)</h2>
            </div>
            <p>
              All client-to-server interactions are protected by TLS 1.3 encryption with 256-bit keys, ensuring protection against eavesdropping, interception, or man-in-the-middle attacks.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900">4. Magic Byte & Antivirus Verification</h2>
            </div>
            <p>
              Uploaded streams are inspected at the binary level using file signature magic bytes (`%PDF-`, `PK\x03\x04`, `\xFF\xD8\xFF`), immediately discarding disguised executables or unauthorized payloads.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
