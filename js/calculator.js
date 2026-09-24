// Unit Economics Decision Engine + Printable PDF Report
function initStrategicDecisionEngine() {
  const unitPriceInput = document.getElementById('unitPriceInput');
  const unitCostInput = document.getElementById('unitCostInput');
  const totalBudgetInput = document.getElementById('totalBudgetInput');
  const targetCrSlider = document.getElementById('targetCrSlider');
  const targetCrVal = document.getElementById('targetCrVal');
  const targetRoasSlider = document.getElementById('targetRoasSlider');
  const targetRoasVal = document.getElementById('targetRoasVal');
  
  const beRoasOutput = document.getElementById('beRoasOutput');
  const maxCacOutput = document.getElementById('maxCacOutput');
  const netProfitReal = document.getElementById('netProfitReal');
  const decisionBadge = document.getElementById('decisionBadge');
  const decisionTitle = document.getElementById('decisionTitle');
  const decisionDesc = document.getElementById('decisionDesc');
  const consultCalcBtn = document.getElementById('consultCalcBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');

  if (!unitPriceInput) return;

  let currentAnalysis = {};

  function recalculate() {
    const price = parseFloat(unitPriceInput.value) || 1;
    const cogs = parseFloat(unitCostInput.value) || 0;
    const budget = parseFloat(totalBudgetInput.value) || 0;
    const crPercent = parseFloat(targetCrSlider.value) || 1;
    const targetRoas = parseFloat(targetRoasSlider.value) || 1;

    targetCrVal.textContent = crPercent.toFixed(1) + '%';
    targetRoasVal.textContent = targetRoas.toFixed(1) + 'x';

    // 1. هامش الربح
    const grossMargin = Math.max(0, price - cogs);
    const grossMarginRatio = grossMargin / price;

    // 2. أقصى كلفة استحواذ
    const maxCac = Math.round(grossMargin);
    maxCacOutput.textContent = maxCac.toLocaleString('ar-EG') + ' ج.م';

    // 3. نقطة التعادل
    const breakEvenRoas = grossMargin > 0 ? (price / grossMargin) : 0;
    beRoasOutput.textContent = breakEvenRoas > 0 ? breakEvenRoas.toFixed(2) + 'x' : 'غير متاح';

    // 4. الإيرادات وصافي الربح
    const estRevenue = budget * targetRoas;
    const unitsSold = estRevenue / price;
    const totalCosts = (unitsSold * cogs) + budget;
    const netProfit = estRevenue - totalCosts;
    netProfitReal.textContent = Math.round(netProfit).toLocaleString('ar-EG') + ' ج.م';

    // 5. التوصية
    let statusText = '';
    if (grossMarginRatio >= 0.55 && targetRoas >= breakEvenRoas * 1.5) {
      decisionBadge.className = 'p-3 rounded-xl bg-green-500/20 border border-green-500/40 text-right text-xs';
      decisionTitle.innerHTML = '<i class="fa-solid fa-rocket text-green-400 ml-1"></i> جاهزية عالية: مؤهل للتوسع الإعلاني (Scale)';
      decisionDesc.textContent = `هامش ربحك (${Math.round(grossMarginRatio * 100)}%) يمنحك متسعاً للمزايدة والمنافسة وجلب عملاء جدد بأرباح صافية مرتفعة.`;
      statusText = 'مؤهل للتوسع الإعلاني والمزايدة التنافسية';
    } else if (grossMarginRatio >= 0.35 && targetRoas >= breakEvenRoas) {
      decisionBadge.className = 'p-3 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-right text-xs';
      decisionTitle.innerHTML = '<i class="fa-solid fa-chart-line text-brand-gold ml-1"></i> نمو منضبط: ركز على رفع متوسط السلة (AOV)';
      decisionDesc.textContent = `أنت في نطاق الربحية، لكن يُنصح بتقديم عروض مجمعة (Bundles) لرفع السلة فوق ${Math.round(price * 1.25)} ج.م.`;
      statusText = 'نمو منضبط مع رفع قيمة سلة المشتريات';
    } else {
      decisionBadge.className = 'p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-right text-xs';
      decisionTitle.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-red-400 ml-1"></i> تنبيه: هامش الربح الحالي يهدد استدامة الإعلانات';
      decisionDesc.textContent = `تكلفة بضاعتك تلتهم معظم العائد؛ تحتاج لنقطة تعادل (${breakEvenRoas.toFixed(2)}x) قبل ضخ ميزانيات كبرى.`;
      statusText = 'تنبيه: يجب تعديل التسعير أو تكلفة المنتج أولاً';
    }

    currentAnalysis = {
      price, cogs, budget, crPercent, targetRoas,
      breakEvenRoas: breakEvenRoas.toFixed(2),
      maxCac,
      estRevenue: Math.round(estRevenue).toLocaleString('ar-EG'),
      netProfit: Math.round(netProfit).toLocaleString('ar-EG'),
      statusText
    };

    consultCalcBtn.href = `https://wa.me/201021252183?text=${encodeURIComponent(`مرحباً إسلام، قمت بحساب اقتصاديات مشروعي: سعر الوحدة ${price} ج.م، التكلفة المباشرة ${cogs} ج.م، الميزانية ${budget} ج.م. التوصية: (${statusText}). أود استشارتك لبدء الحملة.`)}`;
  }

  unitPriceInput.addEventListener('input', recalculate);
  unitCostInput.addEventListener('input', recalculate);
  totalBudgetInput.addEventListener('input', recalculate);
  targetCrSlider.addEventListener('input', recalculate);
  targetRoasSlider.addEventListener('input', recalculate);
  recalculate();

  // تصدير الـ PDF
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      const container = document.createElement('div');
      container.style.padding = '30px';
      container.style.fontFamily = 'Cairo, Tahoma, sans-serif';
      container.style.direction = 'rtl';
      container.style.color = '#0F172A';
      container.style.background = '#FFFFFF';
      container.style.lineHeight = '1.7';

      container.innerHTML = `
        <div style="border-bottom: 2px solid #7C3AED; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #7C3AED; margin: 0; font-size: 22px;">تقرير الجدوى واقتصاديات الإعلانات</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748B;">إعداد: إسلام سعيد - Senior Performance Marketer</p>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
          <h4 style="margin-top: 0; margin-bottom: 8px; color: #1E293B;">بيانات المشروع المدخلة:</h4>
          <div>&bull; سعر بيع الوحدة: <strong>${currentAnalysis.price} ج.م</strong></div>
          <div>&bull; التكلفة المباشرة للوحدة: <strong>${currentAnalysis.cogs} ج.م</strong></div>
          <div>&bull; الميزانية الإعلانية المقترحة: <strong>${currentAnalysis.budget.toLocaleString('ar-EG')} ج.م</strong></div>
          <div>&bull; معدل تحويل المتجر: <strong>${currentAnalysis.crPercent}%</strong></div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #7C3AED; color: #fff;">
              <th style="padding: 8px; border: 1px solid #CBD5E1; text-align: right;">المؤشر</th>
              <th style="padding: 8px; border: 1px solid #CBD5E1; text-align: right;">القيمة</th>
              <th style="padding: 8px; border: 1px solid #CBD5E1; text-align: right;">المعنى التشغيلي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #CBD5E1;"><strong>نقطة التعادل (Break-Even)</strong></td>
              <td style="padding: 8px; border: 1px solid #CBD5E1; color: #D97706; font-weight: bold;">${currentAnalysis.breakEvenRoas}x</td>
              <td style="padding: 8px; border: 1px solid #CBD5E1;">الحد الأدنى لعدم الخسارة</td>
            </tr>
            <tr style="background: #F8FAFC;">
              <td style="padding: 8px; border: 1px solid #CBD5E1;"><strong>أقصى تكلفة شراء (Max CAC)</strong></td>
              <td style="padding: 8px; border: 1px solid #CBD5E1; font-weight: bold;">${currentAnalysis.maxCac} ج.م</td>
              <td style="padding: 8px; border: 1px solid #CBD5E1;">الحد الأقصى المسموح به لشراء الطلب</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #CBD5E1;"><strong>المبيعات المتوقعة</strong></td>
              <td style="padding: 8px; border: 1px solid #CBD5E1; font-weight: bold;">${currentAnalysis.estRevenue} ج.م</td>
              <td style="padding: 8px; border: 1px solid #CBD5E1;">عند تحقيق عائد (${currentAnalysis.targetRoas}x)</td>
            </tr>
            <tr style="background: #ECFDF5;">
              <td style="padding: 8px; border: 1px solid #CBD5E1;"><strong>صافي الأرباح الحقيقية</strong></td>
              <td style="padding: 8px; border: 1px solid #CBD5E1; color: #059669; font-weight: bold;">${currentAnalysis.netProfit} ج.م</td>
              <td style="padding: 8px; border: 1px solid #CBD5E1;">بعد خصم تكلفة المنتجات والميزانية الإعلانية</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 12px; border-radius: 8px; font-size: 12px; color: #1E3A8A; margin-bottom: 20px;">
          <strong>القرار الاستراتيجي الموصى به:</strong> ${currentAnalysis.statusText}
        </div>

        <div style="text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 12px;">
          لإدارة وتطوير حملاتك الإعلانية: تواصل مع إسلام سعيد مباشرة عبر واتساب: <strong>01021252183</strong> أو زيارة <strong>islamsaeid.me</strong>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `تقرير_الجدوى_${currentAnalysis.price}ج.م.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      downloadPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري استخراج الـ PDF...';
      html2pdf().set(opt).from(container).save().then(() => {
        downloadPdfBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down text-brand-gold ml-1"></i> تنزيل تقرير الجدوى (PDF)';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initStrategicDecisionEngine);
