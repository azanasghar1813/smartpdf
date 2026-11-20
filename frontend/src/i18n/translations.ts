/**
 * SimplePDF Core Translation Dictionary
 * Human-curated translations for active languages (en, es, pt, de, fr, ar, hi, ur).
 * Never translates technical file extensions (.pdf, .docx), brand names, or URLs.
 */

export interface UiTranslation {
  // Navigation & General
  allTools: string;
  allPdfTools: string;
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
  searchToolsPlaceholder: string;
  allCategories: string;

  // Direct Quick Tool Labels
  mergePdf: string;
  splitPdf: string;
  compressPdf: string;
  signPdf: string;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroTitleGradient: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  clear: string;

  // Popular & Categories
  mostUsedEveryday: string;
  popularPdfTools: string;
  popularSubtitle: string;
  exploreAllTools: string;
  exploreSubtitle: string;
  openTool: string;

  // How It Works
  howItWorksBadge: string;
  howItWorksHeading: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Security Banner
  securityBadge: string;
  securityHeading: string;
  securitySubtitle: string;

  // Pricing Page
  pricingBadge: string;
  pricingHeading: string;
  pricingSubtitle: string;
  freePlanTitle: string;
  freePlanPrice: string;
  freePlanPeriod: string;
  freePlanDesc: string;
  freePlanCta: string;
  proPlanTitle: string;
  proPlanPrice: string;
  proPlanPeriod: string;
  proPlanDesc: string;
  proPlanCta: string;
  enterprisePlanTitle: string;
  enterprisePlanPrice: string;
  enterprisePlanPeriod: string;
  enterprisePlanDesc: string;
  enterprisePlanCta: string;

  // Blog Page
  blogBadge: string;
  blogHeading: string;
  blogSubtitle: string;
  readTutorial: string;

  // FAQ Page
  faqBadge: string;
  faqHeading: string;
  faqSubtitle: string;

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
  footerTagline: string;
  footerPillZeroRetention: string;
  footerPillEncryption: string;
  footerPillEdge: string;
  companyAndHelp: string;
  pricingPlans: string;
  blogAndTutorials: string;
  aboutUs: string;
  contactSupport: string;
  legalAndPrivacy: string;
}

export const UI_TRANSLATIONS: Record<string, UiTranslation> = {
  en: {
    allTools: 'All Tools',
    allPdfTools: 'All PDF Tools',
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
    searchToolsPlaceholder: 'Search tools...',
    allCategories: 'All Categories',

    mergePdf: 'Merge PDF',
    splitPdf: 'Split PDF',
    compressPdf: 'Compress PDF',
    signPdf: 'Sign PDF',

    heroBadge: 'Every PDF Tool in One Fast, Secure Workspace',
    heroTitle: 'Every PDF Tool You Need.',
    heroTitleGradient: 'All in One Place.',
    heroSubtitle: 'Merge, split, compress, convert, rotate, unlock, and edit PDF files online 100% free. Enjoy lightning-fast in-browser processing with zero file retention.',
    searchPlaceholder: 'Search PDF tools (e.g. Merge, Compress, PDF to Word, Sign, Protect)...',
    clear: 'Clear',

    mostUsedEveryday: 'Most Used Everyday',
    popularPdfTools: 'Popular PDF Tools',
    popularSubtitle: 'The quickest way to solve your common document tasks. 100% free, fast, and secure.',
    exploreAllTools: 'Explore All 30+ PDF Tools',
    exploreSubtitle: 'From essential page merging and compression to OCR, electronic signatures, and AI document intelligence.',
    openTool: 'Open tool',

    howItWorksBadge: 'Simple 3-Step Process',
    howItWorksHeading: 'How SimplePDF Works',
    howItWorksSubtitle: 'No complex software installations or steep learning curves. Complete your document workflows in seconds.',
    step1Title: 'Select or Drop Files',
    step1Desc: 'Upload your PDF documents directly from your device, phone, or drag-and-drop into our secure workspace.',
    step2Title: 'Customize & Process',
    step2Desc: 'Reorder pages, select compression levels, adjust watermark settings, or configure conversion options with real-time feedback.',
    step3Title: 'Download & Done',
    step3Desc: 'Download your finalized PDF instantaneously. Core tools process right in your browser without any waiting queues.',

    securityBadge: 'Strict Privacy Standards',
    securityHeading: 'Security & Document Privacy Are Not Optional',
    securitySubtitle: 'Whether you are handling confidential legal contracts, academic transcripts, or personal IDs, SimplePDF is engineered with uncompromising protection.',

    pricingBadge: 'Transparent, Scalable Pricing',
    pricingHeading: 'Simple Plans for Every PDF Need',
    pricingSubtitle: 'Start completely free without creating an account, or upgrade to Premium for heavy batch workloads, OCR, and AI intelligence.',
    freePlanTitle: 'Free / Guest',
    freePlanPrice: '$0',
    freePlanPeriod: 'Forever free',
    freePlanDesc: 'Everything you need for everyday individual document tasks with in-browser privacy.',
    freePlanCta: 'Start Free Now',
    proPlanTitle: 'Premium Pro',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'per month',
    proPlanDesc: 'For professionals, freelancers, and students requiring high-volume productivity & AI.',
    proPlanCta: 'Upgrade to Pro',
    enterprisePlanTitle: 'Business & Teams',
    enterprisePlanPrice: 'Custom',
    enterprisePlanPeriod: 'per team / month',
    enterprisePlanDesc: 'Centralized document infrastructure for enterprises, law firms, and institutions.',
    enterprisePlanCta: 'Contact Sales',

    blogBadge: 'Document Productivity Tutorials',
    blogHeading: 'SimplePDF Blog & Guides',
    blogSubtitle: 'Expert tips, tutorials, and practical strategies to master document workflows, compression, and security.',
    readTutorial: 'Read Full Tutorial',

    faqBadge: 'Help Center & Answers',
    faqHeading: 'Frequently Asked Questions',
    faqSubtitle: 'Find answers to commonly asked questions about tools, file security, and subscription plans.',

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
    footerTagline: 'Every PDF tool you need to manage, edit, convert, and secure documents. 100% free, browser-optimized, and built with uncompromising privacy.',
    footerPillZeroRetention: 'Zero-Retention Ephemeral Storage',
    footerPillEncryption: 'TLS 256-bit Encryption',
    footerPillEdge: 'Edge In-Browser Processing',
    companyAndHelp: 'Company & Help',
    pricingPlans: 'Pricing Plans',
    blogAndTutorials: 'Blog & Tutorials',
    aboutUs: 'About Us',
    contactSupport: 'Contact Support',
    legalAndPrivacy: 'Legal & Privacy',
  },

  ur: {
    allTools: 'تمام ٹولز',
    allPdfTools: 'تمام PDF ٹولز',
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
    searchToolsPlaceholder: 'ٹولز تلاش کریں...',
    allCategories: 'تمام کیٹیگریز',

    mergePdf: 'PDF ضم کریں',
    splitPdf: 'PDF تقسیم کریں',
    compressPdf: 'PDF کمپریس کریں',
    signPdf: 'PDF پر دستخط کریں',

    heroBadge: 'تمام PDF ٹولز ایک تیز اور محفوظ ورک اسپیس میں',
    heroTitle: 'ہر وہ PDF ٹول جس کی آپ کو ضرورت ہے۔',
    heroTitleGradient: 'سب ایک ہی جگہ پر۔',
    heroSubtitle: 'پی ڈی ایف فائلوں کو باآسانی جوڑیں، تقسیم کریں، کمپریس کریں، تبدیل کریں، گھمائیں اور ایڈٹ کریں۔ بغیر فائل محفوظ کیے 100% براؤزر پرائیویسی کے ساتھ۔',
    searchPlaceholder: 'ٹولز تلاش کریں (مثلاً: ضم کریں، کمپریس، ورڈ بنائیں، دستخط کریں)...',
    clear: 'صاف کریں',

    mostUsedEveryday: 'روزمرہ کے سب سے مقبول ٹولز',
    popularPdfTools: 'مقبول PDF ٹولز',
    popularSubtitle: 'دستاویزات کے کاموں کو فوری حل کرنے کا سب سے تیز، مفت اور محفوظ ترین طریقہ۔',
    exploreAllTools: 'تمام 30+ PDF ٹولز دیکھیں',
    exploreSubtitle: 'صفحات جوڑنے اور سائز کم کرنے سے لے کر او سی آر، ڈیجیٹل دستخط اور مصنوعی ذہانت تک۔',
    openTool: 'ٹول کھولیں',

    howItWorksBadge: 'آسان 3 مرحلہ وار عمل',
    howItWorksHeading: 'SimplePDF کیسے کام کرتا ہے',
    howItWorksSubtitle: 'بغیر کسی سافٹ ویئر انسٹالیشن کے چند سیکنڈز میں اپنی دستاویزات تیار کریں۔',
    step1Title: 'فائلیں منتخب یا ڈراپ کریں',
    step1Desc: 'اپنے کمپیوٹر یا فون سے پی ڈی ایف فائل اپ لوڈ کریں یا ڈریگ اینڈ ڈراپ کریں۔',
    step2Title: 'سیٹنگز اور پروسیسنگ',
    step2Desc: 'صفحات کی ترتیب بدلیں، کمپریشن منتخب کریں یا مطلوبہ آپشنز ایڈجسٹ کریں۔',
    step3Title: 'ڈاؤنلوڈ اور مکمل',
    step3Desc: 'بغیر کسی انتظار کے فوری طور پر تیار شدہ فائنل پی ڈی ایف فائل ڈاؤنلوڈ کریں۔',

    securityBadge: 'سخت ترین پرائیویسی معیارات',
    securityHeading: 'سیکیورٹی اور دستاویز کی رازداری ہمارے لیے لازم ہے',
    securitySubtitle: 'قانونی معاہدات ہوں یا تعلیمی اسناد، SimplePDF آپ کی فائلوں کو مکمل تحفظ فراہم کرتا ہے۔',

    pricingBadge: 'شفاف اور سادہ قیمتیں',
    pricingHeading: 'ہر ضرورت کے لیے بہترین اور آسان منصوبے',
    pricingSubtitle: 'بغیر اکاؤنٹ بنائے بالکل مفت استعمال کریں، یا بڑے کاموں اور AI کے لیے پرو میں اپ گریڈ کریں۔',
    freePlanTitle: 'مفت / گیسٹ',
    freePlanPrice: '$0',
    freePlanPeriod: 'ہمیشہ مفت',
    freePlanDesc: 'روزمرہ کے عام کاموں کے لیے تمام ضروری ٹولز براؤزر پرائیویسی کے ساتھ۔',
    freePlanCta: 'ابھی مفت شروع کریں',
    proPlanTitle: 'پریمیم پرو',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'فی مہینہ',
    proPlanDesc: 'پروفیشنلز، طلباء اور اداروں کے لیے لامحدود سہولیات اور AI فیچرز۔',
    proPlanCta: 'پرو میں اپ گریڈ کریں',
    enterprisePlanTitle: 'بزنس اور ٹیمز',
    enterprisePlanPrice: 'کسٹم',
    enterprisePlanPeriod: 'فی ٹیم / ماہانہ',
    enterprisePlanDesc: 'کاروباری اداروں، قانونی فرموں اور بڑی ٹیموں کے لیے مکمل دستاویزاتی انفراسٹرکچر۔',
    enterprisePlanCta: 'سیلز سے رابطہ کریں',

    blogBadge: 'دستاویزی گائیڈز اور رہنمائی',
    blogHeading: 'SimplePDF بلاگ اور ٹیٹوریلز',
    blogSubtitle: 'دستاویزات کے کام، کمپریشن اور سیکیورٹی میں مہارت کے لیے مفید مشورے اور گائیڈز۔',
    readTutorial: 'مکمل گائیڈ پڑھیں',

    faqBadge: 'مدد اور جوابات',
    faqHeading: 'اکثر پوچھے جانے والے سوالات',
    faqSubtitle: 'ٹولز، فائل سیکیورٹی اور سروسز کے بارے میں اپنے سوالات کے فوری جوابات جانیں۔',

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
    footerTagline: 'ہر PDF ٹول جس کی آپ کو ضرورت ہے۔ 100% مفت، براؤزر پر تیز ترین اور مکمل رازداری کے ساتھ۔',
    footerPillZeroRetention: 'فائلوں کا خودکار صفایا',
    footerPillEncryption: 'TLS 256-bit انکرپشن',
    footerPillEdge: 'براؤزر میں فوری پروسیسنگ',
    companyAndHelp: 'کمپنی اور مدد',
    pricingPlans: 'قیمتوں کے منصوبے',
    blogAndTutorials: 'بلاگ اور ٹیٹوریلز',
    aboutUs: 'ہمارے متعلق',
    contactSupport: 'کسٹمر سپورٹ',
    legalAndPrivacy: 'قانونی و پرائیویسی',
  },

  ar: {
    allTools: 'جميع الأدوات',
    allPdfTools: 'جميع أدوات PDF',
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
    searchToolsPlaceholder: 'بحث في الأدوات...',
    allCategories: 'جميع الفئات',

    mergePdf: 'دمج PDF',
    splitPdf: 'تقسيم PDF',
    compressPdf: 'ضغط PDF',
    signPdf: 'توقيع PDF',

    heroBadge: 'كل أدوات PDF في مساحة عمل واحدة سريعة وآمنة',
    heroTitle: 'كل أدوات PDF التي تحتاجها.',
    heroTitleGradient: 'كلها في مكان واحد.',
    heroSubtitle: 'دمج وتقسيم وضغط وتحويل وتدوير وتعديل ملفات PDF مجاناً 100%. استمتع بمعالجة فورية فائقة السرعة مع خصوصية تامة.',
    searchPlaceholder: 'ابحث عن أدوات PDF (مثلاً: دمج، ضغط، تحويل إلى Word، توقيع)...',
    clear: 'مسح',

    mostUsedEveryday: 'الأكثر استخداماً يومياً',
    popularPdfTools: 'أدوات PDF الشائعة',
    popularSubtitle: 'أسرع طريقة لإنجاز مهام مستنداتك مجاناً وبأمان تام.',
    exploreAllTools: 'استكشف أكثر من 30 أداة PDF',
    exploreSubtitle: 'من دمج الصفحات والضغط إلى OCR والتوقيع الإلكتروني وذكاء AI.',
    openTool: 'فتح الأداة',

    howItWorksBadge: 'عملية بسيطة من 3 خطوات',
    howItWorksHeading: 'كيف يعمل SimplePDF',
    howItWorksSubtitle: 'دون تثبيت برامج معقدة، أنجز مهام مستنداتك خلال ثوانٍ معدودة.',
    step1Title: 'اختر أو أسقط الملفات',
    step1Desc: 'ارفع مستنداتك مباشرة من جهازك أو اسحبها إلى مساحة العمل الآمنة.',
    step2Title: 'التخصيص والمعالجة',
    step2Desc: 'أعد ترتيب الصفحات، وحدد مستوى الضغط، أو اضبط خيارات التحويل فوراً.',
    step3Title: 'التحميل والانتهاء',
    step3Desc: 'حمل ملف PDF الجاهز فوراً بدون قوائم انتظار.',

    securityBadge: 'معايير خصوصية صارمة',
    securityHeading: 'أمان المستندات وخصوصيتها ليست خياراً ثانوياً',
    securitySubtitle: 'سواء كانت عقوداً قانونية أو شهادات دراسية، صُمم SimplePDF بحماية استثنائية.',

    pricingBadge: 'أسعار واضحة ومرنة',
    pricingHeading: 'خطط بسيطة تناسب جميع الاحتياجات',
    pricingSubtitle: 'ابدأ مجاناً دون الحاجة لإنشاء حساب، أو قم بالترقية للوصول إلى الميزات المتقدمة.',
    freePlanTitle: 'مجاني / زائر',
    freePlanPrice: '$0',
    freePlanPeriod: 'مجاني للأبد',
    freePlanDesc: 'كل ما تحتاجه لإنجاز مهامك اليومية مع خصوصية كاملة بالمتصفح.',
    freePlanCta: 'ابدأ مجاناً الآن',
    proPlanTitle: 'بريميوم برو',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'شهرياً',
    proPlanDesc: 'للمحترفين والطلاب الذين يحتاجون إلى سرعة أعلى وميزات AI المتقدمة.',
    proPlanCta: 'ترقية إلى برو',
    enterprisePlanTitle: 'الشركات والفرق',
    enterprisePlanPrice: 'مخصص',
    enterprisePlanPeriod: 'لكل فريق / شهرياً',
    enterprisePlanDesc: 'بنية تحتية متكاملة للمستندات للشركات والمؤسسات القانونية.',
    enterprisePlanCta: 'تواصل مع المبيعات',

    blogBadge: 'دروس إنتاجية المستندات',
    blogHeading: 'مدونة ودلائل SimplePDF',
    blogSubtitle: 'نصائح الخبراء واستراتيجيات متقدمة لإدارة مستندات PDF بكفاءة.',
    readTutorial: 'قراءة الدليل كاملاً',

    faqBadge: 'مركز المساعدة والإجابات',
    faqHeading: 'الأسئلة الشائعة',
    faqSubtitle: 'إجابات واضحة على الأسئلة الأكثر شيوعاً حول الأدوات والأمان والاشتراكات.',

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
    footerTagline: 'كل ما تحتاجه لإدارة وتعديل وتحويل وحماية ملفات PDF مجاناً وبأعلى درجات الخصوصية.',
    footerPillZeroRetention: 'حذف فوري للملفات',
    footerPillEncryption: 'تشفير TLS 256-bit',
    footerPillEdge: 'معالجة مباشرة داخل المتصفح',
    companyAndHelp: 'الشركة والمساعدة',
    pricingPlans: 'خطط الأسعار',
    blogAndTutorials: 'المدونة والدلائل',
    aboutUs: 'من نحن',
    contactSupport: 'الدعم الفني',
    legalAndPrivacy: 'الشروط والخصوصية',
  },

  es: {
    allTools: 'Todas las herramientas',
    allPdfTools: 'Todas las herramientas PDF',
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
    searchToolsPlaceholder: 'Buscar herramientas...',
    allCategories: 'Todas las categorías',

    mergePdf: 'Unir PDF',
    splitPdf: 'Dividir PDF',
    compressPdf: 'Comprimir PDF',
    signPdf: 'Firmar PDF',

    heroBadge: 'Todas las herramientas PDF en un espacio rápido y seguro',
    heroTitle: 'Todas las herramientas PDF que necesitas.',
    heroTitleGradient: 'Todo en un solo lugar.',
    heroSubtitle: 'Une, divide, comprime, convierte, rota y edita archivos PDF online 100% gratis con privacidad total en tu navegador.',
    searchPlaceholder: 'Buscar herramientas PDF (ej. Unir, Comprimir, PDF a Word, Firmar)...',
    clear: 'Limpiar',

    mostUsedEveryday: 'Más utilizadas cada día',
    popularPdfTools: 'Herramientas PDF populares',
    popularSubtitle: 'La forma más rápida de resolver tus tareas con documentos. 100% gratis, rápida y segura.',
    exploreAllTools: 'Explora más de 30 herramientas PDF',
    exploreSubtitle: 'Desde unir y comprimir hasta OCR, firma digital e inteligencia artificial.',
    openTool: 'Abrir herramienta',

    howItWorksBadge: 'Proceso sencillo en 3 pasos',
    howItWorksHeading: 'Cómo funciona SimplePDF',
    howItWorksSubtitle: 'Sin instalaciones complejas de software. Completa tus flujos de documentos en segundos.',
    step1Title: 'Selecciona o suelta archivos',
    step1Desc: 'Sube tus documentos directamente desde tu dispositivo o arrástralos a nuestro espacio seguro.',
    step2Title: 'Personaliza y procesa',
    step2Desc: 'Reordena páginas, elige niveles de compresión o configura opciones con respuesta en tiempo real.',
    step3Title: 'Descarga y listo',
    step3Desc: 'Descarga tu PDF finalizado al instante sin colas de espera.',

    securityBadge: 'Estrictos estándares de privacidad',
    securityHeading: 'La seguridad y la privacidad no son opcionales',
    securitySubtitle: 'Ya sean contratos legales o documentos académicos, SimplePDF está diseñado con máxima protección.',

    pricingBadge: 'Precios transparentes y escalables',
    pricingHeading: 'Planes sencillos para cada necesidad',
    pricingSubtitle: 'Empieza completamente gratis sin registrarte, o actualiza a Pro para tareas masivas e IA.',
    freePlanTitle: 'Gratis / Invitado',
    freePlanPrice: '$0',
    freePlanPeriod: 'Gratis para siempre',
    freePlanDesc: 'Todo lo necesario para tareas individuales con privacidad en el navegador.',
    freePlanCta: 'Empezar gratis ahora',
    proPlanTitle: 'Premium Pro',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'al mes',
    proPlanDesc: 'Para profesionales y estudiantes que requieren alta productividad e IA.',
    proPlanCta: 'Actualizar a Pro',
    enterprisePlanTitle: 'Empresas y Equipos',
    enterprisePlanPrice: 'A medida',
    enterprisePlanPeriod: 'por equipo / mes',
    enterprisePlanDesc: 'Infraestructura centralizada de documentos para organizaciones y despachos.',
    enterprisePlanCta: 'Contactar ventas',

    blogBadge: 'Tutoriales de productividad',
    blogHeading: 'Blog y Guías de SimplePDF',
    blogSubtitle: 'Consejos expertos para dominar tus flujos de trabajo, compresión y seguridad.',
    readTutorial: 'Leer tutorial completo',

    faqBadge: 'Centro de ayuda y respuestas',
    faqHeading: 'Preguntas Frecuentes',
    faqSubtitle: 'Encuentra respuestas sobre herramientas, seguridad de archivos y planes.',

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
    footerTagline: 'Cada herramienta PDF que necesitas para gestionar, editar y proteger tus documentos con total privacidad.',
    footerPillZeroRetention: 'Cero retención de archivos',
    footerPillEncryption: 'Cifrado TLS 256-bit',
    footerPillEdge: 'Procesamiento en navegador',
    companyAndHelp: 'Empresa y Ayuda',
    pricingPlans: 'Planes de Precios',
    blogAndTutorials: 'Blog y Tutoriales',
    aboutUs: 'Sobre Nosotros',
    contactSupport: 'Soporte Técnico',
    legalAndPrivacy: 'Legal y Privacidad',
  },

  pt: {
    allTools: 'Todas as ferramentas',
    allPdfTools: 'Todas as ferramentas PDF',
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
    searchToolsPlaceholder: 'Pesquisar ferramentas...',
    allCategories: 'Todas as categorias',

    mergePdf: 'Juntar PDF',
    splitPdf: 'Dividir PDF',
    compressPdf: 'Comprimir PDF',
    signPdf: 'Assinar PDF',

    heroBadge: 'Todas as ferramentas PDF em um espaço rápido e seguro',
    heroTitle: 'Todas as ferramentas PDF que você precisa.',
    heroTitleGradient: 'Tudo em um só lugar.',
    heroSubtitle: 'Junte, divida, comprima, converta, gire e edite arquivos PDF online 100% grátis com total privacidade no navegador.',
    searchPlaceholder: 'Pesquisar ferramentas PDF (ex.: Juntar, Comprimir, PDF para Word, Assinar)...',
    clear: 'Limpar',

    mostUsedEveryday: 'Mais usadas todos os dias',
    popularPdfTools: 'Ferramentas PDF Populares',
    popularSubtitle: 'A maneira mais rápida de resolver tarefas com documentos. 100% grátis, rápida e segura.',
    exploreAllTools: 'Explore mais de 30 ferramentas PDF',
    exploreSubtitle: 'Da junção e compressão básica até OCR, assinaturas digitais e IA.',
    openTool: 'Abrir ferramenta',

    howItWorksBadge: 'Processo simples em 3 passos',
    howItWorksHeading: 'Como o SimplePDF funciona',
    howItWorksSubtitle: 'Sem instalações complexas. Conclua seus fluxos de trabalho em segundos.',
    step1Title: 'Selecione ou arraste arquivos',
    step1Desc: 'Envie seus documentos diretamente do dispositivo para nosso espaço seguro.',
    step2Title: 'Personalize e processe',
    step2Desc: 'Reordene páginas, defina a compressão e ajuste as opções em tempo real.',
    step3Title: 'Baixe e finalize',
    step3Desc: 'Baixe seu PDF finalizado instantaneamente sem filas de espera.',

    securityBadge: 'Padrões rigorosos de privacidade',
    securityHeading: 'Segurança e privacidade não são opcionais',
    securitySubtitle: 'Seja para contratos confidenciais ou documentos pessoais, o SimplePDF garante máxima segurança.',

    pricingBadge: 'Preços transparentes e escaláveis',
    pricingHeading: 'Planos simples para todas as necessidades',
    pricingSubtitle: 'Comece totalmente grátis ou assine o Pro para conversões em lote e recursos de IA.',
    freePlanTitle: 'Grátis / Visitante',
    freePlanPrice: '$0',
    freePlanPeriod: 'Grátis para sempre',
    freePlanDesc: 'Tudo o que você precisa para tarefas do dia a dia no navegador.',
    freePlanCta: 'Começar grátis agora',
    proPlanTitle: 'Premium Pro',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'por mês',
    proPlanDesc: 'Para profissionais e estudantes que precisam de alta produtividade e IA.',
    proPlanCta: 'Assinar o Pro',
    enterprisePlanTitle: 'Empresas e Equipes',
    enterprisePlanPrice: 'Sob medida',
    enterprisePlanPeriod: 'por equipe / mês',
    enterprisePlanDesc: 'Infraestrutura centralizada de documentos para empresas e escritórios.',
    enterprisePlanCta: 'Falar com vendas',

    blogBadge: 'Tutoriais de produtividade',
    blogHeading: 'Blog e Guias SimplePDF',
    blogSubtitle: 'Dicas de especialistas para otimizar seus documentos e segurança.',
    readTutorial: 'Ler tutorial completo',

    faqBadge: 'Central de ajuda e respostas',
    faqHeading: 'Perguntas Frecuentes',
    faqSubtitle: 'Respostas para dúvidas sobre ferramentas, segurança e planos.',

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
    footerTagline: 'Todas as ferramentas PDF necessárias para gerenciar, editar e proteger documentos com total privacidade.',
    footerPillZeroRetention: 'Zero retenção de dados',
    footerPillEncryption: 'Criptografia TLS 256-bit',
    footerPillEdge: 'Processamento no navegador',
    companyAndHelp: 'Empresa e Ajuda',
    pricingPlans: 'Planos de Preços',
    blogAndTutorials: 'Blog e Tutoriais',
    aboutUs: 'Sobre Nós',
    contactSupport: 'Suporte',
    legalAndPrivacy: 'Legal e Privacidade',
  },

  de: {
    allTools: 'Alle Werkzeuge',
    allPdfTools: 'Alle PDF-Werkzeuge',
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
    searchToolsPlaceholder: 'Werkzeuge suchen...',
    allCategories: 'Alle Kategorien',

    mergePdf: 'PDF zusammenfügen',
    splitPdf: 'PDF teilen',
    compressPdf: 'PDF komprimieren',
    signPdf: 'PDF unterschreiben',

    heroBadge: 'Jedes PDF-Werkzeug in einem schnellen, sicheren Arbeitsbereich',
    heroTitle: 'Alle PDF-Werkzeuge, die Sie brauchen.',
    heroTitleGradient: 'Alles an einem Ort.',
    heroSubtitle: 'PDF-Dateien 100% kostenlos online zusammenfügen, teilen, komprimieren, konvertieren und bearbeiten mit vollständigem Browser-Datenschutz.',
    searchPlaceholder: 'PDF-Werkzeuge durchsuchen (z. B. Zusammenfügen, Komprimieren, Signieren)...',
    clear: 'Löschen',

    mostUsedEveryday: 'Täglich am meisten genutzt',
    popularPdfTools: 'Beliebte PDF-Werkzeuge',
    popularSubtitle: 'Der schnellste Weg für Ihre täglichen Dokumentenaufgaben. 100% kostenlos, schnell und sicher.',
    exploreAllTools: 'Entdecken Sie alle 30+ PDF-Werkzeuge',
    exploreSubtitle: 'Von einfachen Seitenoperationen bis hin zu OCR, elektronischen Signaturen und KI.',
    openTool: 'Werkzeug öffnen',

    howItWorksBadge: 'Einfacher 3-Schritte-Prozess',
    howItWorksHeading: 'So funktioniert SimplePDF',
    howItWorksSubtitle: 'Keine komplizierte Software-Installation. Erledigen Sie Ihre Workflows in Sekunden.',
    step1Title: 'Dateien auswählen oder ablegen',
    step1Desc: 'Laden Sie Ihre Dokumente direkt hoch oder ziehen Sie sie per Drag & Drop in den Bereich.',
    step2Title: 'Anpassen & verarbeiten',
    step2Desc: 'Seiten anordnen, Komprimierung wählen oder Optionen in Echtzeit konfigurieren.',
    step3Title: 'Herunterladen & fertig',
    step3Desc: 'Laden Sie Ihr fertiges PDF sofort ohne Wartezeiten herunter.',

    securityBadge: 'Strikte Datenschutzstandards',
    securityHeading: 'Sicherheit und Datenschutz sind unverzichtbar',
    securitySubtitle: 'Ob vertrauliche Verträge oder persönliche Dokumente — SimplePDF garantiert maximalen Schutz.',

    pricingBadge: 'Transparente, flexible Preise',
    pricingHeading: 'Einfache Tarife für jeden Bedarf',
    pricingSubtitle: 'Starten Sie völlig kostenlos oder wählen Sie Pro für Massenverarbeitung und KI.',
    freePlanTitle: 'Kostenlos / Gast',
    freePlanPrice: '$0',
    freePlanPeriod: 'Dauerhaft kostenlos',
    freePlanDesc: 'Alles für alltägliche Aufgaben mit lokaler Privatsphäre im Browser.',
    freePlanCta: 'Jetzt kostenlos starten',
    proPlanTitle: 'Premium Pro',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'pro Monat',
    proPlanDesc: 'Für Berufstätige und Studierende mit hohem Dokumentenaufkommen und KI-Bedarf.',
    proPlanCta: 'Auf Pro upgraden',
    enterprisePlanTitle: 'Unternehmen & Teams',
    enterprisePlanPrice: 'Individuell',
    enterprisePlanPeriod: 'pro Team / Monat',
    enterprisePlanDesc: 'Zentrale Dokumenteninfrastruktur für Unternehmen und Kanzleien.',
    enterprisePlanCta: 'Vertrieb kontaktieren',

    blogBadge: 'Produktivitäts-Tutorials',
    blogHeading: 'SimplePDF Blog & Anleitungen',
    blogSubtitle: 'Expertentipps zur Beherrschung Ihrer Dokumenten-Workflows und Sicherheit.',
    readTutorial: 'Vollständige Anleitung lesen',

    faqBadge: 'Hilfebereich & Antworten',
    faqHeading: 'Häufig gestellte Fragen',
    faqSubtitle: 'Finden Sie Antworten auf häufige Fragen zu Werkzeugen, Sicherheit und Abonnements.',

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
    footerTagline: 'Alle PDF-Werkzeuge für Verwaltung, Bearbeitung und Schutz Ihrer Dokumente mit höchster Privatsphäre.',
    footerPillZeroRetention: 'Keine Dateispeicherung',
    footerPillEncryption: 'TLS 256-Bit Verschlüsselung',
    footerPillEdge: 'Direkte Verarbeitung im Browser',
    companyAndHelp: 'Unternehmen & Hilfe',
    pricingPlans: 'Preise & Tarife',
    blogAndTutorials: 'Blog & Anleitungen',
    aboutUs: 'Über uns',
    contactSupport: 'Kundensupport',
    legalAndPrivacy: 'Rechtliches & Datenschutz',
  },

  fr: {
    allTools: 'Tous les outils',
    allPdfTools: 'Tous les outils PDF',
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
    searchToolsPlaceholder: 'Rechercher un outil...',
    allCategories: 'Toutes les catégories',

    mergePdf: 'Fusionner PDF',
    splitPdf: 'Diviser PDF',
    compressPdf: 'Compresser PDF',
    signPdf: 'Signer PDF',

    heroBadge: 'Tous les outils PDF dans un espace rapide et sécurisé',
    heroTitle: 'Tous les outils PDF dont vous avez besoin.',
    heroTitleGradient: 'Réunis en un seul endroit.',
    heroSubtitle: 'Fusionnez, divisez, compressez, convertissez, faites pivoter et modifiez des PDF 100% gratuitement en toute confidentialité dans votre navigateur.',
    searchPlaceholder: 'Rechercher des outils PDF (ex. Fusionner, Compresser, PDF en Word, Signer)...',
    clear: 'Effacer',

    mostUsedEveryday: 'Les plus utilisés au quotidien',
    popularPdfTools: 'Outils PDF populaires',
    popularSubtitle: 'La manière la plus rapide de traiter vos documents. 100% gratuit, rapide et sécurisé.',
    exploreAllTools: 'Explorez plus de 30 outils PDF',
    exploreSubtitle: 'De la fusion basique à l\'OCR, aux signatures électroniques et à l\'IA.',
    openTool: 'Ouvrir l\'outil',

    howItWorksBadge: 'Processus simple en 3 étapes',
    howItWorksHeading: 'Comment fonctionne SimplePDF',
    howItWorksSubtitle: 'Sans installer de logiciel lourd. Réalisez vos tâches documentaires en quelques secondes.',
    step1Title: 'Sélectionnez ou déposez vos fichiers',
    step1Desc: 'Téléversez vos fichiers directement depuis votre appareil dans notre espace sécurisé.',
    step2Title: 'Personnalisez & traitez',
    step2Desc: 'Réorganisez les pages, choisissez la compression ou ajustez vos paramètres instantanément.',
    step3Title: 'Téléchargez & c\'est prêt',
    step3Desc: 'Téléchargez immédiatement votre PDF finalisé sans file d\'attente.',

    securityBadge: 'Normes de confidentialité strictes',
    securityHeading: 'La sécurité et la confidentialité ne sont pas optionnelles',
    securitySubtitle: 'Qu\'il s\'agisse de contrats légaux ou de diplômes, SimplePDF garantit une protection absolue.',

    pricingBadge: 'Tarifs transparents et évolutifs',
    pricingHeading: 'Des forfaits simples pour chaque besoin',
    pricingSubtitle: 'Commencez gratuitement sans compte, ou passez à Pro pour les traitements de masse et l\'IA.',
    freePlanTitle: 'Gratuit / Invité',
    freePlanPrice: '$0',
    freePlanPeriod: 'Gratuit pour toujours',
    freePlanDesc: 'Tout le nécessaire pour vos tâches quotidiennes en toute confidentialité.',
    freePlanCta: 'Démarrer gratuitement',
    proPlanTitle: 'Premium Pro',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'par mois',
    proPlanDesc: 'Pour les professionnels et étudiants nécessitant une productivité élevée et l\'IA.',
    proPlanCta: 'Passer à Pro',
    enterprisePlanTitle: 'Entreprises & Équipes',
    enterprisePlanPrice: 'Sur mesure',
    enterprisePlanPeriod: 'par équipe / mois',
    enterprisePlanDesc: 'Infrastructure documentaire centralisée pour entreprises et cabinets d\'avocats.',
    enterprisePlanCta: 'Contacter les ventes',

    blogBadge: 'Tutoriels de productivité',
    blogHeading: 'Blog & Guides SimplePDF',
    blogSubtitle: 'Conseils d\'experts pour maîtriser vos flux de travail et la sécurité de vos documents.',
    readTutorial: 'Lire le tutoriel complet',

    faqBadge: 'Centre d\'aide & Réponses',
    faqHeading: 'Foire Aux Questions',
    faqSubtitle: 'Trouvez des réponses claires sur nos outils, la sécurité des fichiers et les abonnements.',

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
    footerTagline: 'Tous les outils PDF nécessaires pour gérer, modifier et protéger vos documents en toute confidentialité.',
    footerPillZeroRetention: 'Zéro conservation de fichiers',
    footerPillEncryption: 'Chiffrement TLS 256-bit',
    footerPillEdge: 'Traitement direct dans le navigateur',
    companyAndHelp: 'Entreprise & Aide',
    pricingPlans: 'Grille tarifaire',
    blogAndTutorials: 'Blog & Tutoriels',
    aboutUs: 'À propos de nous',
    contactSupport: 'Support technique',
    legalAndPrivacy: 'Mentions légales & Confidentialité',
  },

  hi: {
    allTools: 'सभी टूल्स',
    allPdfTools: 'सभी PDF टूल्स',
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
    searchToolsPlaceholder: 'टूल्स खोजें...',
    allCategories: 'सभी श्रेणियां',

    mergePdf: 'PDF मर्ज करें',
    splitPdf: 'PDF स्प्लिट करें',
    compressPdf: 'PDF कंप्रेस करें',
    signPdf: 'PDF पर हस्ताक्षर करें',

    heroBadge: 'सभी PDF टूल्स एक तेज़ और सुरक्षित वर्कस्पेस में',
    heroTitle: 'हर वो PDF टूल जिसकी आपको ज़रूरत है।',
    heroTitleGradient: 'सब कुछ एक ही जगह पर।',
    heroSubtitle: 'PDF फ़ाइलों को ऑनलाइन 100% मुफ़्त में मर्ज, स्प्लिट, कंप्रेस, कन्वर्ट, रोटेट और एडिट करें। ब्राउज़र में शून्य फ़ाइल प्रतिधारण के साथ तेज़ गति का आनंद लें।',
    searchPlaceholder: 'PDF टूल्स खोजें (जैसे: मर्ज, कंप्रेस, Word में बदलें, साइन)...',
    clear: 'साफ़ करें',

    mostUsedEveryday: 'रोज़ाना सबसे ज़्यादा इस्तेमाल होने वाले',
    popularPdfTools: 'लोकप्रिय PDF टूल्स',
    popularSubtitle: 'दस्तावेज़ कार्यों को तेज़ी से हल करने का 100% मुफ़्त और सुरक्षित तरीका।',
    exploreAllTools: 'सभी 30+ PDF टूल्स देखें',
    exploreSubtitle: 'पेज मर्ज करने और कंप्रेस करने से लेकर OCR, डिजिटल हस्ताक्षर और AI तक।',
    openTool: 'टूल खोलें',

    howItWorksBadge: 'सरल 3-चरणीय प्रक्रिया',
    howItWorksHeading: 'SimplePDF कैसे काम करता है',
    howItWorksSubtitle: 'बिना किसी जटिल सॉफ्टवेयर के कुछ ही सेकंडों में अपने दस्तावेज़ तैयार करें।',
    step1Title: 'फ़ाइलें चुनें या छोड़ें',
    step1Desc: 'अपने डिवाइस से सीधे PDF फ़ाइलें अपलोड करें या वर्कस्पेस में ड्रैग-एंड-ड्रॉप करें।',
    step2Title: 'कस्टमाइज़ और प्रोसेस',
    step2Desc: 'पेजों को पुनर्व्यवस्थित करें, कंप्रेशन चुनें या वास्तविक समय में विकल्प सेट करें।',
    step3Title: 'डाउनलोड और पूर्ण',
    step3Desc: 'बिना किसी कतार के तुरंत अपना अंतिम PDF डाउनलोड करें।',

    securityBadge: 'सख्त गोपनीयता मानक',
    securityHeading: 'सुरक्षा और दस्तावेज़ गोपनीयता कोई विकल्प नहीं है',
    securitySubtitle: 'चाहे कानूनी अनुबंध हों या व्यक्तिगत दस्तावेज़, SimplePDF पूर्ण सुरक्षा प्रदान करता है।',

    pricingBadge: 'पारदर्शी और सरल मूल्य',
    pricingHeading: 'हर ज़रूरत के लिए आसान योजनाएं',
    pricingSubtitle: 'बिना खाता बनाए बिल्कुल मुफ़्त शुरू करें, या बड़े कार्यों और AI के लिए प्रो में अपग्रेड करें।',
    freePlanTitle: 'मुफ़्त / गेस्ट',
    freePlanPrice: '$0',
    freePlanPeriod: 'हमेशा मुफ़्त',
    freePlanDesc: 'ब्राउज़र गोपनीयता के साथ रोज़मर्रा के कार्यों के लिए सभी आवश्यक टूल्स।',
    freePlanCta: 'अभी मुफ़्त शुरू करें',
    proPlanTitle: 'प्रीमियम प्रो',
    proPlanPrice: '$4.99',
    proPlanPeriod: 'प्रति माह',
    proPlanDesc: 'पेशेवरों और छात्रों के लिए उच्च उत्पादकता और AI सुविधाएं।',
    proPlanCta: 'प्रो में अपग्रेड करें',
    enterprisePlanTitle: 'बिजनेस और टीमें',
    enterprisePlanPrice: 'कस्टम',
    enterprisePlanPeriod: 'प्रति टीम / माह',
    enterprisePlanDesc: 'उद्यमों और कानूनी फर्मों के लिए केंद्रीकृत दस्तावेज़ अवसंरचना।',
    enterprisePlanCta: 'बिक्री से संपर्क करें',

    blogBadge: 'दस्तावेज़ उत्पादकता ट्यूटोरियल',
    blogHeading: 'SimplePDF ब्लॉग और गाइड',
    blogSubtitle: 'दस्तावेज़ वर्कफ़्लो और सुरक्षा में महारत हासिल करने के लिए विशेषज्ञ सुझाव।',
    readTutorial: 'पूरा ट्यूटोरियल पढ़ें',

    faqBadge: 'सहायता केंद्र और उत्तर',
    faqHeading: 'अक्सर पूछे जाने वाले प्रश्न',
    faqSubtitle: 'टूल्स, फ़ाइल सुरक्षा और योजनाओं के बारे में अक्सर पूछे जाने वाले प्रश्नों के उत्तर।',

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
    footerTagline: 'दस्तावेज़ों को प्रबंधित, संपादित और सुरक्षित करने के लिए आवश्यक हर PDF टूल। 100% मुफ़्त और सुरक्षित।',
    footerPillZeroRetention: 'शून्य डेटा प्रतिधारण',
    footerPillEncryption: 'TLS 256-बिट एन्क्रिप्शन',
    footerPillEdge: 'ब्राउज़र में सीधी प्रोसेसिंग',
    companyAndHelp: 'कंपनी और सहायता',
    pricingPlans: 'मूल्य योजनाएं',
    blogAndTutorials: 'ब्लॉग और ट्यूटोरियल',
    aboutUs: 'हमारे बारे में',
    contactSupport: 'ग्राहक सहायता',
    legalAndPrivacy: 'कानूनी और गोपनीयता',
  },
};

/**
 * Returns translated UI string dictionary for the given language code with fallback to English.
 */
export function getTranslations(lang?: string): UiTranslation {
  if (!lang) return UI_TRANSLATIONS.en;
  return UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
}
