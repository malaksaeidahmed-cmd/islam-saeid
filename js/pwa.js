// ============================================================
// PWA — Service Worker + Install Prompt
// ============================================================

let deferredPrompt = null;

export function initPWA() {
  registerServiceWorker();
  setupInstallPrompt();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (window.location.protocol !== 'https:') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[PWA] Service Worker registered'))
      .catch(err => console.warn('[PWA] SW registration failed:', err));
  });
}

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show banner after 30 seconds
    setTimeout(() => {
      showInstallBanner();
    }, 30000);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    document.getElementById('pwaInstallBanner')?.remove();
    if (window.gtag) window.gtag('event', 'pwa_installed');
  });
}

function showInstallBanner() {
  if (!deferredPrompt) return;
  if (document.getElementById('pwaInstallBanner')) return;
  if (sessionStorage.getItem('pwa_banner_dismissed')) return;

  const banner = document.createElement('div');
  banner.id = 'pwaInstallBanner';
  banner.className = 'fixed bottom-6 left-6 z-[70] max-w-xs p-4 rounded-2xl bg-[#0E0B1A] border border-purple-500/40 shadow-2xl flex items-start gap-3';
  banner.innerHTML = `
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
      <i class="fa-solid fa-mobile-screen text-white"></i>
    </div>
    <div class="flex-1 min-w-0">
      <div class="text-white font-bold text-sm mb-1">ثبّت الموقع كتطبيق</div>
      <div class="text-[11px] text-slate-400 leading-relaxed mb-3">وصول أسرع + تصفح بدون إنترنت</div>
      <div class="flex gap-2">
        <button id="pwaInstallBtn" class="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] font-bold">
          <i class="fa-solid fa-download ml-1"></i> تثبيت
        </button>
        <button id="pwaDismissBtn" class="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-[11px]">
          لاحقاً
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('pwaInstallBtn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (window.gtag) window.gtag('event', 'pwa_install_prompt', { outcome });
    deferredPrompt = null;
    banner.remove();
  });

  document.getElementById('pwaDismissBtn')?.addEventListener('click', () => {
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
    banner.remove();
  });
}
