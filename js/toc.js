// ============================================================
// TOC — جدول محتويات تلقائي
// ============================================================

export function initTOC(contentSelector = '.article-content', tocContainerId = 'tocContainer') {
  const container = document.getElementById(tocContainerId);
  const content = document.querySelector(contentSelector);
  if (!container || !content) return;

  const headings = content.querySelectorAll('h2, h3');
  if (headings.length < 3) {
    container.classList.add('hidden');
    return;
  }

  // Assign IDs and build TOC
  const items = [];
  headings.forEach((h, i) => {
    if (!h.id) {
      const slug = (h.textContent || `section-${i}`)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FFa-z0-9\-]/g, '')
        .slice(0, 60) || `section-${i}`;
      h.id = slug;
    }
    items.push({
      id: h.id,
      text: h.textContent.trim(),
      level: h.tagName === 'H2' ? 2 : 3
    });
  });

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="p-5 rounded-2xl bg-[#0E0B1A] border border-white/10 space-y-3 overflow-safe-card">
      <div class="flex items-center justify-between cursor-pointer" id="tocToggle">
        <h3 class="text-white font-bold text-sm flex items-center gap-2">
          <i class="fa-solid fa-list-ul text-pink-400"></i>
          محتويات المقال
        </h3>
        <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform" id="tocChevron"></i>
      </div>
      <ol id="tocList" class="space-y-1.5 text-xs border-r-2 border-pink-500/30 pr-3">
        ${items.map(item => `
          <li class="${item.level === 3 ? 'pr-4' : ''}">
            <a href="#${item.id}" data-toc-target="${item.id}"
               class="toc-link block py-1 text-slate-400 hover:text-pink-400 transition-colors break-words-safe leading-relaxed">
              ${escapeHtml(item.text)}
            </a>
          </li>
        `).join('')}
      </ol>
    </div>
  `;

  // Smooth scroll
  container.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.tocTarget);
      if (target) {
        const offset = 100;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        history.replaceState(null, '', `#${link.dataset.tocTarget}`);
      }
    });
  });

  // Toggle collapse
  const toggle = document.getElementById('tocToggle');
  const list = document.getElementById('tocList');
  const chevron = document.getElementById('tocChevron');
  toggle?.addEventListener('click', () => {
    const isHidden = list.classList.contains('hidden');
    list.classList.toggle('hidden');
    if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  // Highlight active heading on scroll
  const tocLinks = container.querySelectorAll('.toc-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('text-pink-400', 'font-bold'));
        const active = container.querySelector(`[data-toc-target="${entry.target.id}"]`);
        if (active) active.classList.add('text-pink-400', 'font-bold');
      }
    });
  }, { rootMargin: '-100px 0px -70% 0px' });

  headings.forEach(h => observer.observe(h));
}

function escapeHtml(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
