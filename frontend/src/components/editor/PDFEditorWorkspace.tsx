import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { SignPadModal } from './SignPadModal';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  PenTool,
  Type,
  Square,
  Download,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AnnotationItem {
  id: string;
  type: 'signature' | 'text' | 'rect';
  x: number; // percentage of canvas width (0 - 100)
  y: number; // percentage of canvas height (0 - 100)
  width?: number;
  height?: number;
  dataUrl?: string; // for signature
  text?: string;
  fontSize?: number;
  color?: string;
}

export const PDFEditorWorkspace: React.FC<{ toolName?: string }> = ({
  toolName = 'Sign & Edit PDF',
}) => {
  const { addHistoryItem } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageRendering, setPageRendering] = useState(false);

  const [activeTool, setActiveTool] = useState<'select' | 'sign' | 'text' | 'rect'>('select');
  const [annotations, setAnnotations] = useState<Record<number, AnnotationItem[]>>({});
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<string | null>(null);

  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF document and render current page using PDF.js
  useEffect(() => {
    if (!file || !window.pdfjsLib) return;

    let isMounted = true;
    setPageRendering(true);

    const renderPage = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (!isMounted) return;

        setNumPages(pdf.numPages);
        const page = await pdf.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Render at crisp 1.5x scale
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport }).promise;
        setPageRendering(false);
      } catch (err) {
        console.error('Error rendering page:', err);
        setPageRendering(false);
      }
    };

    renderPage();
    return () => {
      isMounted = false;
    };
  }, [file, currentPage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCurrentPage(1);
      setAnnotations({});
      setDownloadUrl(null);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTool === 'sign') {
      if (!currentSignature) {
        setSignModalOpen(true);
        return;
      }
      // Place signature
      const newAnnotation: AnnotationItem = {
        id: `ann_${Date.now()}`,
        type: 'signature',
        x: clickX - 10,
        y: clickY - 5,
        width: 140,
        height: 60,
        dataUrl: currentSignature,
      };
      setAnnotations((prev) => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newAnnotation],
      }));
      setActiveTool('select');
    } else if (activeTool === 'text') {
      const text = prompt('Enter annotation text:', 'Approved by management');
      if (!text) return;
      const newAnnotation: AnnotationItem = {
        id: `ann_${Date.now()}`,
        type: 'text',
        x: clickX,
        y: clickY,
        text,
        fontSize: 14,
        color: '#0f172a',
      };
      setAnnotations((prev) => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newAnnotation],
      }));
      setActiveTool('select');
    } else if (activeTool === 'rect') {
      const newAnnotation: AnnotationItem = {
        id: `ann_${Date.now()}`,
        type: 'rect',
        x: clickX - 10,
        y: clickY - 3,
        width: 100,
        height: 25,
        color: 'rgba(254, 240, 138, 0.45)', // yellow highlight
      };
      setAnnotations((prev) => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newAnnotation],
      }));
      setActiveTool('select');
    }
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations((prev) => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).filter((a) => a.id !== id),
    }));
  };

  // Export Signed/Edited PDF with PDF-lib
  const handleExportPDF = async () => {
    if (!file) return;
    setExporting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (let pIndex = 0; pIndex < pages.length; pIndex++) {
        const pageNum = pIndex + 1;
        const pageAnnotations = annotations[pageNum] || [];
        const page = pages[pIndex];
        const { width: pWidth, height: pHeight } = page.getSize();

        for (const item of pageAnnotations) {
          // Calculate PDF coordinates (PDF origin is bottom-left)
          const targetX = (item.x / 100) * pWidth;
          const targetY = pHeight - (item.y / 100) * pHeight;

          if (item.type === 'signature' && item.dataUrl) {
            const pngBytes = await fetch(item.dataUrl).then((r) => r.arrayBuffer());
            const pngImage = await pdfDoc.embedPng(pngBytes);
            const scale = (item.width || 120) * 0.75;
            page.drawImage(pngImage, {
              x: targetX,
              y: targetY - 40,
              width: scale,
              height: scale * 0.42,
            });
          } else if (item.type === 'text' && item.text) {
            page.drawText(item.text, {
              x: targetX,
              y: targetY - 12,
              size: item.fontSize || 12,
              font,
              color: rgb(0.1, 0.1, 0.1),
            });
          } else if (item.type === 'rect') {
            page.drawRectangle({
              x: targetX,
              y: targetY - 20,
              width: item.width || 100,
              height: item.height || 25,
              color: rgb(0.99, 0.94, 0.54), // highlight yellow
              opacity: 0.5,
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      addHistoryItem('Sign & Edit PDF', `signed_${file.name}`, blob.size);
      setExporting(false);
    } catch (err) {
      console.error(err);
      alert('Error exporting signed PDF. Please try again.');
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-600">Interactive Editor</span>
              <h1 className="text-xl font-extrabold text-slate-900">{toolName}</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Stamp visual electronic signatures, add text annotations, and draw highlight boxes directly in your browser.
            </p>
          </div>

          {file && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSignModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <PenTool className="w-3.5 h-3.5 text-brand-600" />
                <span>{currentSignature ? 'Change Visual Signature' : 'Create Visual Signature'}</span>
              </button>

              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{exporting ? 'Exporting...' : 'Export Final PDF'}</span>
              </button>
            </div>
          )}
        </div>

        {/* WORKSPACE AREA */}
        {!file ? (
          /* Empty File Upload View */
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
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all">
                Select PDF to Sign & Edit
              </span>
              <p className="text-xs text-slate-500 pt-2">or drag and drop your document here</p>
            </div>
          </div>
        ) : (
          /* Visual Document Editor Interface */
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setActiveTool('select')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeTool === 'select' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Inspect / Select
                </button>
                <button
                  onClick={() => {
                    setActiveTool('sign');
                    if (!currentSignature) setSignModalOpen(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'sign' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-brand-50'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Place Visual Signature</span>
                </button>
                <button
                  onClick={() => setActiveTool('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'text' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-brand-50'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Add Text</span>
                </button>
                <button
                  onClick={() => setActiveTool('rect')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTool === 'rect' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-brand-50'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Highlight Box</span>
                </button>
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
                  Page {currentPage} of {numPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  disabled={currentPage >= numPages}
                  className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Canvas with Overlay */}
            <div className="bg-slate-200/80 p-6 rounded-3xl border border-slate-300 flex justify-center overflow-auto min-h-[500px]">
              <div className="relative shadow-soft-lg rounded-lg bg-white overflow-hidden max-w-full">
                <canvas ref={canvasRef} className="block max-w-full h-auto pointer-events-none" />

                {/* Interactive Click Overlay */}
                <div
                  ref={overlayRef}
                  onClick={handleOverlayClick}
                  className={`absolute inset-0 ${
                    activeTool !== 'select' ? 'cursor-crosshair bg-brand-500/5' : 'cursor-default'
                  }`}
                >
                  {/* Render Page Annotations */}
                  {(annotations[currentPage] || []).map((ann) => (
                    <div
                      key={ann.id}
                      style={{
                        position: 'absolute',
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                      }}
                      className="group p-1 border border-dashed border-transparent hover:border-brand-500 rounded select-none cursor-move"
                    >
                      {ann.type === 'signature' && ann.dataUrl && (
                        <img src={ann.dataUrl} alt="Signature" className="w-32 h-auto" />
                      )}
                      {ann.type === 'text' && (
                        <span className="font-semibold text-slate-900 bg-white/70 px-1 rounded shadow-2xs">
                          {ann.text}
                        </span>
                      )}
                      {ann.type === 'rect' && (
                        <div
                          style={{
                            width: ann.width || 100,
                            height: ann.height || 25,
                            backgroundColor: ann.color || 'rgba(254, 240, 138, 0.5)',
                          }}
                        />
                      )}

                      {/* Delete button on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnnotation(ann.id);
                        }}
                        className="hidden group-hover:flex absolute -top-3 -right-3 w-5 h-5 rounded-full bg-red-600 text-white items-center justify-center text-[10px] shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Modal / Banner */}
            {downloadUrl && (
              <div className="p-5 sm:p-6 bg-white rounded-2xl border border-emerald-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Signed Document Ready!</h4>
                    <p className="text-xs text-slate-500">All electronic signatures and annotations are baked in.</p>
                  </div>
                </div>
                <a
                  href={downloadUrl}
                  download={`signed_${file.name}`}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Signature Pad Modal */}
        <SignPadModal
          isOpen={signModalOpen}
          onClose={() => setSignModalOpen(false)}
          onSaveSignature={(sigUrl) => {
            setCurrentSignature(sigUrl);
            setActiveTool('sign');
          }}
        />
      </div>
    </div>
  );
};
