// ============================================================
// Simulator Engine — Realistic Marketing Simulation Engine
// ============================================================

import {
  INDUSTRIES, PLATFORMS, OBJECTIVES, FRAMEWORKS, CHANNEL_TYPES,
  CREATIVE_TYPES, HOOK_QUALITY, OFFER_STRENGTH, LANDING_QUALITY,
  BIDDING_STRATEGY, OPT_EVENTS, TESTING, SCALING, RETENTION,
  ATTRIBUTION, BUSINESS_STAGE, JOURNEY_STAGES, PRICING_STRATEGY,
  SEASONALITY, getCurrentSeason, SCORE_WEIGHTS, RISK_FACTORS
} from './simulator-data.js';

// ============================================================
// MAIN SIMULATION FUNCTION
// ============================================================
export function runSimulation(state) {
  // 1. Validate state
  const validation = validateState(state);
  if (!validation.valid) return { error: validation.errors };

  // 2. Get base benchmarks
  const ind = INDUSTRIES[state.foundation.industry];
  const stage = BUSINESS_STAGE[state.foundation.businessStage];
  const objective = OBJECTIVES[state.objective.primaryGoal];
  const primaryFramework = state.framework.primary ? FRAMEWORKS[state.framework.primary] : null;
  const secondaryFramework = state.framework.secondary ? FRAMEWORKS[state.framework.secondary] : null;

  // 3. Seasonality
  const season = state.budget.seasonality === 'normal' 
    ? getCurrentSeason() 
    : { key: state.budget.seasonality, ...SEASONALITY[state.budget.seasonality] };

  // 4. Global multipliers
  const globalMults = computeGlobalMultipliers(state, ind, stage, objective);

  // 5. Platform-by-platform calculation
  const platformResults = calculatePlatformPerformance(state, ind, globalMults, season);

  // 6. Aggregate totals
  const totals = aggregateTotals(platformResults, state);

  // 7. Funnel breakdown (TOFU/MOFU/BOFU)
  const funnel = computeFunnelBreakdown(state, totals, platformResults);

  // 8. Cohort analysis (retention over 12 months)
  const cohort = computeCohortAnalysis(state, totals, ind);

  // 9. Attribution comparison (6 models)
  const attribution = computeAttributionAnalysis(state, platformResults);

  // 10. Learning phase simulation
  const learningPhase = simulateLearningPhase(state, totals);

  // 11. Ad fatigue analysis
  const adFatigue = simulateAdFatigue(state, totals, ind);

  // 12. Risk analysis
  const risks = computeRisks(state, ind, totals);

  // 13. Scoring (8 dimensions)
  const scores = computeScores(state, totals, funnel, cohort, risks);

  // 14. Overall verdict
  const verdict = computeVerdict(scores, totals);

  // 15. Recommendations
  const recommendations = generateRecommendations(state, totals, scores, risks);

  // 16. Optimization opportunities
  const optimizations = findOptimizations(state, totals);

  return {
    success: true,
    metadata: {
      industry: ind.name,
      industryCategory: ind.category,
      businessStage: stage.name,
      objective: objective.name,
      framework: primaryFramework?.name || 'بدون',
      secondaryFramework: secondaryFramework?.name || 'بدون',
      platformCount: state.channels.platforms.length,
      season: season.name,
      generatedAt: new Date().toISOString()
    },
    inputs: state,
    platformResults,
    totals,
    funnel,
    cohort,
    attribution,
    learningPhase,
    adFatigue,
    risks,
    scores,
    verdict,
    recommendations,
    optimizations
  };
}

// ============================================================
// VALIDATION
// ============================================================
function validateState(state) {
  const errors = [];
  if (!state.foundation.industry) errors.push('القطاع غير محدد');
  if (!state.foundation.businessStage) errors.push('مرحلة البيزنس غير محددة');
  if (!state.objective.primaryGoal) errors.push('الهدف التسويقي غير محدد');
  if (!state.channels.platforms.length) errors.push('لم يتم اختيار أي منصة');
  if (state.budget.totalBudget < 1000) errors.push('الميزانية أقل من الحد الأدنى');
  return { valid: errors.length === 0, errors };
}

// ============================================================
// GLOBAL MULTIPLIERS
// ============================================================
function computeGlobalMultipliers(state, ind, stage, objective) {
  const f = state.framework;
  const c = state.creative;
  const fn = state.funnel;

  // Framework effectiveness
  let frameworkMult = 1.0;
  if (f.primary) frameworkMult *= FRAMEWORKS[f.primary].effectiveness;
  if (f.secondary && f.secondary !== f.primary) frameworkMult *= (1 + (FRAMEWORKS[f.secondary].effectiveness - 1) * 0.5);

  // Framework-industry fit
  const primaryFw = f.primary ? FRAMEWORKS[f.primary] : null;
  if (primaryFw && primaryFw.bestFor !== 'any') {
    const bestForList = primaryFw.bestFor.split(',').map(s => s.trim());
    const industryCat = ind.category;
    if (!bestForList.includes(industryCat) && !bestForList.includes(ind.name)) {
      frameworkMult *= 0.85;
    } else {
      frameworkMult *= 1.10;
    }
  }

  // Business stage
  const stageMult = BUSINESS_STAGE[state.foundation.businessStage].mult;

  // Objective alignment
  const objectiveMult = objective.cvrMult;

  // Creative quality (compound)
  const creativeMult = 
    (c.type ? CREATIVE_TYPES[c.type].mult : 1) *
    (c.hook ? HOOK_QUALITY[c.hook].mult : 1) *
    (c.offer ? OFFER_STRENGTH[c.offer].mult : 1);

  // Production quality
  const prodQualityMap = { low: 0.85, medium: 1.0, high: 1.15, premium: 1.30 };
  const prodMult = prodQualityMap[c.productionQuality] || 1.0;

  // Landing quality
  const landingMult = fn.landingQuality ? LANDING_QUALITY[fn.landingQuality].mult : 1.0;

  // Funnel type bonus
  const funnelMultMap = {
    'direct': 1.0,
    'lead-magnet': 1.15,
    'webinar': 1.25,
    'video-series': 1.20
  };
  const funnelMult = funnelMultMap[fn.funnelType] || 1.0;

  // Retargeting
  const retargetingMult = fn.retargetingStrategy ? 1.15 : 1.0;

  // Cart recovery
  const cartMult = fn.abandonedCart ? 1.08 : 1.0;

  // Testing methodology
  const testingMult = state.optimization.testing ? TESTING[state.optimization.testing].mult : 1.0;

  // Bidding strategy
  const biddingMult = state.optimization.bidding ? BIDDING_STRATEGY[state.optimization.bidding].mult : 1.0;

  // Opt event quality
  const eventMult = state.optimization.event ? OPT_EVENTS[state.optimization.event].cvrMult : 1.0;

  // Tracking quality
  const trackingMap = { basic: 0.90, advanced: 1.0, 'world-class': 1.15 };
  const trackingMult = trackingMap[state.analytics.trackingSetup] || 1.0;

  // Attribution model impact
  const attributionMap = {
    lastTouch: 0.95,
    firstTouch: 1.05,
    linear: 1.0,
    timeDecay: 1.05,
    position: 1.05,
    dataDriven: 1.15
  };
  const attributionMult = state.analytics.attributionModel ? attributionMap[state.analytics.attributionModel] : 1.0;

  // Overall synergy (channel mix)
  const channelSynergy = computeChannelSynergy(state.channels.mix);

  return {
    frameworkMult,
    stageMult,
    objectiveMult,
    creativeMult,
    prodMult,
    landingMult,
    funnelMult,
    retargetingMult,
    cartMult,
    testingMult,
    biddingMult,
    eventMult,
    trackingMult,
    attributionMult,
    channelSynergy,
    // Compound CVR modifier
    cvrModifier: frameworkMult * stageMult * creativeMult * prodMult * landingMult * 
                 funnelMult * retargetingMult * cartMult * testingMult * 
                 biddingMult * eventMult * trackingMult * attributionMult * channelSynergy,
    // Compound CPM modifier
    cpmModifier: (1 / channelSynergy) * (1 / Math.max(0.7, frameworkMult * 0.5 + 0.5)),
  };
}

function computeChannelSynergy(mix) {
  if (!Array.isArray(mix) || !mix.length) return 1.0;
  let synergy = 1.0;
  // Paid + Owned combo is strong
  if (mix.includes('paid') && mix.includes('owned')) synergy *= 1.15;
  // Shared amplifies paid
  if (mix.includes('paid') && mix.includes('shared')) synergy *= 1.10;
  // Earned + Owned is premium
  if (mix.includes('earned') && mix.includes('owned')) synergy *= 1.12;
  // All 4 = maximum synergy
  if (mix.length === 4) synergy *= 1.20;
  // Only paid = minimum
  if (mix.length === 1 && mix[0] === 'paid') synergy *= 0.95;
  return synergy;
}

// ============================================================
// PLATFORM PERFORMANCE
// ============================================================
function calculatePlatformPerformance(state, ind, globalMults, season) {
  const results = [];
  const totalBudget = state.budget.totalBudget;
  const n = state.channels.platforms.length;
  const reserve = state.budget.reservePercent / 100;
  const deployableBudget = totalBudget * (1 - reserve);
  const avgBudget = deployableBudget / n;

  state.channels.platforms.forEach(pk => {
    const p = PLATFORMS[pk];
    const budget = state.budget.allocations[pk] || avgBudget;

    // Adjusted CPM
    const baseCPM = ind.cpm * p.cpmMult * globalMults.cpmModifier;
    const adjustedCPM = baseCPM * season.cpmMult;

    // Adjusted CTR
    const baseCTR = ind.ctr * p.ctrMult;
    const creativeCTRBoost = 1 + ((globalMults.creativeMult - 1) * 0.4);
    const adjustedCTR = baseCTR * creativeCTRBoost;

    // Adjusted CVR
    const baseCVR = ind.cvr * p.cvrMult;
    const adjustedCVR = baseCVR * globalMults.cvrModifier * (season.cvrMult * 0.5 + 0.5);

    // Impressions
    const impressions = adjustedCPM > 0 ? (budget / adjustedCPM) * 1000 : 0;

    // Frequency & Reach
    const avgFrequency = ind.avgFrequency || 2.5;
    const reach = impressions / avgFrequency;

    // Clicks
    const clicks = impressions * (adjustedCTR / 100);

    // Landing page views (85% of clicks land)
    const landingViews = clicks * 0.85;

    // Orders (with platform-specific modifiers)
    const orders = landingViews * (adjustedCVR / 100);

    // Revenue
    const aovWithUpsell = state.scaling.upsellStrategy ? ind.aov * 1.15 : ind.aov;
    const revenue = orders * aovWithUpsell;

    // Costs
    const cogs = orders * aovWithUpsell * (state.foundation.cogs / 100);
    const cpa = orders > 0 ? budget / orders : 0;

    // ROAS
    const roas = budget > 0 ? revenue / budget : 0;
    const profitableRoas = (state.foundation.price / (state.foundation.price - state.foundation.price * state.foundation.cogs / 100));

    // Freq warning
    const freqWarning = avgFrequency > 3.5 ? 'high' : avgFrequency > 2.5 ? 'medium' : 'low';

    results.push({
      platform: pk,
      name: p.name,
      icon: p.icon,
      color: p.color,
      budget: Math.round(budget),
      impressions: Math.round(impressions),
      reach: Math.round(reach),
      frequency: parseFloat(avgFrequency.toFixed(2)),
      frequencyWarning: freqWarning,
      clicks: Math.round(clicks),
      ctr: parseFloat(adjustedCTR.toFixed(2)),
      cpc: clicks > 0 ? budget / clicks : 0,
      landingViews: Math.round(landingViews),
      cvr: parseFloat(adjustedCVR.toFixed(2)),
      orders: Math.round(orders),
      cpa: Math.round(cpa),
      aov: Math.round(aovWithUpsell),
      revenue: Math.round(revenue),
      cogs: Math.round(cogs),
      roas: parseFloat(roas.toFixed(2)),
      profitableRoas: parseFloat(profitableRoas.toFixed(2)),
      isProfitable: roas >= profitableRoas,
      contribution: Math.round(revenue - cogs - budget)
    });
  });

  return results;
}

// ============================================================
// AGGREGATE TOTALS
// ============================================================
function aggregateTotals(platformResults, state) {
  const totals = {
    totalBudget: 0,
    totalImpressions: 0,
    totalReach: 0,
    totalClicks: 0,
    totalLandingViews: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCogs: 0,
    totalContribution: 0,
    avgCPM: 0,
    avgCTR: 0,
    avgCVR: 0,
    avgCPA: 0,
    avgROAS: 0,
    avgAOV: 0,
    netProfit: 0,
    profitMargin: 0,
    breakEvenRoas: 0,
    breakEvenOrders: 0
  };

  platformResults.forEach(p => {
    totals.totalBudget += p.budget;
    totals.totalImpressions += p.impressions;
    totals.totalReach += p.reach;
    totals.totalClicks += p.clicks;
    totals.totalLandingViews += p.landingViews;
    totals.totalOrders += p.orders;
    totals.totalRevenue += p.revenue;
    totals.totalCogs += p.cogs;
    totals.totalContribution += p.contribution;
  });

  const price = state.foundation.price;
  const cogsRatio = state.foundation.cogs / 100;
  const grossMargin = price * (1 - cogsRatio);

  totals.avgCPM = totals.totalImpressions > 0 ? (totals.totalBudget / totals.totalImpressions) * 1000 : 0;
  totals.avgCTR = totals.totalImpressions > 0 ? (totals.totalClicks / totals.totalImpressions) * 100 : 0;
  totals.avgCVR = totals.totalLandingViews > 0 ? (totals.totalOrders / totals.totalLandingViews) * 100 : 0;
  totals.avgCPA = totals.totalOrders > 0 ? totals.totalBudget / totals.totalOrders : 0;
  totals.avgROAS = totals.totalBudget > 0 ? totals.totalRevenue / totals.totalBudget : 0;
  totals.avgAOV = totals.totalOrders > 0 ? totals.totalRevenue / totals.totalOrders : 0;
  totals.netProfit = totals.totalContribution;
  totals.profitMargin = totals.totalRevenue > 0 ? (totals.netProfit / totals.totalRevenue) * 100 : 0;
  totals.breakEvenRoas = grossMargin > 0 ? price / grossMargin : 0;
  totals.breakEvenOrders = grossMargin > 0 ? totals.totalBudget / grossMargin : 0;

  // Retention value
  if (state.scaling.retention && state.scaling.retention !== 'none') {
    const retention = RETENTION[state.scaling.retention];
    const ltvBoost = retention.ltvMult;
    totals.ltvRevenue = Math.round(totals.totalRevenue * (ltvBoost - 1) * 0.5);
    totals.adjustedRevenue = totals.totalRevenue + totals.ltvRevenue;
    totals.adjustedProfit = totals.netProfit + totals.ltvRevenue;
    totals.adjustedRoas = totals.totalBudget > 0 ? totals.adjustedRevenue / totals.totalBudget : 0;
  } else {
    totals.ltvRevenue = 0;
    totals.adjustedRevenue = totals.totalRevenue;
    totals.adjustedProfit = totals.netProfit;
    totals.adjustedRoas = totals.avgROAS;
  }

  return totals;
}

// ============================================================
// FUNNEL BREAKDOWN (TOFU/MOFU/BOFU)
// ============================================================
function computeFunnelBreakdown(state, totals, platformResults) {
  const objective = OBJECTIVES[state.objective.primaryGoal];
  const funnelStage = objective.funnelStage;

  // Distribution depends on objective
  const distribution = {
    awareness: { tofu: 1.0, mofu: 0.15, bofu: 0.05 },
    traffic: { tofu: 0.7, mofu: 0.4, bofu: 0.15 },
    engagement: { tofu: 1.0, mofu: 0.10, bofu: 0.03 },
    leads: { tofu: 0.5, mofu: 0.7, bofu: 0.35 },
    sales: { tofu: 0.4, mofu: 0.6, bofu: 0.8 },
    catalog: { tofu: 0.35, mofu: 0.55, bofu: 0.95 },
    appInstalls: { tofu: 0.5, mofu: 0.65, bofu: 0.5 }
  };

  const dist = distribution[state.objective.primaryGoal] || { tofu: 0.5, mofu: 0.5, bofu: 0.5 };

  // Retargeting boosts MOFU/BOFU
  const retargetBoost = state.funnel.retargetingStrategy ? 1.4 : 1.0;
  const cartBoost = state.funnel.abandonedCart ? 1.25 : 1.0;

  const tofu = {
    impressions: Math.round(totals.totalImpressions),
    reach: Math.round(totals.totalReach),
    clicks: Math.round(totals.totalClicks * dist.tofu * 1.0),
    label: 'TOFU — الوعي والاكتشاف',
    desc: 'الجمهور البارد اللي بيشوف العلامة لأول مرة',
    budgetShare: Math.round(totals.totalBudget * (dist.tofu / (dist.tofu + dist.mofu + dist.bofu)) * 100) / 100
  };

  const mofu = {
    impressions: Math.round(totals.totalImpressions * 0.4),
    reach: Math.round(totals.totalReach * 0.3),
    clicks: Math.round(totals.totalClicks * dist.mofu * retargetBoost),
    label: 'MOFU — التفكير والمقارنة',
    desc: 'الجمهور اللي مهتم ويقارن بين الحلول',
    budgetShare: Math.round(totals.totalBudget * (dist.mofu / (dist.tofu + dist.mofu + dist.bofu)) * 100) / 100
  };

  const bofu = {
    impressions: Math.round(totals.totalImpressions * 0.15),
    reach: Math.round(totals.totalReach * 0.1),
    clicks: Math.round(totals.totalClicks * dist.bofu * retargetBoost * cartBoost),
    orders: totals.totalOrders,
    label: 'BOFU — القرار والشراء',
    desc: 'الجمهور الجاهز للشراء ومحتاج دفعة أخيرة',
    budgetShare: Math.round(totals.totalBudget * (dist.bofu / (dist.tofu + dist.mofu + dist.bofu)) * 100) / 100
  };

  return { tofu, mofu, bofu, distribution: dist };
}

// ============================================================
// COHORT ANALYSIS (12-month LTV simulation)
// ============================================================
function computeCohortAnalysis(state, totals, ind) {
  const churnRate = ind.churnRate || 0.30;
  const retentionMult = state.scaling.retention && state.scaling.retention !== 'none' 
    ? RETENTION[state.scaling.retention].ltvMult 
    : 1.0;
  const effectiveChurn = churnRate / retentionMult;

  const aov = totals.avgAOV || ind.aov;
  const cohorts = [];
  const monthlyCustomers = Math.round(totals.totalOrders / Math.max(1, state.budget.duration / 30));

  for (let month = 1; month <= 12; month++) {
    const retainedRate = Math.pow(1 - effectiveChurn, month - 1);
    const activeCustomers = Math.round(monthlyCustomers * retainedRate);
    const monthlyRevenue = Math.round(activeCustomers * aov);
    cohorts.push({
      month,
      monthLabel: `الشهر ${month}`,
      activeCustomers,
      retainedRate: parseFloat((retainedRate * 100).toFixed(1)),
      revenue: monthlyRevenue,
      cumulative: month > 1 ? cohorts[month - 2].cumulative + monthlyRevenue : monthlyRevenue
    });
  }

  const ltv = cohorts.reduce((sum, c) => sum + c.revenue, 0) / Math.max(1, monthlyCustomers);
  const cac = totals.avgCPA;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  return {
    cohorts,
    ltv: Math.round(ltv),
    cac: Math.round(cac),
    ltvCacRatio: parseFloat(ltvCacRatio.toFixed(2)),
    health: ltvCacRatio >= 3 ? 'excellent' : ltvCacRatio >= 2 ? 'good' : ltvCacRatio >= 1 ? 'warning' : 'danger',
    effectiveChurn: parseFloat((effectiveChurn * 100).toFixed(1))
  };
}

// ============================================================
// ATTRIBUTION COMPARISON
// ============================================================
function computeAttributionAnalysis(state, platformResults) {
  const totalRevenue = platformResults.reduce((s, p) => s + p.revenue, 0);

  // Simulate how different models attribute revenue
  // Based on platform position in the funnel
  const platformFunnelBias = {
    meta: { tofu: 0.35, mofu: 0.40, bofu: 0.25 },
    tiktok: { tofu: 0.65, mofu: 0.25, bofu: 0.10 },
    google: { tofu: 0.15, mofu: 0.25, bofu: 0.60 },
    youtube: { tofu: 0.55, mofu: 0.30, bofu: 0.15 },
    snapchat: { tofu: 0.70, mofu: 0.20, bofu: 0.10 },
    linkedin: { tofu: 0.25, mofu: 0.40, bofu: 0.35 },
    pinterest: { tofu: 0.40, mofu: 0.40, bofu: 0.20 },
    x: { tofu: 0.60, mofu: 0.25, bofu: 0.15 }
  };

  const models = {
    lastTouch: {},
    firstTouch: {},
    linear: {},
    timeDecay: {},
    position: {},
    dataDriven: {}
  };

  platformResults.forEach(p => {
    const bias = platformFunnelBias[p.platform] || { tofu: 0.33, mofu: 0.33, bofu: 0.33 };

    models.lastTouch[p.platform] = totalRevenue * bias.bofu;
    models.firstTouch[p.platform] = totalRevenue * bias.tofu;
    models.linear[p.platform] = totalRevenue / platformResults.length;
    models.timeDecay[p.platform] = totalRevenue * (bias.bofu * 0.5 + bias.mofu * 0.35 + bias.tofu * 0.15);
    models.position[p.platform] = totalRevenue * (bias.tofu * 0.4 + bias.bofu * 0.4 + bias.mofu * 0.2);
    models.dataDriven[p.platform] = totalRevenue * ((bias.tofu + bias.mofu + bias.bofu) / 3);
  });

  return {
    models,
    recommended: state.analytics.attributionModel || 'dataDriven',
    recommendedName: state.analytics.attributionModel ? ATTRIBUTION[state.analytics.attributionModel].name : 'Data-Driven',
    insights: generateAttributionInsights(models, platformResults)
  };
}

function generateAttributionInsights(models, platformResults) {
  const insights = [];
  if (platformResults.length < 2) return insights;

  // Compare lastTouch vs firstTouch variance
  const lastTouchValues = Object.values(models.lastTouch);
  const firstTouchValues = Object.values(models.firstTouch);
  const lastTouchMax = Math.max(...lastTouchValues);
  const firstTouchMax = Math.max(...firstTouchValues);
  
  if (lastTouchMax > firstTouchMax * 1.5) {
    insights.push({
      type: 'warning',
      text: 'اختيار Last-Touch ممكن يحسب كل الفضل لمنصة BOFU (زي Google) ويقلل قيمة الوعي (زي TikTok).'
    });
  }

  if (firstTouchMax > lastTouchMax * 1.5) {
    insights.push({
      type: 'info',
      text: 'First-Touch بيبرز دور TOFU (الوعي). مناسب لو بتقيس النمو طويل الأمد.'
    });
  }

  insights.push({
    type: 'success',
    text: 'استخدام Data-Driven Attribution يعطيك أدق صورة لتوزيع الفلوس بين المنصات.'
  });

  return insights;
}

// ============================================================
// LEARNING PHASE
// ============================================================
function simulateLearningPhase(state, totals) {
  const platformCount = state.channels.platforms.length;
  const avgBudgetPerDay = totals.totalBudget / Math.max(1, state.budget.duration);
  const biddingType = state.optimization.bidding;
  const baseLearningDays = biddingType ? BIDDING_STRATEGY[biddingType].learningDays : 7;

  // Learning days depend on budget + platforms + bidding
  const learningDaysPerPlatform = baseLearningDays * (platformCount > 1 ? 1.2 : 1.0);
  const totalLearningDays = Math.round(learningDaysPerPlatform * Math.min(3, platformCount));

  // Budget affects learning speed (higher budget = faster)
  const budgetFactor = avgBudgetPerDay > 1000 ? 0.8 : avgBudgetPerDay > 500 ? 1.0 : 1.3;
  const adjustedLearningDays = Math.round(totalLearningDays * budgetFactor);

  // Revenue during learning is typically 60-70% of stable
  const revenueDuringLearning = Math.round(totals.totalRevenue * (adjustedLearningDays / state.budget.duration) * 0.65);
  const revenueStable = totals.totalRevenue - revenueDuringLearning;

  return {
    learningDays: adjustedLearningDays,
    totalDays: state.budget.duration,
    learningPhasePercent: Math.round((adjustedLearningDays / state.budget.duration) * 100),
    revenueDuringLearning,
    revenueStable,
    recommendation: adjustedLearningDays > state.budget.duration * 0.4
      ? 'مدة التعلم طويلة جداً — زود الميزانية اليومية أو قلل عدد المنصات'
      : adjustedLearningDays > state.budget.duration * 0.25
      ? 'مدة التعلم معقولة — استمر بالمتابعة'
      : 'مدة التعلم سريعة — إعداد ممتاز'
  };
}

// ============================================================
// AD FATIGUE
// ============================================================
function simulateAdFatigue(state, totals, ind) {
  const frequency = ind.avgFrequency || 2.5;
  const creativeVariants = state.creative.variants || 3;
  const duration = state.budget.duration;

  // Fatigue rate per week
  const baseFatigue = 0.08; // 8% per week baseline
  const freqFactor = Math.max(0.5, frequency / 2.5);
  const variantFactor = Math.max(0.5, 3 / creativeVariants);
  const weeklyFatigue = baseFatigue * freqFactor * variantFactor;

  // Weeks until performance drops 30%
  const weeksTo30PercentDrop = Math.round(Math.log(0.70) / Math.log(1 - weeklyFatigue));
  const durationWeeks = duration / 7;

  // Performance degradation over the campaign
  const avgPerformance = durationWeeks > 0
    ? (1 - Math.pow(1 - weeklyFatigue, durationWeeks)) / (weeklyFatigue * durationWeeks)
    : 1;

  const degradation = Math.round((1 - avgPerformance) * 100);

  return {
    weeklyFatigue: parseFloat((weeklyFatigue * 100).toFixed(1)),
    weeksTo30PercentDrop,
    campaignWeeks: Math.round(durationWeeks),
    avgPerformance: parseFloat(avgPerformance.toFixed(3)),
    degradation,
    severity: degradation > 30 ? 'high' : degradation > 15 ? 'medium' : 'low',
    recommendation: degradation > 30
      ? 'كرياتيفك هيتعب بسرعة — جهز بدائل كل أسبوعين أو زود عدد الـ variants'
      : degradation > 15
      ? 'يحتاج تجديد كرياتيف كل 3-4 أسابيع'
      : 'الكرياتيف مستقر — يمكنك الاستمرار بمتابعة'
  };
}

// ============================================================
// RISK ANALYSIS
// ============================================================
function computeRisks(state, ind, totals) {
  const risks = [];
  let totalRiskScore = 0;

  // 1. Competition risk
  const compLevel = state.market.competitionLevel || ind.competition;
  if (compLevel === 'high') {
    risks.push({
      severity: 'high',
      category: 'المنافسة',
      title: 'منافسة شرسة في السوق',
      desc: 'القطاع ده فيه منافسة عالية — CPM أعلى وCVR أقل. تحتاج تميز واضح.',
      mitigation: 'ركز على الزاوية التسويقية الفريدة (USP) + استهدف جماهير ضيقة عالية النية.'
    });
    totalRiskScore += 25;
  } else if (compLevel === 'medium') {
    totalRiskScore += 12;
  }

  // 2. Budget risk
  if (state.budget.totalBudget < 10000) {
    risks.push({
      severity: 'high',
      category: 'الميزانية',
      title: 'الميزانية منخفضة جداً',
      desc: 'الميزانية تحت 10,000 ج.م — صعب تدريب الخوارزمية والوصول لـ Learning Phase كامل.',
      mitigation: 'ارفع الميزانية لـ 20,000 ج.م على الأقل، أو ابدأ بمنصة واحدة فقط.'
    });
    totalRiskScore += 20;
  } else if (state.budget.totalBudget < 30000) {
    totalRiskScore += 8;
  }

  // 3. Platform dependency
  if (state.channels.platforms.length === 1) {
    risks.push({
      severity: 'medium',
      category: 'التنويع',
      title: 'اعتماد على منصة واحدة',
      desc: 'لو المنصة دي حصل فيها تغيير (خوارزمية أو سياسة) — هتتأثر بشدة.',
      mitigation: 'جرب تستثمر 20-30% على منصة تانية بعد ما تثبت الأولى.'
    });
    totalRiskScore += 15;
  }

  // 4. Seasonality
  const season = state.budget.seasonality;
  if (season && season !== 'normal' && SEASONALITY[season]) {
    const s = SEASONALITY[season];
    if (s.cpmMult > 1.25) {
      risks.push({
        severity: 'medium',
        category: 'الموسمية',
        title: `موسم ${s.name} — CPM أعلى`,
        desc: `CPM في ${s.name} بيعلى ${Math.round((s.cpmMult - 1) * 100)}% بسبب زيادة الطلب.`,
        mitigation: 'خصص ميزانية احتياطية 15-20% + ركز على عروض قوية للتميز.'
      });
      totalRiskScore += 10;
    }
  }

  // 5. Creative fatigue
  if (state.creative.variants < 3) {
    risks.push({
      severity: 'medium',
      category: 'الكرياتيف',
      title: 'عدد variants قليل',
      desc: `عندك ${state.creative.variants} variant بس — الإعلانات هتتعب بسرعة.`,
      mitigation: 'جهز 4-6 variants مختلفة (زوايا وعروض مختلفة).'
    });
    totalRiskScore += 10;
  }

  // 6. Tracking risk
  if (state.analytics.trackingSetup === 'basic') {
    risks.push({
      severity: 'medium',
      category: 'القياس',
      title: 'تتبع أساسي',
      desc: 'بدون Conversion API و Advanced Matching — البيانات ناقصة والخوارزمية مش بتتعلم.',
      mitigation: 'فعّل Meta Conversion API + Google Tag Manager + Server-side tracking.'
    });
    totalRiskScore += 10;
  }

  // 7. Landing page
  const lpQuality = state.funnel.landingQuality;
  if (lpQuality === 'bad' || lpQuality === 'veryBad') {
    risks.push({
      severity: 'high',
      category: 'صفحة الهبوط',
      title: 'صفحة هبوط ضعيفة',
      desc: 'صفحة هبوط ضعيفة بتقلل الـ CVR بـ 35-60% — أكبر سبب لخسارة الحملات.',
      mitigation: 'استثمر في تحسين الصفحة: سرعة التحميل، وضوح العرض، CTA قوي، Social Proof.'
    });
    totalRiskScore += 25;
  }

  // 8. Objective mismatch
  const objective = OBJECTIVES[state.objective.primaryGoal];
  if (objective && objective.cvrMult < 0.6 && state.foundation.cogs > 40) {
    risks.push({
      severity: 'high',
      category: 'الهدف',
      title: 'عدم توافق الهدف مع الربحية',
      desc: 'هدف الوعي/التفاعل مع COGS عالي = خسارة صافية مؤكدة.',
      mitigation: 'غيّر الهدف لـ Sales أو Leads أو حسّن هامش الربح أولاً.'
    });
    totalRiskScore += 20;
  }

  // Overall risk level
  const riskLevel = totalRiskScore > 60 ? 'high' : totalRiskScore > 35 ? 'medium' : 'low';

  return {
    risks,
    totalRiskScore: Math.min(100, totalRiskScore),
    riskLevel,
    riskLabel: riskLevel === 'high' ? 'مخاطر عالية ⚠️' : riskLevel === 'medium' ? 'مخاطر متوسطة ⚡' : 'مخاطر منخفضة ✅'
  };
}

// ============================================================
// SCORING (8 dimensions)
// ============================================================
function computeScores(state, totals, funnel, cohort, risks) {
  const scores = {
    strategyQuality: computeStrategyScore(state),
    targeting: computeTargetingScore(state),
    creativeQuality: computeCreativeScore(state),
    budgetEfficiency: computeBudgetScore(state, totals),
    funnelIntegrity: computeFunnelScore(state, funnel),
    sustainability: computeSustainabilityScore(state, cohort),
    measurement: computeMeasurementScore(state),
    profitability: computeProfitabilityScore(state, totals)
  };

  // Weighted total
  let weightedSum = 0;
  let totalWeight = 0;
  Object.entries(SCORE_WEIGHTS).forEach(([key, weight]) => {
    if (scores[key] !== undefined) {
      weightedSum += scores[key] * weight;
      totalWeight += weight;
    }
  });
  const overall = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  // Deduct risk
  const riskDeduction = Math.min(15, risks.totalRiskScore * 0.2);
  const adjustedOverall = Math.max(0, Math.round(overall - riskDeduction));

  return {
    ...scores,
    overall,
    adjustedOverall,
    riskDeduction: Math.round(riskDeduction),
    weights: SCORE_WEIGHTS
  };
}

function computeStrategyScore(state) {
  let score = 30;
  if (state.framework.primary) score += 25;
  if (state.framework.secondary) score += 10;
  if (state.market.uniqueAdvantage) score += 10;
  if (state.foundation.pricingStrategy) score += 10;
  if (state.persona.journeyStage) score += 10;
  if (state.persona.painPoints.length > 0) score += 5;
  return Math.min(100, score);
}

function computeTargetingScore(state) {
  let score = 40;
  if (state.persona.ageRange.length >= 2) score += 15;
  if (state.persona.gender !== 'all') score += 10;
  if (state.persona.painPoints.length >= 3) score += 15;
  if (state.persona.buyingTriggers.length >= 2) score += 10;
  if (state.market.targetMarketSize) score += 10;
  return Math.min(100, score);
}

function computeCreativeScore(state) {
  let score = 30;
  if (state.creative.type) {
    const ct = CREATIVE_TYPES[state.creative.type];
    score += ct.mult * 20;
  }
  if (state.creative.hook) {
    const hq = HOOK_QUALITY[state.creative.hook];
    score += (hq.mult - 0.5) * 20;
  }
  if (state.creative.offer && state.creative.offer !== 'none') score += 15;
  if (state.creative.messagingAngle) score += 10;
  if (state.creative.variants >= 3) score += 10;
  if (state.creative.productionQuality === 'high' || state.creative.productionQuality === 'premium') score += 10;
  return Math.min(100, Math.round(score));
}

function computeBudgetScore(state, totals) {
  let score = 40;
  const cpaRatio = totals.avgCPA / state.foundation.price;
  if (cpaRatio < 0.3) score += 30;
  else if (cpaRatio < 0.5) score += 20;
  else if (cpaRatio < 0.7) score += 10;
  else score -= 15;

  if (state.budget.totalBudget >= 50000) score += 15;
  else if (state.budget.totalBudget >= 20000) score += 10;

  if (state.budget.reservePercent >= 10) score += 10;
  if (state.budget.pacing === 'even') score += 10;

  return Math.max(0, Math.min(100, score));
}

function computeFunnelScore(state, funnel) {
  let score = 40;
  if (state.funnel.retargetingStrategy) score += 20;
  if (state.funnel.abandonedCart) score += 15;
  if (state.funnel.funnelType !== 'direct') score += 15;
  if (state.creative.offer && state.creative.offer !== 'none') score += 10;
  return Math.min(100, score);
}

function computeSustainabilityScore(state, cohort) {
  let score = 30;
  if (state.scaling.retention && state.scaling.retention !== 'none') score += 25;
  if (state.scaling.referralProgram) score += 15;
  if (state.scaling.upsellStrategy) score += 10;
  if (cohort.ltvCacRatio >= 3) score += 25;
  else if (cohort.ltvCacRatio >= 2) score += 15;
  else if (cohort.ltvCacRatio >= 1) score += 5;
  return Math.min(100, Math.round(score));
}

function computeMeasurementScore(state) {
  let score = 30;
  if (state.analytics.trackingSetup === 'advanced') score += 30;
  else if (state.analytics.trackingSetup === 'world-class') score += 50;
  else score += 10;

  if (state.analytics.attributionModel === 'dataDriven') score += 20;
  else if (state.analytics.attributionModel) score += 10;

  if (state.analytics.reportingCadence === 'daily') score += 10;
  else if (state.analytics.reportingCadence === 'weekly') score += 5;

  return Math.min(100, score);
}

function computeProfitabilityScore(state, totals) {
  if (totals.netProfit <= 0) {
    const lossRatio = Math.abs(totals.netProfit) / Math.max(1, totals.totalBudget);
    return Math.max(0, Math.round(35 - lossRatio * 30));
  }
  const profitRatio = totals.netProfit / Math.max(1, totals.totalBudget);
  let score = 40 + profitRatio * 40;
  if (totals.avgROAS >= totals.breakEvenRoas * 2) score += 15;
  else if (totals.avgROAS >= totals.breakEvenRoas * 1.5) score += 10;
  return Math.min(100, Math.round(score));
}

// ============================================================
// VERDICT
// ============================================================
function computeVerdict(scores, totals) {
  const score = scores.adjustedOverall;

  let grade, color, icon, text;
  if (score >= 90) {
    grade = 'A+';
    color = 'green';
    icon = 'fa-trophy';
    text = 'استراتيجية عالمية المستوى 🏆';
  } else if (score >= 80) {
    grade = 'A';
    color = 'green';
    icon = 'fa-circle-check';
    text = 'استراتيجية احترافية ممتازة';
  } else if (score >= 70) {
    grade = 'B+';
    color = 'cyan';
    icon = 'fa-thumbs-up';
    text = 'استراتيجية جيدة جداً';
  } else if (score >= 60) {
    grade = 'B';
    color = 'cyan';
    icon = 'fa-check';
    text = 'استراتيجية جيدة';
  } else if (score >= 50) {
    grade = 'C';
    color = 'amber';
    icon = 'fa-triangle-exclamation';
    text = 'استراتيجية مقبولة — تحتاج تحسينات';
  } else if (score >= 35) {
    grade = 'D';
    color = 'orange';
    icon = 'fa-exclamation-circle';
    text = 'استراتيجية ضعيفة — تحتاج إعادة نظر';
  } else {
    grade = 'F';
    color = 'red';
    icon = 'fa-circle-xmark';
    text = 'استراتيجية خطيرة — ستفقد المال';
  }

  const profitText = totals.netProfit >= 0
    ? `+${totals.netProfit.toLocaleString('ar-EG')} ج.م`
    : `${totals.netProfit.toLocaleString('ar-EG')} ج.م`;

  return {
    grade,
    color,
    icon,
    text,
    score,
    summary: `بنتيجة ${score}/100 — ROAS المتوقع ${totals.avgROAS.toFixed(2)}x، وصافي الربح ${profitText}.`,
    isProfitable: totals.netProfit > 0 && totals.avgROAS >= totals.breakEvenRoas
  };
}

// ============================================================
// RECOMMENDATIONS
// ============================================================
function generateRecommendations(state, totals, scores, risks) {
  const recs = [];

  // Score-based
  Object.entries(scores).forEach(([key, value]) => {
    if (['overall', 'adjustedOverall', 'riskDeduction', 'weights'].includes(key)) return;
    if (value < 50) {
      const labels = {
        strategyQuality: 'الإطار الاستراتيجي',
        targeting: 'الاستهداف',
        creativeQuality: 'الكرياتيف',
        budgetEfficiency: 'كفاءة الميزانية',
        funnelIntegrity: 'سلامة الفانل',
        sustainability: 'الاستدامة',
        measurement: 'القياس والتتبع',
        profitability: 'الربحية'
      };
      recs.push({
        priority: 'high',
        category: labels[key] || key,
        title: `تحسين ${labels[key] || key}`,
        desc: `النتيجة ${Math.round(value)}/100 — تحتاج تحسين عاجل`
      });
    } else if (value < 70) {
      recs.push({
        priority: 'medium',
        category: 'تحسين',
        title: `فرص تحسين في ${key}`,
        desc: `النتيجة ${Math.round(value)}/100 — فيه مساحة للنمو`
      });
    }
  });

  // Profitability
  if (totals.netProfit < 0) {
    recs.push({
      priority: 'urgent',
      category: 'الربحية',
      title: '🚨 الاستراتيجية خاسرة',
      desc: `صافي الربح سالب (${totals.netProfit.toLocaleString('ar-EG')} ج.م). أولويات: (1) رفع السعر أو (2) تقليل COGS أو (3) تحسين الـ CVR.`
    });
  } else if (totals.avgROAS < totals.breakEvenRoas * 1.3) {
    recs.push({
      priority: 'high',
      category: 'الربحية',
      title: 'هامش الربح ضيق',
      desc: 'أنت فوق التعادل بس بفارق صغير. زود عرضك أو استهدف أعلى AOV.'
    });
  }

  // Learning phase
  const learningDays = Math.round(state.budget.duration * 0.4);
  if (state.channels.platforms.length > 2 && state.budget.totalBudget < 30000) {
    recs.push({
      priority: 'high',
      category: 'الميزانية',
      title: 'ميزانية مبعثرة على منصات كتير',
      desc: 'كل منصة محتاجة ميزانية كافية للتعلم. ابدأ بمنصة واحدة، وبعدين أضف الثانية.'
    });
  }

  // Creative
  if (state.creative.variants < 4) {
    recs.push({
      priority: 'medium',
      category: 'الكرياتيف',
      title: 'زود عدد Variants',
      desc: '4-6 variants مختلفة بتقلل التعب وتحسن الأداء 20-30%.'
    });
  }

  // Attribution
  if (!state.analytics.attributionModel || state.analytics.attributionModel === 'lastTouch') {
    recs.push({
      priority: 'medium',
      category: 'القياس',
      title: 'استخدم Data-Driven Attribution',
      desc: 'Last-Touch بيقلل قيمة الوعي. Data-Driven يعطيك الصورة الحقيقية.'
    });
  }

  // Retention
  if (!state.scaling.retention || state.scaling.retention === 'none') {
    recs.push({
      priority: 'medium',
      category: 'الاستدامة',
      title: 'أضف استراتيجية Retention',
      desc: 'الاحتفاظ بالعميل الحالي أرخص 5x من جلب عميل جديد. LTV هيرفع ربحيتك 30%+.'
    });
  }

  // Sort by priority
  const order = { urgent: 0, high: 1, medium: 2, low: 3 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
}

// ============================================================
// OPTIMIZATION OPPORTUNITIES
// ============================================================
function findOptimizations(state, totals) {
  const opts = [];

  // Creative optimizations
  if (state.creative.type === 'static') {
    opts.push({
      impact: 'high',
      area: 'Creative',
      current: 'Static Images',
      suggestion: 'جرب UGC أو Reels',
      expectedGain: '+30-45% في CTR وCVR'
    });
  }

  if (state.creative.hook === 'weak' || state.creative.hook === 'average') {
    opts.push({
      impact: 'high',
      area: 'Hook',
      current: HOOK_QUALITY[state.creative.hook].name,
      suggestion: 'استخدم Hook قوي في أول 2 ثانية',
      expectedGain: '+25-40% في الأداء الكلي'
    });
  }

  if (!state.creative.offer || state.creative.offer === 'none') {
    opts.push({
      impact: 'high',
      area: 'Offer',
      current: 'بدون عرض',
      suggestion: 'أضف خصم 15-20% أو Bundle',
      expectedGain: '+15-25% في CVR'
    });
  }

  // Landing
  if (state.funnel.landingQuality === 'average' || state.funnel.landingQuality === 'good') {
    opts.push({
      impact: 'high',
      area: 'Landing Page',
      current: LANDING_QUALITY[state.funnel.landingQuality].name,
      suggestion: 'استثمر في Landing Page عالمية (سرعة، CTA، Social Proof)',
      expectedGain: '+25-45% في CVR'
    });
  }

  // Tracking
  if (state.analytics.trackingSetup === 'basic') {
    opts.push({
      impact: 'medium',
      area: 'Tracking',
      current: 'Basic',
      suggestion: 'فعّل Conversion API + Server-side Tracking',
      expectedGain: '+10-15% في دقة البيانات وتحسين الخوارزمية'
    });
  }

  // Retargeting
  if (!state.funnel.retargetingStrategy) {
    opts.push({
      impact: 'high',
      area: 'Funnel',
      current: 'بدون Retargeting',
      suggestion: 'أضف Retargeting لزوار الموقع وسلات متروكة',
      expectedGain: '+20-35% في المبيعات الإجمالية'
    });
  }

  // Optimization event
  if (state.optimization.event === 'view' || state.optimization.event === 'click') {
    opts.push({
      impact: 'high',
      area: 'Optimization Event',
      current: OPT_EVENTS[state.optimization.event].name,
      suggestion: 'استخدم Purchase أو Initiate Checkout',
      expectedGain: '+20-30% في جودة الجمهور'
    });
  }

  // Testing
  if (state.optimization.testing === 'none') {
    opts.push({
      impact: 'medium',
      area: 'Testing',
      current: 'بدون اختبار',
      suggestion: 'ابدأ بـ A/B Testing منتظم',
      expectedGain: '+15-20% على المدى الطويل'
    });
  }

  // Retention
  if (!state.scaling.retention || state.scaling.retention === 'none') {
    opts.push({
      impact: 'high',
      area: 'Retention',
      current: 'بدون استراتيجية',
      suggestion: 'Email + Loyalty Program',
      expectedGain: '+30-60% في LTV'
    });
  }

  return opts;
}

// ============================================================
// HELPER: FORMAT REPORT AS HTML (for PDF export)
// ============================================================
export function generateReportHTML(result) {
  const { metadata, totals, platformResults, funnel, cohort, attribution, risks, scores, verdict, recommendations, optimizations, learningPhase, adFatigue } = result;

  const formatCurrency = (n) => `${Math.round(n).toLocaleString('ar-EG')} ج.م`;
  const formatPercent = (n) => `${n.toFixed(1)}%`;

  return `
    <div dir="rtl" style="font-family: 'IBM Plex Sans Arabic', Tahoma, sans-serif; padding: 30px; max-width: 900px; margin: 0 auto; color: #0f172a; background: #fff;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #d946ef;">
        <h1 style="font-size: 28px; margin: 0; color: #7c3aed;">تقرير محاكاة الاستراتيجية التسويقية</h1>
        <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">
          ${metadata.industry} · ${metadata.businessStage} · ${metadata.objective}
        </p>
        <p style="margin: 6px 0 0; font-size: 12px; color: #94a3b8;">
          ${new Date(metadata.generatedAt).toLocaleString('ar-EG')}
        </p>
      </div>

      <!-- Score -->
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%); padding: 30px; border-radius: 20px; color: white; text-align: center; margin-bottom: 30px;">
        <div style="font-size: 64px; font-weight: bold; margin-bottom: 8px;">${verdict.grade}</div>
        <div style="font-size: 40px; font-weight: bold; font-family: monospace; margin-bottom: 10px;">${verdict.score}/100</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${verdict.text}</div>
        <div style="font-size: 13px; opacity: 0.9;">${verdict.summary}</div>
      </div>

      <!-- Key Metrics -->
      <h2 style="font-size: 20px; color: #7c3aed; border-right: 4px solid #d946ef; padding-right: 12px; margin: 30px 0 20px;">الأرقام الرئيسية</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;">
        <tr style="background: #f1f5f9;">
          <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">المؤشر</th>
          <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">القيمة</th>
        </tr>
        <tr><td style="padding: 10px; border: 1px solid #cbd5e1;">إجمالي الميزانية</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #d946ef;">${formatCurrency(totals.totalBudget)}</td></tr>
        <tr style="background: #f8fafc;"><td style="padding: 10px; border: 1px solid #cbd5e1;">المشاهدات (Impressions)</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${totals.totalImpressions.toLocaleString('ar-EG')}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #cbd5e1;">الوصول (Reach)</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${totals.totalReach.toLocaleString('ar-EG')}</td></tr>
        <tr style="background: #f8fafc;"><td style="padding: 10px; border: 1px solid #cbd5e1;">النقرات</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${totals.totalClicks.toLocaleString('ar-EG')}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #cbd5e1;">الطلبات (Orders)</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${totals.totalOrders.toLocaleString('ar-EG')}</td></tr>
        <tr style="background: #f8fafc;"><td style="padding: 10px; border: 1px solid #cbd5e1;">الإيرادات</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #22c55e;">${formatCurrency(totals.totalRevenue)}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #cbd5e1;">ROAS</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: ${totals.avgROAS >= totals.breakEvenRoas ? '#22c55e' : '#ef4444'};">${totals.avgROAS.toFixed(2)}x</td></tr>
        <tr style="background: #f8fafc;"><td style="padding: 10px; border: 1px solid #cbd5e1;">CPA</td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${formatCurrency(totals.avgCPA)}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #cbd5e1;"><strong>صافي الربح</strong></td><td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; font-size: 15px; color: ${totals.netProfit >= 0 ? '#22c55e' : '#ef4444'};">${formatCurrency(totals.netProfit)}</td></tr>
      </table>

      <!-- Platform Breakdown -->
      <h2 style="font-size: 20px; color: #7c3aed; border-right: 4px solid #d946ef; padding-right: 12px; margin: 30px 0 20px;">أداء المنصات</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 30px;">
        <thead>
          <tr style="background: #7c3aed; color: white;">
            <th style="padding: 10px; text-align: right;">المنصة</th>
            <th style="padding: 10px; text-align: right;">الميزانية</th>
            <th style="padding: 10px; text-align: right;">CTR</th>
            <th style="padding: 10px; text-align: right;">CVR</th>
            <th style="padding: 10px; text-align: right;">الطلبات</th>
            <th style="padding: 10px; text-align: right;">ROAS</th>
            <th style="padding: 10px; text-align: right;">CPA</th>
          </tr>
        </thead>
        <tbody>
          ${platformResults.map(p => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">${p.name}</td>
              <td style="padding: 10px;">${formatCurrency(p.budget)}</td>
              <td style="padding: 10px;">${p.ctr}%</td>
              <td style="padding: 10px;">${p.cvr}%</td>
              <td style="padding: 10px;">${p.orders}</td>
              <td style="padding: 10px; font-weight: bold; color: ${p.isProfitable ? '#22c55e' : '#ef4444'};">${p.roas}x</td>
              <td style="padding: 10px;">${formatCurrency(p.cpa)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Scores -->
      <h2 style="font-size: 20px; color: #7c3aed; border-right: 4px solid #d946ef; padding-right: 12px; margin: 30px 0 20px;">تقييم الاستراتيجية (8 محاور)</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">جودة الاستراتيجية</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.strategyQuality}/100</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">الاستهداف</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.targeting}/100</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">جودة الكرياتيف</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.creativeQuality}/100</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">كفاءة الميزانية</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.budgetEfficiency}/100</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">سلامة الفانل</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.funnelIntegrity}/100</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">الاستدامة</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.sustainability}/100</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">القياس والتتبع</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.measurement}/100</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">الربحية</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${scores.profitability}/100</td></tr>
      </table>

      <!-- Risk Analysis -->
      <h2 style="font-size: 20px; color: #7c3aed; border-right: 4px solid #d946ef; padding-right: 12px; margin: 30px 0 20px;">تحليل المخاطر</h2>
      <div style="background: ${risks.riskLevel === 'high' ? '#fef2f2' : risks.riskLevel === 'medium' ? '#fffbeb' : '#f0fdf4'}; border-right: 4px solid ${risks.riskLevel === 'high' ? '#ef4444' : risks.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <strong>مستوى المخاطر الإجمالي: ${risks.totalRiskScore}/100 (${risks.riskLabel})</strong>
      </div>
      ${risks.risks.map(r => `
        <div style="border-right: 3px solid #f59e0b; padding: 12px; margin-bottom: 12px; background: #fffbeb; border-radius: 6px;">
          <div style="font-weight: bold; color: #b45309; margin-bottom: 5px;">⚠️ ${r.title}</div>
          <div style="font-size: 12px; color: #78716c; margin-bottom: 5px;">${r.desc}</div>
          <div style="font-size: 11px; color: #22c55e; font-weight: bold;">الحل: ${r.mitigation}</div>
        </div>
      `).join('')}

      <!-- Recommendations -->
      <h2 style="font-size: 20px; color: #7c3aed; border-right: 4px solid #d946ef; padding-right: 12px; margin: 30px 0 20px;">التوصيات</h2>
      ${recommendations.map(r => `
        <div style="padding: 12px; margin-bottom: 10px; background: ${r.priority === 'urgent' ? '#fef2f2' : r.priority === 'high' ? '#fef3c7' : '#f0f9ff'}; border-radius: 8px; border-right: 3px solid ${r.priority === 'urgent' ? '#ef4444' : r.priority === 'high' ? '#f59e0b' : '#3b82f6'};">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 3px;">${r.title}</div>
          <div style="font-size: 12px; color: #475569;">${r.desc}</div>
        </div>
      `).join('')}

      <!-- Optimizations -->
      <h2 style="font-size: 20px; color: #7c3aed; border-right: 4px solid #d946ef; padding-right: 12px; margin: 30px 0 20px;">فرص التحسين</h2>
      ${optimizations.map(o => `
        <div style="padding: 12px; margin-bottom: 10px; background: #f0fdf4; border-radius: 8px; border-right: 3px solid #22c55e;">
          <div style="font-weight: bold; color: #166534; margin-bottom: 3px;">${o.area}: ${o.suggestion}</div>
          <div style="font-size: 12px; color: #475569;">التوقع: ${o.expectedGain}</div>
        </div>
      `).join('')}

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
        تقرير تم إنشاؤه بواسطة محاكي الاستراتيجيات — إسلام سعيد · islamsaeid.me
      </div>

    </div>
  `;
}
