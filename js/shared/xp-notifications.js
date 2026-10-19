// ============================================================
// XP Notifications — XP Gains, Level Ups, Badges
// ============================================================

import { triggerConfetti, triggerSmallConfetti } from './confetti.js';
import { escapeHtml } from './ui-components.js';

// ============================================================
// XP Gain Notification
// ============================================================
export function showXPGain(amount, reason = '') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 99995;
    background: linear-gradient(135deg, rgba(124,58,237,0.95), rgba(217,70,239,0.95));
    color: white;
    padding: 14px 20px;
    border-radius: 16px;
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 32px rgba(217,70,239,0.4);
    transform: translateX(150%) scale(0.8);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  `;
  notification.innerHTML = `
    <div style="width: 32px; height: 32px; border-radius: 10px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
      <i class="fa-solid fa-star" style="font-size: 14px;"></i>
    </div>
    <div>
      <div style="font-size: 16px; font-weight: 800;">+${amount} XP</div>
      ${reason ? `<div style="font-size: 10px; opacity: 0.9;">${escapeHtml(reason)}</div>` : ''}
    </div>
  `;

  document.body.appendChild(notification);
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0) scale(1)';
  });

  setTimeout(() => {
    notification.style.transform = 'translateX(150%) scale(0.8)';
    setTimeout(() => notification.remove(), 400);
  }, 3000);

  triggerSmallConfetti();
}

// ============================================================
// Level Up Notification (Full Screen Celebration)
// ============================================================
export function showLevelUp(newLevel, levelName) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99997;
    background: rgba(7,6,14,0.95);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  overlay.innerHTML = `
    <div style="text-align: center; max-width: 480px; transform: scale(0.7); transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);" id="levelUpContent">
      <div style="width: 120px; height: 120px; margin: 0 auto 24px; border-radius: 32px; background: linear-gradient(135deg, #7c3aed, #d946ef); display: flex; align-items: center; justify-content: center; animation: levelPulse 2s infinite;">
        <i class="fa-solid fa-trophy" style="font-size: 56px; color: white;"></i>
      </div>
      <div style="font-size: 14px; color: #d946ef; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px;">LEVEL UP!</div>
      <div style="font-size: 72px; font-weight: 900; background: linear-gradient(135deg, #d946ef, #f97316); -webkit-background-clip: text; background-clip: text; color: transparent; font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1;">
        ${newLevel}
      </div>
      <div style="font-size: 24px; color: white; font-weight: bold; margin-top: 8px; margin-bottom: 8px;">${escapeHtml(levelName)}</div>
      <div style="font-size: 13px; color: #94a3b8; line-height: 1.7; margin-bottom: 24px;">مبروك! وصلت لمستوى جديد. استمر في التقدم لفتح المزيد من التحديات والمزايا.</div>
      <button id="levelUpClose" style="padding: 12px 32px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #d946ef); color: white; border: none; font-weight: bold; font-size: 14px; cursor: pointer; font-family: inherit;">
        <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i> استمر
      </button>
    </div>
    <style>
      @keyframes levelPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.5); }
        50% { box-shadow: 0 0 0 30px rgba(217, 70, 239, 0); }
      }
    </style>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    const content = overlay.querySelector('#levelUpContent');
    if (content) content.style.transform = 'scale(1)';
  });

  triggerConfetti({ particleCount: 200, duration: 4000, spread: 120 });

  const close = () => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('#levelUpClose').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

// ============================================================
// Badge Unlock Notification
// ============================================================
export function showBadgeUnlock(badge) {
  const rarityStyles = {
    common: { bg: '#64748b', glow: 'rgba(100,116,139,0.5)' },
    rare: { bg: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
    epic: { bg: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
    legendary: { bg: '#f59e0b', glow: 'rgba(245,158,11,0.5)' }
  };
  const style = rarityStyles[badge.rarity] || rarityStyles.common;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99997;
    background: rgba(7,6,14,0.9);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  overlay.innerHTML = `
    <div style="text-align: center; max-width: 400px; transform: scale(0.7); transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);" id="badgeContent">
      <div style="font-size: 11px; color: ${style.bg}; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 20px;">BADGE UNLOCKED</div>
      <div style="width: 140px; height: 140px; margin: 0 auto 24px; border-radius: 50%; background: ${style.bg}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px ${style.glow}; animation: badgePulse 2s infinite;">
        <span style="font-size: 64px;">${badge.icon || '🏆'}</span>
      </div>
      <div style="font-size: 24px; color: white; font-weight: bold; margin-bottom: 8px;">${escapeHtml(badge.name)}</div>
      <div style="font-size: 13px; color: #94a3b8; line-height: 1.7; margin-bottom: 24px;">${escapeHtml(badge.description || '')}</div>
      <button id="badgeClose" style="padding: 12px 32px; border-radius: 12px; background: ${style.bg}; color: white; border: none; font-weight: bold; font-size: 14px; cursor: pointer; font-family: inherit;">
        رائع! <i class="fa-solid fa-star" style="margin-right: 6px;"></i>
      </button>
    </div>
    <style>
      @keyframes badgePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    </style>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    const content = overlay.querySelector('#badgeContent');
    if (content) content.style.transform = 'scale(1)';
  });

  triggerConfetti({ particleCount: 150, duration: 3500, spread: 100 });

  const close = () => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('#badgeClose').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}
