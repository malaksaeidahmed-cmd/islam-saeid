// ============================================================
// Simulator Data — Benchmarks, Industries, Frameworks
// ============================================================

export const INDUSTRIES = {
  // ============ Retail & E-Commerce ============
  fashion: {
    name: 'الملابس والأزياء',
    category: 'retail',
    icon: 'fa-shirt',
    cpm: 62, ctr: 2.4, cvr: 2.8, aov: 850, cogs: 38,
    ltvMult: 1.6, churnRate: 0.35, seasonality: 'high',
    competition: 'high', impulseBuy: true, avgFrequency: 2.8
  },
  electronics: {
    name: 'الإلكترونيات',
    category: 'retail',
    icon: 'fa-mobile-screen',
    cpm: 78, ctr: 1.9, cvr: 1.9, aov: 2400, cogs: 62,
    ltvMult: 1.3, churnRate: 0.45, seasonality: 'high',
    competition: 'high', impulseBuy: false, avgFrequency: 1.9
  },
  cosmetics: {
    name: 'مستحضرات التجميل والعناية',
    category: 'beauty',
    icon: 'fa-spa',
    cpm: 72, ctr: 2.3, cvr: 2.6, aov: 620, cogs: 28,
    ltvMult: 2.4, churnRate: 0.30, seasonality: 'medium',
    competition: 'high', impulseBuy: true, avgFrequency: 3.6
  },
  babyProducts: {
    name: 'منتجات الأطفال',
    category: 'retail',
    icon: 'fa-baby',
    cpm: 68, ctr: 2.1, cvr: 2.4, aov: 750, cogs: 42,
    ltvMult: 2.8, churnRate: 0.25, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 3.2
  },
  petSupplies: {
    name: 'مستلزمات الحيوانات الأليفة',
    category: 'retail',
    icon: 'fa-paw',
    cpm: 58, ctr: 2.6, cvr: 3.1, aov: 480, cogs: 40,
    ltvMult: 3.2, churnRate: 0.20, seasonality: 'low',
    competition: 'low', impulseBuy: false, avgFrequency: 4.1
  },
  furniture: {
    name: 'الأثاث والديكور',
    category: 'home',
    icon: 'fa-couch',
    cpm: 92, ctr: 1.4, cvr: 1.3, aov: 5800, cogs: 48,
    ltvMult: 1.2, churnRate: 0.70, seasonality: 'medium',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.4
  },
  grocery: {
    name: 'البقالة والسوبر ماركت',
    category: 'retail',
    icon: 'fa-cart-shopping',
    cpm: 42, ctr: 3.2, cvr: 4.5, aov: 380, cogs: 72,
    ltvMult: 5.5, churnRate: 0.15, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 6.8
  },
  jewelry: {
    name: 'الفضة والمجوهرات',
    category: 'luxury',
    icon: 'fa-gem',
    cpm: 105, ctr: 1.6, cvr: 1.2, aov: 3200, cogs: 35,
    ltvMult: 1.8, churnRate: 0.55, seasonality: 'high',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.6
  },
  toys: {
    name: 'الألعاب ومستلزمات الأطفال',
    category: 'retail',
    icon: 'fa-puzzle-piece',
    cpm: 55, ctr: 2.7, cvr: 3.0, aov: 550, cogs: 45,
    ltvMult: 2.0, churnRate: 0.35, seasonality: 'high',
    competition: 'medium', impulseBuy: true, avgFrequency: 2.5
  },
  books: {
    name: 'الكتب والدورات التعليمية',
    category: 'education',
    icon: 'fa-book',
    cpm: 52, ctr: 2.4, cvr: 2.8, aov: 320, cogs: 18,
    ltvMult: 2.2, churnRate: 0.30, seasonality: 'low',
    competition: 'low', impulseBuy: true, avgFrequency: 2.9
  },

  // ============ Food & Beverage ============
  restaurants: {
    name: 'المطاعم',
    category: 'food',
    icon: 'fa-utensils',
    cpm: 48, ctr: 3.0, cvr: 3.8, aov: 260, cogs: 38,
    ltvMult: 4.2, churnRate: 0.18, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 5.2
  },
  cloudKitchen: {
    name: 'مطابخ سحابية',
    category: 'food',
    icon: 'fa-kitchen-set',
    cpm: 44, ctr: 3.4, cvr: 4.2, aov: 220, cogs: 42,
    ltvMult: 4.8, churnRate: 0.15, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 6.1
  },
  cafe: {
    name: 'الكافيهات',
    category: 'food',
    icon: 'fa-mug-hot',
    cpm: 42, ctr: 3.2, cvr: 4.0, aov: 180, cogs: 32,
    ltvMult: 5.5, churnRate: 0.12, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 7.2
  },
  catering: {
    name: 'خدمات الكاترينج',
    category: 'food',
    icon: 'fa-bell-concierge',
    cpm: 65, ctr: 1.9, cvr: 1.8, aov: 4500, cogs: 45,
    ltvMult: 1.5, churnRate: 0.60, seasonality: 'high',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.5
  },

  // ============ Real Estate & Auto ============
  realEstate: {
    name: 'العقارات',
    category: 'realestate',
    icon: 'fa-building',
    cpm: 145, ctr: 1.1, cvr: 0.6, aov: 2500000, cogs: 8,
    ltvMult: 1.0, churnRate: 0.95, seasonality: 'medium',
    competition: 'high', impulseBuy: false, avgFrequency: 1.1
  },
  automotive: {
    name: 'السيارات',
    category: 'auto',
    icon: 'fa-car',
    cpm: 115, ctr: 1.5, cvr: 0.9, aov: 850000, cogs: 78,
    ltvMult: 1.4, churnRate: 0.85, seasonality: 'medium',
    competition: 'high', impulseBuy: false, avgFrequency: 1.5
  },

  // ============ Services ============
  clinics: {
    name: 'العيادات والخدمات الطبية',
    category: 'healthcare',
    icon: 'fa-stethoscope',
    cpm: 82, ctr: 2.0, cvr: 1.9, aov: 850, cogs: 25,
    ltvMult: 2.6, churnRate: 0.40, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.9
  },
  dentistry: {
    name: 'طب الأسنان',
    category: 'healthcare',
    icon: 'fa-tooth',
    cpm: 88, ctr: 1.9, cvr: 2.1, aov: 3200, cogs: 30,
    ltvMult: 1.9, churnRate: 0.45, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.8
  },
  dermatology: {
    name: 'الجلدية والتجميل',
    category: 'healthcare',
    icon: 'fa-sparkles',
    cpm: 95, ctr: 2.1, cvr: 2.4, aov: 1800, cogs: 22,
    ltvMult: 2.8, churnRate: 0.35, seasonality: 'medium',
    competition: 'high', impulseBuy: false, avgFrequency: 2.2
  },
  legalServices: {
    name: 'الخدمات القانونية',
    category: 'professional',
    icon: 'fa-scale-balanced',
    cpm: 130, ctr: 1.3, cvr: 1.4, aov: 5500, cogs: 15,
    ltvMult: 1.6, churnRate: 0.70, seasonality: 'low',
    competition: 'low', impulseBuy: false, avgFrequency: 1.3
  },
  consulting: {
    name: 'الاستشارات',
    category: 'professional',
    icon: 'fa-lightbulb',
    cpm: 125, ctr: 1.4, cvr: 1.6, aov: 8500, cogs: 12,
    ltvMult: 2.2, churnRate: 0.55, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.5
  },

  // ============ Education ============
  onlineCourses: {
    name: 'الكورسات الأونلاين',
    category: 'education',
    icon: 'fa-laptop-code',
    cpm: 55, ctr: 2.6, cvr: 2.2, aov: 1200, cogs: 8,
    ltvMult: 2.4, churnRate: 0.35, seasonality: 'medium',
    competition: 'high', impulseBuy: false, avgFrequency: 2.4
  },
  languageSchool: {
    name: 'مدارس اللغات',
    category: 'education',
    icon: 'fa-language',
    cpm: 62, ctr: 2.3, cvr: 2.6, aov: 2400, cogs: 25,
    ltvMult: 2.1, churnRate: 0.30, seasonality: 'medium',
    competition: 'high', impulseBuy: false, avgFrequency: 2.6
  },
  kidsEducation: {
    name: 'التعليم للأطفال',
    category: 'education',
    icon: 'fa-child',
    cpm: 58, ctr: 2.5, cvr: 2.8, aov: 950, cogs: 22,
    ltvMult: 3.2, churnRate: 0.22, seasonality: 'medium',
    competition: 'medium', impulseBuy: false, avgFrequency: 3.2
  },

  // ============ Fitness & Beauty ============
  gym: {
    name: 'الجيم واللياقة',
    category: 'fitness',
    icon: 'fa-dumbbell',
    cpm: 52, ctr: 2.8, cvr: 3.2, aov: 1200, cogs: 30,
    ltvMult: 3.5, churnRate: 0.20, seasonality: 'medium',
    competition: 'high', impulseBuy: false, avgFrequency: 3.0
  },
  beautySalon: {
    name: 'صالونات التجميل',
    category: 'beauty',
    icon: 'fa-scissors',
    cpm: 48, ctr: 3.0, cvr: 3.6, aov: 450, cogs: 28,
    ltvMult: 4.5, churnRate: 0.15, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 4.8
  },
  barbershop: {
    name: 'حلاقين وباربر',
    category: 'beauty',
    icon: 'fa-user-tie',
    cpm: 42, ctr: 3.4, cvr: 4.2, aov: 150, cogs: 20,
    ltvMult: 6.0, churnRate: 0.10, seasonality: 'low',
    competition: 'medium', impulseBuy: true, avgFrequency: 6.5
  },

  // ============ Events & Services ============
  photography: {
    name: 'التصوير الفوتوغرافي',
    category: 'creative',
    icon: 'fa-camera',
    cpm: 88, ctr: 1.7, cvr: 1.6, aov: 6500, cogs: 22,
    ltvMult: 1.4, churnRate: 0.75, seasonality: 'high',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.4
  },
  weddingPlanning: {
    name: 'تنظيم الأفراح',
    category: 'events',
    icon: 'fa-ring',
    cpm: 95, ctr: 1.5, cvr: 1.2, aov: 25000, cogs: 40,
    ltvMult: 1.0, churnRate: 0.95, seasonality: 'high',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.0
  },
  travel: {
    name: 'السفر والرحلات',
    category: 'travel',
    icon: 'fa-plane',
    cpm: 78, ctr: 2.2, cvr: 1.8, aov: 4500, cogs: 65,
    ltvMult: 1.8, churnRate: 0.55, seasonality: 'high',
    competition: 'high', impulseBuy: false, avgFrequency: 1.8
  },
  hotel: {
    name: 'الفنادق والإقامة',
    category: 'travel',
    icon: 'fa-hotel',
    cpm: 88, ctr: 1.9, cvr: 1.6, aov: 3200, cogs: 55,
    ltvMult: 1.6, churnRate: 0.60, seasonality: 'high',
    competition: 'high', impulseBuy: false, avgFrequency: 1.6
  },

  // ============ B2B & SaaS ============
  saas: {
    name: 'SaaS والبرمجيات',
    category: 'b2b',
    icon: 'fa-cloud',
    cpm: 165, ctr: 1.3, cvr: 0.9, aov: 8500, cogs: 15,
    ltvMult: 8.5, churnRate: 0.04, seasonality: 'low',
    competition: 'high', impulseBuy: false, avgFrequency: 1.2
  },
  b2bServices: {
    name: 'خدمات B2B',
    category: 'b2b',
    icon: 'fa-handshake',
    cpm: 145, ctr: 1.4, cvr: 1.2, aov: 15000, cogs: 20,
    ltvMult: 3.8, churnRate: 0.30, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.3
  },
  manufacturing: {
    name: 'التصنيع',
    category: 'b2b',
    icon: 'fa-industry',
    cpm: 155, ctr: 1.2, cvr: 1.0, aov: 45000, cogs: 55,
    ltvMult: 3.5, churnRate: 0.25, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.2
  },

  // ============ Media & Entertainment ============
  influencer: {
    name: 'المؤثرين',
    category: 'media',
    icon: 'fa-star',
    cpm: 45, ctr: 3.2, cvr: 2.8, aov: 380, cogs: 15,
    ltvMult: 2.8, churnRate: 0.30, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 4.5
  },
  podcast: {
    name: 'البودكاست',
    category: 'media',
    icon: 'fa-microphone',
    cpm: 50, ctr: 2.4, cvr: 2.2, aov: 280, cogs: 12,
    ltvMult: 3.5, churnRate: 0.25, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 3.2
  },
  gaming: {
    name: 'الألعاب والترفيه',
    category: 'media',
    icon: 'fa-gamepad',
    cpm: 42, ctr: 3.5, cvr: 2.4, aov: 180, cogs: 25,
    ltvMult: 4.5, churnRate: 0.35, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 5.8
  },

  // ============ Financial ============
  insurance: {
    name: 'التأمين',
    category: 'finance',
    icon: 'fa-shield-halved',
    cpm: 135, ctr: 1.4, cvr: 1.5, aov: 3500, cogs: 40,
    ltvMult: 6.5, churnRate: 0.08, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 1.4
  },
  investment: {
    name: 'الاستثمار والتداول',
    category: 'finance',
    icon: 'fa-chart-line',
    cpm: 145, ctr: 1.5, cvr: 1.8, aov: 5500, cogs: 20,
    ltvMult: 5.5, churnRate: 0.15, seasonality: 'high',
    competition: 'high', impulseBuy: false, avgFrequency: 1.7
  },

  // ============ Subscription & Recurring ============
  subscription: {
    name: 'خدمات اشتراك',
    category: 'subscription',
    icon: 'fa-repeat',
    cpm: 75, ctr: 2.1, cvr: 2.0, aov: 350, cogs: 20,
    ltvMult: 12.0, churnRate: 0.05, seasonality: 'low',
    competition: 'medium', impulseBuy: false, avgFrequency: 2.5
  },
  delivery: {
    name: 'خدمات التوصيل',
    category: 'service',
    icon: 'fa-truck-fast',
    cpm: 52, ctr: 3.0, cvr: 3.5, aov: 220, cogs: 55,
    ltvMult: 5.5, churnRate: 0.18, seasonality: 'low',
    competition: 'high', impulseBuy: true, avgFrequency: 7.5
  }
};

// ============================================================
// PLATFORMS (8 platforms with detailed multipliers)
// ============================================================
export const PLATFORMS = {
  meta: {
    name: 'Meta Ads',
    icon: 'fa-facebook',
    color: '#1877F2',
    cpmMult: 1.00, ctrMult: 1.00, cvrMult: 1.00,
    audienceSize: 1.00,
    bestFor: ['sales', 'leads', 'awareness'],
    note: 'الأقوى لجميع الأهداف، حجم جمهور ضخم'
  },
  tiktok: {
    name: 'TikTok Ads',
    icon: 'fa-tiktok',
    color: '#FF0050',
    cpmMult: 0.65, ctrMult: 1.55, cvrMult: 0.60,
    audienceSize: 0.75,
    bestFor: ['awareness', 'engagement'],
    note: 'الأرخص CPM والأعلى CTR لكن ضعيف في التحويل'
  },
  google: {
    name: 'Google Ads',
    icon: 'fa-google',
    color: '#4285F4',
    cpmMult: 1.35, ctrMult: 1.15, cvrMult: 1.55,
    audienceSize: 0.85,
    bestFor: ['sales', 'leads'],
    note: 'نية شراء عالية، CVR ممتاز، لكن CPM أعلى'
  },
  youtube: {
    name: 'YouTube Ads',
    icon: 'fa-youtube',
    color: '#FF0000',
    cpmMult: 1.45, ctrMult: 0.75, cvrMult: 1.20,
    audienceSize: 0.95,
    bestFor: ['awareness', 'engagement'],
    note: 'الأفضل للفيديو الطويل والوعي'
  },
  snapchat: {
    name: 'Snapchat Ads',
    icon: 'fa-snapchat',
    color: '#FFFC00',
    cpmMult: 0.55, ctrMult: 0.85, cvrMult: 0.70,
    audienceSize: 0.55,
    bestFor: ['awareness'],
    note: 'الأرخص لكن الجمهور أصغر وأقل نية شراء'
  },
  linkedin: {
    name: 'LinkedIn Ads',
    icon: 'fa-linkedin',
    color: '#0A66C2',
    cpmMult: 3.5, ctrMult: 1.10, cvrMult: 1.60,
    audienceSize: 0.35,
    bestFor: ['leads'],
    note: 'الأفضل لـ B2B لكن الأغلى بفارق كبير'
  },
  pinterest: {
    name: 'Pinterest Ads',
    icon: 'fa-pinterest',
    color: '#E60023',
    cpmMult: 0.72, ctrMult: 1.25, cvrMult: 0.95,
    audienceSize: 0.60,
    bestFor: ['awareness', 'sales'],
    note: 'ممتاز للأزياء والديكور'
  },
  x: {
    name: 'X (Twitter) Ads',
    icon: 'fa-x-twitter',
    color: '#000000',
    cpmMult: 0.95, ctrMult: 0.85, cvrMult: 0.85,
    audienceSize: 0.45,
    bestFor: ['awareness'],
    note: 'مناسب للأخبار والترند'
  }
};

// ============================================================
// MARKETING OBJECTIVES
// ============================================================
export const OBJECTIVES = {
  awareness: {
    name: 'الوعي بالعلامة التجارية',
    icon: 'fa-bullhorn',
    cvrMult: 0.35,
    kpi: 'CPM, Reach, Video Views',
    note: 'مش مناسب لو هتقيس مبيعات',
    funnelStage: 'TOFU'
  },
  traffic: {
    name: 'زيارات الموقع',
    icon: 'fa-arrow-pointer',
    cvrMult: 0.65,
    kpi: 'CTR, CPC, Sessions',
    note: 'متوسط — يعتمد على جودة الزيارة',
    funnelStage: 'TOFU'
  },
  engagement: {
    name: 'التفاعل',
    icon: 'fa-heart',
    cvrMult: 0.45,
    kpi: 'Likes, Comments, Saves',
    note: 'مفيد للمجتمع لكن ضعيف للمبيعات',
    funnelStage: 'TOFU'
  },
  leads: {
    name: 'توليد العملاء المحتملين',
    icon: 'fa-user-plus',
    cvrMult: 1.10,
    kpi: 'CPL, Lead Quality, SQL',
    note: 'الأفضل للخدمات B2B والعيادات',
    funnelStage: 'MOFU'
  },
  sales: {
    name: 'المبيعات المباشرة',
    icon: 'fa-bag-shopping',
    cvrMult: 1.35,
    kpi: 'ROAS, CPA, AOV',
    note: 'الأفضل للتجارة الإلكترونية',
    funnelStage: 'BOFU'
  },
  appInstalls: {
    name: 'تثبيت التطبيق',
    icon: 'fa-mobile-screen-button',
    cvrMult: 0.90,
    kpi: 'CPI, ARPU',
    note: 'مناسب لتطبيقات الموبايل',
    funnelStage: 'MOFU'
  },
  catalog: {
    name: 'مبيعات الكتالوج',
    icon: 'fa-images',
    cvrMult: 1.45,
    kpi: 'ROAS, Cart Recovery',
    note: 'الأقوى للتجارة الإلكترونية',
    funnelStage: 'BOFU'
  }
};

// ============================================================
// FRAMEWORKS / THEORIES
// ============================================================
export const FRAMEWORKS = {
  aida: {
    name: 'AIDA',
    fullName: 'Attention → Interest → Desire → Action',
    icon: 'fa-layer-group',
    effectiveness: 1.10,
    bestFor: 'sales',
    description: 'الأكثر استخداماً في الإعلانات. يبني الرحلة على 4 مراحل من الوعي للتحويل.',
    stages: ['Attention', 'Interest', 'Desire', 'Action']
  },
  aarrr: {
    name: 'AARRR (Pirate Metrics)',
    fullName: 'Acquisition → Activation → Retention → Referral → Revenue',
    icon: 'fa-route',
    effectiveness: 1.25,
    bestFor: 'subscription, saas',
    description: 'الأفضل للمشاريع القائمة على الاحتفاظ. يبني نمو عضوي ومستدام.',
    stages: ['Acquisition', 'Activation', 'Retention', 'Referral', 'Revenue']
  },
  stp: {
    name: 'STP Model',
    fullName: 'Segmentation → Targeting → Positioning',
    icon: 'fa-bullseye',
    effectiveness: 1.15,
    bestFor: 'any',
    description: 'الأساس الاستراتيجي لأي حملة. يقسم السوق ويختار الجمهور الأمثل.',
    stages: ['Segmentation', 'Targeting', 'Positioning']
  },
  '4ps': {
    name: 'Marketing Mix (4Ps)',
    fullName: 'Product, Price, Place, Promotion',
    icon: 'fa-cubes',
    effectiveness: 1.05,
    bestFor: 'any',
    description: 'الإطار التسويقي الكلاسيكي لتنسيق كل عناصر التسويق.',
    stages: ['Product', 'Price', 'Place', 'Promotion']
  },
  jtbd: {
    name: 'Jobs-To-Be-Done',
    fullName: 'ما المهمة اللي العميل بيحاول يعملها؟',
    icon: 'fa-briefcase',
    effectiveness: 1.30,
    bestFor: 'saas, b2b, services',
    description: 'يركز على الوظيفة الفعلية للعميل، يتجاوز الديموغرافيا السطحية.',
    stages: ['Functional Job', 'Emotional Job', 'Social Job']
  },
  growthLoops: {
    name: 'Growth Loops',
    fullName: 'Viral → Content → Paid → Sales',
    icon: 'fa-infinity',
    effectiveness: 1.35,
    bestFor: 'saas, subscription, media',
    description: 'نمو ذاتي مستمر بدون الاعتماد على الميزانية فقط.',
    stages: ['Trigger', 'Action', 'Reward', 'Investment']
  },
  customerJourney: {
    name: 'Customer Journey',
    fullName: 'TOFU → MOFU → BOFU',
    icon: 'fa-diagram-project',
    effectiveness: 1.20,
    bestFor: 'any',
    description: 'بناء الحملات على مراحل رحلة العميل. يمنع الخلط بين المراحل.',
    stages: ['TOFU (Awareness)', 'MOFU (Consideration)', 'BOFU (Decision)']
  },
  race: {
    name: 'RACE Framework',
    fullName: 'Reach → Act → Convert → Engage',
    icon: 'fa-flag-checkered',
    effectiveness: 1.18,
    bestFor: 'any',
    description: 'إطار تسويق رقمي شامل يقيس كل مرحلة بمؤشرات خاصة.',
    stages: ['Reach', 'Act', 'Convert', 'Engage']
  },
  peso: {
    name: 'PESO Model',
    fullName: 'Paid + Earned + Shared + Owned Media',
    icon: 'fa-tower-broadcast',
    effectiveness: 1.22,
    bestFor: 'any',
    description: 'يدمج كل أنواع الميديا. نتيجته استراتيجية شاملة قوية.',
    stages: ['Paid', 'Earned', 'Shared', 'Owned']
  }
};

// ============================================================
// CHANNEL TYPES
// ============================================================
export const CHANNEL_TYPES = {
  owned: {
    name: 'Owned Media (مملوك)',
    icon: 'fa-flag',
    note: 'الموقع، البريد، المجتمع، الـ App',
    effectiveness: 1.40,
    costMult: 0.10,
    difficulty: 'low'
  },
  paid: {
    name: 'Paid Media (مدفوع)',
    icon: 'fa-sack-dollar',
    note: 'الإعلانات المدفوعة على المنصات',
    effectiveness: 1.00,
    costMult: 1.00,
    difficulty: 'medium'
  },
  earned: {
    name: 'Earned Media (مكتسب)',
    icon: 'fa-award',
    note: 'PR، توصيات، تقييمات',
    effectiveness: 1.55,
    costMult: 0.30,
    difficulty: 'high'
  },
  shared: {
    name: 'Shared Media (مشترك)',
    icon: 'fa-share-nodes',
    note: 'سوشيال، UGC، مجتمعات',
    effectiveness: 1.30,
    costMult: 0.20,
    difficulty: 'medium'
  }
};

// ============================================================
// CREATIVE TYPES
// ============================================================
export const CREATIVE_TYPES = {
  static: {
    name: 'صور ثابتة (Static)',
    icon: 'fa-image',
    mult: 0.85, costFactor: 0.5, productionTime: 1
  },
  video: {
    name: 'فيديو احترافي',
    icon: 'fa-video',
    mult: 1.15, costFactor: 2.5, productionTime: 5
  },
  ugc: {
    name: 'UGC (محتوى المستخدم)',
    icon: 'fa-mobile-screen',
    mult: 1.45, costFactor: 1.2, productionTime: 3
  },
  carousel: {
    name: 'Carousel',
    icon: 'fa-images',
    mult: 1.10, costFactor: 1.0, productionTime: 2
  },
  reels: {
    name: 'Reels قصيرة',
    icon: 'fa-film',
    mult: 1.35, costFactor: 1.5, productionTime: 2
  },
  stories: {
    name: 'Stories',
    icon: 'fa-circle-play',
    mult: 1.05, costFactor: 0.8, productionTime: 1
  },
  live: {
    name: 'بث مباشر',
    icon: 'fa-satellite-dish',
    mult: 1.20, costFactor: 0.5, productionTime: 1
  },
  mashup: {
    name: 'Mashup / Remix',
    icon: 'fa-shuffle',
    mult: 1.25, costFactor: 0.7, productionTime: 1
  }
};

// ============================================================
// HOOK QUALITY
// ============================================================
export const HOOK_QUALITY = {
  weak:     { name: 'ضعيف', mult: 0.55, note: 'تخطي سريع في 1-2 ثانية' },
  average:  { name: 'متوسط', mult: 0.85, note: 'يقف عند بعض الجمهور' },
  good:     { name: 'جيد', mult: 1.10, note: 'يجذب الانتباه في 3 ثواني' },
  strong:   { name: 'قوي', mult: 1.35, note: 'يوقف السكرول' },
  viral:    { name: 'فيروسي', mult: 1.75, note: 'ينتشر عضوياً' }
};

// ============================================================
// OFFER STRENGTH
// ============================================================
export const OFFER_STRENGTH = {
  none:        { name: 'بدون عرض', mult: 0.75, cvrDelta: 0 },
  small:       { name: 'خصم 10%', mult: 1.05, cvrDelta: 0.10 },
  medium:      { name: 'خصم 20-25%', mult: 1.20, cvrDelta: 0.25 },
  strong:      { name: 'خصم 30%+', mult: 1.35, cvrDelta: 0.40 },
  bundle:      { name: 'عرض مجمع (Bundle)', mult: 1.45, cvrDelta: 0.35 },
  freeShip:    { name: 'توصيل مجاني', mult: 1.20, cvrDelta: 0.20 },
  bogo:        { name: 'اشتر 1 خد 1', mult: 1.55, cvrDelta: 0.55 },
  exclusive:   { name: 'عرض حصري / Limited', mult: 1.30, cvrDelta: 0.30 }
};

// ============================================================
// LANDING PAGE QUALITY
// ============================================================
export const LANDING_QUALITY = {
  veryBad:   { name: 'ضعيفة جداً', mult: 0.40, cvrDelta: -0.40 },
  bad:       { name: 'ضعيفة', mult: 0.65, cvrDelta: -0.25 },
  average:   { name: 'عادية', mult: 1.00, cvrDelta: 0 },
  good:      { name: 'جيدة', mult: 1.25, cvrDelta: 0.20 },
  excellent: { name: 'احترافية', mult: 1.55, cvrDelta: 0.45 },
  worldClass: { name: 'عالمية (A/B Tested)', mult: 1.85, cvrDelta: 0.65 }
};

// ============================================================
// BIDDING STRATEGIES
// ============================================================
export const BIDDING_STRATEGY = {
  lowestCost: { name: 'Lowest Cost (آمن)', mult: 1.00, learningDays: 3 },
  costCap:    { name: 'Cost Cap (سقف التكلفة)', mult: 1.08, learningDays: 7 },
  bidCap:     { name: 'Bid Cap (سقف المزايدة)', mult: 0.85, learningDays: 10 },
  targetROAS: { name: 'Target ROAS', mult: 1.12, learningDays: 14 },
  targetCPA:  { name: 'Target CPA', mult: 1.10, learningDays: 10 }
};

// ============================================================
// OPTIMIZATION EVENTS
// ============================================================
export const OPT_EVENTS = {
  view:     { name: 'View Content', cvrMult: 0.55, learningQuality: 'low' },
  click:    { name: 'Click / Landing Page View', cvrMult: 0.85, learningQuality: 'medium' },
  atc:      { name: 'Add To Cart', cvrMult: 1.10, learningQuality: 'high' },
  lead:     { name: 'Lead / Form Submit', cvrMult: 1.20, learningQuality: 'high' },
  purchase: { name: 'Purchase', cvrMult: 1.35, learningQuality: 'veryHigh' },
  initiateCheckout: { name: 'Initiate Checkout', cvrMult: 1.25, learningQuality: 'high' }
};

// ============================================================
// TESTING METHODOLOGY
// ============================================================
export const TESTING = {
  none:         { name: 'بدون اختبار', mult: 0.75, costDelta: 0 },
  ab:           { name: 'A/B Testing', mult: 1.20, costDelta: 0.05 },
  multivariant: { name: 'Multivariate', mult: 1.35, costDelta: 0.10 },
  sequential:   { name: 'Sequential Testing', mult: 1.15, costDelta: 0.03 }
};

// ============================================================
// SCALING STRATEGIES
// ============================================================
export const SCALING = {
  conservative: { name: 'تحفظ (20%/أسبوع)', mult: 1.10, risk: 'low', maxSpendMult: 1.4 },
  balanced:     { name: 'متوازن (30%/أسبوع)', mult: 1.05, risk: 'medium', maxSpendMult: 1.8 },
  aggressive:   { name: 'هجومي (50%/أسبوع)', mult: 0.90, risk: 'high', maxSpendMult: 2.5 },
  horizontal:   { name: 'توسع أفقي (جماهير جديدة)', mult: 1.25, risk: 'low', maxSpendMult: 2.0 },
  vertical:     { name: 'توسع عمودي (زيادة ميزانية)', mult: 0.95, risk: 'medium', maxSpendMult: 3.0 },
  hybrid:       { name: 'هجين (أفقي + عمودي)', mult: 1.30, risk: 'medium', maxSpendMult: 2.5 }
};

// ============================================================
// RETENTION STRATEGIES
// ============================================================
export const RETENTION = {
  none:           { name: 'بدون استراتيجية احتفاظ', ltvMult: 1.00, note: 'خسارة طويلة الأجل' },
  email:          { name: 'Email Marketing', ltvMult: 1.35, note: 'الأرخص وأعلى ROI' },
  loyalty:        { name: 'Loyalty Program', ltvMult: 1.60, note: 'ممتاز للعلامات المتكررة' },
  community:      { name: 'Community Building', ltvMult: 1.80, note: 'الأقوى لكن يحتاج صبر' },
  crm:            { name: 'CRM + Automations', ltvMult: 1.45, note: 'أساسي للـ B2B' },
  combined:       { name: 'استراتيجية متكاملة', ltvMult: 2.20, note: 'الأفضل عالمياً' }
};

// ============================================================
// ATTRIBUTION MODELS
// ============================================================
export const ATTRIBUTION = {
  lastTouch:  { name: 'Last-Touch', bias: 'BOFU', note: 'سهل لكن يقلل قيمة TOFU' },
  firstTouch: { name: 'First-Touch', bias: 'TOFU', note: 'يبرز دور الاكتشاف' },
  linear:     { name: 'Linear', bias: 'balanced', note: 'يوزع بالتساوي' },
  timeDecay:  { name: 'Time-Decay', bias: 'MOFU', note: 'يعطي وزناً أكبر للحديث' },
  position:   { name: 'Position-Based (40/20/40)', bias: 'balanced', note: 'يعطي وزناً للأول والأخير' },
  dataDriven: { name: 'Data-Driven', bias: 'accurate', note: 'الأدق لكن يحتاج بيانات ضخمة' }
};

// ============================================================
// BUSINESS STAGES
// ============================================================
export const BUSINESS_STAGE = {
  prelaunch:   { name: 'ما قبل الإطلاق', mult: 0.55, note: 'تأسيس علامة واختبار السوق' },
  new:         { name: 'مشروع جديد (0-6 شهور)', mult: 0.75, note: 'تحتاج traction أولي' },
  growing:     { name: 'مشروع نامي (6-18 شهر)', mult: 1.00, note: 'مرحلة توسع مثالية' },
  scaling:     { name: 'مشروع متوسع (18-36 شهر)', mult: 1.15, note: 'قاعدة عملاء مستقرة' },
  established: { name: 'مشروع راسخ (3+ سنين)', mult: 1.25, note: 'علامة معروفة ومستدامة' }
};

// ============================================================
// INDUSTRY CATEGORIES (for grouping)
// ============================================================
export const CATEGORIES = {
  retail:       { name: 'تجارة تجزئة', icon: 'fa-store' },
  food:         { name: 'أغذية ومطاعم', icon: 'fa-utensils' },
  beauty:       { name: 'تجميل وعناية', icon: 'fa-spa' },
  home:         { name: 'منزل وديكور', icon: 'fa-couch' },
  luxury:       { name: 'فخامة ومجوهرات', icon: 'fa-gem' },
  realestate:   { name: 'عقارات', icon: 'fa-building' },
  auto:         { name: 'سيارات', icon: 'fa-car' },
  healthcare:   { name: 'صحة', icon: 'fa-heart-pulse' },
  professional: { name: 'خدمات احترافية', icon: 'fa-briefcase' },
  education:    { name: 'تعليم', icon: 'fa-graduation-cap' },
  fitness:      { name: 'لياقة', icon: 'fa-dumbbell' },
  creative:     { name: 'خدمات إبداعية', icon: 'fa-palette' },
  events:       { name: 'مناسبات', icon: 'fa-champagne-glasses' },
  travel:       { name: 'سفر وسياحة', icon: 'fa-plane' },
  b2b:          { name: 'B2B', icon: 'fa-handshake' },
  media:        { name: 'ميديا وترفيه', icon: 'fa-tv' },
  finance:      { name: 'خدمات مالية', icon: 'fa-dollar-sign' },
  subscription: { name: 'اشتراكات', icon: 'fa-repeat' },
  service:      { name: 'خدمات', icon: 'fa-concierge-bell' }
};

// ============================================================
// CUSTOMER JOURNEY STAGES
// ============================================================
export const JOURNEY_STAGES = {
  unaware:        { name: 'غير مدرك', desc: 'مش عارف إن عنده مشكلة' },
  problemAware:   { name: 'مدرك للمشكلة', desc: 'عارف المشكلة لكن مش الحل' },
  solutionAware:  { name: 'مدرك للحلول', desc: 'يدور على حلول' },
  productAware:   { name: 'مدرك للمنتج', desc: 'يعرف منتجك ويقارن' },
  mostAware:      { name: 'الأكثر إدراكاً', desc: 'جاهز للشراء، بس محتاج دفعة' }
};

// ============================================================
// PRICING STRATEGY
// ============================================================
export const PRICING_STRATEGY = {
  penetration:  { name: 'اختراق (Penetration)', mult: 1.20, note: 'أسعار منخفضة للسوق السريع' },
  premium:      { name: 'Premium', mult: 1.15, note: 'أسعار عالية وجودة استثنائية' },
  economy:      { name: 'اقتصادي', mult: 0.90, note: 'الأرخص في السوق' },
  value:        { name: 'قيمة (Value-Based)', mult: 1.30, note: 'السعر على أساس القيمة المقدمة' },
  skimming:     { name: 'Skimming', mult: 0.85, note: 'أسعار عالية للرواد' },
  dynamic:      { name: 'Dynamic', mult: 1.10, note: 'تسعير مرن حسب السوق' }
};

// ============================================================
// SEASONALITY
// ============================================================
export const SEASONALITY = {
  ramadan:    { name: 'رمضان', cpmMult: 1.35, cvrMult: 1.25, months: [3, 4] },
  eid:        { name: 'العيد', cpmMult: 1.40, cvrMult: 1.55, months: [4, 5] },
  backToSchool: { name: 'العودة للمدارس', cpmMult: 1.20, cvrMult: 1.40, months: [8, 9] },
  blackFriday: { name: 'الجمعة السوداء', cpmMult: 1.55, cvrMult: 1.85, months: [11] },
  christmas:  { name: 'الكريسماس', cpmMult: 1.30, cvrMult: 1.35, months: [12] },
  summer:     { name: 'الصيف', cpmMult: 1.15, cvrMult: 1.20, months: [6, 7, 8] },
  normal:     { name: 'موسم عادي', cpmMult: 1.00, cvrMult: 1.00, months: [] }
};

export function getCurrentSeason(month) {
  const m = month || (new Date().getMonth() + 1);
  for (const [key, season] of Object.entries(SEASONALITY)) {
    if (key === 'normal') continue;
    if (season.months.includes(m)) return { key, ...season };
  }
  return { key: 'normal', ...SEASONALITY.normal };
}

// ============================================================
// SCORE WEIGHTS (for final report)
// ============================================================
export const SCORE_WEIGHTS = {
  strategyQuality: 0.20,   // جودة البنية الاستراتيجية
  targeting: 0.15,          // دقة الاستهداف
  creativeQuality: 0.20,    // جودة الكرياتيف
  budgetEfficiency: 0.10,   // كفاءة الميزانية
  funnelIntegrity: 0.15,    // سلامة الفانل
  sustainability: 0.10,     // الاستدامة (Retention, LTV)
  measurement: 0.05,        // دقة القياس
  profitability: 0.05       // الربحية الفعلية
};

// ============================================================
// RISK FACTORS
// ============================================================
export const RISK_FACTORS = {
  industryCompetition: { high: 1.25, medium: 1.10, low: 1.00 },
  seasonalPeak: { high: 1.30, medium: 1.15, low: 1.05 },
  budgetShortage: { under5k: 1.40, under20k: 1.15, under100k: 1.00, over100k: 0.95 },
  platformDependency: { single: 1.35, double: 1.15, multi: 1.00 },
  creativeFatigue: { fast: 1.25, medium: 1.10, slow: 1.00 }
};

export const DEFAULT_STATE = {
  // Stage 1: Business Foundation
  foundation: {
    industry: null,
    businessStage: null,
    price: 950,
    cogs: 45,
    aov: 1100,
    pricingStrategy: null
  },
  // Stage 2: Market Analysis
  market: {
    targetMarketSize: 'national', // local, national, regional, global
    competitionLevel: 'medium',
    marketMaturity: 'growing', // emerging, growing, mature, saturated
    uniqueAdvantage: null
  },
  // Stage 3: Customer Persona
  persona: {
    ageRange: [],
    gender: 'all',
    journeyStage: 'problemAware',
    painPoints: [],
    buyingTriggers: []
  },
  // Stage 4: Objective
  objective: {
    primaryGoal: null,
    kpiTarget: 3.0,
    timelineMonths: 3
  },
  // Stage 5: Framework
  framework: {
    primary: null,
    secondary: null
  },
  // Stage 6: Channel Strategy
  channels: {
    mix: [],
    platforms: [],
    ownedMedia: [],
    contentStrategy: []
  },
  // Stage 7: Budget & Media
  budget: {
    totalBudget: 40000,
    duration: 30,
    pacing: 'even', // even, front-loaded, back-loaded
    allocations: {},
    seasonality: 'normal',
    reservePercent: 10
  },
  // Stage 8: Creative
  creative: {
    type: null,
    hook: null,
    offer: null,
    messagingAngle: null,
    variants: 3,
    productionQuality: 'medium' // low, medium, high, premium
  },
  // Stage 9: Landing & Funnel
  funnel: {
    landingQuality: null,
    funnelType: 'direct', // direct, lead-magnet, webinar, video-series
    retargetingStrategy: null,
    abandonedCart: false
  },
  // Stage 10: Optimization
  optimization: {
    bidding: null,
    event: null,
    testing: null,
    frequencyCap: 3
  },
  // Stage 11: Scaling & Retention
  scaling: {
    strategy: null,
    retention: null,
    referralProgram: false,
    upsellStrategy: null
  },
  // Stage 12: Analytics
  analytics: {
    attributionModel: null,
    trackingSetup: 'basic', // basic, advanced, world-class
    reportingCadence: 'weekly'
  }
};
