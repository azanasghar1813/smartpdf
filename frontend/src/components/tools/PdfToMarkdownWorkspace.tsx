import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  FileCode,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  Shield,
} from 'lucide-react';

export const PdfToMarkdownWorkspace: React.FC = () => {
  const { addHistoryItem } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [converting, setConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setConverting(true);
    setMarkdown('');

    try {
      if (!window.pdfjsLib) throw new Error('PDF Engine initializing...');
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let mdOutput = `# ${selectedFile.name.replace('.pdf', '')}\n\n`;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        mdOutput += `\n## Page ${i}\n\n`;

        let currentParagraph = '';
        for (const item of textContent.items as any[]) {
          const str = item.str?.trim();
          if (!str) continue;

          // Detect potential headings
          if (str.length < 50 && (str.toUpperCase() === str || item.height > 14)) {
            if (currentParagraph) {
              mdOutput += currentParagraph + '\n\n';
              currentParagraph = '';
            }
            mdOutput += `### ${str}\n\n`;
          } else {
            currentParagraph += (currentParagraph ? ' ' : '') + str;
          }
        }

        if (currentParagraph) {
          mdOutput += currentParagraph + '\n\n';
        }
      }

      setMarkdown(mdOutput.trim());
      addHistoryItem('PDF to Markdown', `${selectedFile.name.replace('.pdf', '')}.md`, 1024);
      setConverting(false);
    } catch (err: any) {
      console.error(err);
      alert('Could not convert this PDF to Markdown.');
      setConverting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdownFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '') || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% In-Browser Structured Extraction</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            PDF to Markdown Converter
          </h1>
          <p className="text-sm text-slate-600">
            Convert reports, academic papers, and documentation into clean, token-efficient Markdown for LLMs & AI workflows.
          </p>
        </div>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white rounded-3xl border-3 border-dashed border-slate-300 hover:border-brand-400 p-16 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 shadow-soft"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-inner">
              <FileCode className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all">
                Select PDF for Markdown Extraction
              </span>
              <p className="text-xs text-slate-500 pt-2">or drag and drop your document here</p>
            </div>
          </div>
        ) : converting ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
            <RefreshCw className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Parsing PDF Hierarchy...</h3>
            <p className="text-xs text-slate-500">Detecting headings, paragraph flow, and page structures.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-brand-600" />
                <span className="font-bold text-sm text-slate-900">Markdown Result</span>
                <span className="text-xs text-slate-400">({file.name})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Markdown'}</span>
                </button>

                <button
                  onClick={downloadMarkdownFile}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={markdown}
              rows={18}
              className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-200 rounded-2xl focus:outline-none resize-none leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
};
