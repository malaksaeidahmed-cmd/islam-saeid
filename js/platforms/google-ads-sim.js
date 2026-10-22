export const googleState = {
  campaign: { type: 'SEARCH', name: '', budget: 0 },
  adGroup: { name: '', keywords: '', matchType: 'BROAD' },
  ad: { headlines: '', descriptions: '' },
  currentStep: 1
};

export function setGoogleState(section, key, value) {
  if (googleState[section] && key in googleState[section]) googleState[section][key] = value;
}

export function validateGoogleStep(step) {
  if (step === 1) {
    if (!googleState.campaign.name.trim()) return 'يرجى إدخال اسم الحملة.';
    if (googleState.campaign.budget < 50) return 'الميزانية يجب أن تكون 50 ج.م على الأقل.';
  }
  if (step === 2) {
    if (!googleState.adGroup.name.trim()) return 'يرجى إدخال اسم المجموعة.';
    if (!googleState.adGroup.keywords.trim()) return 'يرجى إدخال كلمات مفتاحية واحدة على الأقل.';
  }
  if (step === 3) {
    if (!googleState.ad.headlines.trim()) return 'يرجى إدخال عنوان واحد على الأقل.';
    if (!googleState.ad.descriptions.trim()) return 'يرجى إدخال وصف واحد على الأقل.';
  }
  return null;
}

export function nextGoogleStep() {
  const error = validateGoogleStep(googleState.currentStep);
  if (error) return { success: false, error };
  if (googleState.currentStep < 3) {
    googleState.currentStep++;
    return { success: true };
  }
  return { success: true };
}

export function prevGoogleStep() {
  if (googleState.currentStep > 1) {
    googleState.currentStep--;
    return true;
  }
  return false;
}

export function launchGoogleCampaign() {
  const finalCampaign = {
    platform: 'google',
    strategy: JSON.parse(localStorage.getItem('sim_v3_state')) || { foundation: { industry: 'fashion', aov: 1000, cogs: 30 }, objective: { kpiTarget: 3.0 }, creative: { type: 'video', hook: 'strong', offer: 'none', variants: 3 }, funnel: { landingQuality: 'average' } },
    campaignData: googleState.campaign,
    adSets: [googleState.adGroup],
    ads: [googleState.ad],
    status: 'active',
    dailyBudget: googleState.campaign.budget,
    duration: 30
  };
  localStorage.setItem('executable_google_campaign', JSON.stringify(finalCampaign));
  localStorage.removeItem('executable_meta_campaign');
  localStorage.removeItem('executable_tiktok_campaign');
  return true;
}
