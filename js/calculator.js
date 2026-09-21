// Strategic Growth & Unit Economics Decision Engine + PDF Generator
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
  const maxCpcOutput = document.getElementById('maxCpcOutput');
  const estRevOutput = document.getElementById('estRevOutput');
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

    // 1. هامش الربح الإجمالي للوحدة
    const grossMargin = Math.max(0, price - cogs);
    const grossMarginRatio = grossMargin / price;

    // 2. أقصى كلفة استحواذ مسموح بها (Max CAC)
    const maxCac = Math.round(grossMargin);
    maxCacOutput.textContent = maxCac.toLocaleString('ar-EG') + ' ج.م';

    // 3. نقطة التعادل الإعلانية (Break-Even ROAS)
    const breakEvenRoas = grossMargin > 0 ? (price / grossMargin) : 0;
    beRoasOutput.textContent = breakEvenRoas > 0 ? breakEvenRoas.toFixed(2) + 'x' : 'غير متاح';

    // 4. أقصى كلفة نقرة مربحة (Max CPC)
    const maxCpc = grossMargin * (crPercent / 100);
    maxCpcOutput.textContent = maxCpc.toFixed(2) + ' ج.م';

    // 5. المبيعات الإجمالية وصافي الربح
    const estRevenue = budget * targetRoas;
    estRevOutput.textContent = Math.round(estRevenue).toLocaleString('ar-EG') + ' ج.م';

    const unitsSold = estRevenue / price;
    const totalCosts = (unitsSold * cogs) + budget;
    const netProfit = estRevenue - totalCosts;
    netProfitReal.textContent = Math.round(netProfit).toLocaleString('ar-EG') + ' ج.م';

    // 6. التوصية التنفيذية لصاحب البيزنس
    let statusText = '';
    if (grossMarginRatio >= 0.55 && targetRoas >= breakEvenRoas * 1.5) {
      decisionBadge.className = 'p-3.5 rounded-2xl bg-green-500/20 border border-green-500/40 text-right';
      decisionTitle.innerHTML = '<i class="fa-solid fa-rocket text-green-400 ml-1"></i> حالة ممتازة: مؤهل للتوسع العنيف (Aggressive Scaling)';
      decisionDesc.textContent = `هامش ربحك الإجمالي (${Math.round(grossMarginRatio * 100)}%) يمنحك متسعاً لاقتناص عملاء جدد والتفوق على المنافسين مع تحقيق صافي أرباح مرتفع.`;
      statusText = 'مؤهل للتوسع العنيف (Aggressive Scaling)';
    } else if (grossMarginRatio >= 0.35 && targetRoas >= breakEvenRoas) {
      decisionBadge.className = 'p-3.5 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 text-right';
      decisionTitle.innerHTML = '<i class="fa-solid fa-chart-line-up text-brand-gold ml-1"></i> نمو منضبط: التركيز على رفع متوسط السلة (AOV)';
      decisionDesc.textContent = `أنت في نطاق الربحية، لكن لتحقيق أقصى استفادة، يُنصح بإضافة عروض مجمعة (Bundles) لرفع قيمة السلة فوق ${Math.round(price * 1.25)} ج.م.`;
      statusText = 'نمو منضبط مع رفع قيمة السلة';
    } else {
      decisionBadge.className = 'p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-right';
      decisionTitle.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-red-400 ml-1"></i> تحذير مالي: هامش الربح الحالي يهدد استدامة الإعلانات';
      decisionDesc.textContent = `تكلفة بضاعتك تلتهم معظم العائد؛ تحتاج إلى نقطة تعادل (${breakEvenRoas.toFixed(2)}x) قبل ضخ ميزانيات كبرى.`;
      statusText = 'تحذير: هوامش الربح بحاجة لتعديل فوري';
    }

    // حفظ البيانات لتقرير الـ PDF
    currentAnalysis = {
      price, cogs, budget, crPercent, targetRoas,
      breakEvenRoas: breakEvenRoas.toFixed(2),
      maxCac, maxCpc: maxCpc.toFixed(2),
      estRevenue: Math.round(estRevenue).toLocaleString('ar-EG'),
      netProfit: Math.round(netProfit).toLocaleString('ar-EG'),
      statusText
    };

    const msg = encodeURIComponent(`مرحباً إسلام، قمت بتحليل اقتصاديات مشروعي: سعر الوحدة ${price} ج.م، والتكلفة ${cogs} ج.م، بميزانية ${budget} ج.م. التوصية: (${statusText}). أود حجز استشارة للبدء.`);
    consultCalcBtn.href = `https://wa.me/201021252183?text=${msg}`;
  }

  unitPriceInput.addEventListener('input', recalculate);
  unitCostInput.addEventListener('input', recalculate);
  totalBudgetInput.addEventListener('input', recalculate);
  targetCrSlider.addEventListener('input', recalculate);
  targetRoasSlider.addEventListener('input', recalculate);
  recalculate();

  // دالة تصدير تقرير الـ PDF الاحترافي
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      if (typeof html2pdf === 'undefined') {
        alert('جاري تجهيز محرك التقارير، يُرجى المحاولة بعد ثانية واحدة...');
        return;
      }

      const reportContainer = document.createElement('div');
      reportContainer.style.padding = '35px';
      reportContainer.style.fontFamily = 'Cairo, sans-serif';
      reportContainer.style.color = '#0F172A';
      reportContainer.style.direction = 'rtl';
      reportContainer.style.background = '#FFFFFF';
      reportContainer.style.lineHeight = '1.7';

      reportContainer.innerHTML = `
        <div style="border-bottom: 2px solid #7C3AED; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="color: #7C3AED; margin: 0; font-size: 24px; font-weight: 900;">تقرير الجدوى واقتصاديات الإعلانات</h1>
            <p style="color: #64748B; margin: 5px 0 0 0; font-size: 12px;">إعداد الاستشاري: إسلام سعيد (Senior Performance Marketer)</p>
          </div>
          <div style="text-align: left; font-size: 11px; color: #94A3B8;">
            تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
          <h3 style="margin-top: 0; color: #1E293B; font-size: 16px;">1. المدخلات المالية للمشروع:</h3>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
            <li>&bull; <strong>متوسط سعر بيع الوحدة (AOV):</strong> ${currentAnalysis.price} ج.م</li>
            <li>&bull; <strong>التكلفة المباشرة للوحدة (COGS):</strong> ${currentAnalysis.cogs} ج.م</li>
            <li>&bull; <strong>الميزانية الإعلانية المقترحة:</strong> ${currentAnalysis.budget.toLocaleString('ar-EG')} ج.م</li>
            <li>&bull; <strong>معدل تحويل المتجر المستهدف:</strong> ${currentAnalysis.crPercent}%</li>
          </ul>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1E293B; font-size: 16px;">2. المؤشرات الحسابية الحرجة (Decision KPIs):</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: right;">
            <thead>
              <tr style="background: #7C3AED; color: #FFFFFF;">
                <th style="padding: 10px; border: 1px solid #E2E8F0;">المؤشر المالي</th>
                <th style="padding: 10px; border: 1px solid #E2E8F0;">القيمة المحسوبة</th>
                <th style="padding: 10px; border: 1px solid #E2E8F0;">الدلالة التشغيلية</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>نقطة التعادل (Break-Even ROAS)</strong></td>
                <td style="padding: 10px; border: 1px solid #E2E8F0; color: #F59E0B; font-weight: bold;">${currentAnalysis.breakEvenRoas}x</td>
                <td style="padding: 10px; border: 1px solid #E2E8F0;">الحد الأدنى لتفادي الخسارة الرأسمالية.</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>أقصى تكلفة استحواذ (Max CAC)</strong></td>
                <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold;">${currentAnalysis.maxCac} ج.م</td>
                <td style="padding: 10px; border: 1px solid #E2E8F0;">إذا تجاوزت تكلفة الشراء هذا الرقم يجب إيقاف الإعلان فوراً.</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>أقصى تكلفة نقرة مربحة (Max CPC)</strong></td>
                <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold;">${currentAnalysis.maxCpc} ج.م</td>
                <td style="padding: 10px; border: 1px solid #E2E8F0;">الحد الأقصى للمزايدة في مديري إعلانات Meta و TikTok.</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>المبيعات المتوقعة (Target Revenue)</strong></td>
                <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: bold;">${currentAnalysis.estRevenue} ج.م</td>
                <td style="padding: 10px; border: 1px solid #E2E8F0;">عند تحقيق معدل عائد (${currentAnalysis.targetRoas}x).</td>
              </tr>
              <tr style="background: #ECFDF5;">
                <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>صافي الأرباح المقدرة (Net Profit)</strong></td>
                <td style="padding: 10px; border: 1px solid #E2E8F0; color: #059669; font-weight: bold;">${currentAnalysis.netProfit} ج.م</td>
                <td style="padding: 10px; border: 1px solid #E2E8F0;">الربح الصافي الفعلي بعد خصم تكلفة البضاعة والميزانية.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 5px 0; color: #1E40AF; font-size: 14px;">3. القرار الاستراتيجي الموصى به:</h4>
          <p style="margin: 0; font-size: 12px; color: #1E3A8A;"><strong>${currentAnalysis.statusText}</strong></p>
        </div>

        <div style="border-top: 1px solid #E2E8F0; padding-top: 15px; text-align: center; font-size: 11px; color: #64748B;">
          لطلب تنفيذ هذه الخطة الإعلانية وإدارتها باحترافية: تواصل مع إسلام سعيد مباشرة عبر واتساب: <strong>01021252183</strong> أو زيارة <strong>islamsaeid.me</strong>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `تقرير_الجدوى_الإعلانية_${currentAnalysis.price}EGP.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      downloadPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-brand-gold"></i> جاري استخراج الـ PDF...';
      html2pdf().set(opt).from(reportContainer).save().then(() => {
        downloadPdfBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down text-brand-gold"></i> تحميل تقرير الجدوى الإعلانية لمشروعي (PDF)';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initStrategicDecisionEngine);
