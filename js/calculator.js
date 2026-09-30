// Industry Benchmark Intelligence Engine
const industryBenchmarks = {
  ecommerce: { cogsRatio: 0.45, cr: 2.2, minRoasFactor: 1.5, name: "التجارة الإلكترونية والتجزئة" },
  restaurants: { cogsRatio: 0.35, cr: 3.8, minRoasFactor: 1.3, name: "المطاعم والقطاع الغذائي" },
  services: { cogsRatio: 0.20, cr: 1.8, minRoasFactor: 2.0, name: "الخدمات والشركات B2B" },
  realestate: { cogsRatio: 0.15, cr: 1.2, minRoasFactor: 2.5, name: "العقارات والتشطيبات الفاخرة" }
};

function initStrategicDecisionEngine() {
  const industrySelect = document.getElementById('industrySelect');
  const unitPriceInput = document.getElementById('unitPriceInput');
  const totalBudgetInput = document.getElementById('totalBudgetInput');
  
  const cogsRatioVal = document.getElementById('cogsRatioVal');
  const benchmarkCrVal = document.getElementById('benchmarkCrVal');
  
  const beRoasOutput = document.getElementById('beRoasOutput');
  const maxCacOutput = document.getElementById('maxCacOutput');
  const netProfitReal = document.getElementById('netProfitReal');
  const decisionBadge = document.getElementById('decisionBadge');
  const decisionTitle = document.getElementById('decisionTitle');
  const decisionDesc = document.getElementById('decisionDesc');
  const consultCalcBtn = document.getElementById('consultCalcBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');

  if (!unitPriceInput || !industrySelect) return;

  let currentAnalysis = {};

  function recalculate() {
    const indKey = industrySelect.value || 'ecommerce';
    const benchmark = industryBenchmarks[indKey];
    
    const price = parseFloat(unitPriceInput.value) || 1;
    const budget = parseFloat(totalBudgetInput.value) || 0;

    const estCogs = price * benchmark.cogsRatio;
    const grossMargin = price - estCogs;
    const breakEvenRoas = price / grossMargin;
    const maxCac = Math.round(grossMargin);

    cogsRatioVal.textContent = Math.round(benchmark.cogsRatio * 100) + '%';
    benchmarkCrVal.textContent = benchmark.cr + '%';

    // العائد المستهدف الاستراتيجي للقطاع
    const targetRoas = breakEvenRoas * benchmark.minRoasFactor;
    const estRevenue = budget * targetRoas;
    const estUnits = estRevenue / price;
    const totalCosts = (estUnits * estCogs) + budget;
    const netProfit = estRevenue - totalCosts;

    beRoasOutput.textContent = breakEvenRoas.toFixed(2) + 'x';
    maxCacOutput.textContent = maxCac.toLocaleString('ar-EG') + ' ج.م';
    netProfitReal.textContent = Math.round(netProfit).toLocaleString('ar-EG') + ' ج.م';

    let statusTitle = '';
    let statusDesc = '';

    if (budget >= 25000 && grossMargin / price >= 0.40) {
      decisionBadge.className = 'p-3.5 rounded-xl bg-green-500/20 border border-green-500/40 text-right text-xs';
      statusTitle = 'مؤشر ممتازة: المشروع مؤهل للتوسع الإعلاني الضخم (Scaling)';
      statusDesc = `قطاع (${benchmark.name}) بهامش ربح (${Math.round((grossMargin/price)*100)}%) يمنحك متسعاً للمزايدة التنافسية واقتناص العملاء بأرباح صافية.`;
    } else if (budget >= 15000) {
      decisionBadge.className = 'p-3.5 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-right text-xs';
      statusTitle = 'نمو منضبط: ركز على رفع متوسط السلة (AOV)';
      statusDesc = `الميزانية جيدة للبدء، ويُنصح بتقديم عروض مجمعة (Bundles) لتجاوز نقطة التعادل (${breakEvenRoas.toFixed(2)}x) بسرعة.`;
    } else {
      decisionBadge.className = 'p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-right text-xs';
      statusTitle = 'تنبيه: يُفضل تركيز الميزانية في القنوات ذات التحويل المباشر';
      statusDesc = `الميزانية أقل من الحد الأدنى المعياري للقطاع؛ ركز أولاً على إعادة الاستهداف والتسويق المباشر عبر المبيعات.`;
    }

    decisionTitle.textContent = statusTitle;
    decisionDesc.textContent = statusDesc;

    currentAnalysis = {
      industryName: benchmark.name,
      price,
      budget,
      cogsRatio: Math.round(benchmark.cogsRatio * 100),
      benchmarkCr: benchmark.cr,
      breakEvenRoas: breakEvenRoas.toFixed(2),
      maxCac,
      estRevenue: Math.round(estRevenue).toLocaleString('ar-EG'),
      netProfit: Math.round(netProfit).toLocaleString('ar-EG'),
      statusTitle
    };

    consultCalcBtn.href = `https://wa.me/201021252183?text=${encodeURIComponent(`مرحباً إسلام، قمت بتحليل مشروع في قطاع (${benchmark.name}): متوسط السعر ${price} ج.م، الميزانية ${budget} ج.م. التوصية: (${statusTitle}). أود البدء معكم.`)}`;
  }

  industrySelect.addEventListener('change', recalculate);
  unitPriceInput.addEventListener('input', recalculate);
  totalBudgetInput.addEventListener('input', recalculate);
  recalculate();

  // تنزيل التقرير بتطوير برمجي مباشر يمنع الصفحة البيضاء نهائياً
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      downloadPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري إعداد التقرير...';

      const reportHtml = `
        <div style="padding:25px; font-family: Cairo, Tahoma, sans-serif; direction:rtl; background:#ffffff; color:#0f172a; line-height:1.6;">
          <div style="border-bottom:2px solid #7c3aed; padding-bottom:10px; margin-bottom:15px; display:flex; justify-between; align-items:center;">
            <div>
              <h2 style="color:#7c3aed; margin:0; font-size:20px;">تقرير الدراسة المالية والتسويقية</h2>
              <p style="margin:2px 0 0 0; font-size:12px; color:#64748b;">إعداد: إسلام سعيد - Senior Performance Marketer</p>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:8px; margin-bottom:15px; font-size:12px;">
            <strong>القطاع التجاري:</strong> ${currentAnalysis.industryName} | 
            <strong>سعر الخدمة/المنتج:</strong> ${currentAnalysis.price} ج.م | 
            <strong>الميزانية الإعلانية المقترحة:</strong> ${currentAnalysis.budget.toLocaleString('ar-EG')} ج.م
          </div>

          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:15px;">
            <thead>
              <tr style="background:#7c3aed; color:#ffffff;">
                <th style="padding:8px; border:1px solid #cbd5e1; text-align:right;">المؤشر الاستراتيجي</th>
                <th style="padding:8px; border:1px solid #cbd5e1; text-align:right;">القيمة المحسوبة</th>
                <th style="padding:8px; border:1px solid #cbd5e1; text-align:right;">الأثر الإداري</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:8px; border:1px solid #cbd5e1;"><strong>نقطة التعادل (Break-Even ROAS)</strong></td>
                <td style="padding:8px; border:1px solid #cbd5e1; color:#d97706; font-weight:bold;">${currentAnalysis.breakEvenRoas}x</td>
                <td style="padding:8px; border:1px solid #cbd5e1;">أقل عائد مقبول لعدم تحقيق خسارة</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:8px; border:1px solid #cbd5e1;"><strong>أقصى تكلفة استحواذ (Max CAC)</strong></td>
                <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;">${currentAnalysis.maxCac} ج.م</td>
                <td style="padding:8px; border:1px solid #cbd5e1;">أقصى تكلفة مسموحة لشراء العميل</td>
              </tr>
              <tr style="background:#ecfdf5;">
                <td style="padding:8px; border:1px solid #cbd5e1;"><strong>صافي الربح التقديري</strong></td>
                <td style="padding:8px; border:1px solid #cbd5e1; color:#059669; font-weight:bold;">${currentAnalysis.netProfit} ج.م</td>
                <td style="padding:8px; border:1px solid #cbd5e1;">صافي الربح بعد البضاعة والإعلانات</td>
              </tr>
            </tbody>
          </table>

          <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px; border-radius:8px; font-size:11px; color:#1e3a8a; margin-bottom:15px;">
            <strong>توصية الآلة التنفيذية:</strong> ${currentAnalysis.statusTitle}
          </div>

          <div style="text-align:center; font-size:10px; color:#64748b; border-top:1px solid #e2e8f0; padding-top:10px;">
            للتواصل والاستشارات المباشرة: <strong>01021252183</strong> | <strong>islamsaeid.me</strong>
          </div>
        </div>
      `;

      const element = document.createElement('div');
      element.innerHTML = reportHtml;
      document.body.appendChild(element);

      const opt = {
        margin: 8,
        filename: `تقرير_الجدوى_التسويقية.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
        downloadPdfBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down text-brand-gold ml-1"></i> <span data-i18n="btn-download-pdf">تنزيل تقرير الجدوى المالي (PDF)</span>';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initStrategicDecisionEngine);
