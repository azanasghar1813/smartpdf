import { pdfWorker } from './pdf.worker';
import { cleanupWorker } from './cleanup.worker';

console.log('====================================================');
console.log('🚀 SimplePDF Background Distributed Worker Starting');
console.log('====================================================');

pdfWorker.start();
cleanupWorker.start();

const shutdown = async (signal: string) => {
  console.log(`\n[Worker Process] Received ${signal}. Initiating graceful worker drain...`);
  cleanupWorker.stop();
  await pdfWorker.stop();
  console.log('[Worker Process] All workers drained cleanly. Exiting.');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
