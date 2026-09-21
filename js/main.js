// 0. Theme Toggle (التبديل بين الدارك مود واللايت مود)
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeToggleBtnMobile = document.getElementById('themeToggleBtnMobile');
const themeIcon = document.getElementById('themeIcon');
const themeIconMobile = document.getElementById('themeIconMobile');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  htmlEl.classList.remove('dark');
  updateIcons(false);
} else {
  htmlEl.classList.add('dark');
  updateIcons(true);
}

function updateIcons(isDark) {
  const iconClass = isDark ? 'fa-sun' : 'fa-moon';
  if (themeIcon) themeIcon.className = `fa-solid ${iconClass} text-base`;
  if (themeIconMobile) themeIconMobile.className = `fa-solid ${iconClass} text-sm`;
}

function toggleTheme() {
  const isDark = htmlEl.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateIcons(isDark);
}

if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (themeToggleBtnMobile) themeToggleBtnMobile.addEventListener('click', toggleTheme);

// 1. Splash Screen إخفاء فوري لشاشة البداية
window.addEventListener('load', () => {
  const splash = document.getElementById('introSplash');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
      setTimeout(() => splash.remove(), 400);
    }, 250);
  }
});

// 2. تحديث السنة
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// 3. شريط تقدم التمرير
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progressBar = document.getElementById('progressBar');
  if (progressBar && height > 0) {
    progressBar.style.width = ((winScroll / height) * 100) + '%';
  }
}, { passive: true });

// 4. مؤشر الماوس
const cursorDot = document.getElementById('cursorDot');
const cursorCircle = document.getElementById('cursorCircle');
if (window.innerWidth >= 1024 && cursorDot && cursorCircle) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorCircle.style.left = `${e.clientX}px`;
    cursorCircle.style.top = `${e.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('a, button, input, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorCircle.style.width = '44px';
      cursorCircle.style.height = '44px';
      cursorCircle.style.borderColor = '#F97316';
    });
    el.addEventListener('mouseleave', () => {
      cursorCircle.style.width = '30px';
      cursorCircle.style.height = '30px';
      cursorCircle.style.borderColor = 'rgba(217, 70, 239, 0.65)';
    });
  });
}

// 5. عدادات الأرقام التفاعلية
const counters = document.querySelectorAll('.counter');
let counted = false;
window.addEventListener('scroll', () => {
  const hero = document.getElementById('home');
  if (hero && hero.getBoundingClientRect().top <= window.innerHeight && !counted) {
    counters.forEach(c => {
      const target = +c.getAttribute('data-target');
      let val = 0;
      const inc = target / 25;
      const run = () => {
        val += inc;
        if (val < target) {
          c.innerText = Math.ceil(val);
          setTimeout(run, 25);
        } else {
          c.innerText = target;
        }
      };
      run();
    });
    counted = true;
  }
}, { passive: true });

// 6. عداد الحجز المبكر (48 ساعة)
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

// 7. إشعار المقابلة (يظهر مرتين فقط للزائر)
const ticker = document.getElementById('interviewTicker');
if (ticker) {
  let countTicker = 0;
  const tInterval = setInterval(() => {
    if (countTicker < 2) {
      ticker.classList.remove('opacity-0', 'translate-y-4');
      setTimeout(() => ticker.classList.add('opacity-0', 'translate-y-4'), 3500);
      countTicker++;
    } else {
      clearInterval(tInterval);
    }
  }, 10000);
}

// 8. نموذج التسجيل ونقل البيانات لواتساب
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
      const text = encodeURIComponent(`مرحباً إسلام، أنا ${name} أرسلت طلب ترشح للمقابلة الشخصية للبرنامج الأوفلاين في القاهرة (الدفعة المحدودة - 20 مقعداً).\n- رقمي: ${phone}\n- ميزانيتي الشهرية الحالية: ${budget}\n- التحدي المطلوب حله: ${challenge}\nبانتظار تحديد موعد المقابلة.`);
      window.open(`https://wa.me/201021252183?text=${text}`, '_blank');
    }, 1000);
  });
}

// 9. قائمة الموبايل
const mBtn = document.getElementById('mobileMenuBtn');
const mMenu = document.getElementById('mobileMenu');
if (mBtn && mMenu) {
  mBtn.addEventListener('click', () => mMenu.classList.toggle('hidden'));
  mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mMenu.classList.add('hidden')));
}

// 10. تفاعلية أكورديون الأسئلة الشائعة (FAQ Accordion)
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

    document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = '0px');
    document.querySelectorAll('.faq-btn i').forEach(i => i.style.transform = 'rotate(0deg)');

    if (!isOpen) {
      content.style.maxHeight = content.scrollHeight + 'px';
      icon.style.transform = 'rotate(180deg)';
    }
  });
});
