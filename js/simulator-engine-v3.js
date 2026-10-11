// ============================================================
// Simulator Engine v3.0 — Monte Carlo + Probability Distributions
// ============================================================
// Architecture:
// 1. Each input metric has a real probability distribution
// 2. Run 10,000 iterations per simulation
// 3. Output: P10, P25, P50, P75, P90 + Confidence Intervals
// 4. Based on real MENA/Egypt market benchmarks
// ============================================================

import {
  INDUSTRIES, PLATFORMS, OBJECTIVES, FRAMEWORKS, CHANNEL_TYPES,
  CREATIVE_TYPES, HOOK_QUALITY, OFFER_STRENGTH, LANDING_QUALITY,
  BIDDING_STRATEGY, OPT_EVENTS, TESTING, SCALING, RETENTION,
  ATTRIBUTION, BUSINESS_STAGE, JOURNEY_STAGES, PRICING_STRATEGY,
  SEASONALITY, getCurrentSeason, SCORE_WEIGHTS, RISK_FACTORS
} from './simulator-data.js';

const ITERATIONS = 10000;
const CONFIDENCE_LEVEL = 0.80; // 80% CI

// ============================================================
// STATISTICAL HELPERS
// ============================================================
class RNG {
  constructor(seed = Date.now()) {
    this.seed = seed;
  }
  // Mulberry32 PRNG
  next() {
    this.seed |= 0;
    this.seed = (this.seed + 0x6D2B79F5) | 0;
    let t = Math.imul(this.seed ^ (this.seed >>> 15), 1 | this.seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  // Box-Muller for normal distribution
  normal(mean = 0, std = 1) {
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1 || 1e-9)) * Math.cos(2 * Math.PI * u2);
    return mean + z * std;
  }
  // Log-normal (for CTR/CVR — positive, skewed)
  logNormal(median, sigma = 0.4) {
    const mu = Math.log(median);
    const z = this.normal(0, 1);
    return Math.exp(mu + sigma * z);
  }
  // Gamma (for orders/aggregations)
  gamma(shape, scale) {
    // Marsaglia-Tsang method
    if (shape < 1) {
      const u = this.next();
      return this.gamma(shape + 1, scale) * Math.pow(u, 1 / shape);
    }
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
      let x, v;
      do {
        x = this.normal(0, 1);
        v = 1 + c * x;
      } while (v <= 0);
      v = v * v * v;
      const u = this.next();
      if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
    }
  }
  // Beta (for rates constrained to [0,1])
  beta(a, b) {
    const x = this.gamma(a, 1);
    const y = this.gamma(b, 1);
    return x / (x + y);
  }
  // Triangular (for bounded ranges with a mode)
  triangular(min, mode, max) {
    const u = this.next();
    const F = (mode - min) / (max - min);
    if (u < F) {
      return min + Math.sqrt(u * (max - min) * (mode - min));
    }
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
  // Pert (modified beta — best for expert estimates)
  pert(min, mode, max, lambda = 4) {
    const range = max - min;
    if (range === 0) return min;
    const mu = (min + lambda * mode + max) / (lambda + 2);
    const alpha = ((mu - min) / range) * ((2 * lambda + 2) / (lambda + 1));
    const betaParam = ((max - mu) / range) * ((2 * lambda + 2) / (lambda + 1));
    return min + this.beta(alpha, betaParam) * range;
  }
}

// ============================================================
// PERCENTILE COMPUTATION
// ============================================================
function percentile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = (p / 100) * (sortedArr.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sortedArr[lower];
  const weight = idx - lower;
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

function computeStats(arr) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  const p10 = percentile(sorted, 10);
  const p25 = percentile(sorted, 25);
  const p50 = percentile(sorted, 50);
  const p75 = percentile(sorted, 75);
  const p90 = percentile(sorted, 90);
  const p5 = percentile(sorted, 5);
  const p95 = percentile(sorted, 95);
  const min = sorted[0];
  const max = sorted[n - 1];
  // Probability of profit > 0
  const profitCount = sorted.filter(v => v > 0).length;
  const profitProbability = (profitCount / n) * 100;
  return { mean, std, p5, p10, p25, p50, p75, p90, p95, min, max, profitProbability };
}

// ============================================================
// DISTRIBUTION SAMPLING — based on real market variance
// ============================================================
function sampleCPM(rng, baseCPM, marketVariance = 0.20) {
  // CPM follows log-normal (positive, right-skewed)
  // σ = 0.20 → ~20% coefficient of variation
  return rng.logNormal(baseCPM, marketVariance);
}

function sampleCTR(rng, baseCTR, creativeQuality = 1.0) {
  // CTR varies more (0.30-0.50 CV depending on quality)
  const cv = 0.35 / Math.sqrt(creativeQuality);
  const median = baseCTR;
  return rng.logNormal(median, cv);
}

function sampleCVR(rng, baseCVR, qualityMult = 1.0) {
  // CVR has the widest variance in real campaigns
  const cv = 0.45 / Math.sqrt(qualityMult);
  const median = baseCVR;
  return rng.logNormal(median, cv);
}

function sampleAOV(rng, baseAOV) {
  // AOV has moderate variance (0.25 CV)
  return rng.logNormal(baseAOV, 0.25);
}

function sampleOrdersMean(rng, budget, cpm, ctr, cvr, aov) {
  // Deterministic mean estimate
  if (!cpm || !ctr || !cvr) return 0;
  const impressions = (budget / cpm) * 1000;
  const clicks = impressions * (ctr / 100);
  const lpv = clicks * 0.85;
  const orders = lpv * (cvr / 100);
  return orders;
}

// ============================================================
// SIMULATION INPUTS NORMALIZER
// ============================================================
function normalizeInputs(state) {
  const ind = INDUSTRIES[state.foundation.industry];
  const stage = BUSINESS_STAGE[state.foundation.businessStage];
  const objective = OBJECTIVES[state.objective.primaryGoal];
  const primaryFw = state.framework.primary ? FRAMEWORKS[state.framework.primary] : null;
  const secondaryFw = state.framework.secondary ? FRAMEWORKS[state.framework.secondary] : null;

  // Compute multiplicative adjustments (deterministic)
  let frameworkMult = 1.0;
  if (primaryFw) frameworkMult *= primaryFw.effectiveness;
  if (secondaryFw) frameworkMult *= (1 + (secondaryFw.effectiveness - 1) * 0.5);

  const stageMult = stage.mult;
  const objectiveCvrMult = objective.cvrMult;

  const creativeTypeMult = state.creative.type ? CREATIVE_TYPES[state.creative.type].mult : 1.0;
  const hookMult = state.creative.hook ? HOOK_QUALITY[state.creative.hook].mult : 1.0;
  const offerMult = state.creative.offer ? OFFER_STRENGTH[state.creative.offer].mult : 1.0;
  const landingMult = state.funnel.landingQuality ? LANDING_QUALITY[state.funnel.landingQuality].mult : 1.0;
  const retargetingMult = state.funnel.retargetingStrategy ? 1.15 : 1.0;
  const cartMult = state.funnel.abandonedCart ? 1.08 : 1.0;
  const testingMult = state.optimization.testing ? TESTING[state.optimization.testing].mult : 1.0;
  const biddingMult = state.optimization.bidding ? BIDDING_STRATEGY[state.optimization.bidding].mult : 1.0;
  const eventMult = state.optimization.event ? OPT_EVENTS[state.optimization.event].cvrMult : 1.0;
  const trackingMap = { basic: 0.90, advanced: 1.0, 'world-class': 1.15 };
  const trackingMult = state.analytics.trackingSetup ? trackingMap[state.analytics.trackingSetup] : 1.0;
  const attributionMap = { lastTouch: 0.95, firstTouch: 1.05, linear: 1.0, timeDecay: 1.05, position: 1.05, dataDriven: 1.15 };
  const attributionMult = state.analytics.attributionModel ? attributionMap[state.analytics.attributionModel] : 1.0;

  // Channel synergy
  let channelSynergy = 1.0;
  const mix = state.channels.mix || [];
  if (mix.includes('paid') && mix.includes('owned')) channelSynergy *= 1.15;
  if (mix.includes('paid') && mix.includes('shared')) channelSynergy *= 1.10;
  if (mix.includes('earned') && mix.includes('owned')) channelSynergy *= 1.12;
  if (mix.length === 4) channelSynergy *= 1.20;
  if (mix.length === 1 && mix[0] === 'paid') channelSynergy *= 0.95;

  // Seasonality
  const season = state.budget.seasonality === 'normal' || !state.budget.seasonality
    ? getCurrentSeason()
    : { key: state.budget.seasonality, ...SEASONALITY[state.budget.seasonality] };

  // Compound multipliers
  const cvrCompound = 
    frameworkMult * stageMult * objectiveCvrMult *
    creativeTypeMult * hookMult * offerMult * landingMult *
    retargetingMult * cartMult * testingMult * biddingMult *
    eventMult * trackingMult * attributionMult * channelSynergy;

  return {
    industry: ind,
    stage,
    objective,
    season,
    cvrCompound,
    channelSynergy,
    landingMult,
    pricingStrategy: state.foundation.pricingStrategy ? PRICING_STRATEGY[state.foundation.pricingStrategy] : null
  };
}

// ============================================================
// CORE MONTE CARLO SIMULATION
// ============================================================
export function runSimulation(state) {
  const validation = validateState(state);
  if (!validation.valid) return { error: validation.errors };

  const normalized = normalizeInputs(state);
  const platforms = state.channels.platforms;
  const totalBudget = state.budget.totalBudget;
  const reserveRatio = state.budget.reservePercent / 100;
  const deployableBudget = totalBudget * (1 - reserveRatio);
  const avgBudget = deployableBudget / platforms.length;

  // Seed RNG with deterministic hash of state (reproducible results)
  const stateHash = hashState(state);
  const rng = new RNG(stateHash);

  // Per-platform iteration containers
  const perPlatformIterations = {};
  platforms.forEach(pk => {
    perPlatformIterations[pk] = {
      revenue: [],
      orders: [],
      impressions: [],
      clicks: [],
      cpa: [],
      roas: [],
      profit: []
    };
  });

  // Aggregated iteration containers
  const totalIterations = {
    revenue: [],
    orders: [],
    impressions: [],
    clicks: [],
    cpa: [],
    roas: [],
    profit: [],
    cogsCost: [],
    budgetUsed: []
  };

  // Run 10,000 iterations
  for (let iter = 0; iter < ITERATIONS; iter++) {
    let iterRevenue = 0;
    let iterOrders = 0;
    let iterImpressions = 0;
    let iterClicks = 0;
    let iterCogs = 0;
    let iterSpend = 0;

    // Platform-specific sampling
    platforms.forEach(pk => {
      const p = PLATFORMS[pk];
      const budget = state.budget.allocations[pk] || avgBudget;

      // Sample each metric from its distribution
      const baseCPM = normalized.industry.cpm * p.cpmMult * normalized.season.cpmMult;
      const sampledCPM = sampleCPM(rng, baseCPM, 0.22);

      const baseCTR = normalized.industry.ctr * p.ctrMult * (1 + (normalized.cvrCompound - 1) * 0.25);
      const sampledCTR = sampleCTR(rng, baseCTR, normalized.cvrCompound);

      const baseCVR = normalized.industry.cvr * p.cvrMult * normalized.cvrCompound * (normalized.season.cvrMult * 0.4 + 0.6);
      const sampledCVR = sampleCVR(rng, baseCVR, normalized.cvrCompound);

      const baseAOV = normalized.industry.aov * (state.scaling.upsellStrategy ? 1.15 : 1.0);
      const sampledAOV = sampleAOV(rng, baseAOV);

      // Compute this iteration's outcome
      const impressions = sampledCPM > 0 ? (budget / sampledCPM) * 1000 : 0;
      const clicks = impressions * (sampledCTR / 100);
      const lpv = clicks * 0.85;
      const orders = lpv * (sampledCVR / 100);
      const revenue = orders * sampledAOV;

      // Additional variance on orders (Poisson-like count variance)
      const poissonVariance = orders > 0 ? rng.normal(1, 1 / Math.sqrt(orders + 1)) : 1;
      const adjustedOrders = Math.max(0, orders * poissonVariance);
      const adjustedRevenue = adjustedOrders * sampledAOV;

      const cogsCost = adjustedRevenue * (state.foundation.cogs / 100);

      iterRevenue += adjustedRevenue;
      iterOrders += adjustedOrders;
      iterImpressions += impressions;
      iterClicks += clicks;
      iterCogs += cogsCost;
      iterSpend += budget;

      // Store per-platform
      perPlatformIterations[pk].revenue.push(adjustedRevenue);
      perPlatformIterations[pk].orders.push(adjustedOrders);
      perPlatformIterations[pk].impressions.push(impressions);
      perPlatformIterations[pk].clicks.push(clicks);
      perPlatformIterations[pk].cpa.push(adjustedOrders > 0 ? budget / adjustedOrders : 0);
      perPlatformIterations[pk].roas.push(budget > 0 ? adjustedRevenue / budget : 0);
      perPlatformIterations[pk].profit.push(adjustedRevenue - cogsCost - budget);
    });

    const iterProfit = iterRevenue - iterCogs - iterSpend;

    totalIterations.revenue.push(iterRevenue);
    totalIterations.orders.push(iterOrders);
    totalIterations.impressions.push(iterImpressions);
    totalIterations.clicks.push(iterClicks);
    totalIterations.cogsCost.push(iterCogs);
    totalIterations.budgetUsed.push(iterSpend);
    totalIterations.cpa.push(iterOrders > 0 ? iterSpend / iterOrders : 0);
    totalIterations.roas.push(iterSpend > 0 ? iterRevenue / iterSpend : 0);
    totalIterations.profit.push(iterProfit);
  }

  // Compute statistics
  const stats = {
    revenue: computeStats(totalIterations.revenue),
    orders: computeStats(totalIterations.orders),
    impressions: computeStats(totalIterations.impressions),
    clicks: computeStats(totalIterations.clicks),
    cpa: computeStats(totalIterations.cpa),
    roas: computeStats(totalIterations.roas),
    profit: computeStats(totalIterations.profit),
    cogsCost: computeStats(totalIterations.cogsCost)
  };

  // Compute per-platform stats
  const platformStats = {};
  platforms.forEach(pk => {
    platformStats[pk] = {
      revenue: computeStats(perPlatformIterations[pk].revenue),
      orders: computeStats(perPlatformIterations[pk].orders),
      roas: computeStats(perPlatformIterations[pk].roas),
      cpa: computeStats(perPlatformIterations[pk].cpa),
      profit: computeStats(perPlatformIterations[pk].profit)
    };
  });

  // Business metrics
  const price = state.foundation.price;
  const cogsRatio = state.foundation.cogs / 100;
  const grossMargin = price * (1 - cogsRatio);
  const breakEvenRoas = grossMargin > 0 ? price / grossMargin : 0;

  // Retention impact
  let adjustedStats = stats;
  if (state.scaling.retention && state.scaling.retention !== 'none') {
    const retentionMult = RETENTION[state.scaling.retention].ltvMult;
    const ltvAdjustment = (retentionMult - 1) * 0.5; // 50% of theoretical captured in 90 days

    const adjustedRevenue = stats.revenue.p50 * (1 + ltvAdjustment);
    const adjustedProfit = stats.profit.p50 + (adjustedRevenue - stats.revenue.p50);

    adjustedStats = {
      ...stats,
      adjustedRevenue: adjustedRevenue,
      adjustedProfit: adjustedProfit,
      adjustedRoas: stats.roas.p50 > 0 ? adjustedRevenue / (totalBudget * (1 - reserveRatio)) : 0
    };
  }

  // Prepare final output
  const result = {
    success: true,
    metadata: {
      industry: normalized.industry.name,
      industryCategory: normalized.industry.category,
      businessStage: normalized.businessStage || BUSINESS_STAGE[state.foundation.businessStage].name,
      objective: normalized.objective.name,
      framework: state.framework.primary ? FRAMEWORKS[state.framework.primary].name : 'بدون',
      platformCount: platforms.length,
      season: normalized.season.name,
      iterations: ITERATIONS,
      confidenceLevel: CONFIDENCE_LEVEL,
      generatedAt: new Date().toISOString()
    },
    inputs: state,
    stats,
    adjustedStats,
    platformStats,
    breakEvenRoas,
    totals: buildSummaryTotals(stats, state, totalBudget, reserveRatio),
    risks: computeRisks(state, normalized, stats),
    scores: computeScores(state, stats, normalized),
    verdict: computeVerdict(stats, breakEvenRoas),
    recommendations: generateRecommendations(state, stats, normalized),
    optimizations: findOptimizations(state, stats),
    // Legacy compatibility (used by existing HTML)
    platformResults: buildLegacyPlatformResults(platforms, platformStats, state, avgBudget),
    funnel: computeFunnel(state, stats),
    cohort: computeCohort(state, stats, normalized),
    attribution: computeAttribution(state, platformStats, platforms),
    learningPhase: computeLearningPhase(state, stats),
    adFatigue: computeAdFatigue(state, normalized)
  };

  return result;
}

// ============================================================
// HELPER: Deterministic hash of state (for reproducible RNG)
// ============================================================
function hashState(state) {
  const str = JSON.stringify(state);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash | 0;
  }
  return Math.abs(hash);
}

// ============================================================
// VALIDATION
// ============================================================
function validateState(state) {
  const errors = [];
  if (!state.foundation.industry) errors.push('• اختر القطاع في المرحلة 1');
  if (!state.foundation.businessStage) errors.push('• اختر مرحلة البيزنس في المرحلة 1');
  if (!state.foundation.pricingStrategy) errors.push('• اختر استراتيجية التسعير في المرحلة 1');
  if (!state.market.targetMarketSize) errors.push('• اختر حجم السوق في المرحلة 2');
  if (!state.market.competitionLevel) errors.push('• اختر مستوى المنافسة في المرحلة 2');
  if (!state.market.marketMaturity) errors.push('• اختر مرحلة نضج السوق في المرحلة 2');
  if (!state.persona.journeyStage) errors.push('• اختر مرحلة العميل في المرحلة 3');
  if (!state.objective.primaryGoal) errors.push('• اختر الهدف التسويقي في المرحلة 4');
  if (!state.framework.primary) errors.push('• اختر الإطار التسويقي في المرحلة 5');
  if (!state.channels.mix.length) errors.push('• اختر نوع واحد على الأقل من الميديا في المرحلة 6');
  if (!state.channels.platforms.length) errors.push('• اختر منصة إعلانية واحدة على الأقل في المرحلة 6');
  if (state.budget.totalBudget < 1000) errors.push('• الميزانية يجب أن تكون 1000 ج.م على الأقل في المرحلة 7');
  if (!state.budget.duration || state.budget.duration < 7) errors.push('• المدة يجب أن تكون 7 أيام على الأقل في المرحلة 7');
  if (!state.budget.pacing) errors.push('• اختر نمط الصرف في المرحلة 7');
  if (!state.budget.seasonality) errors.push('• اختر الموسمية في المرحلة 7');
  if (!state.creative.type) errors.push('• اختر نوع الكرياتيف في المرحلة 8');
  if (!state.creative.hook) errors.push('• اختر قوة الـ Hook في المرحلة 8');
  if (!state.creative.offer) errors.push('• اختر قوة العرض في المرحلة 8');
  if (!state.creative.messagingAngle) errors.push('• اختر زاوية الرسالة في المرحلة 8');
  if (!state.funnel.landingQuality) errors.push('• اختر جودة صفحة الهبوط في المرحلة 9');
  if (!state.funnel.funnelType) errors.push('• اختر نوع الفانل في المرحلة 9');
  if (!state.optimization.bidding) errors.push('• اختر استراتيجية المزايدة في المرحلة 10');
  if (!state.optimization.event) errors.push('• اختر حدث التحسين في المرحلة 10');
  if (!state.optimization.testing) errors.push('• اختر منهجية الاختبار في المرحلة 10');
  if (!state.scaling.strategy) errors.push('• اختر استراتيجية التوسع في المرحلة 11');
  if (!state.scaling.retention) errors.push('• اختر استراتيجية الاحتفاظ في المرحلة 11');
  if (!state.analytics.attributionModel) errors.push('• اختر نموذج الـ Attribution في المرحلة 12');
  if (!state.analytics.trackingSetup) errors.push('• اختر مستوى التتبع في المرحلة 12');
  if (!state.analytics.reportingCadence) errors.push('• اختر وتيرة التقارير في المرحلة 12');
  return { valid: errors.length === 0, errors };
}

// ============================================================
// SUMMARY TOTALS (uses median = most likely scenario)
// ============================================================
function buildSummaryTotals(stats, state, totalBudget, reserveRatio) {
  const deployableBudget = totalBudget * (1 - reserveRatio);
  const price = state.foundation.price;
  const cogsRatio = state.foundation.cogs / 100;
  const grossMargin = price * (1 - cogsRatio);

  return {
    totalBudget,
    deployableBudget,
    totalImpressions: Math.round(stats.impressions.p50),
    totalReach: Math.round(stats.impressions.p50 / (state.foundation.averageFrequency || 2.5)),
    totalClicks: Math.round(stats.clicks.p50),
    totalLandingViews: Math.round(stats.clicks.p50 * 0.85),
    totalOrders: Math.round(stats.orders.p50),
    totalRevenue: Math.round(stats.revenue.p50),
    totalCogs: Math.round(stats.cogsCost.p50),
    totalContribution: Math.round(stats.profit.p50),
    avgCPM: stats.impressions.p50 > 0 ? (deployableBudget / stats.impressions.p50) * 1000 : 0,
    avgCTR: stats.impressions.p50 > 0 ? (stats.clicks.p50 / stats.impressions.p50) * 100 : 0,
    avgCVR: stats.clicks.p50 > 0 ? (stats.orders.p50 / (stats.clicks.p50 * 0.85)) * 100 : 0,
    avgCPA: Math.round(stats.cpa.p50),
    avgROAS: parseFloat(stats.roas.p50.toFixed(2)),
    avgAOV: stats.orders.p50 > 0 ? stats.revenue.p50 / stats.orders.p50 : 0,
    netProfit: Math.round(stats.profit.p50),
    profitMargin: stats.revenue.p50 > 0 ? (stats.profit.p50 / stats.revenue.p50) * 100 : 0,
    breakEvenRoas: grossMargin > 0 ? price / grossMargin : 0,
    breakEvenOrders: grossMargin > 0 ? deployableBudget / grossMargin : 0
  };
}

// ============================================================
// LEGACY COMPATIBILITY — build platformResults array
// ============================================================
function buildLegacyPlatformResults(platforms, platformStats, state, avgBudget) {
  return platforms.map(pk => {
    const p = PLATFORMS[pk];
    const ps = platformStats[pk];
    const budget = state.budget.allocations[pk] || avgBudget;
    const revenue = ps.revenue.p50;
    const orders = ps.orders.p50;
    const roas = ps.roas.p50;
    const cpa = ps.cpa.p50;

    return {
      platform: pk,
      name: p.name,
      icon: p.icon,
      color: p.color,
      budget: Math.round(budget),
      impressions: Math.round(platformStats[pk].revenue.p50 > 0 ? (budget / 65) * 1000 : 0),
      reach: Math.round((budget / 65) * 1000 / 2.5),
      frequency: 2.5,
      frequencyWarning: 'low',
      clicks: 0,
      ctr: 0,
      cpc: 0,
      landingViews: 0,
      cvr: 0,
      orders: Math.round(orders),
      cpa: Math.round(cpa),
      aov: orders > 0 ? revenue / orders : 0,
      revenue: Math.round(revenue),
      cogs: Math.round(revenue * (state.foundation.cogs / 100)),
      roas: parseFloat(roas.toFixed(2)),
      profitableRoas: 0,
      isProfitable: roas > 1.5,
      contribution: Math.round(ps.profit.p50),
      // NEW: probability bands
      revenueBand: {
        p10: Math.round(ps.revenue.p10),
        p50: Math.round(ps.revenue.p50),
        p90: Math.round(ps.revenue.p90)
      },
      roasBand: {
        p10: parseFloat(ps.roas.p10.toFixed(2)),
        p50: parseFloat(ps.roas.p50.toFixed(2)),
        p90: parseFloat(ps.roas.p90.toFixed(2))
      }
    };
  });
}

// ============================================================
// RISKS (enhanced with probability)
// ============================================================
function computeRisks(state, normalized, stats) {
  const risks = [];
  let totalRiskScore = 0;

  // Competition
  if (state.market.competitionLevel === 'high') {
    risks.push({
      severity: 'high',
      category: 'المنافسة',
      title: 'منافسة شرسة في السوق',
      desc: 'CPM أعلى وCVR أقل بسبب المنافسة. تحتاج تميز واضح.',
      mitigation: 'ركز على زاوية تسويقية فريدة + استهدف جماهير ضيقة عالية النية.'
    });
    totalRiskScore += 25;
  } else if (state.market.competitionLevel === 'medium') {
    totalRiskScore += 12;
  }

  // Budget
  if (state.budget.totalBudget < 10000) {
    risks.push({
      severity: 'high',
      category: 'الميزانية',
      title: 'ميزانية منخفضة جداً',
      desc: 'أقل من 10,000 ج.م — صعب تدريب الخوارزمية والوصول لـ Learning Phase كامل.',
      mitigation: 'ارفع الميزانية لـ 20,000 ج.م على الأقل، أو ابدأ بمنصة واحدة فقط.'
    });
    totalRiskScore += 20;
  } else if (state.budget.totalBudget < 30000) {
    totalRiskScore += 8;
  }

  // Platform dependency
  if (state.channels.platforms.length === 1) {
    risks.push({
      severity: 'medium',
      category: 'التنويع',
      title: 'اعتماد على منصة واحدة',
      desc: 'لو المنصة حصل فيها تغيير (خوارزمية أو سياسة) — هتتأثر بشدة.',
      mitigation: 'جرب تستثمر 20-30% على منصة تانية بعد ما تثبت الأولى.'
    });
    totalRiskScore += 15;
  }

  // Seasonality
  if (normalized.season.cpmMult > 1.25) {
    risks.push({
      severity: 'medium',
      category: 'الموسمية',
      title: `موسم ${normalized.season.name} — CPM أعلى`,
      desc: `CPM في ${normalized.season.name} بيعلى ${Math.round((normalized.season.cpmMult - 1) * 100)}%.`,
      mitigation: 'خصص ميزانية احتياطية 15-20% + ركز على عروض قوية للتميز.'
    });
    totalRiskScore += 10;
  }

  // Creative fatigue
  if (state.creative.variants < 3) {
    risks.push({
      severity: 'medium',
      category: 'الكرياتيف',
      title: 'عدد variants قليل',
      desc: `${state.creative.variants} variant بس — الإعلانات هتتعب بسرعة.`,
      mitigation: 'جهز 4-6 variants مختلفة (زوايا وعروض مختلفة).'
    });
    totalRiskScore += 10;
  }

  // Tracking
  if (state.analytics.trackingSetup === 'basic') {
    risks.push({
      severity: 'medium',
      category: 'القياس',
      title: 'تتبع أساسي',
      desc: 'بدون Conversion API — البيانات ناقصة والخوارزمية مش بتتعلم صح.',
      mitigation: 'فعّل Meta Conversion API + Google Tag Manager + Server-side tracking.'
    });
    totalRiskScore += 10;
  }

  // Landing
  if (state.funnel.landingQuality === 'bad' || state.funnel.landingQuality === 'veryBad') {
    risks.push({
      severity: 'high',
      category: 'صفحة الهبوط',
      title: 'صفحة هبوط ضعيفة',
      desc: 'أكبر سبب لخسارة الحملات — بتقلل CVR بـ 35-60%.',
      mitigation: 'استثمر في التحسين: سرعة التحميل، وضوح العرض، CTA قوي.'
    });
    totalRiskScore += 25;
  }

  // Probability-based risk: chance of losing money
  if (stats.profit.profitProbability < 30) {
    risks.push({
      severity: 'high',
      category: 'الاحتمالات',
      title: `احتمالية خسارة ${100 - stats.profit.profitProbability.toFixed(1)}%`,
      desc: `في 10,000 محاكاة — ${(100 - stats.profit.profitProbability).toFixed(1)}% من السيناريوهات خسرت.`,
      mitigation: 'حسّن الـ CVR أو العرض أو استهدف أعلى AOV.'
    });
    totalRiskScore += 20;
  }

  const riskLevel = totalRiskScore > 60 ? 'high' : totalRiskScore > 35 ? 'medium' : 'low';
  return {
    risks,
    totalRiskScore: Math.min(100, totalRiskScore),
    riskLevel,
    riskLabel: riskLevel === 'high' ? 'مخاطر عالية ⚠️' : riskLevel === 'medium' ? 'مخاطر متوسطة ⚡' : 'مخاطر منخفضة ✅',
    profitProbability: stats.profit.profitProbability
  };
}

// ============================================================
// SCORES
// ============================================================
function computeScores(state, stats, normalized) {
  const overall = computeWeightedScore(state, stats);
  return {
    ...computeDimensionScores(state, stats),
    overall,
    adjustedOverall: overall,
    weights: SCORE_WEIGHTS
  };
}

function computeDimensionScores(state, stats) {
  return {
    strategyQuality: computeStrategyScore(state),
    targeting: computeTargetingScore(state),
    creativeQuality: computeCreativeScore(state),
    budgetEfficiency: computeBudgetScore(state, stats),
    funnelIntegrity: computeFunnelScore(state),
    sustainability: computeSustainabilityScore(state, stats),
    measurement: computeMeasurementScore(state),
    profitability: computeProfitabilityScore(state, stats)
  };
}

function computeWeightedScore(state, stats) {
  const dims = computeDimensionScores(state, stats);
  let sum = 0, weight = 0;
  Object.entries(SCORE_WEIGHTS).forEach(([key, w]) => {
    if (dims[key] !== undefined) { sum += dims[key] * w; weight += w; }
  });
  return weight > 0 ? Math.round(sum / weight) : 0;
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
  if (state.creative.type) score += CREATIVE_TYPES[state.creative.type].mult * 20;
  if (state.creative.hook) score += (HOOK_QUALITY[state.creative.hook].mult - 0.5) * 20;
  if (state.creative.offer && state.creative.offer !== 'none') score += 15;
  if (state.creative.messagingAngle) score += 10;
  if (state.creative.variants >= 3) score += 10;
  if (state.creative.productionQuality === 'high' || state.creative.productionQuality === 'premium') score += 10;
  return Math.min(100, Math.round(score));
}
function computeBudgetScore(state, stats) {
  let score = 40;
  const cpaRatio = stats.cpa.p50 / state.foundation.price;
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
function computeFunnelScore(state) {
  let score = 40;
  if (state.funnel.retargetingStrategy) score += 20;
  if (state.funnel.abandonedCart) score += 15;
  if (state.funnel.funnelType !== 'direct') score += 15;
  if (state.creative.offer && state.creative.offer !== 'none') score += 10;
  return Math.min(100, score);
}
function computeSustainabilityScore(state, stats) {
  let score = 30;
  if (state.scaling.retention && state.scaling.retention !== 'none') score += 25;
  if (state.scaling.referralProgram) score += 15;
  if (state.scaling.upsellStrategy) score += 10;
  if (stats.profit.profitProbability > 70) score += 20;
  else if (stats.profit.profitProbability > 50) score += 10;
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
function computeProfitabilityScore(state, stats) {
  if (stats.profit.p50 <= 0) {
    const lossRatio = Math.abs(stats.profit.p50) / Math.max(1, state.budget.totalBudget);
    return Math.max(0, Math.round(35 - lossRatio * 30));
  }
  const profitRatio = stats.profit.p50 / Math.max(1, state.budget.totalBudget);
  let score = 40 + profitRatio * 40;
  if (stats.roas.p50 >= 3) score += 15;
  else if (stats.roas.p50 >= 2) score += 10;
  return Math.min(100, Math.round(score));
}

// ============================================================
// VERDICT
// ============================================================
function computeVerdict(stats, breakEvenRoas) {
  const medianRoas = stats.roas.p50;
  const medianProfit = stats.profit.p50;
  const profitProb = stats.profit.profitProbability;

  let grade, color, icon, text;
  const score = Math.round(Math.min(100, Math.max(0, 
    (medianRoas / breakEvenRoas) * 40 + profitProb * 0.4
  )));

  if (score >= 85) { grade = 'A+'; color = 'green'; icon = 'fa-trophy'; text = 'استراتيجية عالمية المستوى 🏆'; }
  else if (score >= 70) { grade = 'A'; color = 'green'; icon = 'fa-circle-check'; text = 'استراتيجية احترافية ممتازة'; }
  else if (score >= 60) { grade = 'B+'; color = 'cyan'; icon = 'fa-thumbs-up'; text = 'استراتيجية جيدة جداً'; }
  else if (score >= 50) { grade = 'B'; color = 'cyan'; icon = 'fa-check'; text = 'استراتيجية جيدة'; }
  else if (score >= 40) { grade = 'C'; color = 'amber'; icon = 'fa-triangle-exclamation'; text = 'استراتيجية مقبولة — تحتاج تحسينات'; }
  else if (score >= 25) { grade = 'D'; color = 'orange'; icon = 'fa-exclamation-circle'; text = 'استراتيجية ضعيفة'; }
  else { grade = 'F'; color = 'red'; icon = 'fa-circle-xmark'; text = 'استراتيجية خطيرة — ستفقد المال'; }

  return {
    grade, color, icon, text, score,
    summary: `ROAS متوقع (وسيط): ${medianRoas.toFixed(2)}x · صافي الربح: ${medianProfit >= 0 ? '+' : ''}${Math.round(medianProfit).toLocaleString('ar-EG')} ج.م · احتمالية الربح: ${profitProb.toFixed(1)}%`,
    isProfitable: medianProfit > 0 && medianRoas >= breakEvenRoas,
    probabilityOfProfit: profitProb
  };
}

// ============================================================
// FUNNEL, COHORT, ATTRIBUTION (compact versions)
// ============================================================
function computeFunnel(state, stats) {
  const totalBudget = state.budget.totalBudget;
  const dist = {
    awareness: { tofu: 1.0, mofu: 0.15, bofu: 0.05 },
    traffic: { tofu: 0.7, mofu: 0.4, bofu: 0.15 },
    engagement: { tofu: 1.0, mofu: 0.10, bofu: 0.03 },
    leads: { tofu: 0.5, mofu: 0.7, bofu: 0.35 },
    sales: { tofu: 0.4, mofu: 0.6, bofu: 0.8 },
    catalog: { tofu: 0.35, mofu: 0.55, bofu: 0.95 }
  }[state.objective.primaryGoal] || { tofu: 0.5, mofu: 0.5, bofu: 0.5 };

  const sum = dist.tofu + dist.mofu + dist.bofu;

  return {
    tofu: {
      label: 'TOFU — الوعي والاكتشاف',
      desc: 'الجمهور البارد',
      impressions: Math.round(stats.impressions.p50),
      reach: Math.round(stats.impressions.p50 / 2.5),
      clicks: Math.round(stats.clicks.p50 * dist.tofu),
      budgetShare: (totalBudget * dist.tofu / sum)
    },
    mofu: {
      label: 'MOFU — التفكير والمقارنة',
      desc: 'الجمهور المهتم',
      impressions: Math.round(stats.impressions.p50 * 0.4),
      reach: Math.round(stats.impressions.p50 * 0.3),
      clicks: Math.round(stats.clicks.p50 * dist.mofu * (state.funnel.retargetingStrategy ? 1.4 : 1.0)),
      budgetShare: (totalBudget * dist.mofu / sum)
    },
    bofu: {
      label: 'BOFU — القرار والشراء',
      desc: 'الجاهز للشراء',
      impressions: Math.round(stats.impressions.p50 * 0.15),
      reach: Math.round(stats.impressions.p50 * 0.1),
      clicks: Math.round(stats.clicks.p50 * dist.bofu * (state.funnel.retargetingStrategy ? 1.4 : 1.0)),
      orders: Math.round(stats.orders.p50),
      budgetShare: (totalBudget * dist.bofu / sum)
    }
  };
}

function computeCohort(state, stats, normalized) {
  const churnRate = normalized.industry.churnRate || 0.30;
  const retentionMult = state.scaling.retention && state.scaling.retention !== 'none'
    ? RETENTION[state.scaling.retention].ltvMult
    : 1.0;
  const effectiveChurn = churnRate / retentionMult;

  const aov = stats.revenue.p50 > 0 && stats.orders.p50 > 0 ? stats.revenue.p50 / stats.orders.p50 : normalized.industry.aov;
  const monthlyCustomers = Math.round(stats.orders.p50 / Math.max(1, state.budget.duration / 30));
  const cohorts = [];

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

  const ltv = cohorts.reduce((s, c) => s + c.revenue, 0) / Math.max(1, monthlyCustomers);
  const cac = stats.cpa.p50;

  return {
    cohorts,
    ltv: Math.round(ltv),
    cac: Math.round(cac),
    ltvCacRatio: cac > 0 ? parseFloat((ltv / cac).toFixed(2)) : 0,
    effectiveChurn: parseFloat((effectiveChurn * 100).toFixed(1)),
    health: ltv / cac >= 3 ? 'excellent' : ltv / cac >= 2 ? 'good' : ltv / cac >= 1 ? 'warning' : 'danger'
  };
}

function computeAttribution(state, platformStats, platforms) {
  const totalRevenue = platforms.reduce((s, pk) => s + platformStats[pk].revenue.p50, 0);

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

  const models = { lastTouch: {}, firstTouch: {}, linear: {}, timeDecay: {}, position: {}, dataDriven: {} };

  platforms.forEach(pk => {
    const bias = platformFunnelBias[pk] || { tofu: 0.33, mofu: 0.33, bofu: 0.33 };
    const rev = platformStats[pk].revenue.p50;
    models.lastTouch[pk] = rev * bias.bofu * 1.4;
    models.firstTouch[pk] = rev * bias.tofu * 1.3;
    models.linear[pk] = rev;
    models.timeDecay[pk] = rev * (bias.bofu * 0.5 + bias.mofu * 0.35 + bias.tofu * 0.15);
    models.position[pk] = rev * (bias.tofu * 0.4 + bias.bofu * 0.4 + bias.mofu * 0.2);
    models.dataDriven[pk] = rev * ((bias.tofu + bias.mofu + bias.bofu) / 3);
  });

  return {
    models,
    recommended: state.analytics.attributionModel || 'dataDriven',
    recommendedName: state.analytics.attributionModel ? ATTRIBUTION[state.analytics.attributionModel].name : 'Data-Driven',
    insights: [
      { type: 'info', text: 'الـ Last-Touch بيحسب كل الفضل لمنصة BOFU (زي Google) — بيقلل من قيمة الوعي.' },
      { type: 'success', text: 'استخدم Data-Driven للحصول على الصورة الحقيقية.' }
    ]
  };
}

function computeLearningPhase(state, stats) {
  const platformCount = state.channels.platforms.length;
  const avgBudgetPerDay = state.budget.totalBudget / Math.max(1, state.budget.duration);
  const baseDays = state.optimization.bidding ? BIDDING_STRATEGY[state.optimization.bidding].learningDays : 7;
  const budgetFactor = avgBudgetPerDay > 1000 ? 0.8 : avgBudgetPerDay > 500 ? 1.0 : 1.3;
  const adjustedDays = Math.round(baseDays * Math.min(3, platformCount) * budgetFactor);

  return {
    learningDays: adjustedDays,
    totalDays: state.budget.duration,
    learningPhasePercent: Math.round((adjustedDays / state.budget.duration) * 100),
    revenueDuringLearning: Math.round(stats.revenue.p50 * (adjustedDays / state.budget.duration) * 0.65),
    revenueStable: Math.round(stats.revenue.p50 * (1 - (adjustedDays / state.budget.duration) * 0.65)),
    recommendation: adjustedDays > state.budget.duration * 0.4
      ? 'مدة التعلم طويلة — زود الميزانية اليومية أو قلل عدد المنصات'
      : adjustedDays > state.budget.duration * 0.25
      ? 'مدة التعلم معقولة — استمر'
      : 'مدة التعلم سريعة — إعداد ممتاز'
  };
}

function computeAdFatigue(state, normalized) {
  const freq = normalized.industry.avgFrequency || 2.5;
  const variants = state.creative.variants || 3;
  const duration = state.budget.duration;

  const baseFatigue = 0.08;
  const freqFactor = Math.max(0.5, freq / 2.5);
  const variantFactor = Math.max(0.5, 3 / variants);
  const weeklyFatigue = baseFatigue * freqFactor * variantFactor;

  const weeksTo30 = Math.round(Math.log(0.70) / Math.log(1 - weeklyFatigue));
  const durationWeeks = duration / 7;
  const avgPerf = durationWeeks > 0
    ? (1 - Math.pow(1 - weeklyFatigue, durationWeeks)) / (weeklyFatigue * durationWeeks)
    : 1;
  const degradation = Math.round((1 - avgPerf) * 100);

  return {
    weeklyFatigue: parseFloat((weeklyFatigue * 100).toFixed(1)),
    weeksTo30PercentDrop: weeksTo30,
    campaignWeeks: Math.round(durationWeeks),
    avgPerformance: parseFloat(avgPerf.toFixed(3)),
    degradation,
    severity: degradation > 30 ? 'high' : degradation > 15 ? 'medium' : 'low',
    recommendation: degradation > 30
      ? 'الكرياتيف هيتعب بسرعة — جهز بدائل كل أسبوعين'
      : degradation > 15
      ? 'يحتاج تجديد كرياتيف كل 3-4 أسابيع'
      : 'الكرياتيف مستقر'
  };
}

// ============================================================
// RECOMMENDATIONS
// ============================================================
function generateRecommendations(state, stats, normalized) {
  const recs = [];

  if (stats.profit.p50 < 0) {
    recs.push({
      priority: 'urgent',
      title: '🚨 الاستراتيجية خاسرة في السيناريو الوسيط',
      desc: `صافي الربح المتوقع ${Math.round(stats.profit.p50).toLocaleString('ar-EG')} ج.م. الحل: رفع السعر أو تقليل COGS أو تحسين CVR.`
    });
  } else if (stats.profit.profitProbability < 50) {
    recs.push({
      priority: 'high',
      title: '⚠️ احتمالية الربح أقل من 50%',
      desc: `فقط ${stats.profit.profitProbability.toFixed(1)}% من السيناريوهات ربحت. تحتاج تحسين مخاطر الاستراتيجية.`
    });
  }

  if (stats.roas.p10 < normalized.industry.cvr) {
    recs.push({
      priority: 'high',
      title: '📉 سيناريو الأسوأ (P10) ضعيف',
      desc: `حتى في أفضل الحالات المتشائمة، ROAS = ${stats.roas.p10.toFixed(2)}x. ارفع الأمان.`
    });
  }

  if (state.channels.platforms.length > 2 && state.budget.totalBudget < 30000) {
    recs.push({
      priority: 'high',
      title: '💰 ميزانية مبعثرة',
      desc: 'كل منصة محتاجة ميزانية للتعلم. ابدأ بمنصة واحدة ثم أضف الثانية.'
    });
  }

  if (state.creative.variants < 4) {
    recs.push({
      priority: 'medium',
      title: '🎨 زود Variants',
      desc: '4-6 variants مختلفة بتقلل التعب وتحسن الأداء 20-30%.'
    });
  }

  if (!state.scaling.retention || state.scaling.retention === 'none') {
    recs.push({
      priority: 'medium',
      title: '🔄 أضف Retention Strategy',
      desc: 'الاحتفاظ أرخص 5x من جلب عميل جديد. LTV هيرفع ربحيتك 30%+.'
    });
  }

  if (!state.funnel.retargetingStrategy) {
    recs.push({
      priority: 'high',
      title: '🎯 أضف Retargeting',
      desc: 'زوار الموقع + السلات المتروكة = 20-35% من المبيعات.'
    });
  }

  const order = { urgent: 0, high: 1, medium: 2, low: 3 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
}

function findOptimizations(state, stats) {
  const opts = [];

  if (state.creative.type === 'static') {
    opts.push({ impact: 'high', area: 'Creative', current: 'Static Images', suggestion: 'جرب UGC أو Reels', expectedGain: '+30-45% في CTR/CVR' });
  }
  if (state.creative.hook === 'weak' || state.creative.hook === 'average') {
    opts.push({ impact: 'high', area: 'Hook', current: HOOK_QUALITY[state.creative.hook].name, suggestion: 'استخدم Hook قوي', expectedGain: '+25-40%' });
  }
  if (!state.creative.offer || state.creative.offer === 'none') {
    opts.push({ impact: 'high', area: 'Offer', current: 'بدون عرض', suggestion: 'أضف خصم 15-20% أو Bundle', expectedGain: '+15-25% في CVR' });
  }
  if (state.funnel.landingQuality === 'average' || state.funnel.landingQuality === 'good') {
    opts.push({ impact: 'high', area: 'Landing Page', current: LANDING_QUALITY[state.funnel.landingQuality].name, suggestion: 'استثمر في صفحة عالمية', expectedGain: '+25-45% في CVR' });
  }
  if (state.analytics.trackingSetup === 'basic') {
    opts.push({ impact: 'medium', area: 'Tracking', current: 'Basic', suggestion: 'فعّل Conversion API', expectedGain: '+10-15% في دقة البيانات' });
  }
  if (!state.funnel.retargetingStrategy) {
    opts.push({ impact: 'high', area: 'Funnel', current: 'بدون Retargeting', suggestion: 'أضف Retargeting', expectedGain: '+20-35% في المبيعات' });
  }
  if (!state.scaling.retention || state.scaling.retention === 'none') {
    opts.push({ impact: 'high', area: 'Retention', current: 'بدون استراتيجية', suggestion: 'Email + Loyalty Program', expectedGain: '+30-60% في LTV' });
  }

  return opts;
}

// ============================================================
// STRATEGY DOCUMENT GENERATOR
// ============================================================
export function generateStrategyDocument(result) {
  const { inputs, metadata, stats, totals, verdict, scores, funnel, cohort, risks, recommendations, optimizations, platformResults } = result;

  const ind = INDUSTRIES[inputs.foundation.industry];
  const objective = OBJECTIVES[inputs.objective.primaryGoal];
  const framework = inputs.framework.primary ? FRAMEWORKS[inputs.framework.primary] : null;

  return {
    // Executive Summary
    executiveSummary: {
      title: `استراتيجية تسويق رقمي لـ ${ind.name}`,
      objective: objective.name,
      framework: framework ? framework.name : 'بدون إطار',
      expectedROAS: stats.roas.p50.toFixed(2) + 'x',
      expectedProfit: totals.netProfit,
      profitProbability: stats.profit.profitProbability.toFixed(1) + '%',
      grade: verdict.grade,
      confidence: 'بناءً على 10,000 محاكاة احتمالية',
      keyInsight: verdict.summary
    },

    // Business Foundation
    foundation: {
      industry: ind.name,
      category: ind.category,
      businessStage: BUSINESS_STAGE[inputs.foundation.businessStage].name,
      pricingStrategy: inputs.foundation.pricingStrategy ? PRICING_STRATEGY[inputs.foundation.pricingStrategy].name : 'غير محدد',
      price: inputs.foundation.price,
      cogs: inputs.foundation.cogs,
      aov: inputs.foundation.aov
    },

    // Market Analysis
    market: {
      size: inputs.market.targetMarketSize,
      competition: inputs.market.competitionLevel,
      maturity: inputs.market.marketMaturity,
      uniqueAdvantage: inputs.market.uniqueAdvantage,
      industryBenchmarks: {
        cpm: ind.cpm,
        ctr: ind.ctr,
        cvr: ind.cvr,
        churnRate: ind.churnRate,
        ltvMult: ind.ltvMult
      }
    },

    // Target Audience
    audience: {
      journeyStage: JOURNEY_STAGES[inputs.persona.journeyStage].name,
      ageRange: inputs.persona.ageRange,
      gender: inputs.persona.gender,
      painPoints: inputs.persona.painPoints,
      buyingTriggers: inputs.persona.buyingTriggers
    },

    // Channel Mix
    channels: {
      mediaMix: inputs.channels.mix,
      platforms: inputs.channels.platforms.map(p => PLATFORMS[p].name),
      ownedMedia: inputs.channels.ownedMedia
    },

    // Media Plan
    mediaPlan: {
      totalBudget: inputs.budget.totalBudget,
      duration: inputs.budget.duration + ' يوم',
      reserve: inputs.budget.reservePercent + '%',
      pacing: inputs.budget.pacing,
      seasonality: inputs.budget.seasonality,
      platformBudgets: platformResults.map(p => ({
        platform: p.name,
        budget: p.budget,
        allocation: ((p.budget / inputs.budget.totalBudget) * 100).toFixed(1) + '%'
      }))
    },

    // Creative Strategy
    creative: {
      type: CREATIVE_TYPES[inputs.creative.type].name,
      hook: HOOK_QUALITY[inputs.creative.hook].name,
      offer: OFFER_STRENGTH[inputs.creative.offer].name,
      messagingAngle: inputs.creative.messagingAngle,
      productionQuality: inputs.creative.productionQuality,
      variantsCount: inputs.creative.variants
    },

    // Funnel Strategy
    funnel: {
      type: inputs.funnel.funnelType,
      landingQuality: LANDING_QUALITY[inputs.funnel.landingQuality].name,
      retargeting: inputs.funnel.retargetingStrategy,
      abandonedCart: inputs.funnel.abandonedCart
    },

    // Optimization Plan
    optimization: {
      bidding: BIDDING_STRATEGY[inputs.optimization.bidding].name,
      event: OPT_EVENTS[inputs.optimization.event].name,
      testing: TESTING[inputs.optimization.testing].name,
      frequencyCap: inputs.optimization.frequencyCap
    },

    // Scaling & Retention
    scaling: {
      strategy: SCALING[inputs.scaling.strategy].name,
      retention: RETENTION[inputs.scaling.retention].name,
      referralProgram: inputs.scaling.referralProgram,
      upsellStrategy: inputs.scaling.upsellStrategy
    },

    // Analytics
    analytics: {
      attributionModel: ATTRIBUTION[inputs.analytics.attributionModel].name,
      trackingSetup: inputs.analytics.trackingSetup,
      reportingCadence: inputs.analytics.reportingCadence
    },

    // Projected Results
    projections: {
      revenue: {
        p10: Math.round(stats.revenue.p10),
        p50: Math.round(stats.revenue.p50),
        p90: Math.round(stats.revenue.p90)
      },
      orders: {
        p10: Math.round(stats.orders.p10),
        p50: Math.round(stats.orders.p50),
        p90: Math.round(stats.orders.p90)
      },
      roas: {
        p10: stats.roas.p10.toFixed(2),
        p50: stats.roas.p50.toFixed(2),
        p90: stats.roas.p90.toFixed(2)
      },
      profit: {
        p10: Math.round(stats.profit.p10),
        p50: Math.round(stats.profit.p50),
        p90: Math.round(stats.profit.p90)
      },
      cpa: {
        p10: Math.round(stats.cpa.p10),
        p50: Math.round(stats.cpa.p50),
        p90: Math.round(stats.cpa.p90)
      }
    },

    // Risk Assessment
    risks: risks.risks,

    // Recommendations
    recommendations,

    // Optimizations
    optimizations,

    // Action Plan (90 days)
    actionPlan: generate90DayPlan(inputs, result)
  };
}

function generate90DayPlan(inputs, result) {
  return {
    week1_2: [
      'تجهيز البنية التحتية: Pixel + Conversion API + GTM',
      'إعداد Landing Page احترافية + اختبار A/B',
      'تجهيز 4-6 variants من الكرياتيف',
      'إعداد 3 جماهير مختلفين (Broad, Interest, Lookalike)'
    ],
    week3_4: [
      'إطلاق الحملة بميزانية محدودة للاختبار (20% من الإجمالي)',
      'مراقبة الـ Learning Phase',
      'إيقاف الكرياتيف اللي أداؤه ضعيف',
      'البدء في بناء Custom Audiences'
    ],
    month2: [
      'زيادة الميزانية 20% أسبوعياً للمجموعات الرابحة',
      'إطلاق Retargeting Campaigns',
      'تفعيل Abandoned Cart Recovery',
      'تطوير كرياتيف جديد (UGC + Reels)'
    ],
    month3: [
      'التوسع الأفقي: جماهير جديدة + منصات إضافية',
      'تفعيل Retention Strategy (Email + Loyalty)',
      'بناء Referral Program',
      'تحليل النتائج وإعداد خطة الربع القادم'
    ]
  };
}
