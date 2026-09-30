// Comprehensive Real-Market Industry Benchmarks
const marketData = {
  fashion: {
    name: "الملابس والأزياء والتجزئة",
    defaultCogsRatio: 40,
    cr: 2.8,
    ctr: 2.2,
    cpm: 65,
    cpaFactor: 0.18
  },
  restaurants: {
    name: "المطاعم والأغذية والوجبات",
    defaultCogsRatio: 35,
    cr: 3.8,
    ctr: 2.8,
    cpm: 45,
    cpaFactor: 0.12
  },
  cosmetics: {
    name: "مستحضرات التجميل والعناية",
    defaultCogsRatio: 30,
    cr: 2.4,
    ctr: 2.0,
    cpm: 75,
    cpaFactor: 0.20
  },
  furniture: {
    name: "الأثاث والديكور والتشطيبات",
    defaultCogsRatio: 50,
    cr: 1.4,
    ctr: 1.5,
    cpm: 90,
    cpaFactor: 0.22
  },
  realestate: {
    name: "العقارات والاستثمار العقاري",
    defaultCogsRatio: 10,
    cr: 0.8,
    ctr: 1.1,
    cpm: 140,
    cpaFactor: 0.25
  },
  healthcare: {
    name: "العيادات والخدمات الطبية",
    defaultCogsRatio: 25,
    cr: 2.0,
    ctr: 1.9,
    cpm: 80,
    cpaFactor: 0.19
  },
  education: {
    name: "التعليم والدورات والفرص الأكاديمية",
    defaultCogsRatio: 20,
    cr: 2.2,
    ctr: 2.1,
    cpm: 70,
    cpaFactor: 0.18
  },
  b2b: {
    name: "الخدمات والشركات واستشارات B2B",
    defaultCogsRatio: 15,
    cr: 1.5,
    ctr: 1.4,
    cpm: 110,
    cpaFactor: 0.24
  }
};

function initStrategicDecisionEngine() {
  const industrySelect = document.getElementById('industrySelect');
  const unitPriceInput = document.getElementById('unitPriceInput');
  const totalBudgetInput = document.getElementById('totalBudgetInput');
  const cogsRatioInput = document.getElementById('cogsRatioInput');

  const marketReachVal = document.getElementById('marketReachVal');
  const marketCrVal = document.getElementById('marketCrVal');
  const marketCtrVal = document.getElementById('marketCtrVal');
  const marketCpaVal = document.getElementById('marketCpaVal');

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

  // تحديث النسبة المباشرة تلقائياً عند تغيير المجال
  industrySelect.addEventListener('change', () => {
    const indKey = industrySelect.value || 'fashion';
    cogsRatioInput.value = marketData[indKey].defaultCogsRatio;
    recalculate();
  });

  function recalculate() {
    const indKey = industrySelect.value || 'fashion';
    const m = marketData[indKey];

    const price = parseFloat(unitPriceInput.value) || 1;
    const budget = parseFloat(totalBudgetInput.value) || 0;
    const cogsPercent = parseFloat(cogsRatioInput.value) || m.defaultCogsRatio;

    // 1. حسابات التكلفة المالية
    const cogsValue = price * (cogsPercent / 100);
    const grossMargin = price - cogsValue;
    const grossMarginRatio = grossMargin / price;

    const breakEvenRoas = grossMargin > 0 ? (price / grossMargin) : 0;
    const maxCac = Math.round(grossMargin);

    // 2. حسابات معايير الوصول والـ Market Expectations
    const estImpressions = (budget / m.cpm) * 1000;
    const minReach = Math.round(estImpressions * 0.7);
    const maxReach = Math.round(estImpressions * 0.9);

    const estCpa = Math.round(price * m.cpaFactor);
    const estOrders = estCpa > 0 ? Math.round(budget / estCpa) : 0;
    const estRevenue = estOrders * price;
    const totalCosts = (estOrders * cogsValue) + budget;
    const netProfit = estRevenue - totalCosts;

    // تحديث الواجهة
    marketReachVal.textContent = `${minReach.toLocaleString('ar-EG')} - ${maxReach.toLocaleString('ar-EG')} عميل`;
    marketCrVal.textContent = `${m.cr}%`;
    marketCtrVal.textContent = `${m.ctr}%`;
    marketCpaVal.textContent = `${estCpa.toLocaleString('ar-EG')} ج.م`;

    beRoasOutput.textContent = breakEvenRoas > 0 ? breakEvenRoas.toFixed(2) + 'x' : 'غير متاح';
    maxCacOutput.textContent = maxCac.toLocaleString('ar-EG') + ' ج.م';
    netProfitReal.textContent = Math.round(netProfit).toLocaleString('ar-EG') + ' ج.م';

    // 3. التوجيه الاستراتيجي
    let statusTitle = '';
    let statusDesc = '';

    if (grossMarginRatio >= 0.45 && budget >= 20000) {
      decisionBadge.className = 'p-3.5 rounded-xl bg-green-500/20 border border-green-500/40 text-right text-xs';
      statusTitle = `جاهزية عالية: مجال (${m.name}) مؤهل للسكيلينج الضخم`;
      statusDesc = `هامش الربح (${Math.round(grossMarginRatio * 100)}%) وميزانية الإعلان المتاحة تضمن المزايدة القوية في السوق واقتناص أفضل شريحة عملاء.`;
    } else if (grossMarginRatio >= 0.30) {
      decisionBadge.className = 'p-3.5 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-right text-xs';
      statusTitle = 'نمو متوازن: ركز على رفع متوسط القيمة للطلب (AOV)';
      statusDesc = `المؤشرات إيجابية؛ ويُنصح بإنشاء عروض مجمعة لتخطي نقطة التعادل (${breakEvenRoas.toFixed(2)}x) سريعاً.`;
    } else {
      decisionBadge.className = 'p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-right text-xs';
      statusTitle = 'تنبيه: هامش الربح الحالي يتطلب رفع سعر المنتج أو تخفيض تكلفة التوريد';
      statusDesc = `تكلفة البضاعة المرتفعة تشكل ضغطاً على الحملة؛ تحتاج لتسليم تحويلات بعائد أعلا من (${breakEvenRoas.toFixed(2)}x) لضمان صافي ربح.`;
    }

    decisionTitle.textContent = statusTitle;
    decisionDesc.textContent = statusDesc;

    currentAnalysis = {
      industryName: m.name,
      price,
      budget,
      cogsPercent,
      breakEvenRoas: breakEvenRoas.toFixed(2),
      maxCac,
      estReach: `${minReach.toLocaleString('ar-EG')} - ${maxReach.toLocaleString('ar-EG')}`,
      estCpa,
      estRevenue: Math.round(estRevenue).toLocaleString('ar-EG'),
      netProfit: Math.round(netProfit).toLocaleString('ar-EG'),
      statusTitle
    };

    consultCalcBtn.href = `https://wa.me/201021252183?text=${encodeURIComponent(`مرحباً إسلام، قمت بتحليل مشروعي في مجال (${m.name}): سعر المنتجات ${price} ج.م، الميزانية ${budget} ج.م. النتيجة: (${statusTitle}). أود تنفيذ الخطة معكم.`)}`;
  }

  unitPriceInput.addEventListener('input', recalculate);
  totalBudgetInput.addEventListener('input', recalculate);
  cogsRatioInput.addEventListener('input', recalculate);
  recalculate();

  // 4. التصدير المباشر لتقرير الـ PDF بدون صفحة بيضاء
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      downloadPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري استخراج التقرير...';

      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'fixed';
      pdfContainer.style.top = '-9999px';
      pdfContainer.style.left = '0';
      pdfContainer.style.width = '750px';
      pdfContainer.style.background = '#ffffff';
      pdfContainer.style.color = '#0f172a';
      pdfContainer.style.padding = '30px';
      pdfContainer.style.fontFamily = 'Cairo, Tahoma, sans-serif';
      pdfContainer.style.direction = 'rtl';
      pdfContainer.style.boxSizing = 'border-box';

      pdfContainer.innerHTML = `
        <div style="border-bottom: 2px solid #7c3aed; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="color: #7c3aed; margin: 0; font-size: 22px; font-weight: bold;">تقرير الجدوى واقتصاديات الإعلانات</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">إعداد: إسلام سعيد - Senior Performance Marketer</p>
          </div>
          <div style="text-align: left; font-size: 12px; color: #64748b;">
            التاريخ: ${new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
          <div style="margin-bottom: 6px;"><strong>المجال / القطاع:</strong> ${currentAnalysis.industryName}</div>
          <div style="margin-bottom: 6px;"><strong>متوسط سعر المنتجات/الخدمات:</strong> ${currentAnalysis.price} ج.م</div>
          <div style="margin-bottom: 6px;"><strong>الميزانية الإعلانية المقترحة شهرياً:</strong> ${currentAnalysis.budget.toLocaleString('ar-EG')} ج.م</div>
          <div><strong>نسبة التكلفة المباشرة للقطاع:</strong> ${currentAnalysis.cogsPercent}%</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #7c3aed; color: #ffffff;">
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">المؤشر التشغيلي</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">القيمة التقديرية</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">التفسير الإداري</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #cbd5e1;"><strong>متوسط الوصول (Reach)</strong></td>
              <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${currentAnalysis.estReach} عميل</td>
              <td style="padding: 10px; border: 1px solid #cbd5e1;">حجم المشاهدات والوصول التقديري بالمنطقة</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #cbd5e1;"><strong>نقطة التعادل (Break-Even ROAS)</strong></td>
              <td style="padding: 10px; border: 1px solid #cbd5e1; color: #d97706; font-weight: bold;">${currentAnalysis.breakEvenRoas}x</td>
              <td style="padding: 10px; border: 1px solid #cbd5e1;">الحد الأدنى لعدم تحقيق أي خسائر مالية</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #cbd5e1;"><strong>أقصى كلفة استحواذ (Max CAC)</strong></td>
              <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${currentAnalysis.maxCac} ج.م</td>
              <td style="padding: 10px; border: 1px solid #cbd5e1;">أقصى ميزانية لشراء العميل الواحدة</td>
            </tr>
            <tr style="background: #ecfdf5;">
              <td style="padding: 10px; border: 1px solid #cbd5e1;"><strong>صافي الربح الحقيقي المتوقع</strong></td>
              <td style="padding: 10px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">${currentAnalysis.netProfit} ج.م</td>
              <td style="padding: 10px; border: 1px solid #cbd5e1;">بعد تسديد تكلفة البضاعة والميزانية الإعلانية</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 8px; font-size: 12px; color: #1e3a8a; margin-bottom: 25px;">
          <strong>القرار والتوجيه التسويقي الموصى به:</strong> ${currentAnalysis.statusTitle}
        </div>

        <div style="text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          لإدارة وتطوير الحملات الإعلانية لمشروعك: تواصل مع إسلام سعيد مباشرة عبر واتساب: <strong>01021252183</strong> أو زيارة الموقع <strong>islamsaeid.me</strong>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const opt = {
        margin: 5,
        filename: `تقرير_الجدوى_التسويقية_${currentAnalysis.price}ج.م.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(pdfContainer).save().then(() => {
        document.body.removeChild(pdfContainer);
        downloadPdfBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down text-brand-gold ml-1"></i> <span data-i18n="btn-download-pdf">تنزيل تقرير الجدوى المالي (PDF)</span>';
      }).catch(err => {
        console.error(err);
        document.body.removeChild(pdfContainer);
        downloadPdfBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down text-brand-gold ml-1"></i> تنزيل تقرير الجدوى المالي (PDF)';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initStrategicDecisionEngine);
