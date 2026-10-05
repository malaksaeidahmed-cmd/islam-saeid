(function() {
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const DEFAULT_PORTFOLIO = [
    {
      id: "1",
      category: "تجارة إلكترونية",
      roas: "30x ROAS",
      title: "براندات لوكسير و B-Smart",
      desc: "إدارة حملات التحويل السريع وتطبيق إعادة الاستهداف لزوار الموقع وتحقيق نمو مبيعات قياسي.",
      budget: "100,000 EGP",
      results: "3,000,000+ EGP مبيعات"
    },
    {
      id: "2",
      category: "مطابخ وتشطيبات فاخرة",
      roas: "2.54 EGP / 1k",
      title: "Woody للمطابخ والدريسينج",
      desc: "استهداف دقيق لمالكي الوحدات السكنية والفيلات، وتحقيق أوسع وصول للمعاينات بأقل تكلفة.",
      budget: "393,098 وصول",
      results: "406,460+ ظهور"
    },
    {
      id: "3",
      category: "سلاسل أغذية ومطاعم",
      roas: "0.01 EGP / تفاعل",
      title: "سلسلة مطاعم ملك الشاورما",
      desc: "حملات ريلز فيروسية وعروض مجمعة حققت تفاعلاً هائلاً ورفعت اتصالات الدليفري وزيارات الفروع.",
      budget: "43,302 تفاعل ريلز",
      results: "17,475+ مبيعات عروض"
    }
  ];

  const DEFAULT_BLOG = [
    {
      id: "1",
      title: "كيف تحسب Break-Even ROAS قبل ضخ أول 10 آلاف جنيه إعلانات؟",
      excerpt: "دليل عملي لكيفية مراجعة دفاتر البيزنس وتحديد نقطة التعادل قبل إطلاق حملات الميديا باينج.",
      content: `عندما تبدأ في إطلاق حملتك الإعلانية الأولى، الخطأ القاتل الذي يقع فيه أغلب أصحاب الأنشطة التجارية هو تقييم نجاح الحملة بناءً على سعر النقرة (CPC) أو عدد الإعجابات.
      
الحقيقة التسويقية الصارمة تقول: "الإعلان ليس مجرد تفاعل، بل هو معادلة محاسبية في المقام الأول".

لحساب نقطة التعادل (Break-Even ROAS):
1. حدد سعر البيع النهائي للمنتج (مثلاً 1,000 ج.م).
2. الخصم المباشر لتكلفة البضاعة والتصنيع والشحن (مثلاً 600 ج.م).
3. هامش الربح الصافي المتبقي قبل الإعلانات = 400 ج.م (نسبة 40%).
4. نقطة التعادل المالي = (سعر البيع ÷ هامش الربح) = (1000 ÷ 400) = 2.5x ROAS.

معنى هذا الرقم: لو حقق لك مدير الإعلانات عائد 2.49x فأنت تخسر مالياً حقيقة حتى وإن بلغت مبيعاتك ملايين الجنيهات. تأكد دائماً أن الـ ROAS الفعلي يتجاوز هذه النقطة لضمان أرباح صافية بالخزينة.`,
      category: "استراتيجيات مالية",
      date: new Date().toLocaleDateString('ar-EG'),
      author: "إسلام سعيد",
      image: "assets/1.webp"
    },
    {
      id: "2",
      title: "سيكولوجية الإعلان الفيروسى: كيف حققنا 0.01 EGP للتفاعل في حملات المطاعم؟",
      excerpt: "أسرار صناعة الهوك (Hook) في أول ثانيتين وكيفية توجيه المشاهد لاتخاذ قرار الشراء المباشر.",
      content: `تعتبر صناعة الإعلانات الفيروسية (Viral Ads) لقطاع المطاعم والأغذية من أكبر التحديات بسبب المنافسة الشديدة وضخامة الخيارات أمام العميل.

كيف حققنا تكلفة تفاعل 0.01 جنيه لـ 43 ألف عميل في سلسلة "ملك الشاورما"؟

أولاً: قانون الـ 2 Seconds Hook:
العميل لا يفتح فيسبوك أو إنستجرام ليشتري؛ بل يفتح للترفيه. أول ثانيتين يجب أن تتضمن صدمة بصرية أو سؤالاً يمس جوعه (صوت تقطيع الشاورما الساخنة أو عرض الساندوتش الضخم كلوذ أب).

ثانياً: العرض المجمع (The Irresistible Bundle):
بدلاً من الإعلان عن ساندوتش واحد، تم تحفيز الجمهور بعروض العائلات أو الأصدقاء (Buy 2 Get 1 Free). هذا العرض ينقل العميل من مرحلة "التفرج" إلى مرحلة "طلب الدليفري المباشر".`,
      category: "صناعة المحتوى الإعلاني",
      date: new Date().toLocaleDateString('ar-EG'),
      author: "إسلام سعيد",
      image: "assets/2.webp"
    }
  ];

  const DEFAULT_USERS = [
    { username: "islam", pass: "Nour123@@##", role: "Admin", name: "إسلام سعيد" }
  ];

  // Initialize Storage (Fresh Reset for Analytics)
  if (!localStorage.getItem('cms_portfolio')) {
    localStorage.setItem('cms_portfolio', JSON.stringify(DEFAULT_PORTFOLIO));
  }
  if (!localStorage.getItem('cms_blog')) {
    localStorage.setItem('cms_blog', JSON.stringify(DEFAULT_BLOG));
  }
  if (!localStorage.getItem('cms_users')) {
    localStorage.setItem('cms_users', JSON.stringify(DEFAULT_USERS));
  }
  
  // Real Analytics Starting at Clean 0
  if (!localStorage.getItem('cms_analytics')) {
    localStorage.setItem('cms_analytics', JSON.stringify({ visits: 0, leads: 0, pdfDownloads: 0, events: [] }));
  }

  window.cmsEngine = {
    getPortfolio: () => JSON.parse(localStorage.getItem('cms_portfolio')),
    savePortfolio: (data) => localStorage.setItem('cms_portfolio', JSON.stringify(data)),
    
    getBlog: () => JSON.parse(localStorage.getItem('cms_blog')),
    saveBlog: (data) => localStorage.setItem('cms_blog', JSON.stringify(data)),
    
    getUsers: () => JSON.parse(localStorage.getItem('cms_users')),
    saveUsers: (data) => localStorage.setItem('cms_users', JSON.stringify(data)),

    getAnalytics: () => JSON.parse(localStorage.getItem('cms_analytics')),

    trackVisit: () => {
      const stats = JSON.parse(localStorage.getItem('cms_analytics'));
      stats.visits += 1;
      localStorage.setItem('cms_analytics', JSON.stringify(stats));
    },

    logEvent: (type, details) => {
      const stats = JSON.parse(localStorage.getItem('cms_analytics'));
      if (type === 'PDF Download') stats.pdfDownloads += 1;
      if (type === 'Bootcamp Lead') stats.leads += 1;
      stats.events.unshift({ type, details, date: new Date().toLocaleString('ar-EG') });
      localStorage.setItem('cms_analytics', JSON.stringify(stats));
    },

    renderPortfolio: (containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      const list = window.cmsEngine.getPortfolio();
      
      container.innerHTML = list.map(item => `
        <div class="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between hover:border-brand-magenta/40 transition-all">
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-brand-magenta font-bold">${escapeHtml(item.category)}</span>
              <span class="font-sans font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">${escapeHtml(item.roas)}</span>
            </div>
            <h3 class="font-bold text-white text-lg">${escapeHtml(item.title)}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">${escapeHtml(item.desc)}</p>
          </div>
          <div class="mt-6 pt-4 border-t border-white/5 space-y-1 text-xs">
            <div class="flex justify-between"><span class="text-slate-400">التفاصيل:</span><span class="font-bold text-white font-sans">${escapeHtml(item.budget)}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">النتائج:</span><span class="font-bold text-green-400 font-sans">${escapeHtml(item.results)}</span></div>
          </div>
        </div>
      `).join('');
    }
  };
})();
