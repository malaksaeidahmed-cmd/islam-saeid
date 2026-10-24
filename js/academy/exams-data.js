// ============================================================
// Exams Data — Unit Exams & Practical Exams
// ============================================================

export const EXAMS = {
  // ============================================================
  // UNIT 1 EXAM (أساسيات الأعمال)
  // ============================================================
  unit1_exam: {
    id: 'unit1_exam',
    unitId: 'unit1',
    title: 'الاختبار الشامل — الوحدة الأولى',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'ما هو المقياس الذي يقيس تكلفة الألف ظهور للإعلان؟',
        options: ['CTR', 'CPM', 'CPC', 'CPA'],
        correctAnswer: 1, // CPM
        points: 5
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'أي من هذه المراحل تمثل "Bottom of Funnel" (BOFU)؟',
        options: ['زيادة الوعي بالبراند', 'جذب الزوار للموقع', 'تحويل الزائر إلى مشتري', 'بناء قائمة بريدية'],
        correctAnswer: 2,
        points: 5
      },
      {
        id: 'q3',
        type: 'mcq',
        question: 'ما هي المعادلة الصحيحة لحساب Max CAC؟',
        options: ['سعر المنتج - تكلفة البضاعة', 'الإيرادات ÷ الإنفاق', 'التحويلات ÷ النقرات', 'النقرات ÷ الظهور'],
        correctAnswer: 0,
        points: 5
      },
      {
        id: 'q4',
        type: 'essay',
        question: 'اشرح باختصار كيف يمكن لاستخدام إطار "Jobs To Be Done" أن يغير من طريقة كتابة الإعلانات؟ اذكر مثالاً عملياً.',
        points: 15
      },
      {
        id: 'q5',
        type: 'essay',
        question: 'لديك متجر ملابس، متوسط سعر المنتج 500 جنيه، وتكلفة البضاعة 200 جنيه. احسب Max CAC الخاص بك، ثم اشرح كيف يمكن أن يؤثر هذا الرقم على قرارك عند إعداد حملة إعلانية.',
        points: 20
      }
    ]
  },

  // ============================================================
  // UNIT 2 EXAM (استراتيجية المحتوى)
  // ============================================================
  unit2_exam: {
    id: 'unit2_exam',
    unitId: 'unit2',
    title: 'الاختبار الشامل — الوحدة الثانية',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'ما هو الهدف الأساسي من محتوى TOFU (Top of Funnel)؟',
        options: ['زيادة المبيعات المباشرة', 'بناء الوعي وجذب الانتباه', 'إعادة استهداف الزوار', 'بناء قائمة بريدية'],
        correctAnswer: 1,
        points: 5
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'في إطار PAS، ماذا يمثل الحرف "A"؟',
        options: ['Action', 'Attention', 'Agitation', 'Audience'],
        correctAnswer: 2,
        points: 5
      },
      {
        id: 'q3',
        type: 'essay',
        question: 'اكتب إعلاناً قصيراً (3-4 أسطر) باستخدام إطار "PAS" لمنتج ساعة ذكية، مع التركيز على زاوية "توفير الوقت".',
        points: 15
      },
      {
        id: 'q4',
        type: 'essay',
        question: 'لماذا تعتبر الهوكات (Hooks) مهمة جداً في فيديوهات TikTok؟ اذكر 3 أنواع مختلفة من الهوكات مع مثال لكل منها.',
        points: 15
      }
    ]
  }
};

export function getExamData(examId) {
  return EXAMS[examId] || null;
}
