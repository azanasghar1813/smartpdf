import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/apiService';
import {
  Sparkles,
  UploadCloud,
  Languages,
  Copy,
  Check,
  Download,
  BookOpen,
  RefreshCw,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface AiIntelligenceWorkspaceProps {
  mode: 'summarize' | 'translate';
}

export const AiIntelligenceWorkspace: React.FC<AiIntelligenceWorkspaceProps> = ({ mode }) => {
  const { addHistoryItem } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [processingAi, setProcessingAi] = useState(false);

  // Summarize state
  const [summaryDepth, setSummaryDepth] = useState<'brief' | 'bullets' | 'deep'>('bullets');
  const [generatedSummary, setGeneratedSummary] = useState('');

  // Translate state
  const [targetLang, setTargetLang] = useState('Spanish');
  const [translatedContent, setTranslatedContent] = useState('');

  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract text from PDF in-browser via PDF.js
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setExtracting(true);
    setGeneratedSummary('');
    setTranslatedContent('');

    try {
      if (!window.pdfjsLib) throw new Error('PDF Engine initializing...');
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `\n--- Page ${i} ---\n` + pageText;
      }

      setExtractedText(fullText.trim());
      setExtracting(false);
    } catch (err: any) {
      console.error(err);
      alert('Could not extract text from this PDF.');
      setExtracting(false);
    }
  };

  const runAiProcessing = async () => {
    if (!extractedText) return;
    setProcessingAi(true);

    if (mode === 'summarize') {
      const cleanSnippet = extractedText.replace(/--- Page \d+ ---/g, '').trim();
      if (cleanSnippet.length < 25) {
        alert('This document appears to be scanned or contains no extractable text. Scanned files require optical character recognition (OCR) before text can be summarized.');
        setProcessingAi(false);
        return;
      }

      try {
        const depthParam = summaryDepth === 'brief' ? 'quick' : summaryDepth === 'deep' ? 'academic' : 'detailed';
        const aiResponse = await ApiService.summarizeText(extractedText, depthParam);
        
        let formatted = `### ${aiResponse.keyTopics ? aiResponse.keyTopics.join(' • ') : 'Document Summary'}\n\n`;
        formatted += `${aiResponse.summary}\n\n`;
        if (aiResponse.bulletPoints && aiResponse.bulletPoints.length > 0) {
          formatted += `#### Key Takeaways\n` + aiResponse.bulletPoints.join('\n');
        }
        setGeneratedSummary(formatted);
        addHistoryItem('AI Summarizer', file?.name || 'document.pdf', 1024);
      } catch (err: any) {
        console.warn('[AiIntelligence] Cloud AI API error:', err);
        setGeneratedSummary(`### Service Notice\nUnable to generate AI summary at this time (${err?.message || 'Cloud AI engine offline'}). Please ensure backend AI service is running and try again.`);
      }
    } else {
      const cleanSnippet = extractedText.replace(/--- Page \d+ ---/g, '').trim();
      if (cleanSnippet.length < 10) {
        alert('This document contains no extractable text to translate. Please upload a text-based document.');
        setProcessingAi(false);
        return;
      }

      try {
        const aiResponse = await ApiService.translateText(extractedText.slice(0, 3000), targetLang);
        setTranslatedContent(aiResponse.translatedText);
        addHistoryItem('Translate PDF', file?.name || 'document.pdf', 1024);
      } catch (err: any) {
        console.warn('[AiIntelligence] Cloud Translation API error:', err);
        setTranslatedContent(`### Translation Notice\nTranslation service is temporarily unavailable (${err?.message || 'Server connection failed'}). Please try again shortly.`);
      }
    }

    setProcessingAi(false);
  };

  const copyToClipboard = () => {
    const textToCopy = mode === 'summarize' ? generatedSummary : translatedContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsMarkdown = () => {
    const textToDownload = mode === 'summarize' ? generatedSummary : translatedContent;
    const blob = new Blob([textToDownload], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'summarize' ? 'summary' : 'translated'}_${file?.name.replace('.pdf', '')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>PDF Document Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'summarize' ? 'AI PDF Document Summarizer' : 'AI PDF Document Translator'}
          </h1>
          <p className="text-sm text-slate-600">
            {mode === 'summarize'
              ? 'Distill lengthy papers, reports, and contracts into instant executive takeaways.'
              : 'Translate complex multi-page PDF documents into 50+ languages.'}
          </p>
        </div>

        {!file ? (
          /* File Ingestion Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white rounded-3xl border-3 border-dashed border-slate-300 hover:border-indigo-400 p-16 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 shadow-soft"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all">
                Select PDF for {mode === 'summarize' ? 'Summarization' : 'Translation'}
              </span>
              <p className="text-xs text-slate-500 pt-2">or drag and drop your document here</p>
            </div>
          </div>
        ) : (
          /* Processing Workspace */
          <div className="space-y-6">
            {/* Document Info & Controls */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm truncate max-w-sm">{file.name}</h4>
                  <p className="text-xs text-slate-400">
                    {extractedText ? `${extractedText.split(' ').length} words extracted` : 'Analyzing text layer...'}
                  </p>
                </div>
              </div>

              {/* Tool Specific Options */}
              <div className="flex items-center gap-3">
                {mode === 'summarize' ? (
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setSummaryDepth('brief')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        summaryDepth === 'brief' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      Brief
                    </button>
                    <button
                      onClick={() => setSummaryDepth('bullets')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        summaryDepth === 'bullets' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      Takeaways
                    </button>
                    <button
                      onClick={() => setSummaryDepth('deep')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        summaryDepth === 'deep' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      Deep Dive
                    </button>
                  </div>
                ) : (
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="Urdu">Urdu (اردو)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                  </select>
                )}

                <button
                  onClick={runAiProcessing}
                  disabled={processingAi || extracting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{processingAi ? 'Generating...' : mode === 'summarize' ? 'Generate Summary' : 'Translate'}</span>
                </button>
              </div>
            </div>

            {/* Results Display */}
            {(generatedSummary || translatedContent) && (
              <div className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-soft space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Insights Result</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={downloadAsMarkdown}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .MD</span>
                    </button>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-3">
                  <div className="whitespace-pre-wrap font-sans text-sm">
                    {mode === 'summarize' ? generatedSummary : translatedContent}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
