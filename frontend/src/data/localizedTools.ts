import { ToolMeta, ToolCategory, ToolFaq } from '../types/index';
import { ALL_TOOLS, CATEGORIES_CONFIG } from './tools';
import { TOOL_SEO_DETAILS, ToolSeoDetail } from './toolSeoContent';

export interface LocalizedToolStrings {
  name: string;
  shortName?: string;
  description: string;
  longDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  howToSteps?: string[];
  features?: string[];
  limitations?: string[];
  useCases?: string[];
  faqs?: ToolFaq[];
  privacyNote?: string;
}

/**
 * Localized Category Translations
 */
export const LOCALIZED_CATEGORIES: Record<string, Record<ToolCategory, { name: string; description: string }>> = {
  ur: {
    organize: { name: 'PDF ترتیب دیں', description: 'صفحات کو باآسانی ضم کریں، تقسیم کریں، حذف کریں اور دوبارہ ترتیب دیں۔' },
    optimize: { name: 'PDF بہتر بنائیں', description: 'سائز کم کریں، خراب فائلیں درست کریں اور ٹیکسٹ اسکین OCR کریں۔' },
    'convert-to': { name: 'PDF میں تبدیل کریں', description: 'تصاویر، ورڈ، پاورپوائنٹ، ایکسل اور ویب صفحات کو PDF بنائیں۔' },
    'convert-from': { name: 'PDF سے تبدیل کریں', description: 'پی ڈی ایف کو ورڈ، ایکسل، پاورپوائنٹ، تصاویر اور مارک ڈاؤن میں بدلیں۔' },
    edit: { name: 'PDF ایڈٹ کریں', description: 'ٹیکسٹ، واٹر مارک، صفحہ نمبر شامل کریں، کراپ اور گھمائیں۔' },
    security: { name: 'PDF سیکیورٹی', description: 'پاس ورڈ لگائیں، ان لاک کریں، دستخط کریں اور حساس ڈیٹا چھپائیں۔' },
    intelligence: { name: 'AI انٹیلی جنس', description: 'خلاصہ حاصل کریں، زبانیں ترجمہ کریں اور دستاویزات کا موازنہ کریں۔' },
  },
  ar: {
    organize: { name: 'تنظيم PDF', description: 'دمج وتقسيم وحذف واستخراج وإعادة ترتيب صفحات PDF بكل سهولة.' },
    optimize: { name: 'تحسين PDF', description: 'ضغط وإصلاح والتعرف الضوئي على الحروف (OCR) لملفات PDF.' },
    'convert-to': { name: 'تحويل إلى PDF', description: 'تحويل الصور وWord وPowerPoint وExcel وصفحات الويب إلى PDF.' },
    'convert-from': { name: 'تحويل من PDF', description: 'استخراج محتوى PDF إلى Word وExcel وPowerPoint وJPG وMarkdown.' },
    edit: { name: 'تعديل PDF', description: 'إضافة نصوص وعلامات مائية وأرقام صفحات وقص وتدوير الصفحات.' },
    security: { name: 'أمان PDF', description: 'تشفير بكلمة مرور، فك القفل، التوقيع الإلكتروني، وطمس البيانات الحساسة.' },
    intelligence: { name: 'ذكاء PDF الاصطناعي', description: 'تلخيص المستندات وترجمة اللغات ومقارنة المراجعات باستخدام AI.' },
  },
  es: {
    organize: { name: 'Organizar PDF', description: 'Unir, dividir, eliminar, extraer y reordenar páginas de PDF con facilidad.' },
    optimize: { name: 'Optimizar PDF', description: 'Comprimir, reparar y aplicar OCR a PDFs escaneados para un almacenamiento óptimo.' },
    'convert-to': { name: 'Convertir a PDF', description: 'Convertir imágenes, Word, PowerPoint, Excel y páginas web en PDF.' },
    'convert-from': { name: 'Convertir desde PDF', description: 'Extraer contenido de PDF a Word, Excel, PowerPoint, JPG y Markdown editables.' },
    edit: { name: 'Editar PDF', description: 'Añadir texto, marcas de agua, numeración de páginas, recortar y rotar páginas.' },
    security: { name: 'Seguridad PDF', description: 'Proteger con contraseña, desbloquear, firmar digitalmente y redactar datos.' },
    intelligence: { name: 'Inteligencia PDF (IA)', description: 'Resumir documentos, traducir idiomas y comparar revisiones con IA.' },
  },
  de: {
    organize: { name: 'PDF organisieren', description: 'PDF-Seiten einfach zusammenfügen, teilen, entfernen, extrahieren und sortieren.' },
    optimize: { name: 'PDF optimieren', description: 'PDFs komprimieren, reparieren und per OCR scannen für optimale Lesbarkeit.' },
    'convert-to': { name: 'In PDF konvertieren', description: 'Bilder, Word, PowerPoint, Excel und Webseiten in PDF umwandeln.' },
    'convert-from': { name: 'Aus PDF konvertieren', description: 'PDF-Inhalte in bearbeitbare Word-, Excel-, PowerPoint-, JPG- und Markdown-Dateien extrahieren.' },
    edit: { name: 'PDF bearbeiten', description: 'Text, Wasserzeichen, Seitenzahlen hinzufügen, Seiten zuschneiden und drehen.' },
    security: { name: 'PDF-Sicherheit', description: 'Passwortschutz, Entsperren, elektronisch signieren und sensible Daten schwärzen.' },
    intelligence: { name: 'PDF-Intelligenz (KI)', description: 'Dokumente zusammenfassen, übersetzen und Versionen vergleichen mit KI.' },
  },
  fr: {
    organize: { name: 'Organiser PDF', description: 'Fusionnez, divisez, supprimez, extrayez et réorganisez les pages PDF facilement.' },
    optimize: { name: 'Optimiser PDF', description: 'Compressez, réparez et appliquez l\'OCR à vos documents scannés.' },
    'convert-to': { name: 'Convertir en PDF', description: 'Convertissez des images, Word, PowerPoint, Excel et pages web en PDF.' },
    'convert-from': { name: 'Convertir depuis PDF', description: 'Extrayez le contenu PDF vers Word, Excel, PowerPoint, JPG et Markdown.' },
    edit: { name: 'Modifier PDF', description: 'Ajoutez du texte, des filigranes, numérotez, recadrez et faites pivoter les pages.' },
    security: { name: 'Sécurité PDF', description: 'Protégez par mot de passe, déverrouillez, signez et masquez les données sensibles.' },
    intelligence: { name: 'Intelligence PDF (IA)', description: 'Résumez vos documents, traduisez et comparez des révisions avec l\'IA.' },
  },
  pt: {
    organize: { name: 'Organizar PDF', description: 'Juntar, dividir, remover, extrair e reordenar páginas de PDF com facilidade.' },
    optimize: { name: 'Otimizar PDF', description: 'Comprimir, reparar e aplicar OCR em PDFs escaneados para máxima eficiência.' },
    'convert-to': { name: 'Converter para PDF', description: 'Converter imagens, Word, PowerPoint, Excel e HTML em arquivos PDF.' },
    'convert-from': { name: 'Converter de PDF', description: 'Extrair conteúdo de PDF para Word, Excel, PowerPoint, JPG e Markdown.' },
    edit: { name: 'Editar PDF', description: 'Adicionar texto, marcas d\'água, numeração, cortar e girar páginas.' },
    security: { name: 'Segurança PDF', description: 'Proteger com senha, desbloquear, assinar digitalmente e ocultar dados sensíveis.' },
    intelligence: { name: 'Inteligência PDF (IA)', description: 'Resumir documentos, traduzir idiomas e comparar versões com IA.' },
  },
  hi: {
    organize: { name: 'PDF व्यवस्थित करें', description: 'PDF पेजों को आसानी से मर्ज, स्प्लिट, हटाएं, निकालें और पुनर्व्यवस्थित करें।' },
    optimize: { name: 'PDF ऑप्टिमाइज़ करें', description: 'स्कैन किए गए PDF को कंप्रेस, रिपेयर और OCR करें।' },
    'convert-to': { name: 'PDF में बदलें', description: 'चित्र, Word, PowerPoint, Excel और वेब पेजों को PDF में बदलें।' },
    'convert-from': { name: 'PDF से बदलें', description: 'PDF सामग्री को संपादन योग्य Word, Excel, PowerPoint, JPG और Markdown में निकालें।' },
    edit: { name: 'PDF संपादित करें', description: 'टेक्स्ट, वॉटरमार्क, पेज नंबर जोड़ें, क्रॉप करें और पेजों को घुमाएं।' },
    security: { name: 'PDF सुरक्षा', description: 'पासवर्ड सुरक्षा, अनलॉक, डिजिटल हस्ताक्षर और संवेदनशील डेटा छुपाएं।' },
    intelligence: { name: 'PDF इंटेलिजेंस (AI)', description: 'दस्तावेज़ों का सारांश, अनुवाद और संस्करणों की तुलना AI से करें।' },
  },
};

/**
 * Localized Tool Dictionary by language and toolId
 */
export const LOCALIZED_TOOLS: Record<string, Record<string, LocalizedToolStrings>> = {
  ur: {
    'merge-pdf': {
      name: 'PDF ضم کریں',
      shortName: 'ضم کریں',
      description: 'متعدد PDF فائلوں کو کسی بھی ترتیب میں ایک ہی مشترکہ دستاویز میں جوڑیں۔',
      longDescription: 'اپنی PDF فائلوں کو آن لائن باآسانی ضم کریں۔ صفحات کو مطلوبہ ترتیب میں رکھنے کے لیے ڈریگ اور ڈراپ کریں اور 100% براؤزر پرائیویسی کے ساتھ ایک مکمل فائل بنائیں۔',
      seoTitle: 'آن لائن PDF ضم کریں — متعدد PDF فائلیں مفت جوڑیں',
      seoDescription: 'متعدد PDF فائلوں کو مفت ایک ہی دستاویز میں ضم کریں۔ 100% محفوظ براؤزر پروسیسنگ کے ساتھ صفحات کو اپنی مرضی کی ترتیب میں جوڑیں۔',
      howToSteps: [
        'اپنی متعدد PDF فائلیں منتخب کریں یا ڈریگ اینڈ ڈراپ کریں۔',
        'پیش نظارہ کارڈز کو ڈریگ کر کے صفحات کو اپنی پسندیدہ ترتیب میں رکھیں۔',
        '"PDF ضم کریں" کے بٹن پر کلک کریں تاکہ فائلیں فوری طور پر یکجا ہو جائیں۔',
        'بغیر کسی سرور تاخیر کے اپنی مکمل PDF فائل فوراً ڈاؤنلوڈ کریں۔',
      ],
      features: [
        'لامحدود PDF فائلوں کو ایک منظم دستاویز میں باآسانی جوڑیں',
        'ضم کرنے سے پہلے بصری ڈریگ اینڈ ڈراپ کے ذریعے صفحات کی ترتیب تبدیل کریں',
        'ویب اسمبلی کے ذریعے فائلیں اپ لوڈ کیے بغیر 100% براؤزر پرائیویسی',
        'اصلی فونٹس، ویکٹر گرافکس اور بُک مارکس کو مکمل طور پر محفوظ رکھیں',
        'بغیر کوالٹی کم کیے بالکل صاف اور واضح رزلٹ',
      ],
      limitations: [
        'مفت ورژن میں فی فائل زیادہ سے زیادہ 50MB کی حد (پرو میں 200MB)',
        'پاس ورڈ لگی ہوئی فائلوں کو ضم کرنے سے پہلے ان لاک کرنا ضروری ہے',
        'جدید ویب براؤزر کا استعمال تجویز کیا جاتا ہے',
      ],
      useCases: [
        'متعدد رسیدوں یا انوائسز کو ایک ٹیکس فائل میں اکٹھا کرنا',
        'ماہانہ محکمانہ رپورٹوں کو سہ ماہی رپورٹ میں یکجا کرنا',
        'قانونی معاہدات، حلف ناموں اور ثبوتوں کو ایک ترتیب میں جوڑنا',
        'تعلیمی نوٹس، اسائنمنٹس اور ریسرچ پیپرز کو یکجا کرنا',
      ],
      faqs: [
        {
          question: 'کیا میری ضم شدہ فائلیں آپ کے سرور پر محفوظ ہوتی ہیں؟',
          answer: 'بالکل نہیں۔ PDF ضم کرنے کا عمل آپ کے براؤزر کے اندر ویب اسمبلی کے ذریعے مکمل ہوتا ہے۔ فائلیں کبھی بھی سرور پر اپ لوڈ نہیں ہوتیں۔',
        },
        {
          question: 'کیا میں فائلوں کو جوڑنے سے پہلے ان کی ترتیب بدل سکتا ہوں؟',
          answer: 'جی ہاں! آپ ورک اسپیس میں پیش نظارہ کارڈز کو بآسانی ڈریگ کر کے مطلوبہ ترتیب میں لگا سکتے ہیں۔',
        },
        {
          question: 'کیا فائلیں جوڑنے سے ٹیکسٹ یا تصاویر کا معیار کم ہو جاتا ہے؟',
          answer: 'نہیں، SimplePDF بغیر کسی نقصان کے تمام اصل کوالٹی، فونٹس اور ویکٹرز کو برقرار رکھتا ہے۔',
        },
      ],
      privacyNote: '100% براؤزر پرائیویسی: آپ کی دستاویزات صرف آپ کے کمپیوٹر کی میموری میں رہتی ہیں اور کبھی نیٹ ورک پر نہیں بھیجی جاتیں۔',
    },

    'split-pdf': {
      name: 'PDF تقسیم کریں',
      shortName: 'تقسیم کریں',
      description: 'ایک صفحہ یا صفحات کی حدود کو الگ کر کے آزاد PDF فائلیں بنائیں۔',
      longDescription: 'PDF کو انفرادی صفحات یا اپنی پسند کی صفحات کی حدود میں تقسیم کریں۔ تیز، مفت اور مکمل طور پر محفوظ۔',
      seoTitle: 'آن لائن PDF تقسیم کریں — مفت صفحات الگ کریں',
      seoDescription: 'PDF فائل سے مخصوص صفحات یا حدود الگ کریں۔ 100% مفت اور محفوظ براؤزر اسپلٹر۔',
      howToSteps: [
        'اپنی PDF فائل منتخب کریں یا ورک اسپیس میں اپ لوڈ کریں۔',
        'وہ صفحات منتخب کریں یا حدود درج کریں جنہیں آپ الگ کرنا چاہتے ہیں۔',
        '"PDF تقسیم کریں" کے بٹن پر کلک کریں۔',
        'اپنی نئی علیحدہ PDF فائلیں ڈاؤنلوڈ کریں۔',
      ],
      features: [
        'مخصوص صفحات یا کسٹم حدود کو الگ فائلوں میں تقسیم کریں',
        'درست انتخاب کے لیے تمام صفحات کے تھمب نیلز دیکھیں',
        'ہر صفحے کو الگ فائل بنانے کا خودکار آپشن',
        'مکمل رازداری کے ساتھ تیز رفتار براؤزر پروسیسنگ',
      ],
      limitations: [
        'پاس ورڈ سے محفوظ فائل کو تقسیم کرنے سے پہلے ان لاک کرنا ضروری ہے',
      ],
      useCases: [
        'بڑی کتاب یا رپورٹ سے صرف کام کا ایک باب الگ کرنا',
        'معاہدے سے مخصوص دستخط شدہ صفحہ الگ بھیجنا',
      ],
      faqs: [
        {
          question: 'کیا میں ایک ساتھ کئی صفحات الگ کر سکتا ہوں؟',
          answer: 'جی ہاں! آپ کاما لگا کر صفحات کی حدود لکھ سکتے ہیں جیسے کہ 1-3، 5، 8-10۔',
        },
      ],
    },

    'compress-pdf': {
      name: 'PDF کمپریس کریں',
      shortName: 'کمپریس کریں',
      description: 'معیار برقرار رکھتے ہوئے PDF فائل کا سائز کم کریں تاکہ ای میل میں آسانی ہو۔',
      longDescription: 'پی ڈی ایف کا فائل سائز 80% تک کم کریں۔ تصویر اور فونٹ آپٹمائزیشن کے ذریعے واضح ٹیکسٹ اور تصاویر محفوظ رہتی ہیں۔',
      seoTitle: 'PDF کمپریس کریں — سائز کم کریں مفت آن لائن',
      seoDescription: 'PDF فائل سائز باآسانی کم کریں۔ دستاویزات کے معیار کو متاثر کیے بغیر ای میل اور ویب کے لیے سائز چھوٹا کریں۔',
      howToSteps: [
        'اپنی بھاری PDF فائل منتخب کریں۔',
        'کمپریشن لیول (انتہائی، تجویز کردہ، یا ہلکا) منتخب کریں۔',
        '"PDF کمپریس کریں" پر کلک کریں۔',
        'کم سائز والی بہترین PDF فائل ڈاؤنلوڈ کریں۔',
      ],
      features: [
        'فائل سائز میں 80% تک شاندار کمی',
        'تین کمپریشن موڈز: انتہائی، تجویز کردہ، اور ہلکا',
        'ٹیکسٹ اور ویکٹرز کی وضاحت مکمل طور پر محفوظ',
      ],
      useCases: [
        'ملازمت یا ویزا درخواست کے لیے فائل سائز چھوٹا کرنا',
        'ای میل اٹیچمنٹ کی حد (جیسے 25MB) سے کم کرنا',
      ],
    },

    'sign-pdf': {
      name: 'PDF پر دستخط کریں',
      shortName: 'دستخط کریں',
      description: 'ماؤس، ٹچ اسکرین یا تصویر کے ذریعے اپنے قانونی ڈیجیٹل دستخط شامل کریں۔',
      longDescription: 'بغیر پرنٹ اور اسکین کیے اپنے معاہدات اور فارمز پر براہ راست دستخط کریں۔ محفوظ اور فوری قانونی دستاویزات۔',
      seoTitle: 'آن لائن PDF پر دستخط کریں — مفت ڈیجیٹل دستخط',
      seoDescription: 'PDF پر ماؤس، اسٹائلس یا تصویر کے ذریعے باآسانی دستخط کریں۔ 100% مفت اور محفوظ ای سائن۔',
      howToSteps: [
        'دستخط کے لیے اپنی PDF فائل اپ لوڈ کریں۔',
        'ماؤس یا انگلی سے دستخط کھینچیں یا تصویر اپ لوڈ کریں۔',
        'دستخط کو درست جگہ پر رکھیں اور سائز ایڈجسٹ کریں۔',
        'دستخط شدہ مکمل PDF ڈاؤنلوڈ کریں۔',
      ],
      features: [
        'ماؤس، ٹچ یا اسٹائلس سے قدرتی قلمی دستخط بنائیں',
        'تاریخ، نام اور چیک مارک بھی شامل کرنے کی سہولت',
        'پرنٹ اور اسکین کی جھنجھٹ سے مکمل نجات',
      ],
    },

    'pdf-to-word': {
      name: 'PDF سے Word بنائیں',
      shortName: 'PDF تا Word',
      description: 'PDF کو قابل تدوین Microsoft Word (DOCX) دستاویز میں تبدیل کریں۔',
      longDescription: 'پی ڈی ایف فائل کے لے آؤٹ، پیراگراف اور ٹیبلز کو برقرار رکھتے ہوئے فوری قابل ترمیم ورڈ فائل بنائیں۔',
      seoTitle: 'PDF سے Word کنورٹر — مفت DOCX آن لائن',
      seoDescription: 'PDF فائل کو قابل تدوین Word فارمیٹ میں تبدیل کریں۔ لے آؤٹ اور ٹیبلز کی درستگی کی مکمل ضمانت۔',
      howToSteps: [
        'اپنی PDF فائل ڈراپ زون میں منتخب کریں۔',
        '"Word میں تبدیل کریں" پر کلک کریں۔',
        'تیار شدہ DOCX دستاویز فوراً ڈاؤنلوڈ کریں۔',
      ],
    },

    'word-to-pdf': {
      name: 'Word سے PDF بنائیں',
      shortName: 'Word تا PDF',
      description: 'Microsoft Word (DOC, DOCX) دستاویزات کو محفوظ PDF میں تبدیل کریں۔',
      longDescription: 'ورڈ دستاویزات کے فونٹس، فارمیٹنگ اور تصاویر کو بغیر کسی تبدیلی کے معیاری PDF میں منتقل کریں۔',
      seoTitle: 'Word سے PDF کنورٹر — DOCX کو PDF بنائیں آن لائن',
      seoDescription: 'Word فائلوں کو چند سیکنڈ میں پروفیشنل PDF میں بدلیں۔ مفت اور محفوظ۔',
      howToSteps: [
        'اپنی Word (DOCX یا DOC) فائل منتخب کریں۔',
        '"PDF بنائیں" پر کلک کریں۔',
        'تیار شدہ پی ڈی ایف ڈاؤنلوڈ کریں۔',
      ],
    },

    'jpg-to-pdf': {
      name: 'تصاویر (JPG) سے PDF بنائیں',
      shortName: 'JPG تا PDF',
      description: 'تصاویر (JPG, PNG, WebP) کو یکجا کر کے ایک خوبصورت PDF البم بنائیں۔',
      longDescription: 'تصویروں کو گھمائیں، مارجن اور اورینٹیشن سیٹ کریں اور ایک کلک میں معیاری پی ڈی ایف فائل حاصل کریں۔',
      seoTitle: 'تصاویر سے PDF بنائیں — JPG تا PDF کنورٹر',
      seoDescription: 'JPG اور PNG تصاویر کو سیکنڈوں میں ایک ہی PDF دستاویز میں تبدیل کریں۔',
      howToSteps: [
        'اپنی تمام تصاویر منتخب کریں۔',
        'تصاویر کی ترتیب، سائز اور پیج اورینٹیشن ایڈجسٹ کریں۔',
        '"PDF بنائیں" پر کلک کریں اور ڈاؤنلوڈ کریں۔',
      ],
    },

    'pdf-to-jpg': {
      name: 'PDF سے تصاویر (JPG) بنائیں',
      shortName: 'PDF تا JPG',
      description: 'PDF کے تمام صفحات کو ہائی ریزولوشن تصاویر میں تبدیل کریں۔',
      longDescription: 'ہر صفحے کو اعلیٰ کوالٹی JPG تصویر میں بدلیں یا سنگل زپ فائل کے طور پر حاصل کریں۔',
      seoTitle: 'PDF سے JPG کنورٹر — پی ڈی ایف کو تصاویر میں بدلیں',
      seoDescription: 'PDF صفحات کو ہائی ڈیفینیشن تصاویر میں الگ الگ نکالیں یا ایک کلک میں زپ ڈاؤنلوڈ کریں۔',
      howToSteps: [
        'اپنی PDF فائل منتخب کریں۔',
        'تصویر کی مطلوبہ کوالٹی منتخب کریں۔',
        '"JPG میں تبدیل کریں" پر کلک کریں اور تصاویر حاصل کریں۔',
      ],
    },

    'rotate-pdf': {
      name: 'PDF گھمائیں',
      shortName: 'گھمائیں',
      description: 'الٹے یا ٹیڑھے صفحات کو 90، 180 یا 270 ڈگری پر سیدھا کریں۔',
      longDescription: 'پورے پی ڈی ایف یا صرف منتخب صفحات کی اورینٹیشن درست کریں۔ فوری اور براؤزر پر محفوظ۔',
      seoTitle: 'PDF گھمائیں — صفحات سیدھے کریں آن لائن',
      seoDescription: 'PDF کے صفحات کو مستقل طور پر 90 یا 180 ڈگری گھما کر درست سمت میں محفوظ کریں۔',
      howToSteps: [
        'اپنی PDF فائل لوڈ کریں۔',
        'مطلوبہ صفحات کو کلاک وائز یا اینٹی کلاک وائز گھمائیں۔',
        'نئی اورینٹیشن کے ساتھ محفوظ کریں اور ڈاؤنلوڈ کریں۔',
      ],
    },

    'protect-pdf': {
      name: 'PDF پر پاس ورڈ لگائیں',
      shortName: 'پاس ورڈ لگائیں',
      description: '256-bit AES انکرپشن کے ساتھ اپنی حساس فائلوں کو محفوظ بنائیں۔',
      longDescription: 'مضبوط پاس ورڈ لگا کر غیر مجاز رسائی کو روکیں۔ بینکنگ لیول کی حفاظت۔',
      seoTitle: 'PDF پر پاس ورڈ لگائیں — فائل محفوظ کریں',
      seoDescription: 'مضبوط انکرپشن کے ذریعے PDF کو پاس ورڈ پروٹیکٹ کریں۔ 100% پرائیویٹ اور محفوظ۔',
      howToSteps: [
        'اپنی فائل اپ لوڈ کریں۔',
        'مضبوط پاس ورڈ درج کریں اور تصدیق کریں۔',
        '"پاس ورڈ لگائیں" پر کلک کر کے محفوظ فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'unlock-pdf': {
      name: 'PDF ان لاک کریں',
      shortName: 'ان لاک کریں',
      description: 'پاس ورڈ ہٹا کر فائل کو آسانی سے پڑھنے اور شیئر کرنے کے قابل بنائیں۔',
      longDescription: 'اگر آپ کو پاس ورڈ معلوم ہے تو مستقل طور پر پروٹیکشن ہٹا کر عام PDF بنائیں۔',
      seoTitle: 'PDF ان لاک کریں — پاس ورڈ ہٹائیں آن لائن',
      seoDescription: 'محفوظ PDF سے پاس ورڈ اور پرنٹنگ کی پابندیاں باآسانی ختم کریں۔',
      howToSteps: [
        'پاس ورڈ لگی ہوئی PDF منتخب کریں۔',
        'صحیح پاس ورڈ درج کریں۔',
        'پابندیوں کے بغیر آزاد PDF فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'ocr-pdf': {
      name: 'PDF ٹیکسٹ OCR کریں',
      shortName: 'OCR ٹیکسٹ',
      description: 'اسکین شدہ پی ڈی ایف اور تصاویر سے سرچ کے قابل ٹیکسٹ نکالیں۔',
      longDescription: 'جدید مصنوعی ذہانت آپٹیکل کریکٹر ریکگنیشن کے ذریعے اسکین دستاویزات کو سرچ ایبل بنائیں۔',
      seoTitle: 'PDF OCR آن لائن — اسکین سے سرچ ایبل ٹیکسٹ بنائیں',
      seoDescription: 'اسکین شدہ کتابوں اور پیپرز کو قابل تلاش اور کاپی کرنے کے قابل PDF میں بدلیں۔',
      howToSteps: [
        'اسکین شدہ PDF اپ لوڈ کریں۔',
        'دستاویز کی زبان منتخب کریں۔',
        'OCR پروسیس شروع کریں اور ٹیکسٹ سرچ والی فائل حاصل کریں۔',
      ],
    },

    'ai-summarizer': {
      name: 'AI دستاویز کا خلاصہ',
      shortName: 'AI خلاصہ',
      description: 'مصنوعی ذہانت کے ذریعے طویل پی ڈی ایف کا فوری اور جامع خلاصہ حاصل کریں۔',
      longDescription: 'سینکڑوں صفحات پر مشتمل ریسرچ پیپرز، کتابوں اور رپورٹس کے اہم نکات سیکنڈز میں جانیں۔',
      seoTitle: 'AI PDF سمری — دستاویزات کا فوری خلاصہ بنائیں',
      seoDescription: 'بڑی رپورٹس اور نوٹس کا تیز رفتار AI خلاصہ حاصل کریں۔ طلباء اور پروفیشنلز کے لیے بہترین۔',
      howToSteps: [
        'اپنی طویل PDF فائل اپ لوڈ کریں۔',
        'AI خلاصہ کا بٹن دبائیں۔',
        'اہم نکات اور تفصیلی نتائج پڑھیں یا محفوظ کریں۔',
      ],
    },

    'edit-pdf': {
      name: 'PDF ایڈٹ کریں',
      shortName: 'ایڈٹ کریں',
      description: 'براہ راست پی ڈی ایف میں نیا ٹیکسٹ لکھیں، تصاویر جوڑیں اور نوٹ لکھیں۔',
      longDescription: 'طاقتور اور آسان ایڈیٹر کے ذریعے کسی بھی دستاویز پر نوٹس، تیر کے نشانات اور تصاویر شامل کریں۔',
      seoTitle: 'PDF ایڈٹ کریں آن لائن — مفت دستاویز ایڈیٹر',
      seoDescription: 'براؤزر میں براہ راست PDF دستاویزات ایڈٹ کریں، ہائی لائٹ کریں اور ٹیکسٹ لکھیں۔',
      howToSteps: [
        'پی ڈی ایف لوڈ کریں۔',
        'ٹول بار سے ٹیکسٹ، ہینڈ رائٹنگ یا اشکال کا انتخاب کریں۔',
        'تبدیلیاں محفوظ کریں اور فائنل فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'add-page-numbers': {
      name: 'صفحہ نمبر درج کریں',
      shortName: 'صفحہ نمبر',
      description: 'پی ڈی ایف کے تمام صفحات پر اپنی مرضی کے فونٹس اور اسٹائل میں نمبر لگائیں۔',
      longDescription: 'دستاویز کی تیاری کے لیے خودکار صفحہ نمبر (جیسے Page 1 of 10) باآسانی لگائیں۔',
      seoTitle: 'PDF میں صفحہ نمبر لگائیں — آن لائن پیج نمبرنگ',
      seoDescription: 'پی ڈی ایف میں کسٹم فارمیٹ اور لوکیشن کے ساتھ خوبصورت صفحہ نمبر شامل کریں۔',
      howToSteps: [
        'فائل اپ لوڈ کریں۔',
        'نمبر کی پوزیشن (اوپر، نیچے، دائیں، بائیں) اور فارمیٹ منتخب کریں۔',
        'نمبر لگا کر ڈاؤنلوڈ کریں۔',
      ],
    },

    'add-watermark': {
      name: 'واٹر مارک شامل کریں',
      shortName: 'واٹر مارک',
      description: 'کاپی رائٹ کی حفاظت کے لیے ٹیکسٹ یا لوگو واٹر مارک لگائیں۔',
      longDescription: 'کانفیڈنشل یا کمپنی لوگو کا واٹر مارک شفافیت اور زاویہ کنٹرول کے ساتھ شامل کریں۔',
      seoTitle: 'PDF میں واٹر مارک لگائیں — کاپی رائٹ پروٹیکشن',
      seoDescription: 'اپنی PDF میں شفاف ٹیکسٹ یا برانڈ لوگو کا واٹر مارک سیکنڈز میں شامل کریں۔',
      howToSteps: [
        'پی ڈی ایف منتخب کریں۔',
        'ٹیکسٹ لکھیں یا لوگو تصویر اپ لوڈ کریں۔',
        'شفافیت اور زاویہ ایڈجسٹ کر کے محفوظ کریں۔',
      ],
    },

    'remove-pages': {
      name: 'صفحات حذف کریں',
      shortName: 'حذف کریں',
      description: 'پی ڈی ایف سے غیر ضروری یا خالی صفحات مستقل طور پر ہٹائیں۔',
      longDescription: 'ایک یا زائد صفحات پر کلک کر کے انہیں فائل سے فوراً نکال باہر کریں۔',
      seoTitle: 'PDF سے صفحات حذف کریں — فالتو صفحات مٹائیں',
      seoDescription: 'پی ڈی ایف سے ناپسندیدہ صفحات سیکنڈز میں ڈیلیٹ کر کے فائل کلین کریں۔',
      howToSteps: [
        'فائل اپ لوڈ کریں۔',
        'جو صفحات نہیں چاہئیں ان پر کلک کر کے منتخب کریں۔',
        'ڈیلیٹ پر کلک کر کے صاف فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'extract-pages': {
      name: 'صفحات الگ کریں',
      shortName: 'صفحات نکالیں',
      description: 'اہم صفحات کو منتخب کر کے ایک علیحدہ نئی PDF فائل بنائیں۔',
      longDescription: 'بڑی فائل میں سے صرف کام کے چند صفحات چن کر الگ دستاویز بنائیں۔',
      seoTitle: 'PDF سے صفحات الگ کریں — کسٹم پیجز ایکسٹریکٹ کریں',
      seoDescription: 'پی ڈی ایف میں سے صرف کام کے مخصوص صفحات کو ایک نئی فائل میں محفوظ کریں۔',
      howToSteps: [
        'فائل لوڈ کریں۔',
        'مطلوبہ صفحات منتخب کریں۔',
        '"صفحات الگ کریں" پر کلک کر کے نئی فائل حاصل کریں۔',
      ],
    },

    'organize-pdf': {
      name: 'صفحات ترتیب دیں',
      shortName: 'ترتیب دیں',
      description: 'صفحات کو ڈریگ کر کے آگے پیچھے کریں، گھمائیں اور ترتیب درست کریں۔',
      longDescription: 'تمام صفحات کے تھمب نیلز دیکھ کر ان کی صحیح ترتیب مرتب کریں۔',
      seoTitle: 'PDF صفحات ترتیب دیں — ری آرڈر پیجز آن لائن',
      seoDescription: 'پی ڈی ایف کے صفحات کو باآسانی اپنی مرضی کے مطابق آگے پیچھے ترتیب دیں۔',
      howToSteps: [
        'دستاویز اپ لوڈ کریں۔',
        'تھمب نیلز کو ڈریگ کر کے صحیح ترتیب میں لگائیں۔',
        'نئی ترتیب کے ساتھ فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'repair-pdf': {
      name: 'خراب PDF درست کریں',
      shortName: 'خراب فائل درست کریں',
      description: 'ناقابل رسائی یا خراب ہو جانے والی PDF فائلوں کو خودکار طریقے سے ریکور کریں۔',
      longDescription: 'خراب ٹیبلز، غائب پوائنٹرز اور متاثرہ ڈیٹا کو بحال کر کے فائل پڑھنے کے قابل بنائیں۔',
      seoTitle: 'خراب PDF درست کریں — ریپیر پی ڈی ایف آن لائن',
      seoDescription: 'خراب اور کرپٹ پی ڈی ایف فائلوں کا ڈیٹا خودکار نظام سے بحال کریں۔',
      howToSteps: [
        'خراب فائل اپ لوڈ کریں۔',
        '"ریپیر کریں" کا بٹن دبائیں۔',
        'بحال شدہ فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'powerpoint-to-pdf': {
      name: 'PowerPoint سے PDF بنائیں',
      shortName: 'PPT تا PDF',
      description: 'پاورپوائنٹ پریزنٹیشنز (PPT, PPTX) کو اعلیٰ کوالٹی PDF میں بدلیں۔',
      longDescription: 'سلائیڈز کے فونٹ، ٹرانزیشن اسٹائل اور تصاویر کو ہو بہو پی ڈی ایف میں تبدیل کریں۔',
      seoTitle: 'PowerPoint سے PDF کنورٹر — PPT کو PDF بنائیں',
      seoDescription: 'PPT اور PPTX سلائیڈز کو خوبصورت اور شیئر کرنے کے قابل PDF میں بدلیں۔',
      howToSteps: [
        'پاورپوائنٹ فائل منتخب کریں۔',
        '"PDF بنائیں" پر کلک کریں۔',
        'پی ڈی ایف دستاویز حاصل کریں۔',
      ],
    },

    'excel-to-pdf': {
      name: 'Excel سے PDF بنائیں',
      shortName: 'Excel تا PDF',
      description: 'ایکسل شیٹس (XLS, XLSX) کو پرنٹ کے لیے تیار PDF میں بدلیں۔',
      longDescription: 'کالمز، ٹیبلز اور فارمولوں کے نتائج کو پرفیکٹ پرنٹ ایبل پی ڈی ایف میں منتقل کریں۔',
      seoTitle: 'Excel سے PDF کنورٹر — XLS کو PDF بنائیں',
      seoDescription: 'ایکسل ورک بکس اور اسسٹنٹس کو صاف ستھری پی ڈی ایف میں تبدیل کریں۔',
      howToSteps: [
        'ایکسل شیٹ منتخب کریں۔',
        '"تبدیل کریں" پر کلک کریں۔',
        'پی ڈی ایف ڈاؤنلوڈ کریں۔',
      ],
    },

    'html-to-pdf': {
      name: 'HTML سے PDF بنائیں',
      shortName: 'HTML تا PDF',
      description: 'ویب پیجز یا HTML کوڈ کو محفوظ اور دیدہ زیب PDF میں بدلیں۔',
      longDescription: 'ویب سائٹ کے یو آر ایل یا ایچ ٹی ایم ایل کوڈ سے براہ راست پی ڈی ایف ڈاکومنٹ تیار کریں۔',
      seoTitle: 'HTML سے PDF بنائیں — ویب پیج کو PDF بنائیں',
      seoDescription: 'ویب پیج یا ایچ ٹی ایم ایل فائلوں کو ایک کلک میں پی ڈی ایف میں کنورٹ کریں۔',
      howToSteps: [
        'HTML فائل اپ لوڈ کریں یا کوڈ پیسٹ کریں۔',
        '"PDF بنائیں" پر کلک کریں۔',
        'فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'pdf-to-powerpoint': {
      name: 'PDF سے PowerPoint بنائیں',
      shortName: 'PDF تا PPT',
      description: 'پی ڈی ایف کو دوبارہ پیش کرنے کے لیے قابل تدوین PPTX سلائیڈز میں بدلیں۔',
      longDescription: 'پی ڈی ایف کے صفحات کو الگ الگ پریزنٹیشن سلائیڈز میں تبدیل کر کے مکمل تدوین کی سہولت پائیں۔',
      seoTitle: 'PDF سے PowerPoint کنورٹر — PPTX سلائیڈز بنائیں',
      seoDescription: 'پی ڈی ایف فائلوں کو باآسانی پاورپوائنٹ پریزنٹیشن سلائیڈز میں تبدیل کریں۔',
      howToSteps: [
        'پی ڈی ایف فائل منتخب کریں۔',
        '"پاورپوائنٹ میں بدلیں" پر کلک کریں۔',
        'PPTX فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'pdf-to-excel': {
      name: 'PDF سے Excel بنائیں',
      shortName: 'PDF تا Excel',
      description: 'پی ڈی ایف کے ٹیبلز اور مالی ڈیٹا کو ایکسل شیٹس (XLSX) میں منتقل کریں۔',
      longDescription: 'انوائسز، اسٹیٹمنٹس اور کالمز کا ڈیٹا خودکار طور پر بغیر ٹائپنگ کے ایکسل میں نکالیں۔',
      seoTitle: 'PDF سے Excel کنورٹر — ڈیٹا کو XLSX میں نکالیں',
      seoDescription: 'پی ڈی ایف کے تمام ٹیبلز کو ایکسل میں سیکنڈز میں منتقل کریں۔',
      howToSteps: [
        'پی ڈی ایف اپ لوڈ کریں۔',
        '"Excel میں تبدیل کریں" پر کلک کریں۔',
        'XLSX شیٹ ڈاؤنلوڈ کریں۔',
      ],
    },

    'pdf-to-pdfa': {
      name: 'PDF کو PDF/A بنائیں',
      shortName: 'PDF/A فارمیٹ',
      description: 'طویل مدتی قانونی اور آرکائیو ریکارڈز کے لیے PDF/A-1b یا 2b میں کنورٹ کریں۔',
      longDescription: 'بین الاقوامی آئی ایس او معیار پر دستاویزات کو سال ہا سال تک محفوظ رکھنے کے لیے تبدیل کریں۔',
      seoTitle: 'PDF کو PDF/A بنائیں — آرکائیو کے لیے معیاری فارمیٹ',
      seoDescription: 'قانونی تقاضے پورے کرنے کے لیے پی ڈی ایف کو تصدیق شدہ PDF/A معیار میں ڈھالیں۔',
      howToSteps: [
        'فائل اپ لوڈ کریں۔',
        'PDF/A پروفائل منتخب کریں۔',
        'آرکائیو معیار والی فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'pdf-to-markdown': {
      name: 'PDF سے Markdown بنائیں',
      shortName: 'PDF تا Markdown',
      description: 'دستاویز کا متن، ہیڈنگز اور کوڈ نوٹس کے لیے کلین مارک ڈاؤن (.md) میں بدلیں۔',
      longDescription: 'ڈاکومنٹیشن، نوٹس اور بلاگز کے لیے صاف ستھرا مارک ڈاؤن فارمیٹ حاصل کریں۔',
      seoTitle: 'PDF سے Markdown کنورٹر — کلین MD فارمیٹ',
      seoDescription: 'پی ڈی ایف کے ٹیکسٹ اور اسٹرکچر کو ڈویلپرز اور مصنفین کے لیے مارک ڈاؤن میں بدلیں۔',
      howToSteps: [
        'فائل اپ لوڈ کریں۔',
        '"Markdown میں بدلیں" دبائیں۔',
        '.md فائل یا کاپی شدہ ٹیکسٹ حاصل کریں۔',
      ],
    },

    'crop-pdf': {
      name: 'PDF کراپ کریں',
      shortName: 'کراپ کریں',
      description: 'اضافی سفید حاشیے کاٹ کر صفحے کو موبائل اور پرنٹ کے لیے موزوں بنائیں۔',
      longDescription: 'بصری فریم کو ایڈجسٹ کر کے پی ڈی ایف کے کناروں کو کاٹیں۔',
      seoTitle: 'PDF کراپ کریں — غیر ضروری مارجن کاٹیں آن لائن',
      seoDescription: 'پی ڈی ایف کے تمام یا منتخب صفحات کے سفید حاشیے کاٹ کر پرفیکٹ بنائیں۔',
      howToSteps: [
        'فائل لوڈ کریں۔',
        'کراپنگ ایریا منتخب کریں۔',
        'کراپ کر کے ڈاؤنلوڈ کریں۔',
      ],
    },

    'redact-pdf': {
      name: 'حساس ڈیٹا چھپائیں',
      shortName: 'ڈیٹا چھپائیں',
      description: 'قومی شناختی نمبر، کریڈٹ کارڈ اور خفیہ معلومات کو مستقل طور پر بلیک آؤٹ کریں۔',
      longDescription: 'حساس ڈیٹا کو صرف چھپانے کے بجائے مستقل طور پر دستاویز کی تہہ سے ختم کریں۔',
      seoTitle: 'PDF میں حساس ڈیٹا چھپائیں — مستقل ریڈیکشن',
      seoDescription: 'پی ڈی ایف سے پرائیویٹ اور خفیہ معلومات کو مستقل طور پر بلیک آؤٹ کریں۔',
      howToSteps: [
        'فائل اپ لوڈ کریں۔',
        'حساس الفاظ یا ایریاز پر بلیک باکس لگائیں۔',
        '"ڈیٹا چھپائیں" دبا کر محفوظ فائل ڈاؤنلوڈ کریں۔',
      ],
    },

    'translate-pdf': {
      name: 'PDF کا ترجمہ کریں',
      shortName: 'ترجمہ کریں',
      description: 'فائل کے لے آؤٹ اور اسٹائل کو برقرار رکھتے ہوئے 100+ زبانوں میں ترجمہ کریں۔',
      longDescription: 'مصنوعی ذہانت کے ذریعے کتابوں اور مضامین کا دوسری زبانوں میں فوری ترجمہ حاصل کریں۔',
      seoTitle: 'PDF کا ترجمہ کریں آن لائن — کثیر لسانی دستاویز ترجمہ',
      seoDescription: 'پی ڈی ایف کے اصلی فارمیٹ کو متاثر کیے بغیر کسی بھی زبان میں ترجمہ کریں۔',
      howToSteps: [
        'دستاویز اپ لوڈ کریں۔',
        'اصل اور ہدف کی زبان منتخب کریں۔',
        'ترجمہ شدہ پی ڈی ایف حاصل کریں۔',
      ],
    },

    'compare-pdf': {
      name: 'دو PDF کا موازنہ کریں',
      shortName: 'موازنہ کریں',
      description: 'دو فائلوں کے درمیان فرق، ترامیم اور حذف شدہ ٹیکسٹ کی نشاندہی کریں۔',
      longDescription: 'قانونی معاہدوں اور مسودوں کے نئے اور پرانے ورژن میں تبدیلیوں کو ہائی لائٹ کریں۔',
      seoTitle: 'دو PDF کا موازنہ کریں — تبدیلیاں اور فرق تلاش کریں',
      seoDescription: 'دو پی ڈی ایف دستاویزات کا ساتھ ساتھ موازنہ کر کے ہر تبدیلی فوراً دیکھیں۔',
      howToSteps: [
        'دونوں فائلیں (اصل اور ترمیم شدہ) اپ لوڈ کریں۔',
        '"موازنہ شروع کریں" پر کلک کریں۔',
        'ہائی لائٹ شدہ فرق والی رپورٹ دیکھیں۔',
      ],
    },

    'pdf-forms': {
      name: 'PDF فارم پُر کریں',
      shortName: 'فارم پُر کریں',
      description: 'آن لائن پی ڈی ایف فارمز میں ٹیکسٹ لکھیں، چیک باکسز لگائیں اور دستخط کریں۔',
      longDescription: 'بغیر پرنٹ کیے کسی بھی سرکاری، ٹیکس یا بینک فارم کو کمپیوٹر یا موبائل سے پُر کریں۔',
      seoTitle: 'PDF فارم پُر کریں — آن لائن فارم فلر اور سائن',
      seoDescription: 'پی ڈی ایف فارمز کے خانے پُر کریں، چیک باکس لگائیں اور مکمل فارم ڈاؤنلوڈ کریں۔',
      howToSteps: [
        'فارم اپ لوڈ کریں۔',
        'خانوں پر کلک کر کے معلومات درج کریں۔',
        'فارم مکمل کر کے ڈاؤنلوڈ کریں۔',
      ],
    },
  },

  ar: {
    'merge-pdf': {
      name: 'دمج ملفات PDF',
      shortName: 'دمج',
      description: 'اجمع عدة ملفات PDF في مستند واحد بأي ترتيب تريده.',
      longDescription: 'ادمج ملفات PDF عبر الإنترنت بسهولة تامة وبخصوصية كاملة داخل متصفحك.',
      seoTitle: 'دمج PDF عبر الإنترنت — دمج ملفات PDF مجاناً',
      seoDescription: 'اجمع عدة ملفات PDF في مستند واحد مجاناً دون الحاجة لرفعها إلى خوادم خارجية.',
      howToSteps: [
        'اختر ملفات PDF متعددة أو اسحبها إلى مساحة العمل.',
        'أعد ترتيب الملفات بسحب بطاقات المعاينة للترتيب المطلوب.',
        'انقر فوق "دمج PDF" لجمع مستنداتك فوراً.',
        'قم بتحميل ملف PDF المدمج بدون أي تأخير.',
      ],
      features: [
        'دمج عدد غير محدود من ملفات PDF في مستند موحد',
        'معاينة بصرية وإعادة ترتيب الصفحات قبل الدمج',
        'تنفيذ كامل 100% داخل المتصفح بأمان وخصوصية مطلقة',
        'الحفاظ على الخطوط والرسومات وجودة المستند الأصلية',
      ],
    },
    'split-pdf': {
      name: 'تقسيم PDF',
      shortName: 'تقسيم',
      description: 'فصل صفحة أو نطاق صفحات لتحويلها إلى ملفات PDF مستقلة.',
      longDescription: 'قسم ملف PDF إلى صفحات منفصلة أو نطاقات مخصصة بسرعة وأمان.',
      seoTitle: 'تقسيم PDF أونلاين — فصل صفحات PDF مجاناً',
      seoDescription: 'استخرج صفحات معينة من ملف PDF بسهولة وبخصوصية كاملة.',
    },
    'compress-pdf': {
      name: 'ضغط PDF',
      shortName: 'ضغط',
      description: 'تقليل حجم ملف PDF مع الحفاظ على أفضل جودة ممكنة.',
      longDescription: 'قلل حجم المستندات بنسبة تصل إلى 80% لتسهيل إرسالها عبر البريد الإلكتروني.',
      seoTitle: 'ضغط ملفات PDF أونلاين — تقليل الحجم مجاناً',
      seoDescription: 'ضغط ملفات PDF وتقليل حجمها بسهولة دون التأثير على وضوح النصوص.',
    },
    'sign-pdf': {
      name: 'توقيع PDF',
      shortName: 'توقيع',
      description: 'إضافة توقيع إلكتروني آمن وقانوني إلى مستنداتك.',
      longDescription: 'وقع العقود والمستندات إلكترونياً بالماوس أو القلم أو برفع صورة توقيعك.',
      seoTitle: 'توقيع مستندات PDF أونلاين — توقيع إلكتروني مجاني',
      seoDescription: 'أضف توقيعك إلى ملفات PDF بدون الحاجة للطباعة والمسح الضوئي.',
    },
    'pdf-to-word': {
      name: 'تحويل PDF إلى Word',
      shortName: 'PDF إلى Word',
      description: 'تحويل ملفات PDF إلى مستندات Word قابلة للتعديل مع الحفاظ على التنسيق.',
      seoTitle: 'تحويل PDF إلى Word مجاناً — مستند DOCX قابل للتعديل',
      seoDescription: 'حول ملفات PDF إلى مستندات Microsoft Word بدقة عالية وبدون أي تكلفة.',
    },
    'word-to-pdf': {
      name: 'تحويل Word إلى PDF',
      shortName: 'Word إلى PDF',
      description: 'تحويل مستندات Word إلى ملفات PDF احترافية ومحمية.',
      seoTitle: 'تحويل Word إلى PDF أونلاين — تحويل DOCX إلى PDF مجاناً',
      seoDescription: 'حول مستندات Word إلى صيغة PDF بسهولة مع الحفاظ على الخطوط والصور.',
    },
    'jpg-to-pdf': {
      name: 'تحويل JPG إلى PDF',
      shortName: 'صور إلى PDF',
      description: 'تحويل صور JPG وPNG إلى مستند PDF واحد أنيق ومنظم.',
      seoTitle: 'تحويل الصور إلى PDF — JPG إلى PDF مجاناً',
      seoDescription: 'اجمع صورك في ملف PDF واحد عالي الدقة في ثوانٍ معدودة.',
    },
    'pdf-to-jpg': {
      name: 'تحويل PDF إلى JPG',
      shortName: 'PDF إلى صور',
      description: 'استخراج جميع صفحات PDF إلى صور JPG عالية الدقة.',
      seoTitle: 'تحويل PDF إلى JPG مجاناً — استخراج صور من PDF',
      seoDescription: 'حول كل صفحة من مستند PDF إلى صورة عالية الوضوح بنقرة واحدة.',
    },
    'rotate-pdf': {
      name: 'تدوير PDF',
      shortName: 'تدوير',
      description: 'تدوير صفحات PDF بزاوية 90 أو 180 درجة وتعديل الاتجاه.',
      seoTitle: 'تدوير صفحات PDF أونلاين — تعديل اتجاه PDF مجاناً',
      seoDescription: 'قم بتدوير صفحات PDF المقلوبة وحفظها بالشكل الصحيح دائماً.',
    },
    'protect-pdf': {
      name: 'حماية PDF بكلمة مرور',
      shortName: 'حماية',
      description: 'تشفير ملفاتك الحساسة بكلمة مرور قوية بتقنية 256-bit AES.',
      seoTitle: 'حماية PDF بكلمة مرور — تشفير ملفات PDF مجاناً',
      seoDescription: 'احمِ مستنداتك السرية بكلمة سر قوية وتشفير بنكي عالي المستوى.',
    },
    'unlock-pdf': {
      name: 'فك قفل PDF',
      shortName: 'فك القفل',
      description: 'إزالة كلمة المرور والقيود من ملفات PDF المصرح لك بها.',
      seoTitle: 'فك قفل PDF أونلاين — إزالة كلمة سر PDF بسهولة',
      seoDescription: 'تخلص من قيود الطباعة وكلمات المرور في ملفات PDF بسهولة.',
    },
    'ocr-pdf': {
      name: 'التعرف الضوئي على الحروف (OCR)',
      shortName: 'OCR',
      description: 'تحويل المستندات الممسوحة ضوئياً إلى نصوص قابلة للبحث والنسخ.',
      seoTitle: 'OCR PDF عبر الإنترنت — استخراج النص من PDF ممسوح',
      seoDescription: 'حول ملفات PDF والصور الممسوحة ضوئياً إلى نصوص قابلة للبحث بدقة.',
    },
  },

  es: {
    'merge-pdf': {
      name: 'Unir PDF',
      shortName: 'Unir',
      description: 'Combina múltiples archivos PDF en un solo documento unificado.',
      longDescription: 'Une archivos PDF online sin esfuerzo. Arrastra y suelta para reordenar páginas y combinar tus documentos con privacidad total en el navegador.',
      seoTitle: 'Unir PDF Online — Combinar archivos PDF gratis',
      seoDescription: 'Combina varios archivos PDF en un único documento de forma 100% gratuita y privada sin subir archivos a servidores.',
      howToSteps: [
        'Selecciona o arrastra varios archivos PDF al área de trabajo.',
        'Reordena los archivos arrastrando las miniaturas en el orden deseado.',
        'Haz clic en "Unir PDF" para combinar tus documentos al instante.',
        'Descarga tu nuevo archivo PDF unificado sin esperas.',
      ],
    },
    'split-pdf': {
      name: 'Dividir PDF',
      shortName: 'Dividir',
      description: 'Separa una página o un rango completo en archivos PDF independientes.',
      seoTitle: 'Dividir PDF Online — Separar páginas PDF gratis',
      seoDescription: 'Separa páginas o rangos de tu PDF en archivos independientes al instante con total privacidad.',
    },
    'compress-pdf': {
      name: 'Comprimir PDF',
      shortName: 'Comprimir',
      description: 'Reduce el tamaño de tu archivo PDF manteniendo la máxima calidad.',
      seoTitle: 'Comprimir PDF Online — Reducir tamaño de PDF gratis',
      seoDescription: 'Reduce el tamaño de tus archivos PDF manteniendo la máxima calidad visual y resolución.',
    },
    'sign-pdf': {
      name: 'Firmar PDF',
      shortName: 'Firmar',
      description: 'Firma digitalmente tus documentos con total validez legal y privacidad.',
      seoTitle: 'Firmar PDF Online — Firma digital para documentos gratis',
      seoDescription: 'Firma digitalmente contratos y acuerdos en PDF sin imprimir ni escanear.',
    },
    'pdf-to-word': {
      name: 'PDF a Word',
      shortName: 'PDF a Word',
      description: 'Convierte tus documentos PDF a Microsoft Word DOCX editable conservando el diseño.',
      seoTitle: 'Convertir PDF a Word Online — Gratis y editable',
      seoDescription: 'Convierte tus documentos PDF a Microsoft Word DOCX editable conservando el diseño original.',
    },
    'word-to-pdf': {
      name: 'Word a PDF',
      shortName: 'Word a PDF',
      description: 'Convierte archivos Word a PDF profesional con formato y fuentes intactas.',
      seoTitle: 'Convertir Word a PDF Online — DOCX a PDF gratis',
      seoDescription: 'Convierte archivos Word a PDF profesional con formato y fuentes intactas.',
    },
    'jpg-to-pdf': {
      name: 'JPG a PDF',
      shortName: 'JPG a PDF',
      description: 'Convierte fotos JPG y PNG en un documento PDF limpio y ordenado en segundos.',
      seoTitle: 'Convertir JPG a PDF Online — Imágenes a PDF gratis',
      seoDescription: 'Convierte fotos JPG y PNG en un documento PDF limpio y ordenado en segundos.',
    },
    'pdf-to-jpg': {
      name: 'PDF a JPG',
      shortName: 'PDF a JPG',
      description: 'Extrae páginas de PDF como imágenes JPG de alta resolución sin pérdida de calidad.',
      seoTitle: 'Convertir PDF a JPG Online — Extraer imágenes gratis',
      seoDescription: 'Extrae páginas de PDF como imágenes JPG de alta resolución sin pérdida de calidad.',
    },
    'rotate-pdf': {
      name: 'Rotar PDF',
      shortName: 'Rotar',
      description: 'Gira páginas de PDF en 90, 180 o 270 grados y guárdalas permanentemente.',
      seoTitle: 'Rotar PDF Online — Girar páginas de PDF gratis',
      seoDescription: 'Gira páginas de PDF en 90, 180 o 270 grados y guárdalas permanentemente.',
    },
    'protect-pdf': {
      name: 'Proteger PDF',
      shortName: 'Proteger',
      description: 'Protege tus documentos PDF con cifrado AES de 256 bits y contraseña segura.',
      seoTitle: 'Proteger PDF con contraseña — Encriptar PDF gratis',
      seoDescription: 'Protege tus documentos PDF con cifrado AES de 256 bits y contraseña segura.',
    },
    'unlock-pdf': {
      name: 'Desbloquear PDF',
      shortName: 'Desbloquear',
      description: 'Elimina contraseñas y restricciones de tus archivos PDF autorizados fácilmente.',
      seoTitle: 'Desbloquear PDF Online — Quitar contraseña de PDF',
      seoDescription: 'Elimina contraseñas y restricciones de tus archivos PDF autorizados fácilmente.',
    },
    'ocr-pdf': {
      name: 'OCR PDF',
      shortName: 'OCR',
      description: 'Reconoce texto en documentos escaneados y conviértelos en PDF con texto seleccionable.',
      seoTitle: 'OCR PDF Online — Convertir PDF escaneado a texto',
      seoDescription: 'Reconoce texto en documentos escaneados y conviértelos en PDF con texto seleccionable.',
    },
  },

  pt: {
    'merge-pdf': {
      name: 'Juntar PDF',
      shortName: 'Juntar',
      description: 'Junte múltiplos arquivos PDF em um único documento de forma 100% gratuita.',
      seoTitle: 'Juntar PDF Online — Combinar arquivos PDF grátis',
      seoDescription: 'Junte múltiplos arquivos PDF em um único documento de forma 100% gratuita e segura no navegador.',
    },
    'split-pdf': {
      name: 'Dividir PDF',
      shortName: 'Dividir',
      description: 'Separe páginas ou intervalos do seu PDF em arquivos independentes com total privacidade.',
      seoTitle: 'Dividir PDF Online — Separar páginas de PDF grátis',
      seoDescription: 'Separe páginas ou intervalos do seu PDF em arquivos independentes com total privacidade.',
    },
    'compress-pdf': {
      name: 'Comprimir PDF',
      shortName: 'Comprimir',
      description: 'Reduza o tamanho do seu arquivo PDF mantendo a máxima qualidade e nitidez.',
      seoTitle: 'Comprimir PDF Online — Reduzir tamanho de PDF grátis',
      seoDescription: 'Reduza o tamanho do seu arquivo PDF mantendo a máxima qualidade e nitidez.',
    },
    'pdf-to-word': {
      name: 'PDF para Word',
      shortName: 'PDF para Word',
      description: 'Converta arquivos PDF para Word DOCX editável preservando a formatação original.',
      seoTitle: 'Converter PDF para Word Online — Editável e grátis',
      seoDescription: 'Converta arquivos PDF para Word DOCX editável preservando a formatação original.',
    },
    'word-to-pdf': {
      name: 'Word para PDF',
      shortName: 'Word para PDF',
      description: 'Transforme documentos Word em PDF com alta fidelidade de formatação e fontes.',
      seoTitle: 'Converter Word para PDF Online — DOCX para PDF',
      seoDescription: 'Transforme documentos Word em PDF com alta fidelidade de formatação e fontes.',
    },
    'jpg-to-pdf': {
      name: 'JPG para PDF',
      shortName: 'JPG para PDF',
      description: 'Converta imagens JPG e PNG em um documento PDF perfeito em poucos segundos.',
      seoTitle: 'Converter JPG para PDF Online — Fotos em PDF grátis',
      seoDescription: 'Converta imagens JPG e PNG em um documento PDF perfeito em poucos segundos.',
    },
    'pdf-to-jpg': {
      name: 'PDF para JPG',
      shortName: 'PDF para JPG',
      description: 'Extraia páginas de PDF como imagens JPG de alta resolução sem perder qualidade.',
      seoTitle: 'Converter PDF para JPG Online — Extrair imagens grátis',
      seoDescription: 'Extraia páginas de PDF como imagens JPG de alta resolução sem perder qualidade.',
    },
    'rotate-pdf': {
      name: 'Girar PDF',
      shortName: 'Girar',
      description: 'Gire páginas de PDF em 90 ou 180 graus e salve permanentemente no navegador.',
      seoTitle: 'Girar PDF Online — Rotacionar páginas de PDF grátis',
      seoDescription: 'Gire páginas de PDF em 90 ou 180 graus e salve permanentemente no navegador.',
    },
    'protect-pdf': {
      name: 'Proteger PDF',
      shortName: 'Proteger',
      description: 'Proteja seus arquivos PDF confidenciais com senha forte e criptografia AES de 256 bits.',
      seoTitle: 'Proteger PDF com senha — Criptografar PDF grátis',
      seoDescription: 'Proteja seus arquivos PDF confidenciais com senha forte e criptografia AES de 256 bits.',
    },
    'unlock-pdf': {
      name: 'Desbloquear PDF',
      shortName: 'Desbloquear',
      description: 'Remova senhas e restrições de arquivos PDF autorizados com facilidade.',
      seoTitle: 'Desbloquear PDF Online — Remover senha de PDF grátis',
      seoDescription: 'Remova senhas e restrições de arquivos PDF autorizados com facilidade.',
    },
    'sign-pdf': {
      name: 'Assinar PDF',
      shortName: 'Assinar',
      description: 'Assine documentos e contratos em PDF eletronicamente com total validade.',
      seoTitle: 'Assinar PDF Online — Assinatura eletrônica grátis',
      seoDescription: 'Assine documentos e contratos em PDF eletronicamente com total validade.',
    },
    'ocr-pdf': {
      name: 'OCR PDF',
      shortName: 'OCR',
      description: 'Reconheça texto em documentos PDF escaneados e crie arquivos pesquisáveis.',
      seoTitle: 'OCR PDF Online — Converter PDF digitalizado em texto',
      seoDescription: 'Reconheça texto em documentos PDF escaneados e crie arquivos pesquisáveis.',
    },
  },

  de: {
    'merge-pdf': {
      name: 'PDF zusammenfügen',
      shortName: 'Zusammenfügen',
      description: 'Fügen Sie mehrere PDF-Dateien kostenlos und sicher im Browser zusammen.',
      seoTitle: 'PDF zusammenfügen Online — PDF Dateien verbinden',
      seoDescription: 'Fügen Sie mehrere PDF-Dateien kostenlos und sicher im Browser zu einem einzigen Dokument zusammen.',
    },
    'split-pdf': {
      name: 'PDF teilen',
      shortName: 'Teilen',
      description: 'Trennen Sie einzelne Seiten oder Bereiche aus Ihrem PDF kostenlos.',
      seoTitle: 'PDF teilen Online — PDF Seiten trennen kostenlos',
      seoDescription: 'Trennen Sie einzelne Seiten oder Bereiche aus Ihrem PDF kostenlos und sekundenschnell.',
    },
    'compress-pdf': {
      name: 'PDF komprimieren',
      shortName: 'Komprimieren',
      description: 'Reduzieren Sie die Dateigröße Ihrer PDFs bei maximaler Qualität.',
      seoTitle: 'PDF komprimieren Online — Dateigröße verkleinern',
      seoDescription: 'Reduzieren Sie die Dateigröße Ihrer PDFs bei maximaler Bild- und Textqualität.',
    },
    'pdf-to-word': {
      name: 'PDF in Word',
      shortName: 'PDF in Word',
      description: 'Wandeln Sie PDF-Dokumente in bearbeitbare Word DOCX-Dateien um.',
      seoTitle: 'PDF in Word umwandeln — Kostenlos & bearbeitbar',
      seoDescription: 'Wandeln Sie PDF-Dokumente in bearbeitbare Word DOCX-Dateien mit Originallayout um.',
    },
    'word-to-pdf': {
      name: 'Word in PDF',
      shortName: 'Word in PDF',
      description: 'Konvertieren Sie Microsoft Word-Dokumente sauber in hochwertige PDFs.',
      seoTitle: 'Word in PDF umwandeln — DOCX in PDF kostenlos',
      seoDescription: 'Konvertieren Sie Microsoft Word-Dokumente schnell und sauber in hochwertige PDF-Dateien.',
    },
    'jpg-to-pdf': {
      name: 'JPG in PDF',
      shortName: 'JPG in PDF',
      description: 'Konvertieren Sie JPG- und PNG-Bilder in Sekunden in ein sauberes PDF.',
      seoTitle: 'JPG in PDF umwandeln — Bilder in PDF kostenlos',
      seoDescription: 'Konvertieren Sie JPG- und PNG-Bilder in Sekunden in ein sauberes PDF-Dokument.',
    },
    'pdf-to-jpg': {
      name: 'PDF in JPG',
      shortName: 'PDF in JPG',
      description: 'Extrahieren Sie PDF-Seiten als hochauflösende JPG-Bilder.',
      seoTitle: 'PDF in JPG umwandeln — PDF Seiten als Bilder extrahieren',
      seoDescription: 'Extrahieren Sie PDF-Seiten als hochauflösende JPG-Bilder ohne Qualitätsverlust.',
    },
    'rotate-pdf': {
      name: 'PDF drehen',
      shortName: 'Drehen',
      description: 'Drehen Sie PDF-Seiten um 90, 180 oder 270 Grad dauerhaft.',
      seoTitle: 'PDF drehen Online — PDF Seiten dauerhaft ausrichten',
      seoDescription: 'Drehen Sie PDF-Seiten um 90, 180 oder 270 Grad und speichern Sie sie dauerhaft.',
    },
    'protect-pdf': {
      name: 'PDF schützen',
      shortName: 'Schützen',
      description: 'Verschlüsseln Sie PDF-Dateien mit 256-Bit AES-Passwortschutz.',
      seoTitle: 'PDF schützen mit Passwort — PDF verschlüsseln',
      seoDescription: 'Verschlüsseln Sie PDF-Dateien mit 256-Bit AES-Passwortschutz direkt im Browser.',
    },
    'unlock-pdf': {
      name: 'PDF entsperren',
      shortName: 'Entsperren',
      description: 'Entfernen Sie Passwörter und Einschränkungen von PDF-Dateien.',
      seoTitle: 'PDF entsperren Online — Passwortschutz entfernen',
      seoDescription: 'Entfernen Sie Passwörter und Einschränkungen von autorisierten PDF-Dokumenten.',
    },
    'sign-pdf': {
      name: 'PDF signieren',
      shortName: 'Signieren',
      description: 'Signieren Sie PDF-Dokumente digital ohne Ausdrucken.',
      seoTitle: 'PDF signieren Online — Elektronische Unterschrift',
      seoDescription: 'Signieren Sie PDF-Dokumente und Verträge digital ohne Ausdrucken oder Scannen.',
    },
    'ocr-pdf': {
      name: 'PDF OCR',
      shortName: 'OCR',
      description: 'Erkennen Sie Text in gescannten PDFs und machen Sie sie durchsuchbar.',
      seoTitle: 'PDF OCR Online — Gescannte PDFs durchsuchbar machen',
      seoDescription: 'Erkennen Sie Text in gescannten PDFs per OCR und machen Sie Dokumente durchsuchbar.',
    },
  },

  fr: {
    'merge-pdf': {
      name: 'Fusionner PDF',
      shortName: 'Fusionner',
      description: 'Assemblez plusieurs fichiers PDF en un seul document gratuitement.',
      seoTitle: 'Fusionner PDF en ligne — Combiner des PDF gratuitement',
      seoDescription: 'Assemblez plusieurs fichiers PDF en un seul document gratuitement et en toute sécurité dans votre navigateur.',
    },
    'split-pdf': {
      name: 'Diviser PDF',
      shortName: 'Diviser',
      description: 'Séparez des pages ou des intervalles de pages de vos documents PDF.',
      seoTitle: 'Diviser PDF en ligne — Extraire des pages PDF',
      seoDescription: 'Séparez des pages ou des intervalles de pages de vos documents PDF en quelques secondes.',
    },
    'compress-pdf': {
      name: 'Compresser PDF',
      shortName: 'Compresser',
      description: 'Réduisez la taille de vos fichiers PDF tout en conservant une netteté parfaite.',
      seoTitle: 'Compresser PDF en ligne — Réduire la taille de PDF',
      seoDescription: 'Réduisez la taille de vos fichiers PDF tout en conservant une netteté et une qualité parfaites.',
    },
    'pdf-to-word': {
      name: 'PDF en Word',
      shortName: 'PDF en Word',
      description: 'Convertissez vos fichiers PDF en documents Word éditables.',
      seoTitle: 'Convertir PDF en Word en ligne — DOCX modifiable',
      seoDescription: 'Convertissez vos fichiers PDF en documents Word éditables en préservant la mise en page.',
    },
    'word-to-pdf': {
      name: 'Word en PDF',
      shortName: 'Word en PDF',
      description: 'Transformez des documents Word en PDF professionnels avec polices intactes.',
      seoTitle: 'Convertir Word en PDF en ligne — DOCX en PDF gratuit',
      seoDescription: 'Transformez des documents Word en PDF professionnels avec polices et tableaux intacts.',
    },
    'jpg-to-pdf': {
      name: 'JPG en PDF',
      shortName: 'JPG en PDF',
      description: 'Convertissez vos photos JPG ou PNG en un document PDF impeccable.',
      seoTitle: 'Convertir JPG en PDF en ligne — Images en PDF gratuit',
      seoDescription: 'Convertissez vos photos et images JPG ou PNG en un document PDF impeccable en quelques clics.',
    },
    'pdf-to-jpg': {
      name: 'PDF en JPG',
      shortName: 'PDF en JPG',
      description: 'Extrayez chaque page de vos documents PDF en images JPG haute définition.',
      seoTitle: 'Convertir PDF en JPG en ligne — Extraire des images',
      seoDescription: 'Extrayez chaque page de vos documents PDF en images JPG haute définition.',
    },
    'rotate-pdf': {
      name: 'Faire pivoter PDF',
      shortName: 'Pivoter',
      description: 'Faites pivoter vos pages PDF de 90 ou 180 degrés définitivement.',
      seoTitle: 'Faire pivoter PDF en ligne — Tourner les pages PDF',
      seoDescription: 'Faites pivoter vos pages PDF de 90 ou 180 degrés et enregistrez-les définitivement.',
    },
    'protect-pdf': {
      name: 'Protéger PDF',
      shortName: 'Protéger',
      description: 'Sécurisez vos documents PDF confidentiels avec mot de passe et AES 256 bits.',
      seoTitle: 'Protéger PDF avec mot de passe — Chiffrer PDF gratuit',
      seoDescription: 'Sécurisez vos documents PDF confidentiels avec un chiffrement AES 256 bits et mot de passe.',
    },
    'unlock-pdf': {
      name: 'Déverrouiller PDF',
      shortName: 'Déverrouiller',
      description: 'Supprimez le mot de passe et les restrictions d\'impression de vos PDF.',
      seoTitle: 'Déverrouiller PDF en ligne — Supprimer mot de passe',
      seoDescription: 'Supprimez le mot de passe et les restrictions d\'impression de vos PDF autorisés.',
    },
    'sign-pdf': {
      name: 'Signer PDF',
      shortName: 'Signer',
      description: 'Signez vos contrats et formulaires PDF en ligne sans imprimer.',
      seoTitle: 'Signer PDF en ligne — Signature électronique gratuite',
      seoDescription: 'Signez vos contrats et formulaires PDF en ligne sans avoir à les imprimer ni les scanner.',
    },
    'ocr-pdf': {
      name: 'OCR PDF',
      shortName: 'OCR',
      description: 'Reconnaissez le texte des documents scannés et rendez-les modifiables.',
      seoTitle: 'OCR PDF en ligne — Rendre un PDF scanné modifiable',
      seoDescription: 'Reconnaissez le texte des documents scannés et transformez-les en PDF interrogeables.',
    },
  },

  hi: {
    'merge-pdf': {
      name: 'PDF मर्ज करें',
      shortName: 'मर्ज करें',
      description: 'बिना किसी सीमा के कई PDF फाइलों को एक दस्तावेज़ में मुफ्त में जोड़ें।',
      seoTitle: 'ऑनलाइन PDF मर्ज करें — कई PDF फाइलें मुफ्त में जोड़ें',
      seoDescription: 'बिना किसी सीमा के कई PDF फाइलों को एक दस्तावेज़ में मुफ्त और सुरक्षित तरीके से जोड़ें।',
    },
    'split-pdf': {
      name: 'PDF स्प्लिट करें',
      shortName: 'स्प्लिट करें',
      description: 'PDF दस्तावेज़ से अपनी पसंद के पेज या रेंज अलग करें।',
      seoTitle: 'ऑनलाइन PDF विभाजित करें — पेज अलग करें',
      seoDescription: 'PDF दस्तावेज़ से अपनी पसंद के पेज या रेंज अलग करें। 100% मुफ़्त और सुरक्षित ब्राउज़र स्प्लिटर।',
    },
    'compress-pdf': {
      name: 'PDF कंप्रेस करें',
      shortName: 'कंप्रेस करें',
      description: 'बिना क्वालिटी खोए अपनी PDF फाइल का साइज कम करें।',
      seoTitle: 'PDF साइज कम करें ऑनलाइन — मुफ्त PDF कंप्रेसर',
      seoDescription: 'बिना क्वालिटी खोए अपनी PDF फाइल का साइज कम करें। ईमेल और वेब के लिए उत्तम।',
    },
    'pdf-to-word': {
      name: 'PDF को Word में बदलें',
      shortName: 'PDF से Word',
      description: 'PDF फाइलों को संपादन योग्य Microsoft Word दस्तावेज़ में बदलें।',
      seoTitle: 'PDF से Word कनवर्टर ऑनलाइन — संपादन योग्य DOCX',
      seoDescription: 'PDF फाइलों को संपादन योग्य Microsoft Word दस्तावेज़ में बदलें, मूल फॉर्मेटिंग के साथ।',
    },
    'word-to-pdf': {
      name: 'Word को PDF में बदलें',
      shortName: 'Word से PDF',
      description: 'Word फाइलों को कुछ ही सेकंड में सुरक्षित और प्रोफेशनल PDF में बदलें।',
      seoTitle: 'Word से PDF कनवर्टर — DOCX को PDF में बदलें',
      seoDescription: 'Word फाइलों को कुछ ही सेकंड में सुरक्षित और प्रोफेशनल PDF में बदलें।',
    },
    'jpg-to-pdf': {
      name: 'JPG को PDF में बदलें',
      shortName: 'फोटो से PDF',
      description: 'JPG और PNG तस्वीरों को सेकंडों में एक साफ़ PDF दस्तावेज़ में कनवर्ट करें।',
      seoTitle: 'फोटो को PDF में बदलें — JPG से PDF ऑनलाइन',
      seoDescription: 'JPG और PNG तस्वीरों को सेकंडों में एक साफ़ PDF दस्तावेज़ में कनवर्ट करें।',
    },
    'pdf-to-jpg': {
      name: 'PDF को JPG में बदलें',
      shortName: 'PDF से फोटो',
      description: 'PDF के सभी पेजों को हाई रेजोल्यूशन JPG तस्वीरों में बदलें।',
      seoTitle: 'PDF से JPG कनवर्टर — पेज को फोटो बनाएं',
      seoDescription: 'PDF के सभी पेजों को हाई रेजोल्यूशन JPG तस्वीरों में निकालें और डाउनलोड करें।',
    },
    'rotate-pdf': {
      name: 'PDF घुमाएं',
      shortName: 'घुमाएं',
      description: 'उल्टे पेजों को घुमाकर सीधा करें और सही दिशा में सुरक्षित करें।',
      seoTitle: 'PDF पेजों को घुमाएं — 90 या 180 डिग्री रोटेट करें',
      seoDescription: 'उल्टे पेजों को घुमाकर सीधा करें और हमेशा के लिए सही दिशा में सुरक्षित करें।',
    },
    'protect-pdf': {
      name: 'PDF पासवर्ड लगाएं',
      shortName: 'पासवर्ड लगाएं',
      description: '256-बिट AES एन्क्रिप्शन के साथ अपनी महत्वपूर्ण PDF फाइलों को सुरक्षित बनाएं।',
      seoTitle: 'PDF में पासवर्ड लगाएं — PDF एन्क्रिप्ट करें',
      seoDescription: '256-बिट AES एन्क्रिप्शन के साथ अपनी महत्वपूर्ण PDF फाइलों को सुरक्षित बनाएं।',
    },
    'unlock-pdf': {
      name: 'PDF अनलॉक करें',
      shortName: 'अनलॉक करें',
      description: 'अधिकृत PDF फाइलों से पासवर्ड और प्रिंटिंग प्रतिबंध आसानी से हटाएं।',
      seoTitle: 'PDF पासवर्ड हटाएं — PDF अनलॉक करें ऑनलाइन',
      seoDescription: 'अधिकृत PDF फाइलों से पासवर्ड और प्रिंटिंग प्रतिबंध आसानी से हटाएं।',
    },
    'sign-pdf': {
      name: 'PDF पर हस्ताक्षर करें',
      shortName: 'हस्ताक्षर करें',
      description: 'बिना प्रिंट किए अपने कॉन्ट्रैक्ट्स और फॉर्म्स पर डिजिटल हस्ताक्षर जोड़ें।',
      seoTitle: 'ऑनलाइन PDF साइन करें — डिजिटल हस्ताक्षर मुफ्त',
      seoDescription: 'बिना प्रिंट किए अपने कॉन्ट्रैक्ट्स और फॉर्म्स पर डिजिटल हस्ताक्षर जोड़ें।',
    },
    'ocr-pdf': {
      name: 'PDF OCR करें',
      shortName: 'OCR',
      description: 'OCR तकनीक से स्कैन की गई किताबों को सर्च वाले PDF में बदलें।',
      seoTitle: 'स्कैन किए गए PDF को सर्च करने योग्य टेक्स्ट बनाएं',
      seoDescription: 'OCR तकनीक से स्कैन की गई किताबों और दस्तावेज़ों को टेक्स्ट सर्च वाले PDF में बदलें।',
    },
  },
};

/**
 * Returns a fully localized ToolMeta object for the requested language.
 * Falls back to English strings for any properties not defined in the localization dictionary.
 */
export function getLocalizedTool(tool: ToolMeta, lang?: string): ToolMeta {
  if (!lang || lang === 'en') {
    return tool;
  }

  const langDict = LOCALIZED_TOOLS[lang];
  const toolOverrides = langDict ? langDict[tool.id] : null;

  if (!toolOverrides) {
    return tool;
  }

  return {
    ...tool,
    name: toolOverrides.name || tool.name,
    shortName: toolOverrides.shortName || tool.shortName,
    description: toolOverrides.description || tool.description,
    longDescription: toolOverrides.longDescription || tool.longDescription,
    seoTitle: toolOverrides.seoTitle || tool.seoTitle,
    seoDescription: toolOverrides.seoDescription || tool.seoDescription,
    howToSteps: toolOverrides.howToSteps || tool.howToSteps,
  };
}

/**
 * Returns localized SEO details (features, useCases, faqs, limitations) for the given tool and language.
 */
export function getLocalizedToolSeo(toolId: string, lang?: string): ToolSeoDetail {
  const baseDetail = TOOL_SEO_DETAILS[toolId] || {
    features: [],
    limitations: [],
    useCases: [],
    faqs: [],
    privacyNote: '',
  };

  if (!lang || lang === 'en') {
    return baseDetail;
  }

  const langDict = LOCALIZED_TOOLS[lang];
  const toolOverrides = langDict ? langDict[toolId] : null;

  if (!toolOverrides) {
    return baseDetail;
  }

  return {
    features: toolOverrides.features || baseDetail.features,
    limitations: toolOverrides.limitations || baseDetail.limitations,
    useCases: toolOverrides.useCases || baseDetail.useCases,
    faqs: toolOverrides.faqs || baseDetail.faqs,
    privacyNote: toolOverrides.privacyNote || baseDetail.privacyNote,
  };
}

/**
 * Returns all tools translated for the requested language.
 */
export function getLocalizedAllTools(lang?: string): ToolMeta[] {
  if (!lang || lang === 'en') {
    return ALL_TOOLS;
  }
  return ALL_TOOLS.map((t) => getLocalizedTool(t, lang));
}

/**
 * Returns categories with localized names and descriptions.
 */
export function getLocalizedCategories(lang?: string) {
  if (!lang || lang === 'en') {
    return CATEGORIES_CONFIG;
  }

  const catDict = LOCALIZED_CATEGORIES[lang];
  if (!catDict) {
    return CATEGORIES_CONFIG;
  }

  return CATEGORIES_CONFIG.map((c) => {
    const loc = catDict[c.id];
    if (!loc) return c;
    return {
      ...c,
      name: loc.name,
      description: loc.description,
    };
  });
}
