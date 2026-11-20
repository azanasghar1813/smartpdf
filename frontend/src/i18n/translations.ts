/**
 * SimplePDF Core Translation Dictionary
 * Human-curated translations for active languages (en, es, pt, de, fr, ar, hi, ur).
 * Never translates technical file extensions (.pdf, .docx), brand names, or URLs.
 */

export interface UiTranslation {
  // Navigation & General
  allTools: string;
  popularTools: string;
  howItWorks: string;
  pricing: string;
  about: string;
  contact: string;
  privacy: string;
  terms: string;
  security: string;
  cookies: string;
  faq: string;
  blog: string;
  dashboard: string;
  admin: string;
  login: string;
  register: string;
  logout: string;
  home: string;
  tools: string;

  // Tool Workspace UI
  dropFilesHere: string;
  chooseFiles: string;
  processDocument: string;
  processingDocument: string;
  documentReady: string;
  downloadResult: string;
  processAnother: string;
  fileSize: string;
  freeLimitNotice: string;
  howToUseTitle: string;
  featuresTitle: string;
  limitationsTitle: string;
  useCasesTitle: string;
  privacyTitle: string;
  faqTitle: string;
  relatedToolsTitle: string;
  clientPrivacyBadge: string;
  serverPrivacyBadge: string;

  // Footer & Common
  tagline: string;
  copyright: string;
}

export const UI_TRANSLATIONS: Record<string, UiTranslation> = {
  en: {
    allTools: 'All Tools',
    popularTools: 'Popular Tools',
    howItWorks: 'How it Works',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    security: 'Security',
    cookies: 'Cookies Policy',
    faq: 'FAQ',
    blog: 'Blog',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
    home: 'Home',
    tools: 'Tools',

    dropFilesHere: 'Drop PDF files here, or click to browse',
    chooseFiles: 'Select PDF File',
    processDocument: 'Process Document',
    processingDocument: 'Processing your document...',
    documentReady: 'Your document is ready!',
    downloadResult: 'Download Processed PDF',
    processAnother: 'Process Another File',
    fileSize: 'File Size',
    freeLimitNotice: 'Free tier limit: 50MB per file. Pro unlocks 200MB.',
    howToUseTitle: 'How to use {tool} with SimplePDF',
    featuresTitle: 'Key Features & Capabilities',
    limitationsTitle: 'Supported Formats & Limits',
    useCasesTitle: 'Common Real-World Use Cases',
    privacyTitle: 'Privacy & File Security Guarantee',
    faqTitle: 'Frequently Asked Questions',
    relatedToolsTitle: 'Related PDF Tools',
    clientPrivacyBadge: '100% Client-Side Privacy — Files Never Leave Your Device',
    serverPrivacyBadge: 'Encrypted Cloud Processing — Auto-Deleted Within 60 Mins',

    tagline: 'Document Productivity. Made Simple.',
    copyright: '© SimplePDF. All rights reserved.',
  },

  es: {
    allTools: 'Todas las herramientas',
    popularTools: 'Herramientas populares',
    howItWorks: 'Cómo funciona',
    pricing: 'Precios',
    about: 'Acerca de',
    contact: 'Contacto',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    security: 'Seguridad',
    cookies: 'Política de Cookies',
    faq: 'Preguntas Frecuentes',
    blog: 'Blog',
    dashboard: 'Panel de control',
    admin: 'Administración',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    home: 'Inicio',
    tools: 'Herramientas',

    dropFilesHere: 'Arrastra archivos PDF aquí o haz clic para buscar',
    chooseFiles: 'Seleccionar archivo PDF',
    processDocument: 'Procesar Documento',
    processingDocument: 'Procesando su documento...',
    documentReady: '¡Su documento está listo!',
    downloadResult: 'Descargar PDF Procesado',
    processAnother: 'Procesar otro archivo',
    fileSize: 'Tamaño del archivo',
    freeLimitNotice: 'Límite gratuito: 50MB por archivo. Pro desbloquea 200MB.',
    howToUseTitle: 'Cómo usar {tool} con SimplePDF',
    featuresTitle: 'Características principales',
    limitationsTitle: 'Formatos admitidos y límites',
    useCasesTitle: 'Casos de uso comunes',
    privacyTitle: 'Privacidad y garantía de seguridad de archivos',
    faqTitle: 'Preguntas Frecuentes',
    relatedToolsTitle: 'Herramientas PDF relacionadas',
    clientPrivacyBadge: '100% Privacidad en navegador — Los archivos nunca salen de su equipo',
    serverPrivacyBadge: 'Procesamiento cifrado en la nube — Eliminación automática en 60 mins',

    tagline: 'Productividad documental. Hecha simple.',
    copyright: '© SimplePDF. Todos los derechos reservados.',
  },

  pt: {
    allTools: 'Todas as ferramentas',
    popularTools: 'Ferramentas populares',
    howItWorks: 'Como funciona',
    pricing: 'Preços',
    about: 'Sobre',
    contact: 'Contato',
    privacy: 'Política de Privacidade',
    terms: 'Termos de Serviço',
    security: 'Segurança',
    cookies: 'Política de Cookies',
    faq: 'Perguntas Frequentes',
    blog: 'Blog',
    dashboard: 'Painel',
    admin: 'Admin',
    login: 'Entrar',
    register: 'Cadastre-se',
    logout: 'Sair',
    home: 'Início',
    tools: 'Ferramentas',

    dropFilesHere: 'Arraste os arquivos PDF aqui ou clique para selecionar',
    chooseFiles: 'Selecionar arquivo PDF',
    processDocument: 'Processar Documento',
    processingDocument: 'Processando seu documento...',
    documentReady: 'Seu documento está pronto!',
    downloadResult: 'Baixar PDF Processado',
    processAnother: 'Processar outro arquivo',
    fileSize: 'Tamanho do arquivo',
    freeLimitNotice: 'Limite gratuito: 50MB por arquivo. O Pro libera 200MB.',
    howToUseTitle: 'Como usar {tool} com SimplePDF',
    featuresTitle: 'Principais recursos e capacidades',
    limitationsTitle: 'Formatos suportados e limites',
    useCasesTitle: 'Casos de uso comuns',
    privacyTitle: 'Garantia de privacidade e segurança',
    faqTitle: 'Perguntas Frequentes',
    relatedToolsTitle: 'Ferramentas PDF relacionadas',
    clientPrivacyBadge: '100% de privacidade no navegador — Os arquivos nunca saem do seu dispositivo',
    serverPrivacyBadge: 'Processamento em nuvem criptografado — Excluído em 60 mins',

    tagline: 'Produtividade de documentos. Feita simples.',
    copyright: '© SimplePDF. Todos os direitos reservados.',
  },

  de: {
    allTools: 'Alle Werkzeuge',
    popularTools: 'Beliebte Werkzeuge',
    howItWorks: 'So funktioniert es',
    pricing: 'Preise',
    about: 'Über uns',
    contact: 'Kontakt',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    security: 'Sicherheit',
    cookies: 'Cookie-Richtlinie',
    faq: 'Häufig gestellte Fragen',
    blog: 'Blog',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    home: 'Startseite',
    tools: 'Werkzeuge',

    dropFilesHere: 'PDF-Dateien hier ablegen oder klicken zum Durchsuchen',
    chooseFiles: 'PDF-Datei auswählen',
    processDocument: 'Dokument verarbeiten',
    processingDocument: 'Ihr Dokument wird verarbeitet...',
    documentReady: 'Ihr Dokument ist bereit!',
    downloadResult: 'Verarbeitetes PDF herunterladen',
    processAnother: 'Weitere Datei verarbeiten',
    fileSize: 'Dateigröße',
    freeLimitNotice: 'Kostenloses Limit: 50MB pro Datei. Pro schaltet 200MB frei.',
    howToUseTitle: 'So verwenden Sie {tool} mit SimplePDF',
    featuresTitle: 'Hauptfunktionen und Fähigkeiten',
    limitationsTitle: 'Unterstützte Formate und Einschränkungen',
    useCasesTitle: 'Häufige Anwendungsfälle',
    privacyTitle: 'Datenschutz- und Sicherheitsgarantie',
    faqTitle: 'Häufig gestellte Fragen',
    relatedToolsTitle: 'Verwandte PDF-Werkzeuge',
    clientPrivacyBadge: '100% Browser-Datenschutz — Dateien verlassen niemals Ihr Gerät',
    serverPrivacyBadge: 'Verschlüsselte Cloud-Verarbeitung — Automatische Löschung nach 60 Min.',

    tagline: 'Dokumenten-Produktivität. Einfach gemacht.',
    copyright: '© SimplePDF. Alle Rechte vorbehalten.',
  },

  fr: {
    allTools: 'Tous les outils',
    popularTools: 'Outils populaires',
    howItWorks: 'Comment ça marche',
    pricing: 'Tarifs',
    about: 'À propos',
    contact: 'Contact',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation',
    security: 'Sécurité',
    cookies: 'Politique de cookies',
    faq: 'FAQ',
    blog: 'Blog',
    dashboard: 'Tableau de bord',
    admin: 'Admin',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    home: 'Accueil',
    tools: 'Outils',

    dropFilesHere: 'Déposez vos fichiers PDF ici, ou cliquez pour parcourir',
    chooseFiles: 'Sélectionner un fichier PDF',
    processDocument: 'Traiter le document',
    processingDocument: 'Traitement de votre document...',
    documentReady: 'Votre document est prêt !',
    downloadResult: 'Télécharger le PDF traité',
    processAnother: 'Traiter un autre fichier',
    fileSize: 'Taille du fichier',
    freeLimitNotice: 'Limite gratuite : 50 Mo par fichier. La formule Pro permet 200 Mo.',
    howToUseTitle: 'Comment utiliser {tool} avec SimplePDF',
    featuresTitle: 'Fonctionnalités et capacités clés',
    limitationsTitle: 'Formats pris en charge et limites',
    useCasesTitle: 'Cas d\'utilisation fréquents',
    privacyTitle: 'Garantie de confidentialité et de sécurité des fichiers',
    faqTitle: 'Foire Aux Questions',
    relatedToolsTitle: 'Outils PDF associés',
    clientPrivacyBadge: '100% confidentialité dans le navigateur — Vos fichiers ne quittent jamais votre appareil',
    serverPrivacyBadge: 'Traitement cloud chiffré — Suppression automatique en 60 min',

    tagline: 'Productivité documentaire. En toute simplicité.',
    copyright: '© SimplePDF. Tous droits réservés.',
  },

  ar: {
    allTools: 'جميع الأدوات',
    popularTools: 'الأدوات الشائعة',
    howItWorks: 'كيف يعمل',
    pricing: 'الأسعار',
    about: 'حول SimplePDF',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    security: 'الأمان',
    cookies: 'سياسة ملفات تعريف الارتباط',
    faq: 'الأسئلة الشائعة',
    blog: 'المدونة',
    dashboard: 'لوحة التحكم',
    admin: 'الإدارة',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    tools: 'الأدوات',

    dropFilesHere: 'أسقط ملفات PDF هنا، أو انقر للاختيار',
    chooseFiles: 'اختر ملف PDF',
    processDocument: 'معالجة المستند',
    processingDocument: 'جاري معالجة المستند الخاص بك...',
    documentReady: 'مستندك جاهز الآن!',
    downloadResult: 'تحميل ملف PDF المعالج',
    processAnother: 'معالجة ملف آخر',
    fileSize: 'حجم الملف',
    freeLimitNotice: 'الحد المجاني: 50 ميغابايت للملف. الترقية تتيح حتى 200 ميغابايت.',
    howToUseTitle: 'كيفية استخدام {tool} مع SimplePDF',
    featuresTitle: 'الميزات والقدرات الأساسية',
    limitationsTitle: 'الصيغ المدعومة والحدود',
    useCasesTitle: 'أهم حالات الاستخدام',
    privacyTitle: 'ضمان الخصوصية وأمان الملفات',
    faqTitle: 'الأسئلة الشائعة',
    relatedToolsTitle: 'أدوات PDF ذات صلة',
    clientPrivacyBadge: 'خصوصية تامة 100% داخل المتصفح — لا تغادر ملفاتك جهازك أبداً',
    serverPrivacyBadge: 'معالجة سحابية مشفرة — حذف تلقائي نهائي خلال 60 دقيقة',

    tagline: 'إنتاجية المستندات. بكل بساطة.',
    copyright: '© SimplePDF. جميع الحقوق محفوظة.',
  },

  hi: {
    allTools: 'सभी टूल्स',
    popularTools: 'लोकप्रिय टूल्स',
    howItWorks: 'यह कैसे काम करता है',
    pricing: 'मूल्य निर्धारण',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    terms: 'सेवा की शर्तें',
    security: 'सुरक्षा',
    cookies: 'कुकी नीति',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    blog: 'ब्लॉग',
    dashboard: 'डैशबोर्ड',
    admin: 'एडमिन',
    login: 'लॉग इन करें',
    register: 'साइन अप करें',
    logout: 'लॉग आउट',
    home: 'होम',
    tools: 'टूल्स',

    dropFilesHere: 'PDF फ़ाइलें यहाँ छोड़ें, या चुनने के लिए क्लिक करें',
    chooseFiles: 'PDF फ़ाइल चुनें',
    processDocument: 'दस्तावेज़ प्रोसेस करें',
    processingDocument: 'आपका दस्तावेज़ प्रोसेस हो रहा है...',
    documentReady: 'आपका दस्तावेज़ तैयार है!',
    downloadResult: 'प्रोसेस किया गया PDF डाउनलोड करें',
    processAnother: 'एक और फ़ाइल प्रोसेस करें',
    fileSize: 'फ़ाइल का आकार',
    freeLimitNotice: 'मुफ़्त सीमा: प्रति फ़ाइल 50MB। प्रो 200MB अनलॉक करता है।',
    howToUseTitle: 'SimplePDF के साथ {tool} का उपयोग कैसे करें',
    featuresTitle: 'मुख्य विशेषताएं और क्षमताएं',
    limitationsTitle: 'समर्थित प्रारूप और सीमाएं',
    useCasesTitle: 'सामान्य उपयोग के मामले',
    privacyTitle: 'गोपनीयता और फ़ाइल सुरक्षा गारंटी',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    relatedToolsTitle: 'संबंधित PDF टूल्स',
    clientPrivacyBadge: '100% ब्राउज़र गोपनीयता — फ़ाइलें कभी आपके डिवाइस से बाहर नहीं जातीं',
    serverPrivacyBadge: 'एन्क्रिप्टेड क्लाउड प्रोसेसिंग — 60 मिनट में स्वतः हटाई जाती हैं',

    tagline: 'दस्तावेज़ उत्पादकता। बेहद सरल।',
    copyright: '© SimplePDF. सर्वाधिकार सुरक्षित।',
  },

  ur: {
    allTools: 'تمام ٹولز',
    popularTools: 'مقبول ٹولز',
    howItWorks: 'یہ کیسے کام کرتا ہے',
    pricing: 'قیمتیں',
    about: 'ہمارے متعلق',
    contact: 'رابطہ کریں',
    privacy: 'پرائیویسی پالیسی',
    terms: 'شرائط و ضوابط',
    security: 'سیکیورٹی',
    cookies: 'کوکیز پالیسی',
    faq: 'عام سوالات',
    blog: 'بلاگ',
    dashboard: 'ڈیش بورڈ',
    admin: 'ایڈمن',
    login: 'لاگ ان کریں',
    register: 'اکاؤنٹ بنائیں',
    logout: 'لاگ آؤٹ',
    home: 'ہوم',
    tools: 'ٹولز',

    dropFilesHere: 'PDF فائلیں یہاں ڈراپ کریں یا منتخب کرنے کے لیے کلک کریں',
    chooseFiles: 'PDF فائل منتخب کریں',
    processDocument: 'دستاویز پروسیس کریں',
    processingDocument: 'آپ کی دستاویز پروسیس ہو رہی ہے...',
    documentReady: 'آپ کی دستاویز تیار ہے!',
    downloadResult: 'پروسیس شدہ PDF ڈاؤنلوڈ کریں',
    processAnother: 'ایک اور فائل پروسیس کریں',
    fileSize: 'فائل کا سائز',
    freeLimitNotice: 'مفت حد: 50MB فی فائل۔ پرو میں 200MB تک کی سہولت۔',
    howToUseTitle: 'SimplePDF کے ساتھ {tool} استعمال کرنے کا طریقہ',
    featuresTitle: 'اہم خصوصیات اور صلاحیتیں',
    limitationsTitle: 'سپورٹ شدہ فارمیٹس اور حدود',
    useCasesTitle: 'عام اور عملی استعمال کے مواقع',
    privacyTitle: 'پرائیویسی اور فائل سیکیورٹی کی ضمانت',
    faqTitle: 'اکثر پوچھے جانے والے سوالات',
    relatedToolsTitle: 'متعلقہ PDF ٹولز',
    clientPrivacyBadge: '100% براؤزر پرائیویسی — فائلیں کبھی آپ کے ڈیوائس سے باہر نہیں جاتیں',
    serverPrivacyBadge: 'محفوظ کلاؤڈ پروسیسنگ — 60 منٹ میں خودکار طور پر مستقل ڈیلیٹ',

    tagline: 'دستاویزات کی پرفارمنس۔ اب سب سے آسان۔',
    copyright: '© SimplePDF. تمام جملہ حقوق محفوظ ہیں۔',
  },
};

/**
 * Returns translated UI string dictionary for the given language code with fallback to English.
 */
export function getTranslations(lang: string): UiTranslation {
  return UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
}
