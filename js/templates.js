// ============================================================
// Post Templates — قوالب جاهزة للمقالات
// ============================================================

export const DEFAULT_TEMPLATES = [
  {
    id: 'how-to',
    name: 'دليل عملي (How-To)',
    icon: 'fa-book',
    description: 'قالب مقال تعليمي خطوة بخطوة',
    data: {
      title: 'كيف تفعل [الموضوع] في [الوقت]؟',
      category: 'أدوات وتقنيات',
      excerpt: 'دليل عملي مبني على تجربة حقيقية لتحقيق [النتيجة] بأقل تكلفة ممكنة.',
      content: `<h2>المقدمة</h2><p>في هذا الدليل، سنشرح خطوة بخطوة كيف تحقق [النتيجة] خلال [الوقت المحدد].</p><h2>ما ستحتاجه</h2><ul><li>أداة/مورد 1</li><li>أداة/مورد 2</li></ul><h2>الخطوة 1: [اسم الخطوة]</h2><p>شرح الخطوة...</p><h2>الخطوة 2: [اسم الخطوة]</h2><p>شرح الخطوة...</p><h2>الخطوة 3: [اسم الخطوة]</h2><p>شرح الخطوة...</p><h2>النتائج المتوقعة</h2><p>ما تتوقع رؤيته بعد تنفيذ الخطوات.</p><h2>الخلاصة</h2><p>ملخص سريع للنقاط الرئيسية.</p>`,
      keyTakeaways: ['النقطة الأولى', 'النقطة الثانية', 'النقطة الثالثة'],
      faqItems: [
        { question: 'سؤال متكرر 1؟', answer: 'الإجابة المختصرة.' },
        { question: 'سؤال متكرر 2؟', answer: 'الإجابة المختصرة.' }
      ],
      tags: ['دليل عملي', 'خطوات']
    }
  },
  {
    id: 'case-study',
    name: 'دراسة حالة (Case Study)',
    icon: 'fa-chart-line',
    description: 'قالب لعرض نتائج حملة حقيقية',
    data: {
      title: 'كيف حققنا [النتيجة] لـ [العميل] في [المدة]؟',
      category: 'دراسات حالة',
      excerpt: 'تحليل تفصيلي لحملة إعلانية حققت نتائج استثنائية، مع الأرقام والاستراتيجية الكاملة.',
      content: `<h2>نظرة عامة على العميل</h2><p>معلومات عن العميل والقطاع.</p><h2>التحدي</h2><p>ما كانت المشكلة الأساسية.</p><h2>الاستراتيجية المتبعة</h2><h3>1. تحليل الوضع المبدئي</h3><p>الخطوات الأولى.</p><h3>2. تطوير العرض</h3><p>كيف حسّنا العرض.</p><h3>3. استراتيجية الإعلانات</h3><p>تفاصيل الحملات.</p><h2>النتائج</h2><ul><li>مؤشر 1: القيمة</li><li>مؤشر 2: القيمة</li></ul><h2>الدروس المستفادة</h2><p>ما تعلمناه.</p>`,
      keyTakeaways: ['النتيجة الرئيسية', 'العامل الأساسي', 'التوصية'],
      faqItems: [],
      tags: ['دراسة حالة', 'نتائج']
    }
  },
  {
    id: 'listicle',
    name: 'قائمة (Listicle)',
    icon: 'fa-list-ol',
    description: 'قالب مقال قائمة سريع القراءة',
    data: {
      title: '[رقم] نصائح لـ [الموضوع]',
      category: 'استراتيجيات مالية',
      excerpt: 'قائمة عملية بـ [رقم] نصائح مجربة تساعدك على [الهدف].',
      content: `<p>في هذا المقال، نستعرض [رقم] نصائح عملية يمكنك تطبيقها فوراً.</p><h2>1. [النصيحة الأولى]</h2><p>شرح النصيحة.</p><h2>2. [النصيحة الثانية]</h2><p>شرح النصيحة.</p><h2>3. [النصيحة الثالثة]</h2><p>شرح النصيحة.</p><h2>4. [النصيحة الرابعة]</h2><p>شرح النصيحة.</p><h2>5. [النصيحة الخامسة]</h2><p>شرح النصيحة.</p>`,
      keyTakeaways: ['نقطة 1', 'نقطة 2'],
      faqItems: [],
      tags: ['نصائح', 'قائمة']
    }
  },
  {
    id: 'comparison',
    name: 'مقارنة (Comparison)',
    icon: 'fa-scale-balanced',
    description: 'قالب مقارنة بين خيارين أو أكثر',
    data: {
      title: '[الخيار A] vs [الخيار B]: أيهما أفضل لـ [الهدف]؟',
      category: 'أدوات وتقنيات',
      excerpt: 'مقارنة شاملة بين [A] و [B] بناءً على تجربة عملية في السوق.',
      content: `<h2>المقدمة</h2><p>لماذا هذه المقارنة مهمة.</p><h2>نظرة سريعة على [A]</h2><p>المميزات والعيوب.</p><h2>نظرة سريعة على [B]</h2><p>المميزات والعيوب.</p><h2>المقارنة التفصيلية</h2><h3>السعر</h3><p>مقارنة.</p><h3>الأداء</h3><p>مقارنة.</p><h3>سهولة الاستخدام</h3><p>مقارنة.</p><h2>التوصية النهائية</h2><p>أيهما أفضل ولمن.</p>`,
      keyTakeaways: ['التوصية الرئيسية'],
      faqItems: [],
      tags: ['مقارنة']
    }
  },
  {
    id: 'personal-story',
    name: 'تجربة شخصية',
    icon: 'fa-user',
    description: 'قالب سرد تجربة واقعية',
    data: {
      title: 'ما تعلمته من [تجربة/مشروع]',
      category: 'أخبار التسويق',
      excerpt: 'سرد شخصي لتجربة عملية والدروس المستفادة منها.',
      content: `<h2>البداية</h2><p>كيف بدأت التجربة.</p><h2>التحديات</h2><p>ما واجهته من صعوبات.</p><h2>ما فعلته</h2><p>خطواتي للتعامل مع التحديات.</p><h2>النتيجة</h2><p>ما تحقق.</p><h2>الدروس المستفادة</h2><ul><li>درس 1</li><li>درس 2</li></ul>`,
      keyTakeaways: ['درس رئيسي'],
      faqItems: [],
      tags: ['تجربة']
    }
  }
];

const STORAGE_KEY = 'cms_custom_templates';

export function getCustomTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function saveCustomTemplates(templates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function addCustomTemplate(template) {
  const all = getCustomTemplates();
  const newTemplate = {
    ...template,
    id: 'custom-' + Date.now(),
    isCustom: true
  };
  all.push(newTemplate);
  saveCustomTemplates(all);
  return newTemplate;
}

export function deleteCustomTemplate(id) {
  const filtered = getCustomTemplates().filter(t => t.id !== id);
  saveCustomTemplates(filtered);
}

export function getAllTemplates() {
  return [...DEFAULT_TEMPLATES, ...getCustomTemplates()];
}
