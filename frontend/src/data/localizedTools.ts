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
    },
    'compress-pdf': {
      name: 'Comprimir PDF',
      shortName: 'Comprimir',
      description: 'Reduce el tamaño de tu archivo PDF manteniendo la máxima calidad.',
    },
    'sign-pdf': {
      name: 'Firmar PDF',
      shortName: 'Firmar',
      description: 'Firma digitalmente tus documentos con total validez legal y privacidad.',
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
