import path from 'path';
import { pathToFileURL } from 'url';

let cachedPdfLib: any = null;

// Native ESM dynamic import evaluator that bypasses CommonJS downleveling
const dynamicImport = new Function('specifier', 'return import(specifier)');

export async function getPdfLib(): Promise<any> {
  if (cachedPdfLib) return cachedPdfLib;

  // Resolve absolute path to the ESM bundle of pdf-lib
  const esmPath = path.resolve(__dirname, '../../../node_modules/pdf-lib/dist/pdf-lib.esm.js');
  try {
    const fileUrl = pathToFileURL(esmPath).href;
    const module = await dynamicImport(fileUrl);
    cachedPdfLib = module;
    return cachedPdfLib;
  } catch (err) {
    console.warn('[pdfLibLoader] Fallback to cwd node_modules path:', err);
    const fallbackPath = path.resolve(process.cwd(), 'node_modules/pdf-lib/dist/pdf-lib.esm.js');
    const fallbackUrl = pathToFileURL(fallbackPath).href;
    const module = await dynamicImport(fallbackUrl);
    cachedPdfLib = module;
    return cachedPdfLib;
  }
}
