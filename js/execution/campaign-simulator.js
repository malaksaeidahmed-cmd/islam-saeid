// ============================================================
// Campaign Simulator — محاكي الأداء اليومي للحملة
// ============================================================

// ✅ مسار الاستيراد الصحيح (كان ../simulator/ وهي غلط)
import {
  INDUSTRIES, PLATFORMS, CREATIVE_TYPES,
  HOOK_QUALITY, OFFER_STRENGTH, LANDING_QUALITY
} from '../simulator-data.js';

export function simulateNextDay(campaign, dayNumber) {
  const strategy = campaign.strategy;
  const platform = campaign.platform;

  // 1. البيانات الأساسية
  const industry = INDUSTRIES[strategy.foundation.industry] || INDUSTRIES.fashion;
  const platformData = PLATFORMS[platform] || PLATFORMS.meta;

  const baseCPM = industry.cpm * platformData.cpmMult;
  const baseCTR = industry.ctr * platformData.ctrMult;
  const baseCVR = industry.cvr * platformData.cvrMult;

  // 2. تأثير Learning Phase (أول 3-7 أيام أداء أقل)
  const isLearning = dayNumber <= 3;
  const learningPenalty = isLearning ? (0.6 + (dayNumber * 0.1)) : 1;

  // 3. تأثير Ad Fatigue مع الوقت
  const fatigueFactor = Math.max(0.5, 1 - ((dayNumber - 1) * 0.03));

  // 4. مضاعفات إضافية (كرياتيف، صفحة هبوط، عرض)
  const creativeMultiplier = getCreativeMultiplier(strategy.creative);
  const landingMultiplier = getLandingMultiplier(strategy.funnel.landingQuality);
  const offerMultiplier = getOfferMultiplier(strategy.creative.offer);

  // 5. الحساب مع تباين طبيعي
  const variance = 0.9 + (Math.random() * 0.2);
  const dailyBudget = campaign.dailyBudget || (campaign.totalBudget / campaign.duration);

  const cpm = baseCPM * (isLearning ? 1.2 : 1) * variance;
  const impressions = Math.floor((dailyBudget / cpm) * 1000);
  // ✅ استخدام avgFrequency الصحيح
  const reach = Math.floor(impressions / (industry.avgFrequency || 2.5));

  const ctr = (baseCTR / 100) * learningPenalty * fatigueFactor * creativeMultiplier * variance;
  const clicks = Math.floor(impressions * ctr);

  const cvr = (baseCVR / 100) * learningPenalty * landingMultiplier * offerMultiplier * variance;
  const orders = Math.floor(clicks * cvr);

  const aov = strategy.foundation.aov || industry.aov;
  const revenue = orders * aov;
  const spend = dailyBudget;
  const roas = spend > 0 ? (revenue / spend) : 0;
  const cpa = orders > 0 ? (spend / orders) : 0;

  if (campaign.status === 'paused' || campaign.status === 'completed') {
    return { dayNumber, impressions: 0, clicks: 0, orders: 0, spend: 0, revenue: 0, roas: 0, cpa: 0, cpm: 0, ctr: 0, cvr: 0, reach: 0 };
  }

  return {
    dayNumber,
    impressions, reach, clicks,
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
  if (creative.variants >= 3) mult *= 1.15;
  return mult;
}

function getLandingMultiplier(quality) {
  return (LANDING_QUALITY[quality] && LANDING_QUALITY[quality].mult) || 1;
}

function getOfferMultiplier(offer) {
  return (OFFER_STRENGTH[offer] && OFFER_STRENGTH[offer].mult) || 1;
}
