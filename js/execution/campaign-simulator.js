// ============================================================
// Campaign Simulator — محاكي الأداء اليومي للحملة
// ============================================================

import { INDUSTRIES, PLATFORMS, CREATIVE_TYPES, HOOK_QUALITY, OFFER_STRENGTH, LANDING_QUALITY } from '../simulator/simulator-data.js';

export function simulateNextDay(campaign, dayNumber) {
  const strategy = campaign.strategy;
  const platform = campaign.platform;
  
  // 1. حساب المتغيرات الأساسية (Base Metrics)
  const industry = INDUSTRIES[strategy.foundation.industry] || INDUSTRIES.fashion;
  const platformData = PLATFORMS[platform] || PLATFORMS.meta;
  
  const baseCPM = industry.cpm * platformData.cpmMult;
  const baseCTR = industry.ctr * platformData.ctrMult;
  const baseCVR = industry.cvr * platformData.cvrMult;

  // 2. تأثير الـ Learning Phase (أول 3-7 أيام الأداء بيكون متقلب وأقل كفاءة)
  const isLearning = dayNumber <= 3;
  const learningPenalty = isLearning ? (0.6 + (dayNumber * 0.1)) : 1; // يبدأ من 60% كفاءة ويوصل 100%

  // 3. تأثير إرهاق الإعلانات (Ad Fatigue) مع الوقت
  const fatigueFactor = Math.max(0.5, 1 - ((dayNumber - 1) * 0.03)); // بيقل 3% كل يوم

  // 4. تأثيرات إضافية (الكرياتيف، العرض، صفحة الهبوط)
  const creativeMultiplier = getCreativeMultiplier(strategy.creative);
  const landingMultiplier = getLandingMultiplier(strategy.funnel.landingQuality);

  // 5. حساب الأرقام الفعلية لليوم ده (مع شوية عشوائية للواقعية)
  const variance = 0.9 + (Math.random() * 0.2); // +/- 10%
  
  const dailyBudget = campaign.dailyBudget || (campaign.totalBudget / campaign.duration);
  
  const cpm = baseCPM * (isLearning ? 1.2 : 1) * variance;
  const impressions = Math.floor((dailyBudget / cpm) * 1000);
  const reach = Math.floor(impressions * 0.7); // الوصول عادة أقل من الظهور

  const ctr = (baseCTR / 100) * learningPenalty * fatigueFactor * creativeMultiplier * variance;
  const clicks = Math.floor(impressions * ctr);

  const cvr = (baseCVR / 100) * learningPenalty * landingMultiplier * getOfferMultiplier(strategy.creative.offer) * variance;
  const orders = Math.floor(clicks * cvr);

  const aov = strategy.foundation.aov || industry.aov;
  const revenue = orders * aov;
  const spend = dailyBudget;
  const roas = spend > 0 ? (revenue / spend) : 0;
  const cpa = orders > 0 ? (spend / orders) : 0;

  // 6. إذا كان فيه تخفيض ميزانية أو إيقاف
  if (campaign.status === 'paused') {
    return { impressions: 0, clicks: 0, orders: 0, spend: 0, revenue: 0, roas: 0, cpa: 0, cpm: 0, ctr: 0, cvr: 0, reach: 0 };
  }

  return {
    dayNumber,
    impressions,
    reach,
    clicks,
    ctr: parseFloat((ctr * 100).toFixed(2)),
    orders,
    cvr: parseFloat((cvr * 100).toFixed(2)),
    spend,
    revenue,
    roas: parseFloat(roas.toFixed(2)),
    cpa: parseFloat(cpa.toFixed(2)),
    cpm: parseFloat(cpm.toFixed(2))
  };
}

function getCreativeMultiplier(creative) {
  let mult = 1;
  if (creative.type && CREATIVE_TYPES[creative.type]) mult *= CREATIVE_TYPES[creative.type].mult;
  if (creative.hook && HOOK_QUALITY[creative.hook]) mult *= HOOK_QUALITY[creative.hook].mult;
  // وجود variants كتير بيحسن الأداء
  if (creative.variants >= 3) mult *= 1.15;
  return mult;
}

function getLandingMultiplier(quality) {
  return (LANDING_QUALITY[quality] && LANDING_QUALITY[quality].mult) || 1;
}

function getOfferMultiplier(offer) {
  return (OFFER_STRENGTH[offer] && OFFER_STRENGTH[offer].mult) || 1;
}
