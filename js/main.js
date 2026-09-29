// 1. التبديل بين الدارك مود واللايت مود
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

// 2. تحديث السنة الحالية
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

// 3. عداد انتهاء الحجز المبكر (48 ساعة)
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

// 4. تحميل وعرض البراندات الـ 27 تلقائياً من مجلد assets
const brandNames = [
  "King Burger", "ملك الشاورما", "على الشرقاوي", "الشيبي", "كبابجي فرحات الشرقاوي",
  "المتوكل", "زين الدين", "فليفر - Flavor", "يحيى العطار", "زمزم"
];

const brandsList = [];
for (let i = 1; i <= 27; i++) {
  brandsList.push({
    id: i,
    name: brandNames[i - 1] || `Partner ${i}`,
    ext: [1, 3, 5, 9, 10].includes(i) ? "jpg" : "png"
  });
}

function renderBrands() {
  const marqueeContainer = document.getElementById('brandsMarquee');
  const gridContainer = document.getElementById('brandsGrid');

  if (!marqueeContainer || !gridContainer) return;

  // 1. الشريط المتحرك
  const doubleBrands = [...brandsList, ...brandsList];
  marqueeContainer.innerHTML = doubleBrands.map(brand => `
    <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.03] border border-white/10 p-2.5 flex items-center justify-center flex-shrink-0 hover:border-brand-orange/50 hover:bg-white/5 transition-all group">
      <img src="assets/${brand.id}.${brand.ext}" alt="${brand.name}" class="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300" loading="lazy" onError="this.onerror=null; this.src='assets/${brand.id}.${brand.ext === 'jpg' ? 'png' : 'jpg'}';" />
    </div>
  `).join('');

  // 2. الشبكة التفاعلية
  gridContainer.innerHTML = brandsList.map(brand => `
    <div class="aspect-square rounded-xl bg-white/[0.02] border border-white/5 p-2.5 flex items-center justify-center hover:border-brand-magenta/40 hover:bg-white/5 transition-all group relative">
      <img src="assets/${brand.id}.${brand.ext}" alt="${brand.name}" class="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300" loading="lazy" onError="this.onerror=null; this.src='assets/${brand.id}.${brand.ext === 'jpg' ? 'png' : 'jpg'}';" />
      <span class="absolute -bottom-2 bg-black/90 text-[9px] text-slate-300 px-1.5 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">${brand.name}</span>
    </div>
  `).join('');
}

// 5. نموذج التقديم لكورس القاهرة
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

// 6. الأكورديون للأسئلة الشائعة
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

// 7. قائمة الموبايل
const mBtn = document.getElementById('mobileMenuBtn');
const mMenu = document.getElementById('mobileMenu');
if (mBtn && mMenu) {
  mBtn.addEventListener('click', () => mMenu.classList.toggle('hidden'));
  mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mMenu.classList.add('hidden')));
}

document.addEventListener('DOMContentLoaded', renderBrands);
