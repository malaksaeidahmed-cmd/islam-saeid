// ============================================================
// Units & Lessons Data — 7 Units (28 Lessons Total)
// ============================================================

export const UNITS = [
  {
    id: 'unit1',
    title: 'أساسيات الأعمال والتموضع',
    order: 1,
    icon: 'fa-briefcase',
    color: '#22c55e',
    lessons: [
      { id: 'u1_l1', title: 'منظومة الأعمال والتموضع', pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/my-website-e5b7e.firebasestorage.app/o/lessons%2Fu1_l1.pdf?alt=media', pages: 11 },
      { id: 'u1_l2', title: 'أبحاث السوق وسيكولوجية العميل', pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/my-website-e5b7e.firebasestorage.app/o/lessons%2Fu1_l2.pdf?alt=media', pages: 11 },
      { id: 'u1_l3', title: 'هندسة التموضع السوقي (USP)', pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/my-website-e5b7e.firebasestorage.app/o/lessons%2Fu1_l3.pdf?alt=media', pages: 11 },
      { id: 'u1_l4', title: 'التدقيق الرقمي للمنافسين', pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/my-website-e5b7e.firebasestorage.app/o/lessons%2Fu1_l4.pdf?alt=media', pages: 11 }
    ]
  },
  {
    id: 'unit2',
    title: 'استراتيجية المحتوى والكتابة الإعلانية',
    order: 2,
    icon: 'fa-pen-fancy',
    color: '#f97316',
    lessons: [
      { id: 'u2_l1', title: 'هندسة المسار الكامل للمحتوى', pdfUrl: '', pages: 11 },
      { id: 'u2_l2', title: 'الكتابة الإعلانية المباشرة', pdfUrl: '', pages: 11 },
      { id: 'u2_l3', title: 'هندسة خطف الانتباه (Hook Engineering)', pdfUrl: '', pages: 11 },
      { id: 'u2_l4', title: 'الإخراج الإبداعي ومحتوى المستخدم (UGC)', pdfUrl: '', pages: 11 }
    ]
  },
  {
    id: 'unit3',
    title: 'خوارزميات المنصات والنمو العضوي',
    order: 3,
    icon: 'fa-chart-network',
    color: '#d946ef',
    lessons: [
      { id: 'u3_l1', title: 'خوارزميات التوصية', pdfUrl: '', pages: 11 },
      { id: 'u3_l2', title: 'تحسين محركات البحث بالمنصات', pdfUrl: '', pages: 11 },
      { id: 'u3_l3', title: 'بناء المجتمعات الرقمية', pdfUrl: '', pages: 11 },
      { id: 'u3_l4', title: 'إدارة الأزمات الرقمية', pdfUrl: '', pages: 11 }
    ]
  },
  {
    id: 'unit4',
    title: 'الميديا باينج المتقدم (الجزء الأول)',
    order: 4,
    icon: 'fa-bullhorn',
    color: '#06b6d4',
    lessons: [
      { id: 'u4_l1', title: 'هيكلة حسابات Meta Ads', pdfUrl: '', pages: 11 },
      { id: 'u4_l2', title: 'استراتيجيات التوسع', pdfUrl: '', pages: 11 },
      { id: 'u4_l3', title: 'إعلانات TikTok و Spark Ads', pdfUrl: '', pages: 11 },
      { id: 'u4_l4', title: 'إعلانات LinkedIn و ABM', pdfUrl: '', pages: 11 }
    ]
  },
  {
    id: 'unit5',
    title: 'الاختبار العلمي والتتبع',
    order: 5,
    icon: 'fa-flask',
    color: '#8b5cf6',
    lessons: [
      { id: 'u5_l1', title: 'مصفوفة الاختبار الإبداعي', pdfUrl: '', pages: 11 },
      { id: 'u5_l2', title: 'التتبع من جانب الخادم (CAPI)', pdfUrl: '', pages: 11 },
      { id: 'u5_l3', title: 'نماذج الإسناد و MER', pdfUrl: '', pages: 11 },
      { id: 'u5_l4', title: 'لوحات التحكم في Looker Studio', pdfUrl: '', pages: 11 }
    ]
  },
  {
    id: 'unit6',
    title: 'الذكاء الاصطناعي والأتمتة',
    order: 6,
    icon: 'fa-robot',
    color: '#ec4899',
    lessons: [
      { id: 'u6_l1', title: 'هندسة الأوامر المتقدمة', pdfUrl: '', pages: 11 },
      { id: 'u6_l2', title: 'توليد الأصول البصرية والصوتية', pdfUrl: '', pages: 11 },
      { id: 'u6_l3', title: 'أتمتة المحادثات والربط بالـ CRM', pdfUrl: '', pages: 11 },
      { id: 'u6_l4', title: 'بناء وكلاء AI والأتمتة المتقدمة', pdfUrl: '', pages: 11 }
    ]
  },
  {
    id: 'unit7',
    title: 'إدارة الوكالات والجانب التجاري',
    order: 7,
    icon: 'fa-building',
    color: '#f59e0b',
    lessons: [
      { id: 'u7_l1', title: 'إعداد العروض التقديمية والبيتش ديك', pdfUrl: '', pages: 11 },
      { id: 'u7_l2', title: 'نماذج التسعير والعقود', pdfUrl: '', pages: 11 },
      { id: 'u7_l3', title: 'إدارة سير العمل وتقارير الإدارة العليا', pdfUrl: '', pages: 11 },
      { id: 'u7_l4', title: 'بناء فريق الوكالة والحماية القانونية', pdfUrl: '', pages: 11 }
    ]
  }
];

export function getUnitById(unitId) {
  return UNITS.find(u => u.id === unitId) || null;
}

export function getLessonById(lessonId) {
  for (const unit of UNITS) {
    const lesson = unit.lessons.find(l => l.id === lessonId);
    if (lesson) return { ...lesson, unitId: unit.id, unitTitle: unit.title };
  }
  return null;
}
