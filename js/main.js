// 1. Dark Mode Toggle
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

// 2. Language Switcher Engine (AR / EN)
const langToggleBtn = document.getElementById('langToggleBtn');
const langText = document.getElementById('langText');

const translations = {
  ar: {
    "nav-about": "المنهجية",
    "nav-brands": "شركاء النجاح",
    "nav-portfolio": "سابقة الأعمال",
    "nav-calc": "حاسبة القرار المالي",
    "nav-course": "برنامج القاهرة (20 مقعداً)",
    "nav-faq": "الأسئلة الشائعة",
    "contact-btn": "تواصل معي",
    "hero-tag": "Senior Social Media Specialist & Performance Marketer",
    "hero-title1": "إدارة الميزانيات الإعلانية الضخمة",
    "hero-title2": "بتحقيق عوائد استثمارية تصل إلى 30x ROAS",
    "hero-desc": "أنا إسلام سعيد. متخصص في تحويل ميزانيات إعلانات Meta و TikTok إلى مبيعات وأرباح صافية مستدامة.",
    "btn-course": "البرنامج الأوفلاين المكثف (القاهرة)",
    "btn-calc": "حاسبة القرار المالي للمشروع",
    "stat1": "أعلى عائد ROAS محقق",
    "stat2": "مبيعات حملة فردية (100k)",
    "stat3": "ميزانية شهرية مدارة للبراند",
    "brands-tag": "شركاء النجاح",
    "brands-title": "أكثر من 50+ علامة تجارية وضعت ثقتها في نتائجنا",
    "brands-desc": "نستعرض هنا أبرز شركاء النجاح في قطاعات المطاعم، التجارة الإلكترونية، التشطيبات والديكورات، والمأكولات"
  },
  en: {
    "nav-about": "Methodology",
    "nav-brands": "Partners",
    "nav-portfolio": "Portfolio",
    "nav-calc": "Financial Calculator",
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
    "brands-desc": "Featuring top partner logos across E-Commerce, Restaurants, Interior & Foods."
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

// 3. Current Year Footer
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

// 4. Timer Countdown
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

// 5. Brands 27 Data Array
const realBrandNames = [
  "King Burger", "ملك الشاورما", "على الشرقاوي", "الشيبي", "كبابجي فرحات الشرقاوي",
  "المتوكل", "زين الدين", "فليفر - Flavor", "يحيى العطار", "لؤلؤة الدقي",
  "محمصات الجمهورية", "Energy Sport", "B.S.T Best Soccer Teams", "Woody", "Store Leen",
  "AS International", "Nile Eagle", "360 Ballons", "Gift & Toys", "Crazy Toys",
  "B-Smart", "Luxer", "Anhagar Egypt", "Bubbleino", "Brand 25", "Brand 26", "Brand 27"
];

const brandsList = realBrandNames.map((name, index) => ({
  id: index + 1,
  name: name
}));

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

// 6. Form Submission
const form = document.getElementById('waitlistForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('subName').value;
    const phone = document.getElementById('subPhone').value;
    const budget = document.getElementById('subBudget').value;
    const challenge = document.getElementById('subChallenge').value;
    
    form.classList.add('hidden');
    document.getElementById('waitlistSuccess').classList.remove('hidden');
    
    setTimeout(() => {
      const msg = encodeURIComponent(`مرحباً إسلام، أنا ${name} أرسلت طلب ترشح للمقابلة الشخصية للبرنامج الأوفلاين في القاهرة (الدفعة المغلقة - 20 مقعداً).\n- الهاتف: ${phone}\n- الإنفاق الشهري الحالي: ${budget}\n- التحدي المطلوب حله: ${challenge}\nبانتظار تحديد موعد المقابلة.`);
      window.open(`https://wa.me/201021252183?text=${msg}`, '_blank');
    }, 1000);
  });
}

// 7. FAQ Accordion
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    const isHidden = content.classList.contains('hidden');

    document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.faq-btn i').forEach(i => i.style.transform = 'rotate(0deg)');

    if (isHidden) {
      content.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    }
  });
});

// 8. Mobile Menu
const mBtn = document.getElementById('mobileMenuBtn');
const mMenu = document.getElementById('mobileMenu');
if (mBtn && mMenu) {
  mBtn.addEventListener('click', () => mMenu.classList.toggle('hidden'));
  mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mMenu.classList.add('hidden')));
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
  renderBrandsMarquee();
});
