export const COURSE_CATEGORIES = {
  m1_business: { name: 'أساسيات الأعمال والتموضع', icon: 'fa-briefcase', color: '#22c55e' },
  m2_content: { name: 'استراتيجية المحتوى والسرد', icon: 'fa-pen-nib', color: '#3b82f6' },
  m3_algorithms: { name: 'خوارزميات المنصات والنمو', icon: 'fa-microchip', color: '#8b5cf6' },
  m4_media_buying: { name: 'الميديا باينج المتقدم', icon: 'fa-chart-line', color: '#f97316' },
  m5_tracking: { name: 'التتبع والتحليلات والإسناد', icon: 'fa-satellite-dish', color: '#06b6d4' },
  m6_ai: { name: 'الذكاء الاصطناعي والأتمتة', icon: 'fa-robot', color: '#ec4899' },
  m7_agency: { name: 'إدارة الوكالات والجانب التجاري', icon: 'fa-building', color: '#f59e0b' }
};

export const COURSES = [
  {
    id: 'm1', title: 'المحور الأول: أساسيات الأعمال والتموضع', category: 'm1_business', level: 'beginner', icon: 'fa-briefcase', color: '#22c55e', duration: '4 ساعات', order: 1,
    lessons: [
      { id: 'm1_l1', title: 'اقتصاديات الوحدة والتموضع', order: 1, duration: 45, type: 'theory' },
      { id: 'm1_l2', title: 'أبحاث السوق وإطار JTBD', order: 2, duration: 50, type: 'theory' },
      { id: 'm1_l3', title: 'هندسة التموضع و USP', order: 3, duration: 45, type: 'theory' },
      { id: 'm1_l4', title: 'التدقيق الرقمي للمنافسين', order: 4, duration: 60, type: 'theory' }
    ]
  },
  {
    id: 'm2', title: 'المحور الثاني: استراتيجية المحتوى والسرد الإقناعي', category: 'm2_content', level: 'intermediate', icon: 'fa-pen-nib', color: '#3b82f6', duration: '4 ساعات', order: 2,
    lessons: [
      { id: 'm2_l5', title: 'هندسة المسار الكامل للمحتوى', order: 1, duration: 45, type: 'theory' },
      { id: 'm2_l6', title: 'الكتابة الإعلانية المباشرة', order: 2, duration: 50, type: 'theory' },
      { id: 'm2_l7', title: 'هندسة خطف الانتباه والـ Hooks', order: 3, duration: 45, type: 'theory' },
      { id: 'm2_l8', title: 'الإخراج الإبداعي ومحتوى UGC', order: 4, duration: 60, type: 'theory' }
    ]
  },
  {
    id: 'm3', title: 'المحور الثالث: خوارزميات المنصات والنمو العضوي', category: 'm3_algorithms', level: 'intermediate', icon: 'fa-microchip', color: '#8b5cf6', duration: '4 ساعات', order: 3,
    lessons: [
      { id: 'm3_l9', title: 'التشريح الهندسي لخوارزميات التوصية', order: 1, duration: 45, type: 'theory' },
      { id: 'm3_l10', title: 'تحسين محركات البحث Social SEO', order: 2, duration: 40, type: 'theory' },
      { id: 'm3_l11', title: 'بناء المجتمعات الرقمية', order: 3, duration: 45, type: 'theory' },
      { id: 'm3_l12', title: 'إدارة الأزمات الرقمية Crisis PR', order: 4, duration: 50, type: 'theory' }
    ]
  },
  {
    id: 'm4', title: 'المحور الرابع: الإعلانات الممولة والميديا باينج', category: 'm4_media_buying', level: 'advanced', icon: 'fa-chart-line', color: '#f97316', duration: '5 ساعات', order: 4,
    lessons: [
      { id: 'm4_l13', title: 'هيكلة حسابات Meta Ads الحديثة', order: 1, duration: 60, type: 'theory' },
      { id: 'm4_l14', title: 'استراتيجيات التوسع الرأسي والأفقي', order: 2, duration: 60, type: 'theory' },
      { id: 'm4_l15', title: 'منظومة إعلانات TikTok و Spark Ads', order: 3, duration: 60, type: 'theory' },
      { id: 'm4_l16', title: 'إعلانات LinkedIn والـ ABM', order: 4, duration: 60, type: 'theory' },
      { id: 'm4_l17', title: 'مصفوفة الاختبار الإبداعي العلمي DCT', order: 5, duration: 60, type: 'theory' }
    ]
  },
  {
    id: 'm5', title: 'المحور الخامس: التتبع والتحليلات والإسناد', category: 'm5_tracking', level: 'advanced', icon: 'fa-satellite-dish', color: '#06b6d4', duration: '3 ساعات', order: 5,
    lessons: [
      { id: 'm5_l18', title: 'التتبع من جانب الخادم Meta CAPI', order: 1, duration: 60, type: 'theory' },
      { id: 'm5_l19', title: 'نماذج الإسناد وقياس MER', order: 2, duration: 60, type: 'theory' },
      { id: 'm5_l20', title: 'بناء لوحات التحكم Looker Studio', order: 3, duration: 60, type: 'theory' }
    ]
  },
  {
    id: 'm6', title: 'المحور السادس: الذكاء الاصطناعي والأتمتة', category: 'm6_ai', level: 'advanced', icon: 'fa-robot', color: '#ec4899', duration: '3 ساعات', order: 6,
    lessons: [
      { id: 'm6_l21', title: 'هندسة الأوامر المتقدمة Prompt Engineering', order: 1, duration: 60, type: 'theory' },
      { id: 'm6_l22', title: 'توليد الأصول البصرية والصوتية', order: 2, duration: 60, type: 'theory' },
      { id: 'm6_l23', title: 'أتمتة المحادثات وربط CRM', order: 3, duration: 60, type: 'theory' }
    ]
  },
  {
    id: 'm7', title: 'المحور السابع: إدارة الوكالات والجانب التجاري', category: 'm7_agency', level: 'advanced', icon: 'fa-building', color: '#f59e0b', duration: '3 ساعات', order: 7,
    lessons: [
      { id: 'm7_l24', title: 'إعداد العروض التقديمية والبيتش ديك', order: 1, duration: 60, type: 'theory' },
      { id: 'm7_l25', title: 'نماذج التسعير والعقود', order: 2, duration: 60, type: 'theory' },
      { id: 'm7_l26', title: 'إدارة سير العمل وتقارير C-Level', order: 3, duration: 60, type: 'theory' }
    ]
  }
];

export function getCourseById(courseId) {
  return COURSES.find(c => c.id === courseId) || null;
}

export function getLessonById(lessonId) {
  for (const course of COURSES) {
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (lesson) return { ...lesson, courseId: course.id, courseTitle: course.title };
  }
  return null;
}

export function getNextLesson(currentLessonId) {
  const current = getLessonById(currentLessonId);
  if (!current) return null;
  const course = getCourseById(current.courseId);
  const idx = course.lessons.findIndex(l => l.id === currentLessonId);
  if (idx === -1 || idx === course.lessons.length - 1) {
    // لو خلص المحور، يروح لأول درس في المحور اللي بعده
    const nextCourseIdx = COURSES.findIndex(c => c.id === course.id) + 1;
    if (nextCourseIdx < COURSES.length) {
      return COURSES[nextCourseIdx].lessons[0];
    }
    return null;
  }
  return course.lessons[idx + 1];
}

export function getCourseProgress(courseId, completedLessons = []) {
  const course = getCourseById(courseId);
  if (!course) return { completed: 0, total: 0, percent: 0 };
  const total = course.lessons.length;
  const completed = course.lessons.filter(l => completedLessons.includes(l.id)).length;
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}
