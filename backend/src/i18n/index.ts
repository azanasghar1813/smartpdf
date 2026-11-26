/**
 * SimplePDF Backend Internationalization Module
 * Contains complete language registry, RTL detection, and localized string dictionaries.
 */

export interface LanguageDefinition {
  code: string;            // ISO 639-1 (e.g. 'en', 'es', 'ar', 'ur')
  locale: string;          // Locale identifier (e.g. 'en-US', 'es-ES', 'ar-SA', 'ur-PK')
  name: string;            // English display name
  nativeName: string;      // Native script name
  countryCode: string;     // ISO 3166-1 alpha-2 for visual flag/badge
  flagEmoji?: string;      // Country flag emoji e.g. '🇺🇸', '🇪🇸', '🇧🇷', '🇩🇪', '🇫🇷', '🇸🇦', '🇮🇳', '🇵🇰'
  isRTL: boolean;          // Text direction: true for RTL (Arabic, Urdu, etc.)
  isEnabled: boolean;      // Available in system
  isPublished: boolean;    // Publicly indexable by search engines
}

export const ALL_LANGUAGES: Record<string, LanguageDefinition> = {
  // Active Initial Rollout
  en: { code: 'en', locale: 'en-US', name: 'English', nativeName: 'English', countryCode: 'US', flagEmoji: '🇺🇸', isRTL: false, isEnabled: true, isPublished: true },
  es: { code: 'es', locale: 'es-ES', name: 'Spanish', nativeName: 'Español', countryCode: 'ES', flagEmoji: '🇪🇸', isRTL: false, isEnabled: true, isPublished: true },
  pt: { code: 'pt', locale: 'pt-BR', name: 'Portuguese', nativeName: 'Português', countryCode: 'BR', flagEmoji: '🇧🇷', isRTL: false, isEnabled: true, isPublished: true },
  de: { code: 'de', locale: 'de-DE', name: 'German', nativeName: 'Deutsch', countryCode: 'DE', flagEmoji: '🇩🇪', isRTL: false, isEnabled: true, isPublished: true },
  fr: { code: 'fr', locale: 'fr-FR', name: 'French', nativeName: 'Français', countryCode: 'FR', flagEmoji: '🇫🇷', isRTL: false, isEnabled: true, isPublished: true },
  ar: { code: 'ar', locale: 'ar-SA', name: 'Arabic', nativeName: 'العربية', countryCode: 'SA', flagEmoji: '🇸🇦', isRTL: true, isEnabled: true, isPublished: true },
  hi: { code: 'hi', locale: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', countryCode: 'IN', flagEmoji: '🇮🇳', isRTL: false, isEnabled: true, isPublished: true },
  ur: { code: 'ur', locale: 'ur-PK', name: 'Urdu', nativeName: 'اردو', countryCode: 'PK', flagEmoji: '🇵🇰', isRTL: true, isEnabled: true, isPublished: true },

  // Extended Catalog
  zh: { code: 'zh', locale: 'zh-CN', name: 'Chinese', nativeName: '中文', countryCode: 'CN', flagEmoji: '🇨🇳', isRTL: false, isEnabled: false, isPublished: false },
  ja: { code: 'ja', locale: 'ja-JP', name: 'Japanese', nativeName: '日本語', countryCode: 'JP', flagEmoji: '🇯🇵', isRTL: false, isEnabled: false, isPublished: false },
  ru: { code: 'ru', locale: 'ru-RU', name: 'Russian', nativeName: 'Русский', countryCode: 'RU', flagEmoji: '🇷🇺', isRTL: false, isEnabled: false, isPublished: false },
  it: { code: 'it', locale: 'it-IT', name: 'Italian', nativeName: 'Italiano', countryCode: 'IT', flagEmoji: '🇮🇹', isRTL: false, isEnabled: false, isPublished: false },
  nl: { code: 'nl', locale: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands', countryCode: 'NL', flagEmoji: '🇳🇱', isRTL: false, isEnabled: false, isPublished: false },
  pl: { code: 'pl', locale: 'pl-PL', name: 'Polish', nativeName: 'Polski', countryCode: 'PL', flagEmoji: '🇵🇱', isRTL: false, isEnabled: false, isPublished: false },
  tr: { code: 'tr', locale: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', countryCode: 'TR', flagEmoji: '🇹🇷', isRTL: false, isEnabled: false, isPublished: false },
  id: { code: 'id', locale: 'id-ID', name: 'Indonesian', nativeName: 'Indonesia', countryCode: 'ID', flagEmoji: '🇮🇩', isRTL: false, isEnabled: false, isPublished: false },
  ko: { code: 'ko', locale: 'ko-KR', name: 'Korean', nativeName: '한국어', countryCode: 'KR', flagEmoji: '🇰🇷', isRTL: false, isEnabled: false, isPublished: false },
  vi: { code: 'vi', locale: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', countryCode: 'VN', flagEmoji: '🇻🇳', isRTL: false, isEnabled: false, isPublished: false },
  th: { code: 'th', locale: 'th-TH', name: 'Thai', nativeName: 'ไทย', countryCode: 'TH', flagEmoji: '🇹🇭', isRTL: false, isEnabled: false, isPublished: false },
  fa: { code: 'fa', locale: 'fa-IR', name: 'Persian', nativeName: 'فارسی', countryCode: 'IR', flagEmoji: '🇮🇷', isRTL: true, isEnabled: false, isPublished: false },
  bn: { code: 'bn', locale: 'bn-BD', name: 'Bengali', nativeName: 'বাংলা', countryCode: 'BD', flagEmoji: '🇧🇩', isRTL: false, isEnabled: false, isPublished: false },
  uk: { code: 'uk', locale: 'uk-UA', name: 'Ukrainian', nativeName: 'Українська', countryCode: 'UA', flagEmoji: '🇺🇦', isRTL: false, isEnabled: false, isPublished: false },
  ro: { code: 'ro', locale: 'ro-RO', name: 'Romanian', nativeName: 'Română', countryCode: 'RO', flagEmoji: '🇷🇴', isRTL: false, isEnabled: false, isPublished: false },
  sv: { code: 'sv', locale: 'sv-SE', name: 'Swedish', nativeName: 'Svenska', countryCode: 'SE', flagEmoji: '🇸🇪', isRTL: false, isEnabled: false, isPublished: false },
  el: { code: 'el', locale: 'el-GR', name: 'Greek', nativeName: 'Ελληνικά', countryCode: 'GR', flagEmoji: '🇬🇷', isRTL: false, isEnabled: false, isPublished: false },
  cs: { code: 'cs', locale: 'cs-CZ', name: 'Czech', nativeName: 'Čeština', countryCode: 'CZ', flagEmoji: '🇨🇿', isRTL: false, isEnabled: false, isPublished: false },
  hu: { code: 'hu', locale: 'hu-HU', name: 'Hungarian', nativeName: 'Magyar', countryCode: 'HU', flagEmoji: '🇭🇺', isRTL: false, isEnabled: false, isPublished: false },
  ms: { code: 'ms', locale: 'ms-MY', name: 'Malay', nativeName: 'Bahasa Melayu', countryCode: 'MY', flagEmoji: '🇲🇾', isRTL: false, isEnabled: false, isPublished: false },
  ps: { code: 'ps', locale: 'ps-AF', name: 'Pashto', nativeName: 'پښتو', countryCode: 'AF', flagEmoji: '🇦🇫', isRTL: true, isEnabled: false, isPublished: false },
  sd: { code: 'sd', locale: 'sd-PK', name: 'Sindhi', nativeName: 'سنڌي', countryCode: 'PK', flagEmoji: '🇵🇰', isRTL: true, isEnabled: false, isPublished: false },
};

export const DEFAULT_LANGUAGE = 'en';

export function getPublishedLanguages(): LanguageDefinition[] {
  return Object.values(ALL_LANGUAGES).filter((l) => l.isPublished);
}

export function getEnabledLanguages(): LanguageDefinition[] {
  return Object.values(ALL_LANGUAGES).filter((l) => l.isEnabled);
}

export function isRTL(langCode: string): boolean {
  return ALL_LANGUAGES[langCode]?.isRTL ?? false;
}

export function isPublishedLanguage(langCode: string): boolean {
  return ALL_LANGUAGES[langCode]?.isPublished ?? false;
}

export interface UiTranslation {
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
  searchToolsPlaceholder: string;
  noToolsFound: string;
  footerRights: string;
  selectLanguage: string;
}

export const TRANSLATIONS: Record<string, UiTranslation> = {
  en: {
    allTools: 'All PDF Tools',
    popularTools: 'Popular Tools',
    howItWorks: 'How it Works',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    security: 'Security & Compliance',
    cookies: 'Cookie Policy',
    faq: 'FAQ',
    blog: 'Blog',
    dashboard: 'Dashboard',
    admin: 'Admin Console',
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
    downloadResult: 'Download File',
    processAnother: 'Process Another Document',
    fileSize: 'File size',
    freeLimitNotice: 'Free tier: up to 50MB per file. Upgrade for unlimited files.',
    howToUseTitle: 'How to use {tool} with SimplePDF',
    featuresTitle: 'Core Features & Capabilities',
    limitationsTitle: 'Accepted Formats & Limitations',
    useCasesTitle: 'Common Use Cases & Workflows',
    privacyTitle: 'Privacy & Security Guarantee',
    faqTitle: 'Frequently Asked Questions',
    relatedToolsTitle: 'Related PDF Tools',
    clientPrivacyBadge: '100% In-Browser Privacy — Files never leave your device',
    serverPrivacyBadge: 'End-to-End Encrypted Processing — Auto-purged in 60 minutes',
    searchToolsPlaceholder: 'Search any PDF tool (e.g. merge, compress, word)...',
    noToolsFound: 'No tools match your search criteria.',
    footerRights: 'All rights reserved. SimplePDF — The Modern High-Performance PDF Platform.',
    selectLanguage: 'Select Language',
  },
  es: {
    allTools: 'Todas las herramientas PDF',
    popularTools: 'Herramientas populares',
    howItWorks: 'Cómo funciona',
    pricing: 'Precios',
    about: 'Acerca de',
    contact: 'Contacto',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    security: 'Seguridad y Cumplimiento',
    cookies: 'Política de Cookies',
    faq: 'Preguntas Frecuentes',
    blog: 'Blog',
    dashboard: 'Panel de Control',
    admin: 'Consola de Administración',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    home: 'Inicio',
    tools: 'Herramientas',
    dropFilesHere: 'Arrastra archivos PDF aquí, o haz clic para seleccionar',
    chooseFiles: 'Seleccionar archivo PDF',
    processDocument: 'Procesar documento',
    processingDocument: 'Procesando tu documento...',
    documentReady: '¡Tu documento está listo!',
    downloadResult: 'Descargar archivo',
    processAnother: 'Procesar otro documento',
    fileSize: 'Tamaño del archivo',
    freeLimitNotice: 'Nivel gratuito: hasta 50MB por archivo. Actualiza para límites ilimitados.',
    howToUseTitle: 'Cómo usar {tool} con SimplePDF',
    featuresTitle: 'Características y Capacidades Principales',
    limitationsTitle: 'Formatos Aceptados y Limitaciones',
    useCasesTitle: 'Casos de Uso Comunes',
    privacyTitle: 'Garantía de Privacidad y Seguridad',
    faqTitle: 'Preguntas Frecuentes',
    relatedToolsTitle: 'Herramientas PDF Relacionadas',
    clientPrivacyBadge: 'Privacidad 100% en el navegador — Tus archivos nunca salen de tu dispositivo',
    serverPrivacyBadge: 'Procesamiento cifrado de extremo a extremo — Eliminación automática en 60 min',
    searchToolsPlaceholder: 'Buscar herramientas PDF...',
    noToolsFound: 'No se encontraron herramientas que coincidan.',
    footerRights: 'Todos los derechos reservados. SimplePDF — La plataforma PDF moderna de alto rendimiento.',
    selectLanguage: 'Seleccionar idioma',
  },
  pt: {
    allTools: 'Todas as Ferramentas PDF',
    popularTools: 'Ferramentas Populares',
    howItWorks: 'Como Funciona',
    pricing: 'Preços',
    about: 'Sobre',
    contact: 'Contato',
    privacy: 'Política de Privacidade',
    terms: 'Termos de Serviço',
    security: 'Segurança e Conformidade',
    cookies: 'Política de Cookies',
    faq: 'Perguntas Frequentes',
    blog: 'Blog',
    dashboard: 'Painel',
    admin: 'Painel Admin',
    login: 'Entrar',
    register: 'Cadastre-se',
    logout: 'Sair',
    home: 'Início',
    tools: 'Ferramentas',
    dropFilesHere: 'Arraste arquivos PDF para cá, ou clique para selecionar',
    chooseFiles: 'Selecionar arquivo PDF',
    processDocument: 'Processar Documento',
    processingDocument: 'Processando seu documento...',
    documentReady: 'Seu documento está pronto!',
    downloadResult: 'Baixar Arquivo',
    processAnother: 'Processar Outro Documento',
    fileSize: 'Tamanho do arquivo',
    freeLimitNotice: 'Plano gratuito: até 50MB por arquivo. Atualize para capacidade ilimitada.',
    howToUseTitle: 'Como usar {tool} com SimplePDF',
    featuresTitle: 'Recursos e Capacidades Principais',
    limitationsTitle: 'Formatos Aceitos e Limitações',
    useCasesTitle: 'Casos de Uso Comuns',
    privacyTitle: 'Garantia de Privacidade e Segurança',
    faqTitle: 'Perguntas Frequentes',
    relatedToolsTitle: 'Ferramentas PDF Relacionadas',
    clientPrivacyBadge: 'Privacidade 100% no Navegador — Seus arquivos nunca saem do seu computador',
    serverPrivacyBadge: 'Processamento Criptografado de Ponta a Ponta — Exclusão em 60 minutos',
    searchToolsPlaceholder: 'Pesquisar ferramentas PDF...',
    noToolsFound: 'Nenhuma ferramenta encontrada.',
    footerRights: 'Todos os direitos reservados. SimplePDF — A Plataforma Moderna de PDF.',
    selectLanguage: 'Selecionar idioma',
  },
  de: {
    allTools: 'Alle PDF-Werkzeuge',
    popularTools: 'Beliebte Werkzeuge',
    howItWorks: 'So funktioniert es',
    pricing: 'Preise',
    about: 'Über uns',
    contact: 'Kontakt',
    privacy: 'Datenschutzerklärung',
    terms: 'Nutzungsbedingungen',
    security: 'Sicherheit & Compliance',
    cookies: 'Cookie-Richtlinie',
    faq: 'Häufige Fragen',
    blog: 'Blog',
    dashboard: 'Dashboard',
    admin: 'Admin-Konsole',
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    home: 'Startseite',
    tools: 'Werkzeuge',
    dropFilesHere: 'PDF-Dateien hier ablegen oder zum Auswählen klicken',
    chooseFiles: 'PDF-Datei auswählen',
    processDocument: 'Dokument verarbeiten',
    processingDocument: 'Dokument wird verarbeitet...',
    documentReady: 'Ihr Dokument ist bereit!',
    downloadResult: 'Datei herunterladen',
    processAnother: 'Anderes Dokument verarbeiten',
    fileSize: 'Dateigröße',
    freeLimitNotice: 'Kostenlose Version: bis zu 50MB pro Datei. Upgrade für unbegrenzte Dateigrößen.',
    howToUseTitle: 'So nutzen Sie {tool} mit SimplePDF',
    featuresTitle: 'Hauptfunktionen und Möglichkeiten',
    limitationsTitle: 'Unterstützte Formate und Limits',
    useCasesTitle: 'Häufige Anwendungsbereiche',
    privacyTitle: 'Datenschutz- und Sicherheitsgarantie',
    faqTitle: 'Häufig gestellte Fragen',
    relatedToolsTitle: 'Verwandte PDF-Werkzeuge',
    clientPrivacyBadge: '100% Datenschutz im Browser — Ihre Dateien verlassen Ihr Gerät niemals',
    serverPrivacyBadge: 'Ende-zu-Ende verschlüsselte Verarbeitung — Automatische Löschung nach 60 Min',
    searchToolsPlaceholder: 'PDF-Werkzeuge suchen...',
    noToolsFound: 'Keine passenden Werkzeuge gefunden.',
    footerRights: 'Alle Rechte vorbehalten. SimplePDF — Die moderne Hochleistungs-PDF-Plattform.',
    selectLanguage: 'Sprache wählen',
  },
  fr: {
    allTools: 'Tous les outils PDF',
    popularTools: 'Outils populaires',
    howItWorks: 'Comment ça marche',
    pricing: 'Tarifs',
    about: 'À propos',
    contact: 'Contact',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d’utilisation',
    security: 'Sécurité et conformité',
    cookies: 'Politique des cookies',
    faq: 'FAQ',
    blog: 'Blog',
    dashboard: 'Tableau de bord',
    admin: 'Console Admin',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    home: 'Accueil',
    tools: 'Outils',
    dropFilesHere: 'Déposez les fichiers PDF ici, ou cliquez pour choisir',
    chooseFiles: 'Sélectionner un fichier PDF',
    processDocument: 'Traiter le document',
    processingDocument: 'Traitement de votre document...',
    documentReady: 'Votre document est prêt !',
    downloadResult: 'Télécharger le fichier',
    processAnother: 'Traiter un autre document',
    fileSize: 'Taille du fichier',
    freeLimitNotice: 'Offre gratuite : jusqu’à 50 Mo par fichier. Passez à Pro pour un accès illimité.',
    howToUseTitle: 'Comment utiliser {tool} avec SimplePDF',
    featuresTitle: 'Fonctionnalités et Capacités',
    limitationsTitle: 'Formats Acceptés et Limitations',
    useCasesTitle: 'Cas d’utilisation courants',
    privacyTitle: 'Garantie de Confidentialité et Sécurité',
    faqTitle: 'Questions Fréquemment Posées',
    relatedToolsTitle: 'Outils PDF Associés',
    clientPrivacyBadge: 'Confidentialité 100% dans le navigateur — Vos fichiers ne quittent jamais votre appareil',
    serverPrivacyBadge: 'Traitement chiffré de bout en bout — Suppression automatique après 60 minutes',
    searchToolsPlaceholder: 'Rechercher un outil PDF...',
    noToolsFound: 'Aucun outil ne correspond à votre recherche.',
    footerRights: 'Tous droits réservés. SimplePDF — La plateforme PDF moderne haute performance.',
    selectLanguage: 'Choisir la langue',
  },
  ar: {
    allTools: 'جميع أدوات PDF',
    popularTools: 'الأدوات الشائعة',
    howItWorks: 'كيف يعمل',
    pricing: 'الأسعار',
    about: 'عن المنصة',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    security: 'الأمان والامتثال',
    cookies: 'سياسة ملفات تعريف الارتباط',
    faq: 'الأسئلة الشائعة',
    blog: 'المدونة',
    dashboard: 'لوحة التحكم',
    admin: 'لوحة المشرف',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    tools: 'الأدوات',
    dropFilesHere: 'أسقط ملفات PDF هنا، أو انقر للاختيار',
    chooseFiles: 'اختر ملف PDF',
    processDocument: 'معالجة المستند',
    processingDocument: 'جاري معالجة المستند...',
    documentReady: 'المستند جاهز للتحميل!',
    downloadResult: 'تحميل الملف',
    processAnother: 'معالجة مستند آخر',
    fileSize: 'حجم الملف',
    freeLimitNotice: 'الخطة المجانية: حتى 50 ميغابايت لكل ملف. قم بالترقية لحجم غير محدود.',
    howToUseTitle: 'كيفية استخدام {tool} مع SimplePDF',
    featuresTitle: 'الميزات والقدرات الأساسية',
    limitationsTitle: 'الصيغ المدعومة والقيود',
    useCasesTitle: 'أبرز حالات الاستخدام العملية',
    privacyTitle: 'ضمان الخصوصية والأمان التام',
    faqTitle: 'الأسئلة الشائعة والمعلومات',
    relatedToolsTitle: 'أدوات PDF ذات صلة',
    clientPrivacyBadge: 'خصوصية تامة 100% داخل المتصفح — لا تغادر ملفاتك جهازك أبداً',
    serverPrivacyBadge: 'معالجة مشفرة من النهاية إلى النهاية — حذف تلقائي بعد 60 دقيقة',
    searchToolsPlaceholder: 'ابحث عن أي أداة PDF...',
    noToolsFound: 'لم يتم العثور على أي أدوات مطابقة.',
    footerRights: 'جميع الحقوق محفوظة. SimplePDF — منصة PDF الحديثة فائقة الأداء.',
    selectLanguage: 'اختر اللغة',
  },
  hi: {
    allTools: 'सभी PDF टूल्स',
    popularTools: 'लोकप्रिय टूल्स',
    howItWorks: 'यह कैसे काम करता है',
    pricing: 'मूल्य निर्धारण',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    terms: 'सेवा की शर्तें',
    security: 'सुरक्षा और अनुपालन',
    cookies: 'कुकी नीति',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    blog: 'ब्लॉग',
    dashboard: 'डैशबोर्ड',
    admin: 'एडमिन पैनल',
    login: 'लॉग इन करें',
    register: 'साइन अप करें',
    logout: 'लॉग आउट',
    home: 'होम',
    tools: 'टूल्स',
    dropFilesHere: 'यहाँ PDF फाइलें छोड़ें, या चुनने के लिए क्लिक करें',
    chooseFiles: 'PDF फ़ाइल चुनें',
    processDocument: 'दस्तावेज़ प्रोसेस करें',
    processingDocument: 'आपका दस्तावेज़ प्रोसेस हो रहा है...',
    documentReady: 'आपका दस्तावेज़ तैयार है!',
    downloadResult: 'फ़ाइल डाउनलोड करें',
    processAnother: 'एक और दस्तावेज़ प्रोसेस करें',
    fileSize: 'फ़ाइल का आकार',
    freeLimitNotice: 'निःशुल्क प्लान: प्रति फ़ाइल 50MB तक। असीमित के लिए अपग्रेड करें।',
    howToUseTitle: 'SimplePDF के साथ {tool} का उपयोग कैसे करें',
    featuresTitle: 'मुख्य विशेषताएं और क्षमताएं',
    limitationsTitle: 'समर्थित प्रारूप और सीमाएं',
    useCasesTitle: 'प्रमुख उपयोग परिदृश्य',
    privacyTitle: 'गोपनीयता और सुरक्षा गारंटी',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    relatedToolsTitle: 'संबंधित PDF टूल्स',
    clientPrivacyBadge: '100% इन-ब्राउज़र गोपनीयता — आपकी फाइलें कभी आपके डिवाइस से बाहर नहीं जातीं',
    serverPrivacyBadge: 'एंड-टू-एंड एन्क्रिप्टेड प्रोसेसिंग — 60 मिनट में स्वतः नष्ट',
    searchToolsPlaceholder: 'कोई भी PDF टूल खोजें...',
    noToolsFound: 'कोई टूल नहीं मिला।',
    footerRights: 'सर्वाधिकार सुरक्षित। SimplePDF — आधुनिक उच्च-प्रदर्शन PDF प्लेटफॉर्म।',
    selectLanguage: 'भाषा चुनें',
  },
  ur: {
    allTools: 'تمام PDF ٹولز',
    popularTools: 'مقبول ٹولز',
    howItWorks: 'یہ کیسے کام کرتا ہے',
    pricing: 'قیمتیں',
    about: 'ہمارے بارے میں',
    contact: 'رابطہ کریں',
    privacy: 'رازداری کی پالیسی',
    terms: 'سروس کی شرائط',
    security: 'سیکیورٹی اور تحفظ',
    cookies: 'کوکیز کی پالیسی',
    faq: 'اکثر پوچھے جانے والے سوالات',
    blog: 'بلاگ',
    dashboard: 'ڈیش بورڈ',
    admin: 'ایڈمن کنسول',
    login: 'لاگ ان کریں',
    register: 'سائن اپ کریں',
    logout: 'لاگ آؤٹ',
    home: 'ہوم',
    tools: 'ٹولز',
    dropFilesHere: 'PDF فائلیں یہاں ڈراپ کریں، یا فائل منتخب کریں',
    chooseFiles: 'PDF فائل منتخب کریں',
    processDocument: 'دستاویز پروسیس کریں',
    processingDocument: 'آپ کی دستاویز پروسیس ہو رہی ہے...',
    documentReady: 'آپ کی دستاویز تیار ہے!',
    downloadResult: 'فائل ڈاؤن لوڈ کریں',
    processAnother: 'ایک اور دستاویز پروسیس کریں',
    fileSize: 'فائل کا سائز',
    freeLimitNotice: 'مفت پلان: فی فائل 50MB تک۔ لامحدود سہولیات کے لیے اپ گریڈ کریں۔',
    howToUseTitle: 'SimplePDF کے ساتھ {tool} استعمال کرنے کا طریقہ',
    featuresTitle: 'بنیادی خصوصیات اور صلاحیتیں',
    limitationsTitle: 'تعاون یافتہ فارمیٹس اور حدود',
    useCasesTitle: 'عام عملی استعمال کے طریقے',
    privacyTitle: 'رازداری اور مکمل سیکیورٹی کی ضمانت',
    faqTitle: 'اکثر پوچھے جانے والے سوالات',
    relatedToolsTitle: 'متعلقہ PDF ٹولز',
    clientPrivacyBadge: '100% براؤزر پرائیویسی — آپ کی فائلیں کبھی آپ کی ڈیوائس سے باہر نہیں جاتیں',
    serverPrivacyBadge: 'اینڈ ٹو اینڈ انکرپٹڈ پروسیسنگ — 60 منٹ میں خودکار طور پر ڈیلیٹ',
    searchToolsPlaceholder: 'کوئی بھی PDF ٹول تلاش کریں...',
    noToolsFound: 'کوئی ٹول نہیں ملا۔',
    footerRights: 'جملہ حقوق محفوظ ہیں۔ SimplePDF — جدید اور تیز ترین PDF پلیٹ فارم۔',
    selectLanguage: 'زبان منتخب کریں',
  },
};

export function getTranslations(langCode: string): UiTranslation {
  return TRANSLATIONS[langCode] || TRANSLATIONS[DEFAULT_LANGUAGE];
}
