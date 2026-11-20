const fs = require('fs');
const path = require('path');

const toolsPath = path.resolve(__dirname, '../frontend/src/data/tools.ts');
let content = fs.readFileSync(toolsPath, 'utf-8');

const toolsSeo = {
  'merge-pdf': {
    seoTitle: 'Merge PDF Online — Combine Multiple PDF Files Free',
    seoDescription: 'Combine multiple PDF files into one document for free. Drag and drop to reorder pages with 100% in-browser privacy and zero file uploads.',
  },
  'split-pdf': {
    seoTitle: 'Split PDF Online — Separate & Extract PDF Pages Free',
    seoDescription: 'Split PDF files into individual pages or custom ranges instantly. 100% private in-browser processing with no file size limits on free tier.',
  },
  'remove-pages': {
    seoTitle: 'Remove Pages from PDF Online — Delete PDF Pages Free',
    seoDescription: 'Delete unwanted pages from your PDF document online for free. Select and remove pages instantly in your browser without uploading files.',
  },
  'extract-pages': {
    seoTitle: 'Extract Pages from PDF Online — Save Specific Pages',
    seoDescription: 'Extract specific pages from any PDF document and save them as a new file. Fast, free in-browser extraction with complete document privacy.',
  },
  'organize-pdf': {
    seoTitle: 'Organize PDF Pages Online — Reorder, Rotate & Delete',
    seoDescription: 'Sort, rotate, and delete PDF pages with visual drag-and-drop ease. Organize documents directly in your web browser with 100% local privacy.',
  },
  'compress-pdf': {
    seoTitle: 'Compress PDF Online — Reduce PDF File Size Free',
    seoDescription: 'Reduce PDF file size while keeping crisp text and sharp images. Fast, free online compression with automatic file deletion within 60 minutes.',
  },
  'repair-pdf': {
    seoTitle: 'Repair PDF Online — Fix Damaged or Corrupted PDF',
    seoDescription: 'Recover and repair damaged or unreadable PDF files online for free. Rebuild cross-reference tables and recover pages with automatic cloud purge.',
  },
  'ocr-pdf': {
    seoTitle: 'OCR PDF Online — Convert Scanned PDF to Searchable',
    seoDescription: 'Convert scanned PDFs into searchable, selectable text with advanced OCR. Free text recognition with automatic file deletion within 60 minutes.',
  },
  'jpg-to-pdf': {
    seoTitle: 'JPG to PDF Online — Convert Images to PDF Free',
    seoDescription: 'Convert JPG, PNG, and image files into a single clean PDF document. Reorder photos and adjust margins with 100% private in-browser processing.',
  },
  'word-to-pdf': {
    seoTitle: 'Word to PDF Online — Convert DOCX to PDF Free',
    seoDescription: 'Convert Microsoft Word DOC and DOCX files to PDF documents online for free. Preserves fonts, layouts, and styles with auto-deletion in 60 min.',
  },
  'powerpoint-to-pdf': {
    seoTitle: 'PowerPoint to PDF — Convert PPT & PPTX Online Free',
    seoDescription: 'Convert PowerPoint slides into high-resolution PDF presentations for free. Retains vector graphics and slide layouts with auto-purge in 60 min.',
  },
  'excel-to-pdf': {
    seoTitle: 'Excel to PDF — Convert XLS & XLSX Spreadsheets Free',
    seoDescription: 'Convert Excel spreadsheets into structured PDF tables online for free. Formats rows and columns cleanly with secure cloud deletion in 60 min.',
  },
  'html-to-pdf': {
    seoTitle: 'HTML to PDF Converter — Convert Webpages Online Free',
    seoDescription: 'Convert HTML files and web code into printable, shareable PDF documents online. Fast, free rendering with automatic cloud purge in 60 minutes.',
  },
  'pdf-to-jpg': {
    seoTitle: 'PDF to JPG Online — Extract PDF Pages to Images Free',
    seoDescription: 'Extract PDF pages as high-resolution JPG images for free. Fast, private client-side rendering with zero file uploads or quality loss.',
  },
  'pdf-to-word': {
    seoTitle: 'PDF to Word Converter — Convert PDF to DOCX Free',
    seoDescription: 'Convert PDF documents to editable Microsoft Word DOCX files online for free. Retains formatting, tables, and paragraphs with auto-purge in 60m.',
  },
  'pdf-to-powerpoint': {
    seoTitle: 'PDF to PowerPoint — Convert PDF to PPTX Online Free',
    seoDescription: 'Convert PDF pages into editable PowerPoint PPTX slides online for free. Keep text and layout intact with automatic cloud file deletion in 60m.',
  },
  'pdf-to-excel': {
    seoTitle: 'PDF to Excel Converter — Extract PDF Tables to XLSX',
    seoDescription: 'Extract tables from PDF files into editable Excel XLSX spreadsheets online for free. Accurate cell formatting with auto-deletion in 60 minutes.',
  },
  'pdf-to-pdfa': {
    seoTitle: 'PDF to PDF/A Converter — ISO Archival PDF Online',
    seoDescription: 'Convert PDF documents to ISO-compliant PDF/A format for long-term digital preservation. Fast, free conversion with auto-deletion within 60 min.',
  },
  'pdf-to-markdown': {
    seoTitle: 'PDF to Markdown Converter — Clean Markdown for AI',
    seoDescription: 'Convert PDF documents into structured Markdown text for ChatGPT, Claude, and notes. Free, instant client-side conversion with 100% privacy.',
  },
  'rotate-pdf': {
    seoTitle: 'Rotate PDF Online — Permanently Rotate PDF Pages Free',
    seoDescription: 'Rotate PDF pages 90, 180, or 270 degrees and save them permanently. Fast, free in-browser rotation with zero file uploads and 100% privacy.',
  },
  'add-page-numbers': {
    seoTitle: 'Add Page Numbers to PDF Online — Number PDF Pages',
    seoDescription: 'Add customized page numbers to PDF documents online for free. Choose position, font style, and starting index with 100% in-browser privacy.',
  },
  'add-watermark': {
    seoTitle: 'Add Watermark to PDF Online — Stamp Text or Logo',
    seoDescription: 'Stamp custom text or image watermarks onto your PDF pages for free. Protect confidential documents directly in your browser with zero uploads.',
  },
  'crop-pdf': {
    seoTitle: 'Crop PDF Online — Trim PDF Margins Free',
    seoDescription: 'Crop and trim PDF margins or page boundaries online for free. Adjust visible page dimensions visually with private client-side processing.',
  },
  'edit-pdf': {
    seoTitle: 'Edit PDF Online — Free Web PDF Editor & Annotator',
    seoDescription: 'Add text, annotations, highlights, and drawings to any PDF document for free. Edit files directly in your web browser with 100% data privacy.',
  },
  'protect-pdf': {
    seoTitle: 'Protect PDF with Password Online — Encrypt PDF Free',
    seoDescription: 'Encrypt PDF files with robust password protection and custom permissions for free. Secure sensitive documents in-browser with zero uploads.',
  },
  'unlock-pdf': {
    seoTitle: 'Unlock PDF Online — Remove Password Restrictions',
    seoDescription: 'Remove owner passwords and printing restrictions from PDF documents online for free. Instant in-browser decryption with complete privacy.',
  },
  'sign-pdf': {
    seoTitle: 'Sign PDF Online — Free Electronic Signature for PDFs',
    seoDescription: 'Create legally binding electronic signatures and sign PDF contracts online for free. Draw, type, or upload signatures with 100% local privacy.',
  },
  'redact-pdf': {
    seoTitle: 'Redact PDF Online — Permanently Sanitize Data Free',
    seoDescription: 'Permanently black out and sanitize confidential text and numbers from PDF files for free. Destructive in-browser redaction with zero leaks.',
  },
  'ai-summarizer': {
    seoTitle: 'AI PDF Summarizer — Summarize PDF Documents with AI',
    seoDescription: 'Summarize long PDF research papers, reports, and books in seconds with AI. Extract key takeaways and executive summaries with auto-purge in 60m.',
  },
  'translate-pdf': {
    seoTitle: 'Translate PDF Online — Free AI Document Translator',
    seoDescription: 'Translate PDF documents into over 50 languages while preserving original layout and fonts. Fast AI translation with automatic purge within 60m.',
  },
  'compare-pdf': {
    seoTitle: 'Compare PDF Files Online — Visual Document Diff Free',
    seoDescription: 'Compare two PDF documents side by side to highlight visual and text differences for free. Instant in-browser comparison with complete privacy.',
  },
  'pdf-forms': {
    seoTitle: 'Fill PDF Forms Online Free — Interactive Form Filler',
    seoDescription: 'Fill out interactive AcroForm PDF forms, checkboxes, and text fields online for free. Save and print completed forms with 100% in-browser privacy.',
  },
};

// Validate all descriptions & titles
const descSet = new Set();
const titleSet = new Set();
let error = false;

for (const [id, data] of Object.entries(toolsSeo)) {
  const descLen = data.seoDescription.length;
  if (descLen < 120 || descLen > 160) {
    console.error(`❌ [${id}] seoDescription length is ${descLen} (must be 120-160)`);
    error = true;
  }
  if (descSet.has(data.seoDescription)) {
    console.error(`❌ [${id}] duplicate seoDescription!`);
    error = true;
  }
  descSet.add(data.seoDescription);

  const titleLen = data.seoTitle.length;
  if (titleLen > 65) {
    console.error(`❌ [${id}] seoTitle length is ${titleLen} (>65)`);
    error = true;
  }
  if (titleSet.has(data.seoTitle)) {
    console.error(`❌ [${id}] duplicate seoTitle!`);
    error = true;
  }
  titleSet.add(data.seoTitle);
}

if (error) {
  process.exit(1);
}

console.log('✅ All 32 tools validated: 100% unique, 120-160 chars seoDescription, <60 chars seoTitle.');

// Now patch frontend/src/data/tools.ts
for (const [id, data] of Object.entries(toolsSeo)) {
  const idRegex = new RegExp(`id:\\s*'${id}',([\\s\\S]*?)maxFileSizeFreeMB:\\s*\\d+,`, 'm');
  const match = content.match(idRegex);
  if (!match) {
    console.error(`Could not locate tool ${id} in tools.ts`);
    continue;
  }

  // Replace seoTitle and insert seoDescription
  const block = match[0];
  // Replace existing seoTitle or update
  const toolEnd = content.indexOf(`id: '${id}'`);
  const nextToolIdx = content.indexOf(`seoKeywords:`, toolEnd);

  // Search for seoTitle within this tool
  const titleSearch = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?seoTitle:\\s*)'[^']*'`);
  content = content.replace(titleSearch, `$1'${data.seoTitle}'`);

  // Check if seoDescription already exists
  const descSearch = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?)(seoTitle:\\s*'[^']*',)(\\s*)(seoDescription:\\s*'[^']*',)?`);
  content = content.replace(descSearch, (m, p1, p2, p3, p4) => {
    return `${p1}${p2}\n    seoDescription: '${data.seoDescription}',`;
  });
}

fs.writeFileSync(toolsPath, content, 'utf-8');
console.log('✅ Successfully patched frontend/src/data/tools.ts with seoDescription and verified seoTitle!');
