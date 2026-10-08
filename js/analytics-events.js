// ============================================================
// GA4 Custom Events — تتبع تفاعلات الزوار
// ============================================================

const GA_ID = 'G-N8FEC6LYZ7';

// ============================================================
// Core Event Dispatcher
// ============================================================
export function trackEvent(eventName, params = {}) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
      console.log(`[GA4] ${eventName}`, params);
    } else {
      console.log(`[GA4 pending] ${eventName}`, params);
    }
  } catch (err) {
    console.warn('GA4 track error:', err);
  }
}

// ============================================================
// Standard Events
// ============================================================
export function trackPageView(pagePath, pageTitle) {
  trackEvent('page_view', {
    page_path: pagePath || window.location.pathname + window.location.search,
    page_title: pageTitle || document.title
  });
}

export function trackScrollDepth(percent) {
  trackEvent('scroll_depth', {
    percent,
    page_path: window.location.pathname
  });
}

export function trackOutboundClick(url, label = '') {
  trackEvent('outbound_click', { url, label });
}

export function trackWhatsAppClick(source = 'unknown') {
  trackEvent('whatsapp_click', { source });
}

export function trackContactClick(method = 'whatsapp') {
  trackEvent('contact_click', { method });
}

export function trackPostRead(postId, title, readingTime) {
  trackEvent('post_read', { post_id: postId, title, reading_time: readingTime });
}

export function trackCalculatorUse(industry, price, budget) {
  trackEvent('calculator_use', {
    industry,
    unit_price: Number(price) || 0,
    budget: Number(budget) || 0
  });
}

export function trackPdfDownload(industry, price) {
  trackEvent('pdf_download', { industry, price });
}

export function trackBootcampSubmit(source = 'index') {
  trackEvent('bootcamp_submit', { source });
}

export function trackCourseView(courseName) {
  trackEvent('view_item', { item_name: courseName, item_category: 'course' });
}

export function trackShare(method, contentType, contentId) {
  trackEvent('share', { method, content_type: contentType, item_id: contentId });
}

export function trackCommentSubmit(postId) {
  trackEvent('comment_submit', { post_id: postId });
}

export function trackLike(postId) {
  trackEvent('like_post', { post_id: postId });
}

// ============================================================
// Auto Scroll Depth Tracking
// ============================================================
export function initScrollTracking() {
  const fired = new Set();
  const thresholds = [25, 50, 75, 100];

  const handler = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    thresholds.forEach(t => {
      if (scrolled >= t && !fired.has(t)) {
        fired.add(t);
        trackScrollDepth(t);
      }
    });
  };

  window.addEventListener('scroll', handler, { passive: true });
}

// ============================================================
// Auto Track WhatsApp & External Links
// ============================================================
export function initLinkTracking() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.href || '';

    if (href.includes('wa.me') || href.includes('whatsapp')) {
      trackWhatsAppClick(link.dataset.source || 'link');
    } else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      trackOutboundClick(href, link.textContent?.trim().slice(0, 50) || '');
    }
  });
}

// ============================================================
// Auto Time-on-Page Tracking
// ============================================================
export function initTimeTracking() {
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const seconds = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
      seconds,
      page_path: window.location.pathname
    });
  });
}

// ============================================================
// Init All Auto Trackers
// ============================================================
export function initAnalyticsAuto() {
  initScrollTracking();
  initLinkTracking();
  initTimeTracking();
}
