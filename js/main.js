// ==========================================
// 1. Theme Management (Dark / Light Mode)
// ==========================================
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  htmlEl.classList.remove('dark');
  if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-sm';
} else {
  htmlEl.classList.add('dark');
  if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-sm';
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = htmlEl.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeIcon) themeIcon.className = isDark ? 'fa-solid fa-sun text-sm' : 'fa-solid fa-moon text-sm';
  });
}

// ==========================================
// 2. Full Site Language Engine (AR / EN)
// ==========================================
const langToggleBtn = document.getElementById('langToggleBtn');
const langText = document.getElementById('langText');

const translations = {
  ar: {
    "my-name": "إسلام سعيد",
    "nav-about": "المنهجية",
    "nav-brands": "شركاء النجاح",
    "nav-portfolio": "سابقة الأعمال",
    "nav-calc": "حاسبة القرار المالي",
    "nav-blog": "المدونة والنشرات",
    "nav-course": "برنامج القاهرة (20 مقعداً)",
    "nav-faq": "الأسئلة الشائعة",
    "contact-btn": "تواصل معي",
    "hero-tag": "Senior Social Media Specialist & Performance Marketer",
    "hero-title1": "إدارة الميزانيات الإعلانية الضخمة",
    "hero-title2": "بتحقيق عوائد استثمارية تصل إلى 30x ROAS",
    "hero-desc": "أنا إسلام سعيد. متخصص في تحويل ميزانيات إعلانات Meta و TikTok إلى مبيعات وأرباح صافية مستدامة، من خلال دمج التحليل المالي لاقتصاديات الوحدة (Unit Economics) مع صناعة المحتوى الإعلاني الموجه.",
    "btn-course": "البرنامج الأوفلاين المكثف (القاهرة)",
    "btn-calc": "حاسبة القرار المالي للمشروع",
    "stat1": "أعلى عائد ROAS محقق",
    "stat2": "مبيعات حملة فردية (100k)",
    "stat3": "ميزانية شهرية مدارة للبراند",
    "brands-tag": "شركاء النجاح",
    "brands-title": "أكثر من 50+ علامة تجارية وضعت ثقتها في نتائجنا",
    "brands-desc": "نستعرض هنا أبرز شركاء النجاح في قطاعات المطاعم، التجارة الإلكترونية، التشطيبات والديكورات، والمأكولات",
    "about-tag": "المنهج الإداري",
    "about-title": "لماذا تنجح الحملات المدروسة محاسبياً وتفشل الإعلانات العشوائية؟",
    "about-desc": "الإعلانات الممولة ليست مجرد تجارب لاستهداف عشوائي؛ بل تبدأ من داخل دفاتر حسابات البيزنس. أحسب معك تكلفة كل طلب، والحد الأقصى المسموح به للشراء (Max CAC)، لنضمن أن زيادة الميزانية تؤدي إلى صافي ربح حقيقي في جيب صاحب المشروع وليس مجرد تفاعل وهمي على المنشورات.",
    "mis-deg": "نظم معلومات إدارية MIS",
    "cairo-loc": "القاهرة، مصر",
    "about-card1": "ربط مراحل التوعية وجذب الجمهور الجديد مع حملات التحويل وإعادة الاستهداف المتقدم لزوار السلات المتروكة.",
    "about-card2": "توجيه كتابة وتصوير الفيديوهات القصيرة (Reels & TikToks) لجذب انتباه العميل في أول ثانيتين وحثه المباشر على اتخاذ قرار الشراء.",
    "portfolio-tag": "سجلات أداء حقيقية",
    "portfolio-title": "نتائج حملات موثقة من مدير الإعلانات",
    "calc-tag": "الذكاء المالي واستشراف نتائج الحملات",
    "calc-title": "حاسبة القرار التسويقي واقتصاديات السوق",
    "calc-sub": "حاسبة تعتمد على معدلات الأداء الحقيقية في السوق المصري والعربي لمساعدتك في اتخاذ قرارات تسويقية واثقة.",
    "calc-industry-lbl": "اختر المجال / النشاط التجاري:",
    "calc-price-lbl": "متوسط سعر الخدمة / الطلب (ج.م):",
    "calc-budget-lbl": "الميزانية الإعلانية الشهرية (ج.م):",
    "calc-cogs-lbl": "نسبة تكلفة البضاعة/الخدمة المباشرة (%):",
    "reach-lbl-calc": "متوسط الوصول التقديري (Reach):",
    "cr-lbl-calc": "معدل التحويل المتوقع (CR%):",
    "ctr-lbl-calc": "معدل النقر للإعلان (CTR%):",
    "cpa-lbl-calc": "تكلفة الشراء/العميل المتوقعة (CPA):",
    "calc-be-lbl": "نقطة التعادل (Break-Even ROAS)",
    "calc-maxcac-lbl": "أقصى كلفة استحواذ (Max CAC)",
    "calc-netprofit-lbl": "صافي الأرباح المتوقعة:",
    "calc-netprofit-sub": "بعد خصم التكلفة والميزانية",
    "btn-plan-wa": "طلب تنفيذ هذه الخطة عبر واتساب",
    "btn-download-pdf": "تنزيل تقرير الجدوى المالي (PDF)",
    "course-tag": "أوفلاين في القاهرة | الدفعة مغلقة بـ 20 مقعداً فقط",
    "course-title-1": "معسكر الميديا باينج وتطبيق الـ",
    "course-req-title": "شرط القبول:",
    "course-req-desc": "نظراً لأن البرنامج تطبيقي ومحدود بـ 20 مقعداً فقط، لا يعتبر الحجز نهائياً إلا بعد اجتياز المقابلة الشخصية للتأكد من ملاءمة أهدافك للبرنامج.",
    "course-timer-lbl": "خصم الحجز المبكر (50%) ينتهي خلال:",
    "form-title": "طلب الترشح للمقابلة الشخصية",
    "form-desc": "سجل بياناتك لحجز أسبقية موعد المقابلة والاستفادة من خصم الـ 50%.",
    "form-name": "الاسم الكامل:",
    "form-phone": "رقم الواتساب:",
    "form-budget": "حجم إنفاقك الإعلاني الحالي:",
    "form-challenge": "التحدي الأكبر المطلوب حله في المعسكر:",
    "form-btn": "إرسال طلب الترشح للمقابلة",
    "form-success-title": "تم استلام طلبك بنجاح",
    "form-success-sub": "يتم توجيهك إلى واتساب لترتيب موعد المقابلة...",
    "faq-tag": "وضوح وشفافية",
    "faq-title": "الأسئلة الشائعة",
    "q1": "لماذا تشترط مقابلة شخصية (Interview) قبل القبول في المعسكر التدريبي؟",
    "a1": "لأن المعسكر عملي ومغلق على 20 مقعداً فقط؛ المقابلة تضمن أن خلفيتك وأهدافك ملائمة تماماً للمستوى المتقدم وتطبيق مهارات الـ Scaling.",
    "q2": "هل المنهجية وحاسبة اقتصاديات الوحدة تناسب كافة أنواع الأنشطة؟",
    "a2": "نعم، القواعد المالية لاقتصاديات الوحدة (Break-Even ROAS و Max CAC) هي ركيزة التجارة سواء في التجارة الإلكترونية، خدمات B2B، العقارات، أو قطاع الأغذية والمطاعم.",
    "q3": "ما هي أقل ميزانية إعلانية شهرية توصي بها للبدء في إدارة الحملات؟",
    "a3": "نفضل ميزانية لا تقل عن 20,000 إلى 30,000 ج.م شهرياً لضمان تدريب خوارزميات Meta و TikTok واختبار العروض والوصول إلى أداء مربح مستدام.",
    "rights": "جميع الحقوق محفوظة"
  },
  en: {
    "my-name": "Islam Saeid",
    "nav-about": "Methodology",
    "nav-brands": "Partners",
    "nav-portfolio": "Portfolio",
    "nav-calc": "Financial Calculator",
    "nav-blog": "Blog & Newsletter",
    "nav-course": "Cairo Program (20 Seats)",
    "nav-faq": "FAQ",
    "contact-btn": "Contact Me",
    "hero-tag": "Senior Social Media Specialist & Performance Marketer",
    "hero-title1": "Managing Scale Ad Budgets",
    "hero-title2": "Achieving Record Returns Up to 30x ROAS",
    "hero-desc": "I am Islam Saeid. Specialist in turning Meta & TikTok ad budgets into scalable, profitable revenue.",
    "btn-course": "Offline Intensive Program (Cairo)",
    "btn-calc": "Financial Decision Calculator",
    "stat1": "Highest ROAS Achieved",
    "stat2": "Single Campaign Sales (100k)",
    "stat3": "Monthly Managed Budget",
    "brands-tag": "Success Partners",
    "brands-title": "Over 50+ Brands Trusted Our Growth Engine",
    "brands-desc": "Featuring top partner logos across E-Commerce, Restaurants, Interior & Foods.",
    "about-tag": "Management Methodology",
    "about-title": "Why Financial-Driven Campaigns Succeed While Random Ads Fail?",
    "about-desc": "Paid ads are not random trials; they start inside the accounting books. I calculate your Max Allowable CAC to ensure ad scale turns into real net profit.",
    "mis-deg": "MIS Degree Graduate",
    "cairo-loc": "Cairo, Egypt",
    "about-card1": "Full-funnel integration connecting acquisition with retargeting.",
    "about-card2": "Creative direction for Reels & TikToks hooking attention in 2s.",
    "portfolio-tag": "Verified Case Studies",
    "portfolio-title": "Campaign Results Verified From Ad Manager",
    "calc-tag": "Financial Intelligence",
    "calc-title": "Strategic Marketing Decision Calculator",
    "calc-sub": "Driven by real MENA & Egypt market benchmark metrics.",
    "calc-industry-lbl": "Select Business Sector:",
    "calc-price-lbl": "Average Product / Service Price (EGP):",
    "calc-budget-lbl": "Monthly Proposed Ad Budget (EGP):",
    "calc-cogs-lbl": "Direct COGS / Service Cost (%):",
    "reach-lbl-calc": "Estimated Total Reach:",
    "cr-lbl-calc": "Benchmark Conversion Rate (CR%):",
    "ctr-lbl-calc": "Click Through Rate (CTR%):",
    "cpa-lbl-calc": "Estimated Acquisition Cost (CPA):",
    "calc-be-lbl": "Break-Even ROAS",
    "calc-maxcac-lbl": "Max Allowable CAC",
    "calc-netprofit-lbl": "Estimated Net Profit:",
    "calc-netprofit-sub": "After COGS and Ad Budget",
    "btn-plan-wa": "Execute This Plan via WhatsApp",
    "btn-download-pdf": "Download Feasibility Report (PDF)",
    "course-tag": "Offline in Cairo | Limited to 20 Seats",
    "course-title-1": "Media Buying Bootcamp &",
    "course-req-title": "Admission Criteria:",
    "course-req-desc": "Selection requires passing a personal interview to verify qualification.",
    "course-timer-lbl": "50% Early Bird Offer Ends In:",
    "form-title": "Apply For Candidate Interview",
    "form-desc": "Submit your info to reserve interview priority.",
    "form-name": "Full Name:",
    "form-phone": "WhatsApp Number:",
    "form-budget": "Current Monthly Ad Budget:",
    "form-challenge": "Biggest Challenge To Solve:",
    "form-btn": "Submit Application",
    "form-success-title": "Application Received Successfully",
    "form-success-sub": "Redirecting to WhatsApp for interview schedule...",
    "faq-tag": "Transparency & Clarity",
    "faq-title": "Frequently Asked Questions",
    "q1": "Why is an interview required before bootcamp admission?",
    "a1": "Because it is intensive and limited to 20 seats to guarantee maximum ROI for every accepted candidate.",
    "q2": "Does unit economics apply to all business types?",
    "a2": "Yes, Break-Even ROAS and Max CAC rules are universal across E-Commerce, B2B, Services, and Real Estate.",
    "q3": "What is the recommended minimum monthly budget?",
    "a3": "We recommend a minimum of 20,000 - 30,000 EGP monthly to properly feed Meta & TikTok algorithms.",
    "rights": "All Rights Reserved"
  }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  htmlEl.setAttribute('lang', lang);
  htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  if (langText) langText.textContent = lang === 'ar' ? 'EN' : 'عربي';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
  });
}

// ==========================================
// 3. Current Year & Countdown Timer
// ==========================================
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

let secondsLeft = 48 * 3600;
const timerEl = document.getElementById('earlyBirdTimer');
if (timerEl) {
  setInterval(() => {
    if (secondsLeft > 0) secondsLeft--;
    const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
    const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ==========================================
// 4. Brands Marquee Render Engine
// ==========================================
const realBrandNames = [
  "King Burger", "ملك الشاورما", "على الشرقاوي", "الشيبي", "كبابجي فرحات الشرقاوي",
  "المتوكل", "زين الدين", "فليفر - Flavor", "يحيى العطار", "لؤلؤة الدقي",
  "محمصات الجمهورية", "Energy Sport", "B.S.T Best Soccer Teams", "Woody", "Store Leen",
  "AS International", "Nile Eagle", "360 Ballons", "Gift & Toys", "Crazy Toys",
  "B-Smart", "Luxer", "Anhagar Egypt", "Bubbleino", "Brand 25", "Brand 26", "Brand 27"
];

const brandsList = realBrandNames.map((name, index) => ({ id: index + 1, name: name }));

function renderBrandsMarquee() {
  const group1 = document.getElementById('brandsMarqueeGroup1');
  const group2 = document.getElementById('brandsMarqueeGroup2');

  if (!group1 || !group2) return;

  const htmlContent = brandsList.map(brand => `
    <div class="brand-card w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/[0.03] border border-white/10 p-3 flex items-center justify-center flex-shrink-0 hover:border-brand-orange/50 transition-all group relative">
      <img 
        src="assets/${brand.id}.webp" 
        alt="${brand.name}" 
        class="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-300" 
        loading="lazy" 
        onError="this.onerror=null; this.src='assets/${brand.id}.png';" 
      />
      <span class="absolute -bottom-2 bg-black/90 text-[9px] text-slate-300 px-2 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
        ${brand.name}
      </span>
    </div>
  `).join('');

  group1.innerHTML = htmlContent;
  group2.innerHTML = htmlContent;
}

// ==========================================
// 5. Initializations & Cloud Sync
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
  renderBrandsMarquee();

  if (window.cmsEngine) {
    window.cmsEngine.trackVisit();
    window.cmsEngine.renderPortfolio('dynamicPortfolioGrid');
  }
});

// ==========================================
// 6. Form Submission, Accordions & Navigation
// ==========================================
const form = document.getElementById('waitlistForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('subName').value;
    const phone = document.getElementById('subPhone').value;
    const budget = document.getElementById('subBudget').value;
    const challenge = document.getElementById('subChallenge').value;
    
    if (window.cmsEngine) {
      window.cmsEngine.logEvent('Bootcamp Lead', `Applied: ${name} (${phone})`);
    }

    form.classList.add('hidden');
    document.getElementById('waitlistSuccess').classList.remove('hidden');
    
    setTimeout(() => {
      const msg = encodeURIComponent(`مرحباً إسلام، أنا ${name} أرسلت طلب ترشح للمقابلة الشخصية للبرنامج الأوفلاين في القاهرة (الدفعة المغلقة - 20 مقعداً).\n- الهاتف: ${phone}\n- الإنفاق الشهري الحالي: ${budget}\n- التحدي المطلوب حله: ${challenge}\nبانتظار تحديد موعد المقابلة.`);
      window.open(`https://wa.me/201021252183?text=${msg}`, '_blank');
    }, 1000);
  });
}

// FAQ Accordion
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    const isHidden = content.classList.contains('hidden');

    document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.faq-btn i').forEach(i => i.style.transform = 'rotate(0deg)');

    if (isHidden) {
      content.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    }
  });
});

// Mobile Navigation Toggle
const mBtn = document.getElementById('mobileMenuBtn');
const mMenu = document.getElementById('mobileMenu');
if (mBtn && mMenu) {
  mBtn.addEventListener('click', () => mMenu.classList.toggle('hidden'));
  mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mMenu.classList.add('hidden')));
}
