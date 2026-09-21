// Unit Economics & Break-Even ROAS Calculation Engine
function initUnitEconomicsCalculator() {
  const unitPriceInput = document.getElementById('unitPriceInput');
  const unitCostInput = document.getElementById('unitCostInput');
  const totalBudgetInput = document.getElementById('totalBudgetInput');
  const targetRoasSlider = document.getElementById('targetRoasSlider');
  const targetRoasVal = document.getElementById('targetRoasVal');
  const beRoasOutput = document.getElementById('beRoasOutput');
  const maxCacOutput = document.getElementById('maxCacOutput');
  const estRevOutput = document.getElementById('estRevOutput');
  const netProfitReal = document.getElementById('netProfitReal');
  const consultCalcBtn = document.getElementById('consultCalcBtn');

  if (!unitPriceInput) return;

  function calculate() {
    const price = parseFloat(unitPriceInput.value) || 1;
    const cogs = parseFloat(unitCostInput.value) || 0;
    const budget = parseFloat(totalBudgetInput.value) || 0;
    const targetRoas = parseFloat(targetRoasSlider.value) || 1;

    targetRoasVal.textContent = targetRoas + 'x';

    // هامش الربح الإجمالي للوحدة
    const grossMarginPerUnit = Math.max(0, price - cogs);
    
    // الحد الأقصى لتكلفة الاستحواذ
    maxCacOutput.textContent = grossMarginPerUnit.toLocaleString('ar-EG') + ' ج.م';

    // نقطة التعادل الإعلانية
    const breakEvenRoas = grossMarginPerUnit > 0 ? (price / grossMarginPerUnit) : 0;
    beRoasOutput.textContent = (breakEvenRoas > 0 ? breakEvenRoas.toFixed(2) : 'غير متاح') + 'x';

    // المبيعات التقديرية
    const estRevenue = budget * targetRoas;
    estRevOutput.textContent = estRevenue.toLocaleString('ar-EG') + ' ج.م';

    // صافي الربح الحقيقي بعد خصم تكلفة المنتجات وميزانية الإعلانات
    const unitsSold = estRevenue / price;
    const totalCost = (unitsSold * cogs) + budget;
    const netProfit = estRevenue - totalCost;

    netProfitReal.textContent = Math.round(netProfit).toLocaleString('ar-EG') + ' ج.م';

    // تحديث رابط الواتساب
    const msg = encodeURIComponent(`مرحباً إسلام، قمت بتحليل اقتصاديات مشروعي: سعر بيع الوحدة ${price} ج.م، وتكلفتها ${cogs} ج.م، بميزانية ${budget} ج.م. أود استشارتك لبدء الحملات الإعلانية.`);
    consultCalcBtn.href = `https://wa.me/201021252183?text=${msg}`;
  }

  unitPriceInput.addEventListener('input', calculate);
  unitCostInput.addEventListener('input', calculate);
  totalBudgetInput.addEventListener('input', calculate);
  targetRoasSlider.addEventListener('input', calculate);
  calculate();
}

document.addEventListener('DOMContentLoaded', initUnitEconomicsCalculator);
