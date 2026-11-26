let cachedPdfLib: any = null;

/**
 * Loads pdf-lib reliably in CommonJS/Node runtime without fragile eval/new Function.
 */
export async function getPdfLib(): Promise<any> {
  if (cachedPdfLib) return cachedPdfLib;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  cachedPdfLib = require('pdf-lib');
  return cachedPdfLib;
}
