import React, { useState, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  RotateCw,
  Trash2,
  Copy,
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle2,
  RefreshCw,
  Grid,
  Shield,
  Layers,
} from 'lucide-react';

interface PageItem {
  id: string;
  originalIndex: number; // 0-based index in source PDF
  displayNum: number;
  rotation: number; // 0, 90, 180, 270
  previewUrl: string;
}

export const OrganizePdfWorkspace: React.FC = () => {
  const { addHistoryItem } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setLoadingPages(true);
    setErrorMessage('');
    setDownloadUrl(null);

    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF viewer is initializing. Please try again.');
      }

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const loadedPages: PageItem[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          loadedPages.push({
            id: `p_${i}_${Date.now()}`,
            originalIndex: i - 1,
            displayNum: i,
            rotation: 0,
            previewUrl: canvas.toDataURL('image/jpeg', 0.8),
          });
        }
      }

      setPages(loadedPages);
      setLoadingPages(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to load PDF pages. The document might be corrupted or encrypted.');
      setLoadingPages(false);
    }
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPages(updated);
  };

  const rotatePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) {
      alert('A PDF must contain at least one page.');
      return;
    }
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicatePage = (index: number) => {
    const target = pages[index];
    const duplicated: PageItem = {
      ...target,
      id: `p_dup_${Date.now()}_${Math.random()}`,
    };
    const updated = [...pages];
    updated.splice(index + 1, 0, duplicated);
    setPages(updated);
  };

  const handleSaveOrganizedPdf = async () => {
    if (!file || pages.length === 0) return;
    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const p of pages) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [p.originalIndex]);
        if (p.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + p.rotation) % 360));
        }
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      addHistoryItem('Organize PDF', `organized_${file.name}`, blob.size);
      setProcessing(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to assemble organized PDF. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% In-Browser Interactive Page Manager</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Organize PDF Pages
          </h1>
          <p className="text-sm text-slate-600">
            Drag to reorder, click to rotate, duplicate, or delete pages to build the perfect document.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        {!file ? (
          /* Empty Dropzone */
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
              <Grid className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all">
                Select PDF to Organize
              </span>
              <p className="text-xs text-slate-500 pt-2">or drag and drop your document here</p>
            </div>
          </div>
        ) : loadingPages ? (
          /* Loading Thumbnails */
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
            <RefreshCw className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Rendering Page Thumbnails...</h3>
            <p className="text-xs text-slate-500">Generating visual previews for every page in your document.</p>
          </div>
        ) : (
          /* Interactive Pages Grid */
          <div className="space-y-6">
            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" />
                <span className="font-bold text-sm text-slate-800">
                  {pages.length} Pages Configured
                </span>
                <span className="text-xs text-slate-400">({file.name})</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-colors"
                >
                  Change File
                </button>
                <button
                  onClick={handleSaveOrganizedPdf}
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{processing ? 'Assembling PDF...' : 'Save & Download PDF'}</span>
                </button>
              </div>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((p, index) => (
                <div
                  key={p.id}
                  className="relative bg-white rounded-2xl border-2 border-slate-200 hover:border-brand-400 p-3 shadow-xs hover:shadow-soft transition-all flex flex-col justify-between group"
                >
                  {/* Top Badge: Position and Original Page Num */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Page {index + 1}
                    </span>
                    {p.rotation !== 0 && (
                      <span className="text-[10px] font-bold text-brand-600 bg-rose-50 px-1.5 rounded">
                        {p.rotation}°
                      </span>
                    )}
                  </div>

                  {/* Page Preview Thumbnail */}
                  <div className="flex items-center justify-center p-2 bg-slate-50 rounded-xl overflow-hidden min-h-[160px]">
                    <img
                      src={p.previewUrl}
                      alt={`Page ${index + 1}`}
                      style={{
                        transform: `rotate(${p.rotation}deg)`,
                      }}
                      className="max-h-36 object-contain shadow-xs transition-transform duration-200"
                    />
                  </div>

                  {/* Actions Toolbar */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                    <button
                      onClick={() => movePage(index, 'left')}
                      disabled={index === 0}
                      title="Move Left"
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 hover:text-brand-600"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => rotatePage(p.id)}
                      title="Rotate 90° Clockwise"
                      className="p-1 rounded hover:bg-slate-100 hover:text-brand-600"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => duplicatePage(index)}
                      title="Duplicate Page"
                      className="p-1 rounded hover:bg-slate-100 hover:text-brand-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePage(p.id)}
                      title="Delete Page"
                      className="p-1 rounded hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePage(index, 'right')}
                      disabled={index === pages.length - 1}
                      title="Move Right"
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 hover:text-brand-600"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Complete Banner */}
            {downloadUrl && (
              <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-soft flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Organized PDF Generated!</h4>
                    <p className="text-xs text-slate-500">All page sequences and rotations have been committed.</p>
                  </div>
                </div>
                <a
                  href={downloadUrl}
                  download={`organized_${file.name}`}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
