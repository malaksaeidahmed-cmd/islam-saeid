// Dynamic Widgets, PDF Engine & Interactive UI Features
import { CloudCMS } from './firebase-cms.js';

// 1. Full PDF Generation Engine for Financial Decision Calculator
export async function generateCalculatorPDF(budget, roas, avgOrderValue) {
  const months = ['الشهر 1', 'الشهر 2', 'الشهر 3', 'الشهر 4', 'الشهر 5', 'الشهر 6'];
  const spendData = Array.from({ length: 6 }, (_, i) => Math.round(budget * (1 + i * 0.15)));
  const revenueData = spendData.map(s => Math.round(s * roas));
  const profitData = revenueData.map((r, i) => Math.round(r - spendData[i]));

  const pdfTemplate = `
    <div style="font-family: 'IBM Plex Sans Arabic', sans-serif; direction: rtl; text-align: right; padding: 30px; background: #07060E; color: #fff; min-height: 1000px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ec4899; padding-bottom: 15px; margin-bottom: 25px;">
        <div>
          <h1 style="font-size: 22px; color: #fff; margin: 0;">تقرير توقعات النمو المالي والإعلاني</h1>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">إعداد المستشار الإعلاني: إسلام سعيد</p>
        </div>
        <div style="text-align: left;">
          <span style="font-size: 11px; color: #ec4899; font-weight: bold;">خطة 6 أشهر</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
        <div style="background: #0E0B1A; border: 1px solid rgba(255,255,255,0.1); padding: 15px; rounded-radius: 12px;">
          <span style="font-size: 11px; color: #94a3b8; display: block;">الميزانية الشهرية الأولى</span>
          <strong style="font-size: 18px; color: #f59e0b;">$${budget.toLocaleString()}</strong>
        </div>
        <div style="background: #0E0B1A; border: 1px solid rgba(255,255,255,0.1); padding: 15px; rounded-radius: 12px;">
          <span style="font-size: 11px; color: #94a3b8; display: block;">معدل العائد العائد المستهدف (ROAS)</span>
          <strong style="font-size: 18px; color: #ec4899;">${roas}x</strong>
        </div>
        <div style="background: #0E0B1A; border: 1px solid rgba(255,255,255,0.1); padding: 15px; rounded-radius: 12px;">
          <span style="font-size: 11px; color: #94a3b8; display: block;">إجمالي الإيرادات المتوقعة (6 أشهر)</span>
          <strong style="font-size: 18px; color: #22c55e;">$${revenueData.reduce((a, b) => a + b, 0).toLocaleString()}</strong>
        </div>
      </div>

      <h3 style="font-size: 14px; color: #fff; margin-bottom: 15px;">جدول توقعات التدفق المالي الشهري:</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 30px; text-align: center;">
        <thead>
          <tr style="background: rgba(236, 72, 153, 0.2); color: #fff;">
            <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">الشهر</th>
            <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">الميزانية الإعلانية</th>
            <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">المبيعات المتوقعة</th>
            <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">صافي الأرباح</th>
          </tr>
        </thead>
        <tbody>
          ${months.map((m, i) => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: ${i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'};">
              <td style="padding: 10px; color: #fff;">${m}</td>               <td style="padding: 10px; color: #f59e0b;">$${spendData[i].toLocaleString()}</td>
              <td style="padding: 10px; color: #ec4899;">$${revenueData[i].toLocaleString()}</td>               <td style="padding: 10px; color: #22c55e; font-weight: bold;">$${profitData[i].toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); padding: 15px; border-radius: 12px; font-size: 11px; color: #cbd5e1; line-height: 1.6;">
        <strong style="color: #22c55e; display: block; margin-bottom: 5px;">توصية الاستراتيجية الإعلانية:</strong>
        تستند هذه الأرقام إلى تحليل معدلات التحويل واقتصاديات الوحدة. يُوصى بزيادة الميزانية بنسبة 15% شهرياً عند استقرار الـ ROAS فوق ${roas}x للحفاظ على كفاءة الـ CPA وسلسلة التوسع.
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = pdfTemplate;
  document.body.appendChild(element);

  const opt = {
    margin: 0,
    filename: `Financial_Plan_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  // @ts-ignore
  if (window.html2pdf) {
    // @ts-ignore
    await window.html2pdf().set(opt).from(element).save();
    element.remove();
  }
}

// 2. Interactive Toast Notifications
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-5 left-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold text-white transition-all transform translate-y-10 opacity-0 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-amber-600' : 'bg-purple-600'
  }`;
  toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 100);
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
