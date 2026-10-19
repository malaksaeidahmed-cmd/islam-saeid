// ============================================================
// Optimization Engine — محرك التوصيات والتحذيرات
// ============================================================

export function generateDailyAlerts(campaign, dailyData, totals) {
  const alerts = [];
  const { strategy } = campaign;
  
  // 1. Learning Phase Check
  if (dailyData.dayNumber <= 3) {
    alerts.push({
      type: 'info',
      title: 'مرحلة التعلم (Learning Phase)',
      desc: 'الخوارزمية لسه بتتعلم. متعدلش إعدادات الحملة الأيام الأولى.',
      icon: 'fa-brain'
    });
  }

  // 2. Ad Fatigue Check
  if (dailyData.ctr < 1.0 && dailyData.dayNumber > 3) {
    alerts.push({
      type: 'warning',
      title: 'إرهاق الإعلان (Ad Fatigue)',
      desc: 'معدل النقر (CTR) بدأ يقل. الوقت مناسب لتغيير الكرياتيف أو إضافة variants جديدة.',
      icon: 'fa-battery-quarter'
    });
  }

  // 3. CPA Check
  const maxCac = strategy.foundation.aov * (1 - strategy.foundation.cogs / 100);
  if (dailyData.cpa > maxCac && dailyData.orders > 0) {
    alerts.push({
      type: 'danger',
      title: 'تجاوز تكلفة الاستحواذ (High CPA)',
      desc: `تكلفة العميل (${dailyData.cpa.toFixed(0)} ج.م) أعلى من الحد الأقصى (${maxCac.toFixed(0)} ج.م). راجع العرض أو الجمهور.`,
      icon: 'fa-triangle-exclamation'
    });
  }

  // 4. Scaling Opportunity
  if (totals.roas >= strategy.objective.kpiTarget && dailyData.dayNumber >= 5) {
    alerts.push({
      type: 'success',
      title: 'فرصة توسع (Scaling Opportunity)',
      desc: `ROAS الإجمالي (${totals.roas.toFixed(2)}x) تعدى المستهدف. يمكنك زيادة الميزانية بنسبة 20%.`,
      icon: 'fa-rocket'
    });
  }

  // 5. Zero Orders Check
  if (dailyData.clicks > 50 && dailyData.orders === 0) {
    alerts.push({
      type: 'danger',
      title: 'نقرات بدون تحويلات',
      desc: 'في زوار بيدخلوا الموقع بس مش بيشتروا. المشكلة في صفحة الهبوط أو العرض.',
      icon: 'fa-person-falling'
    });
  }

  return alerts;
}

export function getOptimalAction(alerts) {
  if (alerts.some(a => a.type === 'danger')) return 'pause';
  if (alerts.some(a => a.type === 'success')) return 'scale';
  return 'continue';
}
