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

export const LOCALIZED_GLOBAL_FAQS: Record<string, GlobalFaqItem[]> = {
  ur: [
    {
      q: 'کیا SimplePDF واقعی 100% مفت ہے؟',
      a: 'جی ہاں! تمام بنیادی ٹولز (بشمول PDF ضم کرنا، تقسیم کرنا، گھمانا، تصاویر سے PDF بنانا، واٹر مارک اور صفحہ نمبر لگانا) بالکل مفت ہیں۔ عام کاموں کے لیے کریڈٹ کارڈ یا اکاؤنٹ بنانے کی قطعی ضرورت نہیں ہے۔',
    },
    {
      q: 'براؤزر میں پروسیسنگ میری پرائیویسی کی حفاظت کیسے کرتی ہے؟',
      a: 'ہم جدید ویب اسمبلی ٹیکنالوجی استعمال کرتے ہیں جس سے آپ کی دستاویزات آپ کے کمپیوٹر یا فون سے باہر نہیں جاتیں اور تمام کام آپ کے آلے کی میموری میں ہی مکمل ہو جاتا ہے۔',
    },
    {
      q: 'سرور پر اپ لوڈ کی گئی فائلیں کتنی دیر تک محفوظ رہتی ہیں؟',
      a: 'کلاؤڈ کنورژن والے کاموں کے لیے تمام فائلیں 60 منٹ کے اندر خودکار طریقے سے مستقل ڈیلیٹ کر دی جاتی ہیں یا ڈاؤنلوڈ کرتے ہی ختم ہو جاتی ہیں۔',
    },
    {
      q: 'کیا میں موبائل فون پر SimplePDF استعمال کر سکتا ہوں؟',
      a: 'جی ہاں! SimplePDF ہر قسم کے آئی فون، آئی پیڈ اور اینڈرائیڈ موبائل براؤزرز پر بہترین اور روانی سے کام کرتا ہے۔',
    },
    {
      q: 'پریمیم پرو پلان میں کیا سہولیات شامل ہیں؟',
      a: 'پرو میں 200MB فی فائل کی حد، لامحدود بیچ پروسیسنگ، تیز ترین کلاؤڈ سرورز، AI فیچرز، او سی آر اسکیننگ اور اشتہارات سے پاک انٹرفیس ملتا ہے۔',
    },
    {
      q: 'میں اپنی سبسکرپشن کیسے منسوخ کر سکتا ہوں؟',
      a: 'آپ کسی بھی وقت اپنے یوزر ڈیش بورڈ سے صرف ایک کلک میں سبسکرپشن منسوخ کر سکتے ہیں۔ کوئی اضافی فیس نہیں ہے۔',
    },
  ],
  ar: [
    {
      q: 'هل SimplePDF مجاني بالفعل بنسبة 100%؟',
      a: 'نعم! جميع الأدوات الأساسية (بما فيها دمج وتقسيم وتدوير وضغط ملفات PDF) مجانية بالكامل دون الحاجة لبطاقة ائتمان أو إنشاء حساب.',
    },
    {
      q: 'كيف تحمي المعالجة داخل المتصفح خصوصيتي؟',
      a: 'نعتمد على تقنية WebAssembly المتقدمة لمعالجة ملفاتك محلياً داخل جهازك دون رفعها إلى أي خوادم خارجية.',
    },
    {
      q: 'كم مدة الاحتفاظ بالملفات على الخوادم؟',
      a: 'بالنسبة للمهام السحابية كتحويل Office وOCR، يتم حذف الملفات نهائياً وتلقائياً خلال 60 دقيقة أو فور تحميلها.',
    },
    {
      q: 'هل يمكنني استخدام SimplePDF على الهواتف الذكية؟',
      a: 'بالتأكيد، الموقع متوافق بالكامل مع جميع هواتف iPhone وAndroid بدون الحاجة لتثبيت أي تطبيقات.',
    },
  ],
  es: [
    {
      q: '¿Es SimplePDF realmente 100% gratuito?',
      a: '¡Sí! Todas las herramientas esenciales son completamente gratuitas sin necesidad de tarjeta de crédito ni registro obligatorio.',
    },
    {
      q: '¿Cómo protege mi privacidad el procesamiento en el navegador?',
      a: 'Utilizamos WebAssembly para que tus documentos nunca salgan de tu dispositivo para las tareas principales.',
    },
    {
      q: '¿Cuánto tiempo permanecen los archivos en los servidores?',
      a: 'Para conversiones en la nube, los archivos se eliminan de forma segura y automática en un máximo de 60 minutos.',
    },
  ],
};

export function getLocalizedGlobalFaqs(lang?: string): GlobalFaqItem[] {
  if (!lang || lang === 'en') return GLOBAL_FAQS;
  return LOCALIZED_GLOBAL_FAQS[lang] || GLOBAL_FAQS;
}
