import React, { useState, useRef, useEffect } from 'react';
import {
  GitCompare,
  UploadCloud,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export const ComparePdfWorkspace: React.FC = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);

  const [pageCountA, setPageCountA] = useState(0);
  const [pageCountB, setPageCountB] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const canvasRefA = useRef<HTMLCanvasElement>(null);
  const canvasRefB = useRef<HTMLCanvasElement>(null);

  const renderPage = async (file: File, pageNum: number, canvas: HTMLCanvasElement) => {
    if (!window.pdfjsLib) return;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    if (pageNum > pdf.numPages) return;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      await page.render({ canvasContext: ctx, viewport }).promise;
    }
  };

  useEffect(() => {
    if (fileA && canvasRefA.current) {
      renderPage(fileA, currentPage, canvasRefA.current);
    }
  }, [fileA, currentPage]);

  useEffect(() => {
    if (fileB && canvasRefB.current) {
      renderPage(fileB, currentPage, canvasRefB.current);
    }
  }, [fileB, currentPage]);

  const handleUploadA = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileA(f);
      if (window.pdfjsLib) {
        const buf = await f.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
        setPageCountA(pdf.numPages);
      }
    }
  };

  const handleUploadB = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileB(f);
      if (window.pdfjsLib) {
        const buf = await f.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
        setPageCountB(pdf.numPages);
      }
    }
  };

  const maxPages = Math.max(pageCountA, pageCountB) || 1;

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Side-by-Side Visual Document Diff</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Compare Two PDF Documents
          </h1>
          <p className="text-sm text-slate-600">
            Spot differences between two versions of a contract, report, or presentation with ease.
          </p>
        </div>

        {/* Dual Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File A Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Document A (Original)
            </span>
            {!fileA ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-400" />
                <span className="text-xs font-bold text-brand-600">Upload Original PDF</span>
                <input type="file" accept=".pdf" onChange={handleUploadA} className="hidden" />
              </label>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-brand-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 truncate">{fileA.name}</span>
                </div>
                <span className="text-xs text-slate-400">{pageCountA} pages</span>
              </div>
            )}
          </div>

          {/* File B Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Document B (New Revision)
            </span>
            {!fileB ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-400" />
                <span className="text-xs font-bold text-brand-600">Upload Revised PDF</span>
                <input type="file" accept=".pdf" onChange={handleUploadB} className="hidden" />
              </label>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-brand-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 truncate">{fileB.name}</span>
                </div>
                <span className="text-xs text-slate-400">{pageCountB} pages</span>
              </div>
            )}
          </div>
        </div>

        {/* Side-by-Side Visual Comparison View */}
        {fileA && fileB && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-brand-600" />
                <span className="font-bold text-sm text-slate-900">Synchronized Page Inspector</span>
              </div>

              {/* Page Navigator */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {maxPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(maxPages, p + 1))}
                  disabled={currentPage >= maxPages}
                  className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-100 p-6 rounded-2xl overflow-auto">
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold text-slate-500">Document A (Page {currentPage})</span>
                <div className="bg-white p-2 rounded-xl shadow-xs flex justify-center">
                  <canvas ref={canvasRefA} className="max-w-full h-auto border border-slate-200" />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <span className="text-xs font-bold text-slate-500">Document B (Page {currentPage})</span>
                <div className="bg-white p-2 rounded-xl shadow-xs flex justify-center">
                  <canvas ref={canvasRefB} className="max-w-full h-auto border border-slate-200" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
