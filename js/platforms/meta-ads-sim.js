// ============================================================
// Meta Ads Simulator — Logic & State Management
// ============================================================

export const metaState = {
  campaign: { objective: null, name: '', cbo: true, budget: 0 },
  adSet: { name: '', audience: 'broad', placements: 'advantage', budget: 0, optimization: 'purchase' },
  ad: { name: '', primaryText: '', headline: '', cta: 'SHOP_NOW', imageUrl: 'placeholder' },
  currentStep: 1
};

export function setMetaState(section, key, value) {
  if (metaState[section] && key in metaState[section]) {
    metaState[section][key] = value;
  }
}

export function validateStep(step) {
  if (step === 1) {
    if (!metaState.campaign.objective) return 'يرجى اختيار هدف الحملة.';
    if (!metaState.campaign.name.trim()) return 'يرجى إدخال اسم الحملة.';
    if (metaState.campaign.cbo && metaState.campaign.budget < 100) return 'الميزانية يجب أن تكون 100 ج.م على الأقل.';
  }
  if (step === 2) {
    if (!metaState.adSet.name.trim()) return 'يرجى إدخال اسم المجموعة الإعلانية.';
    if (!metaState.campaign.cbo && metaState.adSet.budget < 50) return 'ميزانية المجموعة يجب أن تكون 50 ج.م على الأقل.';
  }
  if (step === 3) {
    if (!metaState.ad.name.trim()) return 'يرجى إدخال اسم الإعلان.';
    if (!metaState.ad.primaryText.trim()) return 'يرجى إدخال النص الأساسي.';
    if (!metaState.ad.headline.trim()) return 'يرجى إدخال العنوان.';
  }
  return null;
}

export function nextStep() {
  const error = validateStep(metaState.currentStep);
  if (error) return { success: false, error };
  if (metaState.currentStep < 3) {
    metaState.currentStep++;
    return { success: true };
  }
  return { success: true, isLastStep: true };
}

export function prevStep() {
  if (metaState.currentStep > 1) {
    metaState.currentStep--;
    return true;
  }
  return false;
}

export function launchMetaCampaign() {
  // ✅ استخدم الاستراتيجية الموجودة، متستبدلهاش!
  let existingStrategy;
  try {
    const raw = localStorage.getItem('sim_v3_state');
    existingStrategy = raw ? JSON.parse(raw) : null;
  } catch (_) {
    existingStrategy = null;
  }

  const fallbackStrategy = {
    foundation: { industry: 'fashion', aov: 1000, cogs: 30 },
    objective: { kpiTarget: 3.0 },
    creative: { type: 'video', hook: 'strong', offer: 'none', variants: 3 },
    funnel: { landingQuality: 'average' }
  };

  const finalCampaign = {
    platform: 'meta',
    strategy: existingStrategy || fallbackStrategy,
    campaignData: metaState.campaign,
    adSets: [metaState.adSet],
    ads: [metaState.ad],
    status: 'active',
    dailyBudget: metaState.campaign.cbo ? metaState.campaign.budget : metaState.adSet.budget,
    duration: 30
  };

  localStorage.setItem('executable_meta_campaign', JSON.stringify(finalCampaign));
  // ⚠️ ممنوع نكتب في sim_v3_state تاني — ده بتاع المحاكي
  return true;
}
