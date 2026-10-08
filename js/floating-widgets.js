// ============================================================
// Floating Widgets — WhatsApp + Exit Intent + Back to Top
// ============================================================

const EXIT_INTENT_KEY = 'exit_intent_shown';
const EXIT_INTENT_DELAY = 5000;

export function initFloatingWidgets() {
  initFloatingWhatsApp();
  initBackToTop();
  initExitIntent();
}

// ============================================================
// Floating WhatsApp Button
// ============================================================
function initFloatingWhatsApp() {
  if (document.getElementById('floatingWhatsApp')) return;

  const btn = document.createElement('a');
  btn.id = 'floatingWhatsApp';
  btn.href = 'https://wa.me/201021252183?text=مرحباً%20إسلام،%20أريد%20استشارة%20مجانية';
  btn.target = '_blank';
  btn.setAttribute('data-source', 'floating');
  btn.setAttribute('aria-label', 'تواصل عبر واتساب');
  btn.className = 'fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform';
  btn.style.animation = 'pulseWhatsApp 2s infinite';
  btn.innerHTML = '<i class="fa-brands fa-whatsapp text-2xl"></i>';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulseWhatsApp {
      0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
      50% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(btn);
}

// ============================================================
// Back to Top
// ============================================================
function initBackToTop() {
  if (document.getElementById('backToTop')) return;

  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.setAttribute('aria-label', 'العودة للأعلى');
  btn.className = 'fixed bottom-24 right-6 z-[60] w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg text-white shadow-lg flex items-center justify-center opacity-0 pointer-events-none transition-all hover:bg-white/10';
  btn.innerHTML = '<i class="fa-solid fa-arrow-up text-sm"></i>';

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
    }
  }, { passive: true });
}

// ============================================================
// Exit Intent Popup
// ============================================================
function initExitIntent() {
  if (sessionStorage.getItem(EXIT_INTENT_KEY)) return;
  if (window.location.pathname.includes('/admin/')) return;

  let shown = false;

  const showPopup = () => {
    if (shown) return;
    shown = true;
    sessionStorage.setItem(EXIT_INTENT_KEY, 'true');

    const popup = document.createElement('div');
    popup.id = 'exitIntentPopup';
    popup.className = 'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
    popup.innerHTML = `
      <div class="relative max-w-md w-full p-8 rounded-3xl bg-gradient-to-br from-[#0F0A1F] to-[#0E0B1A] border border-pink-500/30 shadow-2xl space-y-4 text-center">
        <button onclick="document.getElementById('exitIntentPopup').remove()" 
          class="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center">
          <i class="fa-solid fa-times text-sm"></i>
        </button>

        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto">
          <i class="fa-solid fa-gift text-white text-2xl"></i>
        </div>

        <h3 class="text-2xl font-bold text-white leading-snug">
          خصم <span class="text-pink-400">50%</span> على برنامج القاهرة
        </h3>

        <p class="text-sm text-slate-300 leading-relaxed">
          سجل بياناتك الآن واحصل على خصم فوري + كتاب "اقتصاديات الوحدة للتسويق" هدية مجانية
        </p>

        <a href="#course" 
           onclick="document.getElementById('exitIntentPopup').remove()"
           class="block w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm shadow-lg hover:opacity-95">
          <i class="fa-solid fa-arrow-down ml-1"></i>
          احصل على الخصم
        </a>

        <p class="text-[10px] text-slate-500">العرض ينتهي خلال 24 ساعة</p>
      </div>
    `;
    document.body.appendChild(popup);

    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.remove();
    });

    if (window.gtag) window.gtag('event', 'exit_intent_shown');
  };

  // Desktop: Mouse leaves viewport top
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0) showPopup();
  });

  // Mobile: rapid scroll up after delay
  let lastY = window.scrollY;
  let scrollUpTimer = null;

  setTimeout(() => {
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      if (lastY - currentY > 100 && currentY < 500) {
        clearTimeout(scrollUpTimer);
        scrollUpTimer = setTimeout(showPopup, 500);
      }
      lastY = currentY;
    }, { passive: true });
  }, EXIT_INTENT_DELAY);
}
