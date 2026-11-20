export interface GlobalFaqItem {
  q: string;
  a: string;
}

export const GLOBAL_FAQS: GlobalFaqItem[] = [
  {
    q: 'Is SimplePDF really 100% free?',
    a: 'Yes! All core tools (including Merge PDF, Split PDF, Rotate PDF, JPG to PDF, Add Watermark, and Page Numbers) are completely free with generous file allowances. You do not need to enter a credit card or create an account for essential tasks.',
  },
  {
    q: 'How does in-browser client-side processing protect my privacy?',
    a: 'We leverage WebAssembly and modern browser capabilities so that your documents never leave your computer or phone for essential tasks. The merging, splitting, and rotating happen directly in your device’s local memory.',
  },
  {
    q: 'How long are uploaded files retained on your servers?',
    a: 'For tasks that require cloud conversion (such as OCR or Microsoft Office formats), files are permanently destroyed within 60 minutes via an automated cryptographic zero-fill shredder daemon, or deleted immediately upon download.',
  },
  {
    q: 'Can I use SimplePDF on mobile devices (iPhone, iPad, Android)?',
    a: 'Yes, our platform is fully responsive and optimized for mobile touchscreens. You can merge, convert, and sign PDF documents directly from your smartphone browser.',
  },
  {
    q: 'What is included in the Premium Pro ($4.99/mo) plan?',
    a: 'Pro unlocks 200MB file allowances, unlimited simultaneous batch queues, high-speed priority servers, AI Document Intelligence credits, full OCR scanned-PDF text extraction, and an ad-free clean experience.',
  },
  {
    q: 'How do I cancel my Premium subscription?',
    a: 'You can cancel anytime directly from your User Dashboard with a single click. You will retain access until the end of your billing cycle with zero cancellation fees.',
  },
];
