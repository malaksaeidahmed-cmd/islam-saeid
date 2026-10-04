// Chart.js & Dynamic Page Features Integrator
import { CloudCMS } from './firebase-cms.js';

// 1. Chart.js Financial Decision Chart
let roasChartInstance = null;

export function renderROASChart(canvasId, budget, roasTarget, avgOrderValue) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const months = ['الشهر 1', 'الشهر 2', 'الشهر 3', 'الشهر 4', 'الشهر 5', 'الشهر 6'];
  const spendData = Array.from({ length: 6 }, (_, i) => budget * (1 + i * 0.15));
  const revenueData = spendData.map(s => s * roasTarget);
  const profitData = revenueData.map((r, i) => r - spendData[i]);

  if (roasChartInstance) roasChartInstance.destroy();

  // @ts-ignore
  roasChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'الإيرادات المتوقعة ($)', data: revenueData, borderColor: '#ec4899', backgroundColor: 'rgba(236,72,153,0.1)', fill: true, tension: 0.4 },
        { label: 'صافي الأرباح ($)', data: profitData, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4 },
        { label: 'الميزانية الإعلانية ($)', data: spendData, borderColor: '#f59e0b', borderDash: [5, 5], fill: false, tension: 0.4 }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#cbd5e1', font: { family: 'IBM Plex Sans Arabic' } } }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

// 2. Toast Notifications Integrator
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-5 left-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold text-white transition-all transform translate-y-10 opacity-0 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-amber-600' : 'bg-purple-600'
  }`;
  toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 100);

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
