// ============================================================
// Quizzes Data — أسئلة الاختبارات الشاملة
// ============================================================

export const QUIZZES = {
  // ============================================================
  // FOUNDATIONS QUIZ
  // ============================================================
  quiz_foundations: {
    id: 'quiz_foundations',
    lessonId: 'f7',
    title: 'الاختبار الشامل — أساسيات التسويق',
    passingScore: 75,
    questions: [
      {
        id: 'q_f1',
        question: 'ما هو المقياس الذي يقيس تكلفة الألف ظهور للإعلان؟',
        options: ['CTR', 'CPM', 'CPC', 'CPA'],
        correctAnswer: 1, // CPM
        explanation: 'CPM (Cost Per Mille) هو تكلفة الألف ظهور.'
      },
      {
        id: 'q_f2',
        question: 'أي من هذه المراحل تمثل "Bottom of Funnel" (BOFU)؟',
        options: ['زيادة الوعي بالبراند', 'جذب الزوار للموقع', 'تحويل الزائر إلى مشتري', 'بناء قائمة بريدية'],
        correctAnswer: 2,
        explanation: 'BOFU هو أسفل الفانل، وهدفه تحويل العميل للشراء.'
      },
      {
        id: 'q_f3',
        question: 'ما هي المعادلة الصحيحة لحساب ROAS؟',
        options: ['الإيرادات ÷ الميزانية', 'الميزانية ÷ الإيرادات', 'التحويلات ÷ النقرات', 'النقرات ÷ الظهور'],
        correctAnswer: 0,
        explanation: 'ROAS = العائد على الإنفاق الإعلاني = الإيرادات ÷ الميزانية.'
      },
      {
        id: 'q_f4',
        question: 'إذا كان سعر منتجك 1000 جنيه، وتكلفته 400 جنيه، فما هو Max CAC الخاص بك (بدون تكاليف إضافية)؟',
        options: ['400 جنيه', '600 جنيه', '1000 جنيه', '1400 جنيه'],
        correctAnswer: 1,
        explanation: 'Max CAC = سعر المنتج (1000) - التكلفة (400) = 600 جنيه.'
      },
      {
        id: 'q_f5',
        question: 'أي نوع من الميديا في إطار PESO يشمل الإعلانات المدفوعة مثل Meta و Google؟',
        options: ['Earned Media', 'Shared Media', 'Owned Media', 'Paid Media'],
        correctAnswer: 3,
        explanation: 'Paid Media هي القنوات المدفوعة.'
      },
      {
        id: 'q_f6',
        question: 'ماذا يقيس الـ CTR؟',
        options: ['نسبة التحويل', 'نسبة النقر إلى الظهور', 'تكلفة الاستحواذ', 'العائد على الإنفاق'],
        correctAnswer: 1,
        explanation: 'CTR = (النقرات ÷ الظهور) × 100.'
      }
    ]
  },

  // ============================================================
  // MEDIA BUYING QUIZ
  // ============================================================
  quiz_media_buying: {
    id: 'quiz_media_buying',
    lessonId: 'mb10',
    title: 'الاختبار الشامل — إدارة الحملات الإعلانية',
    passingScore: 75,
    questions: [
      {
        id: 'q_mb1',
        question: 'ما هو الهيكل الصحيح للحملة الإعلانية؟',
        options: ['Ad > Ad Set > Campaign', 'Campaign > Ad Set > Ad', 'Campaign > Ad > Ad Set', 'Ad Set > Campaign > Ad'],
        correctAnswer: 1,
        explanation: 'الهيكل الصحيح هو Campaign (الحملة) > Ad Set (المجموعة) > Ad (الإعلان).'
      },
      {
        id: 'q_mb2',
        question: 'أي استراتيجية مزايدة تضع "سقف" لأقصى تكلفة تقبلها للتحويل؟',
        options: ['Lowest Cost', 'Bid Cap', 'Cost Cap', 'Target CPA'],
        correctAnswer: 2,
        explanation: 'Cost Cap تحدد أقصى تكلفة تقبلها (سقف التكلفة).'
      },
      {
        id: 'q_mb3',
        question: 'ماذا يحدث إذا قمت بتعديل ميزانية الحملة بشكل كبير أثناء الـ Learning Phase؟',
        options: ['تتحسن النتائج فوراً', 'تخرج الحملة من Learning Phase أسرع', 'ترجع الحملة لمرحلة التعلم من جديد وتتأخر النتائج', 'لا يحدث شيء'],
        correctAnswer: 2,
        explanation: 'التعديلات الكبيرة بتضيع التعلم اللي خوارزمية المنصة عملته، وبترجعك لنقطة الصفر.'
      },
      {
        id: 'q_mb4',
        question: 'ما هي أفضل طريقة لعمل Scaling (توسع) آمن في Meta؟',
        options: ['مضاعفة الميزانية مرة واحدة', 'زيادة الميزانية 20-30% كل 3 أيام', 'إنشاء 50 حملة في يوم', 'إيقاف الحملة يومين ثم تشغيلها'],
        correctAnswer: 1,
        explanation: 'الزيادة التدريجية (20-30% كل 3 أيام) بتمنع دخول الحملة في Learning Phase جديدة.'
      },
      {
        id: 'q_mb5',
        question: 'ما الفرق الأساسي بين CBO و ABO؟',
        options: ['CBO للميزانية الثابتة، ABO للمتغيرة', 'CBO الميزانية على مستوى الحملة، ABO على مستوى المجموعة الإعلانية', 'CBO لا يدعم الـ E-commerce', 'ABO هو الأحدث'],
        correctAnswer: 1,
        explanation: 'CBO = Campaign Budget Optimization (ميزانية الحملة). ABO = Ad Set Budget Optimization (ميزانية المجموعة).'
      },
      {
        id: 'q_mb6',
        question: 'ما هو العنصر الأهم في نجاح إعلانات TikTok؟',
        options: ['استهداف الجماهير الدقيق', 'الميزانية الضخمة', 'الكرياتيف الذي يشبه المحتوى الأصلي (Native/UGC)', 'طول الفيديو'],
        correctAnswer: 2,
        explanation: 'جمهور تيك توك يتفاعل مع المحتوى الأصلي (UGC) وليس الإعلانات التقليدية.'
      }
    ]
  },

  // ============================================================
  // ADVANCED QUIZ
  // ============================================================
  quiz_advanced: {
    id: 'quiz_advanced',
    lessonId: 'ad8',
    title: 'الاختبار الشامل — الاستراتيجيات المتقدمة',
    passingScore: 75,
    questions: [
      {
        id: 'q_ad1',
        question: 'أي نموذج Attribution يعطي 40% لأول لمسة و 40% لآخر لمسة؟',
        options: ['Linear', 'Last-Touch', 'Position-Based (U-Shape)', 'Time-Decay'],
        correctAnswer: 2,
        explanation: 'نموذج Position-Based (أو U-Shape) يعطي وزناً أكبر لأول وآخر تفاعل.'
      },
      {
        id: 'q_ad2',
        question: 'ما هي النسبة المثالية بين LTV و CAC؟',
        options: ['1:1', '2:1', '3:1', '5:1'],
        correctAnswer: 2,
        explanation: 'النسبة الذهبية هي 3:1 (أي أن العميل يجلب 3 أضعاف تكلفة استحواذه).'
      },
      {
        id: 'q_ad3',
        question: 'ما هو إطار العمل الذي يركز على "المهمة" التي يريد العميل إنجازها؟',
        options: ['AIDA', 'AARRR', 'JTBD (Jobs To Be Done)', 'PESO'],
        correctAnswer: 2,
        explanation: 'إطار JTBD يركز على الوظيفة أو المهمة التي يشتري العميل المنتج من أجلها.'
      },
      {
        id: 'q_ad4',
        question: 'كيف يمكن تقليل مخاطر حظر الحساب الإعلاني (Account Ban)؟',
        options: ['استخدام حسابات شخصية', 'استخدام Business Manager متوافق مع السياسات وحفظ نسخ احتياطية', 'تغيير الـ IP كل يوم', 'تجاهل تحذيرات المنصة'],
        correctAnswer: 1,
        explanation: 'استخدام Business Manager يقلل المخاطر، والأهم هو الالتزام بالسياسات وتجهيز حسابات بديلة.'
      }
    ]
  },

  // ============================================================
  // PLATFORM MASTERY QUIZ
  // ============================================================
  quiz_platform: {
    id: 'quiz_platform',
    lessonId: 'pm12',
    title: 'الاختبار الشامل — إتقان المنصات',
    passingScore: 75,
    questions: [
      {
        id: 'q_pm1',
        question: 'في Meta Ads، ما هو الحدث الأفضل للتحسين (Optimization Event) لحملة E-commerce تهدف للمبيعات؟',
        options: ['Link Clicks', 'Landing Page Views', 'Purchase (الشراء)', 'Add to Cart'],
        correctAnswer: 2,
        explanation: 'حدث Purchase هو الأقرب للهدف النهائي، رغم أن AddToCart قد يكون مفيداً في بداية التعلم.'
      },
      {
        id: 'q_pm2',
        question: 'في Google Search، أي نوع من مطابقة الكلمات المفتاحية (Match Types) يعرض إعلانك فقط عند البحث عن الكلمة بالضبط أو قريب جداً منها؟',
        options: ['Broad Match', 'Phrase Match', 'Exact Match', 'Negative Match'],
        correctAnswer: 2,
        explanation: 'Exact Match يعرض الإعلان فقط عند البحث عن الكلمة المفتاحية المحددة أو صيغها القريبة جداً.'
      },
      {
        id: 'q_pm3',
        question: 'ما هو نوع حملات جوجل الذي يجمع كل القنوات (Search, Display, YouTube) في حملة واحدة مدعومة بالـ AI؟',
        options: ['Shopping', 'Performance Max (PMax)', 'Search', 'Discovery'],
        correctAnswer: 1,
        explanation: 'Performance Max (PMax) هي الحملة الشاملة التي تستخدم الذكاء الاصطناعي للوصول للعملاء في جميع قنوات جوجل.'
      },
      {
        id: 'q_pm4',
        question: 'في TikTok Ads، ما هو الـ Bidding Strategy الأفضل لتحقيق تحويلات ومبيعات؟',
        options: ['CPM', 'CPV', 'oCPM (Optimized CPM)', 'CPC'],
        correctAnswer: 2,
        explanation: 'oCPM (Optimized CPM) يوجه الخوارزمية للبحث عن التحويلات وليس مجرد الظهور.'
      }
    ]
  }
};

export function getQuizData(quizId) {
  return QUIZZES[quizId] || null;
}
