// Strategic Growth & Unit Economics Decision Engine
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

  if (!unitPriceInput) return;

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
    maxCacOutput.textContent = Math.round(grossMargin).toLocaleString('ar-EG') + ' ج.م';

    // 3. نقطة التعادل الإعلانية (Break-Even ROAS)
    const breakEvenRoas = grossMargin > 0 ? (price / grossMargin) : 0;
    beRoasOutput.textContent = breakEvenRoas > 0 ? breakEvenRoas.toFixed(2) + 'x' : 'غير متاح';

    // 4. أقصى كلفة نقرة مربحة (Max CPC = Max CAC * CR%)
    const maxCpc = grossMargin * (crPercent / 100);
    maxCpcOutput.textContent = maxCpc.toFixed(2) + ' ج.م';

    // 5. المبيعات الإجمالية وصافي الربح
    const estRevenue = budget * targetRoas;
    estRevOutput.textContent = Math.round(estRevenue).toLocaleString('ar-EG') + ' ج.م';

    const unitsSold = estRevenue / price;
    const totalCosts = (unitsSold * cogs) + budget;
    const netProfit = estRevenue - totalCosts;
    netProfitReal.textContent = Math.round(netProfit).toLocaleString('ar-EG') + ' ج.م';

    // 6. خوارزمية التوصية التنفيذية لصاحب البيزنس (Decision Recommendation Logic)
    if (grossMarginRatio >= 0.55 && targetRoas >= breakEvenRoas * 1.5) {
      decisionBadge.className = 'p-3.5 rounded-2xl bg-green-500/20 border border-green-500/40 text-right';
      decisionTitle.innerHTML = '<i class="fa-solid fa-rocket text-green-400 ml-1"></i> حالة ممتازة: مؤهل للتوسع العنيف (Aggressive Scaling)';
      decisionDesc.textContent = `هامش ربحك الإجمالي (${Math.round(grossMarginRatio * 100)}%) يمنحك متسعاً لاقتناص عملاء جدد والتفوق على المنافسين في المزادات الإعلانية مع تحقيق صافي أرباح مرتفع.`;
    } else if (grossMarginRatio >= 0.35 && targetRoas >= breakEvenRoas) {
      decisionBadge.className = 'p-3.5 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 text-right';
      decisionTitle.innerHTML = '<i class="fa-solid fa-chart-line-up text-brand-gold ml-1"></i> نمو منضبط: التركيز على رفع متوسط السلة (AOV)';
      decisionDesc.textContent = `أنت في نطاق الربحية، لكن لتحقيق أقصى استفادة من الميزانية، يُنصح بإضافة عروض مجمعة (Bundles) لرفع قيمة السلة فوق ${Math.round(price * 1.25)} ج.م.`;
    } else {
      decisionBadge.className = 'p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-right';
      decisionTitle.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-red-400 ml-1"></i> تحذير مالي: هامش الربح الحالي يهدد استدامة الإعلانات';
      decisionDesc.textContent = `تكلفة بضاعتك تلتهم معظم العائد؛ تحتاج إلى نقطة تعادل (${breakEvenRoas.toFixed(2)}x) قبل ضخ ميزانيات كبرى. يُرجى مراجعة تسعيرك أو تقليل تكاليف الشحن أولاً.`;
    }

    // تحديث رسالة الواتساب المباشرة
    const msg = encodeURIComponent(`مرحباً إسلام، قمت بتحليل اقتصاديات مشروعي عبر حاسبة القرار: سعر الوحدة ${price} ج.م، التكلفة المباشرة ${cogs} ج.م، بميزانية ${budget} ج.م. التوصية كانت: (${decisionTitle.innerText.trim()}). أود استشارتك لتنفيذ خطة إعلانية مربحة.`);
    consultCalcBtn.href = `https://wa.me/201021252183?text=${msg}`;
  }

  unitPriceInput.addEventListener('input', recalculate);
  unitCostInput.addEventListener('input', recalculate);
  totalBudgetInput.addEventListener('input', recalculate);
  targetCrSlider.addEventListener('input', recalculate);
  targetRoasSlider.addEventListener('input', recalculate);
  recalculate();
}

document.addEventListener('DOMContentLoaded', initStrategicDecisionEngine);
