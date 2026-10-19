// ============================================================
// UI Components — Modals, Toasts, Loading, Confirm
// ============================================================

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ============================================================
// Toast Notifications
// ============================================================
export function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position: fixed; top: 20px; left: 20px; z-index: 99998; display: flex; flex-direction: column; gap: 10px; max-width: 380px;';
    document.body.appendChild(container);
  }

  const colors = {
    success: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', text: '#86efac', icon: 'fa-circle-check' },
    error: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#fca5a5', icon: 'fa-circle-xmark' },
    warning: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', text: '#fcd34d', icon: 'fa-triangle-exclamation' },
    info: { bg: 'rgba(124,58,237,0.15)', border: '#7c3aed', text: '#c4b5fd', icon: 'fa-circle-info' }
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${c.bg};
    border: 1px solid ${c.border};
    color: ${c.text};
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    transform: translateX(-120%);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;
  toast.innerHTML = `<i class="fa-solid ${c.icon}" style="font-size:16px;"></i><span style="flex:1;">${escapeHtml(message)}</span><button style="background:none;border:none;color:inherit;cursor:pointer;padding:0 4px;font-size:14px;">✕</button>`;

  const dismiss = () => {
    toast.style.transform = 'translateX(-120%)';
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('button').addEventListener('click', dismiss);
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return { dismiss };
}

// ============================================================
// Loading Overlay
// ============================================================
let loadingCount = 0;

export function showLoading(message = 'جاري التحميل...') {
  loadingCount++;
  let overlay = document.getElementById('globalLoading');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'globalLoading';
    overlay.style.cssText = 'position: fixed; inset: 0; z-index: 99997; background: rgba(7,6,14,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center;';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 16px; background: linear-gradient(135deg, #7c3aed, #d946ef); display: flex; align-items: center; justify-content: center;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; color: white;"></i>
      </div>
      <p style="color: #cbd5e1; font-size: 14px;">${escapeHtml(message)}</p>
    </div>
  `;
  overlay.style.display = 'flex';
}

export function hideLoading() {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    const overlay = document.getElementById('globalLoading');
    if (overlay) overlay.style.display = 'none';
  }
}

// ============================================================
// Modal
// ============================================================
export function showModal(options = {}) {
  const {
    title = '',
    content = '',
    size = 'md',
    buttons = [{ label: 'حسناً', type: 'primary', action: 'close' }],
    onClose = null,
    closable = true
  } = options;

  const sizes = {
    sm: 'max-width: 380px;',
    md: 'max-width: 560px;',
    lg: 'max-width: 800px;',
    xl: 'max-width: 1100px;'
  };

  const modalId = 'modal_' + Date.now();
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.style.cssText = 'position: fixed; inset: 0; z-index: 99996; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px;';

  modal.innerHTML = `
    <div style="background: #0E0B1A; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; ${sizes[size] || sizes.md} max-height: 90vh; overflow-y: auto;">
      ${title ? `
        <div style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
          <h3 style="color: white; font-size: 16px; font-weight: bold; margin: 0;">${escapeHtml(title)}</h3>
          ${closable ? `<button data-modal-close style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 20px; padding: 4px;">✕</button>` : ''}
        </div>
      ` : ''}
      <div style="padding: 24px; color: #cbd5e1; font-size: 14px; line-height: 1.7;">${content}</div>
      ${buttons.length ? `
        <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-end; gap: 8px;">
          ${buttons.map((b, i) => `
            <button data-btn-index="${i}" style="padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: bold; border: none; cursor: pointer; ${
              b.type === 'primary' 
                ? 'background: linear-gradient(135deg, #7c3aed, #d946ef); color: white;' 
                : b.type === 'danger'
                  ? 'background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4);'
                  : 'background: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1);'
            }">${escapeHtml(b.label)}</button>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.remove();
    if (onClose) onClose();
  };

  modal.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', close);
  });

  modal.querySelectorAll('[data-btn-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.btnIndex, 10);
      const b = buttons[idx];
      if (b.action === 'close' || !b.action) {
        close();
      } else if (typeof b.action === 'function') {
        const result = b.action();
        if (result !== false) close();
      }
    });
  });

  if (closable) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  return { close, element: modal };
}

// ============================================================
// Confirm Dialog
// ============================================================
export function showConfirm(options = {}) {
  return new Promise((resolve) => {
    const {
      title = 'تأكيد',
      message = 'هل أنت متأكد؟',
      confirmLabel = 'تأكيد',
      cancelLabel = 'إلغاء',
      type = 'danger'
    } = options;

    showModal({
      title,
      content: `<p style="margin:0;">${escapeHtml(message)}</p>`,
      size: 'sm',
      buttons: [
        { label: cancelLabel, type: 'secondary', action: () => { resolve(false); } },
        { label: confirmLabel, type, action: () => { resolve(true); } }
      ],
      onClose: () => resolve(false)
    });
  });
}

// ============================================================
// Skeleton Loader
// ============================================================
export function skeletonLoader(lines = 3) {
  return Array.from({ length: lines }, (_, i) => `
    <div class="skeleton" style="height: ${i === 0 ? '24px' : '14px'}; width: ${i === 0 ? '60%' : (100 - i * 10) + '%'}; margin-bottom: 12px; border-radius: 6px; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% 100%; animation: skeletonAnim 1.5s infinite;"></div>
  `).join('');
}

// Add skeleton animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes skeletonAnim { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }`;
  document.head.appendChild(style);
}
