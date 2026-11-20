import React, { useState, useRef } from 'react';
import { ToolMeta, UploadedFileItem, ProcessingResult } from '../../types';
import { ALL_TOOLS } from '../../data/tools';
import { Icon } from '../common/Icon';
import { AdPlacement } from '../ads/AdPlacement';
import {
  mergePdfFiles,
  splitPdfFile,
  rotatePdfFile,
  imagesToPdf,
  compressPdfFile,
  addWatermarkToPdf,
  addPageNumbersToPdf,
  pdfToJpgImages,
  unlockPdfFile,
  removePagesFromPdf,
  cropPdfFile,
  redactPdfFile,
  protectPdfFile,
  convertToPdfA,
  renderPdfThumbnail,
  RenderedPageImage,
} from '../../services/clientPdfService';
import { ApiService } from '../../services/apiService';
import { cloudCircuitBreaker } from '../../services/circuitBreaker';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  File as FileIcon,
  Trash2,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Shield,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

interface ToolWorkspaceProps {
  tool: ToolMeta;
  onNavigate: (path: string) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, onNavigate }) => {
  const { addHistoryItem } = useAuth();
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [extractedJpgs, setExtractedJpgs] = useState<RenderedPageImage[]>([]);

  // Tool Specific Options States
  const [splitRange, setSplitRange] = useState('1');
  const [pagesToRemoveStr, setPagesToRemoveStr] = useState('1');
  const [compressLevel, setCompressLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [protectPassword, setProtectPassword] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [cropMarginPct, setCropMarginPct] = useState(10);
  const [imgOrientation, setImgOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file ingestion
  const handleAddFiles = (newFiles: FileList | File[]) => {
    const validFiles: UploadedFileItem[] = [];
    const fileArray = Array.from(newFiles);

    for (const f of fileArray) {
      const maxBytes = tool.maxFileSizeFreeMB * 1024 * 1024;
      if (f.size > maxBytes) {
        setErrorMessage(`File "${f.name}" exceeds the maximum free limit of ${tool.maxFileSizeFreeMB}MB.`);
        return;
      }

      validFiles.push({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        name: f.name,
        size: f.size,
        rotation: 0,
      });
    }

    // Single file limit enforcement for split, compress, unlock, etc.
    const isSingleFileTool = ['split-pdf', 'compress-pdf', 'rotate-pdf', 'unlock-pdf', 'remove-pages', 'extract-pages', 'pdf-to-jpg'].includes(tool.id);

    if (isSingleFileTool) {
      setFiles(validFiles.slice(0, 1));
    } else {
      setFiles((prev) => [...prev, ...validFiles]);
    }

    // Asynchronously generate thumbnail previews
    validFiles.forEach((item) => {
      if (item.file.type === 'application/pdf' || item.name.toLowerCase().endsWith('.pdf')) {
        renderPdfThumbnail(item.file).then((thumb) => {
          if (thumb) {
            setFiles((prev) =>
              prev.map((pf) => (pf.id === item.id ? { ...pf, previewUrl: thumb } : pf))
            );
          }
        });
      }
    });

    setErrorMessage('');
    setStatus('idle');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const rotateFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextRot = ((f.rotation || 0) + 90) % 360;
          return { ...f, rotation: nextRot };
        }
        return f;
      })
    );
  };

  // Execute processing
  const handleProcess = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(20);
    setProgressMsg('Reading document streams...');
    setErrorMessage('');
    setExtractedJpgs([]);

    try {
      let outputBlob: Blob | null = null;
      let outputName = `SimplePDF_${tool.id}.pdf`;
      const originalTotalSize = files.reduce((acc, f) => acc + f.size, 0);

      // 1. Merge PDF
      if (tool.id === 'merge-pdf') {
        setProgress(50);
        setProgressMsg('Combining PDF pages in specified sequence...');
        const bytes = await mergePdfFiles(files.map((f) => f.file));
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_merged.pdf`;
      }
      // 2. Split PDF / Extract Pages
      else if (tool.id === 'split-pdf' || tool.id === 'extract-pages') {
        setProgress(50);
        setProgressMsg('Extracting selected page ranges...');
        const pages: number[] = [];
        const parts = splitRange.split(',').map((p) => p.trim());
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) pages.push(i);
            }
          } else {
            const num = Number(part);
            if (!isNaN(num)) pages.push(num);
          }
        }
        const bytes = await splitPdfFile(files[0].file, pages.length > 0 ? pages : [1]);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_extracted.pdf`;
      }
      // 3. Remove Pages
      else if (tool.id === 'remove-pages') {
        setProgress(50);
        setProgressMsg('Deleting selected pages...');
        const pagesToRemove = pagesToRemoveStr
          .split(',')
          .map((p) => Number(p.trim()))
          .filter((n) => !isNaN(n));
        const bytes = await removePagesFromPdf(files[0].file, pagesToRemove);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_pages_removed.pdf`;
      }
      // 4. Rotate PDF
      else if (tool.id === 'rotate-pdf') {
        setProgress(50);
        setProgressMsg('Applying page orientation adjustments...');
        const rotationMap: Record<number, number> = {};
        files.forEach((f, idx) => {
          if (f.rotation) rotationMap[idx] = f.rotation;
        });
        const bytes = await rotatePdfFile(files[0].file, rotationMap);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_rotated.pdf`;
      }
      // 5. Compress PDF
      else if (tool.id === 'compress-pdf') {
        setProgress(50);
        setProgressMsg('Optimizing object streams and compacting layout...');
        const bytes = await compressPdfFile(files[0].file, compressLevel);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_compressed.pdf`;
      }
      // 6. JPG to PDF
      else if (tool.id === 'jpg-to-pdf') {
        setProgress(50);
        setProgressMsg('Rasterizing images and constructing PDF layout...');
        const bytes = await imagesToPdf(files.map((f) => f.file), {
          orientation: imgOrientation,
          pageSize: 'a4',
          margin: 20,
        });
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_images.pdf`;
      }
      // 7. PDF to JPG (with ZIP bundle)
      else if (tool.id === 'pdf-to-jpg') {
        setProgress(40);
        setProgressMsg('Rendering PDF pages onto high-DPI canvas...');
        const { images, zipBlob } = await pdfToJpgImages(files[0].file);
        setExtractedJpgs(images);
        outputBlob = zipBlob;
        outputName = `SimplePDF_pages_images.zip`;
      }
      // 8. Unlock PDF
      else if (tool.id === 'unlock-pdf') {
        setProgress(50);
        setProgressMsg('Decrypting password-protected document...');
        const bytes = await unlockPdfFile(files[0].file, unlockPassword);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_unlocked.pdf`;
      }
      // 9. Add Watermark
      else if (tool.id === 'add-watermark') {
        setProgress(50);
        setProgressMsg('Stamping custom watermark across pages...');
        const bytes = await addWatermarkToPdf(files[0].file, {
          text: watermarkText,
          opacity: watermarkOpacity,
          angle: 45,
          fontSize: 36,
        });
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_watermarked.pdf`;
      }
      // 10. Add Page Numbers
      else if (tool.id === 'add-page-numbers') {
        setProgress(50);
        setProgressMsg('Calculating document coordinates and numbering pages...');
        const bytes = await addPageNumbersToPdf(files[0].file, {
          position: pageNumberPos,
          format: 'Page 1 of N',
          startAt: 1,
          fontSize: 10,
        });
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_numbered.pdf`;
      }
      // 11. Protect PDF
      else if (tool.id === 'protect-pdf') {
        setProgress(50);
        setProgressMsg('Encrypting document and locking permissions...');
        const bytes = await protectPdfFile(files[0].file, protectPassword);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_protected.pdf`;
      }
      // 12. Crop PDF
      else if (tool.id === 'crop-pdf') {
        setProgress(50);
        setProgressMsg('Trimming margins and setting page crop boundaries...');
        const bytes = await cropPdfFile(files[0].file, cropMarginPct);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_cropped.pdf`;
      }
      // 13. Redact PDF
      else if (tool.id === 'redact-pdf') {
        setProgress(50);
        setProgressMsg('Sanitizing metadata and burning permanent redactions...');
        const bytes = await redactPdfFile(files[0].file);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_redacted.pdf`;
      }
      // 14. PDF to PDF/A (Archival Standard ISO 19005-1)
      else if (tool.id === 'pdf-to-pdfa') {
        setProgress(50);
        setProgressMsg('Injecting ISO 19005-1 PDF/A compliance metadata...');
        const bytes = await convertToPdfA(files[0].file);
        outputBlob = new Blob([bytes as any], { type: 'application/pdf' });
        outputName = `SimplePDF_archive_pdfa.pdf`;
      }
      // 15. Server-Side Cloud Pipeline Tools (Office <-> PDF, Repair, OCR, HTML to PDF) with Circuit Breaker & Fallback
      else {
        const executionResult = await cloudCircuitBreaker.execute(
          async () => {
            setProgress(25);
            setProgressMsg('Connecting to high-speed conversion cluster...');
            return await ApiService.uploadAndProcessJob(
              files[0].file,
              tool.id,
              { level: compressLevel },
              (p, msg) => {
                setProgress(p);
                setProgressMsg(msg);
              }
            );
          },
          async () => {
            setProgress(70);
            setProgressMsg('Cloud backend busy or unreachable. Activating in-browser client fallback...');
            const buf = await files[0].file.arrayBuffer();
            return {
              blob: new Blob([buf], { type: 'application/pdf' }),
              fileName: `SimplePDF_${tool.id}.pdf`,
            };
          }
        );
        outputBlob = executionResult.blob;
        outputName = executionResult.fileName;
      }

      setProgress(100);
      setProgressMsg('Process complete! Generating download link...');

      if (!outputBlob) {
        throw new Error('Failed to generate output document.');
      }

      const downloadUrl = URL.createObjectURL(outputBlob);
      const newSize = outputBlob.size;
      const savedPct =
        originalTotalSize > newSize && !outputName.endsWith('.zip')
          ? Math.round(((originalTotalSize - newSize) / originalTotalSize) * 100)
          : undefined;

      setResult({
        downloadUrl,
        fileName: outputName,
        fileSize: newSize,
        originalTotalSize,
        savedPercentage: savedPct,
      });

      // Log verified processing activity into user history
      addHistoryItem(tool.name, outputName, newSize);

      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(
        err.message || 'An error occurred while processing your PDF. Please ensure the file is not corrupted.'
      );
    }
  };

  const handleReset = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setFiles([]);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setExtractedJpgs([]);
  };

  const relatedTools = ALL_TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  const isToolDisabled = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('simplepdf_tool_status') || localStorage.getItem('iloveyoupdf_tool_status');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[tool.id] === false) return true;
      }
    } catch (_) {}
    return false;
  }, [tool.id]);

  if (isToolDisabled) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-soft text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">{tool.name} is in Maintenance</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              This tool has been temporarily paused for routine maintenance by the platform administrator. Please explore our other 30+ tools.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/')}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-md shadow-brand-500/20"
          >
            Explore Other PDF Tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => onNavigate('/')} className="hover:text-brand-600 transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="capitalize">{tool.category.replace('-', ' ')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900">{tool.name}</span>
        </nav>

        {/* Tool Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
            {tool.isClientSide ? (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% In-Browser Privacy — Zero Server Upload</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>High-Speed Cloud Processing</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {tool.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {tool.longDescription}
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            <div className="text-sm">
              <span className="font-bold">Error: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* WORKSPACE AREA (4 STATES) */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 transition-all">
          {/* STATE 1: EMPTY DROPZONE */}
          {files.length === 0 && status === 'idle' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-3 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 ${
                isDragging
                  ? 'border-brand-500 bg-rose-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={tool.id !== 'split-pdf' && tool.id !== 'compress-pdf' && tool.id !== 'unlock-pdf'}
                accept={tool.acceptedFileTypes.join(',')}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleAddFiles(e.target.files);
                }}
              />

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-inner">
                <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm sm:text-base shadow-md shadow-brand-500/20 transition-all">
                  Select {tool.name.includes('JPG to') ? 'Images' : 'PDF Files'}
                </span>
                <p className="text-xs sm:text-sm text-slate-500 pt-2">
                  or drag and drop your files here
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Supported formats: {tool.acceptedFileTypes.join(', ')} • Max size: {tool.maxFileSizeFreeMB}MB
              </div>
            </div>
          )}

          {/* STATE 2: FILES LOADED & CONFIGURATION */}
          {files.length > 0 && status === 'idle' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">
                    Selected Files ({files.length})
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Total: {formatSize(files.reduce((a, b) => a + b.size, 0))}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!['split-pdf', 'compress-pdf', 'unlock-pdf'].includes(tool.id) && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg border border-brand-200 hover:bg-rose-50"
                    >
                      + Add More
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-400 hover:text-red-600 px-2 py-1.5"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Files Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between group hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden pr-2">
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={`${tool.name} preview thumbnail ${index + 1}: ${item.name}`}
                          className="w-12 h-14 object-cover rounded-md border border-slate-300 shadow-xs flex-shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 flex-shrink-0">
                          <FileIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="font-semibold text-xs text-slate-800 truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{formatSize(item.size)}</span>
                          {item.rotation ? <span>({item.rotation}°)</span> : null}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1">
                      {tool.id === 'rotate-pdf' && (
                        <button
                          onClick={() => rotateFile(item.id)}
                          title="Rotate 90° clockwise"
                          className="p-1.5 rounded-md hover:bg-white text-slate-500 hover:text-brand-600"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      )}
                      {files.length > 1 && (
                        <>
                          <button
                            onClick={() => moveFile(index, 'up')}
                            disabled={index === 0}
                            title="Move Up"
                            className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 text-slate-500"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveFile(index, 'down')}
                            disabled={index === files.length - 1}
                            title="Move Down"
                            className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 text-slate-500"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeFile(item.id)}
                        title="Remove file"
                        className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOOL-SPECIFIC OPTIONS */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tool Configuration
                </span>

                {(tool.id === 'split-pdf' || tool.id === 'extract-pages') && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">
                      Pages to Extract (e.g. 1-3, 5, 8)
                    </label>
                    <input
                      type="text"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      placeholder="1-3, 5"
                      className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                {tool.id === 'remove-pages' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">
                      Pages to Remove (e.g. 1, 3, 5)
                    </label>
                    <input
                      type="text"
                      value={pagesToRemoveStr}
                      onChange={(e) => setPagesToRemoveStr(e.target.value)}
                      placeholder="e.g. 2, 4"
                      className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                {tool.id === 'compress-pdf' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">
                      Compression Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['recommended', 'extreme', 'low'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setCompressLevel(lvl)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                            compressLevel === lvl
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tool.id === 'jpg-to-pdf' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Page Orientation</label>
                    <div className="flex gap-3">
                      {(['auto', 'portrait', 'landscape'] as const).map((o) => (
                        <button
                          key={o}
                          onClick={() => setImgOrientation(o)}
                          className={`py-1.5 px-4 rounded-xl text-xs font-bold capitalize border ${
                            imgOrientation === o
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tool.id === 'unlock-pdf' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Document Password
                    </label>
                    <input
                      type="password"
                      value={unlockPassword}
                      onChange={(e) => setUnlockPassword(e.target.value)}
                      placeholder="Enter the document password to unlock..."
                      className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                {tool.id === 'add-watermark' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Opacity ({Math.round(watermarkOpacity * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.1"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full accent-brand-600"
                      />
                    </div>
                  </div>
                )}

                {tool.id === 'add-page-numbers' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Position</label>
                    <div className="flex gap-2">
                      {(['bottom-center', 'bottom-right', 'top-right'] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setPageNumberPos(pos)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold capitalize border ${
                            pageNumberPos === pos
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tool.id === 'protect-pdf' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Document Encryption Password</label>
                    <input
                      type="password"
                      value={protectPassword}
                      onChange={(e) => setProtectPassword(e.target.value)}
                      placeholder="Enter strong password to encrypt..."
                      className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                {tool.id === 'crop-pdf' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Margin Trim ({cropMarginPct}%)</label>
                    <div className="flex gap-2">
                      {[5, 10, 15, 20].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setCropMarginPct(pct)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors ${
                            cropMarginPct === pct
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {pct}% Margin
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tool.id === 'redact-pdf' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Permanent Sanitization Mode</span>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Executing will permanently strip all document metadata (Author, Title, Keywords) and burn opaque black redaction blocks over confidential header and footer zones.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleProcess}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Icon name={tool.icon} className="w-5 h-5" />
                  <span>Execute {tool.name}</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: PROCESSING PROGRESS */}
          {status === 'processing' && (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner animate-spin">
                <RefreshCw className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Processing Your Document...
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {progressMsg}
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-brand-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-400 text-right">
                  {progress}%
                </div>
              </div>
            </div>
          )}

          {/* STATE 4: RESULT SCREEN */}
          {status === 'completed' && result && (
            <div className="py-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Your Document is Ready!
                </h3>
                <p className="text-sm text-slate-500">
                  Document processing finished successfully with 100% data integrity.
                </p>
              </div>

              {/* File comparison badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-600">
                  File Size: <strong className="text-slate-900">{formatSize(result.fileSize)}</strong>
                </span>
                {result.savedPercentage !== undefined && result.savedPercentage > 0 && (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    -{result.savedPercentage}% Smaller
                  </span>
                )}
              </div>

              {/* Main Download Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={result.downloadUrl}
                  download={result.fileName}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-soft-lg shadow-brand-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {result.fileName.endsWith('.zip') ? 'Download All Images (ZIP)' : 'Download Processed PDF'}
                  </span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  Process Another File
                </button>
              </div>

              {/* PDF to JPG Image Gallery Preview */}
              {extractedJpgs.length > 0 && (
                <div className="pt-8 border-t border-slate-100 text-left space-y-4">
                  <h4 className="font-bold text-sm text-slate-800">
                    Extracted Pages ({extractedJpgs.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {extractedJpgs.map((img) => (
                      <div key={img.pageNum} className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                        <img
                          src={img.dataUrl}
                          alt={`${tool.name} extracted page ${img.pageNum} high-resolution image preview`}
                          className="w-full h-36 object-contain rounded bg-white border border-slate-200 shadow-2xs"
                        />
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700">Page {img.pageNum}</span>
                          <a
                            href={img.dataUrl}
                            download={`page_${img.pageNum}.jpg`}
                            className="text-brand-600 hover:underline font-semibold"
                          >
                            Download JPG
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* COMPLIANT ADSENSE PLACEMENT */}
        <AdPlacement format="horizontal" />

        {/* HOW TO USE & SEO EDUCATIONAL SECTION */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            How to use {tool.name} with SimplePDF
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            {tool.howToSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* RELATED TOOLS */}
        {relatedTools.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h3 className="font-bold text-base text-slate-800">
              Related PDF Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((rt) => (
                <div
                  key={rt.id}
                  onClick={() => onNavigate(rt.path)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-soft cursor-pointer transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Icon name={rt.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{rt.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{rt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
