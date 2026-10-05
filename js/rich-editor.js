// ============================================================
// Rich Editor Module — Multi-instance (Blog + Portfolio)
// ============================================================

const IMGBB_API_KEY = "c393b2efe08ba757e8483951adbfb11c";
const quillInstances = {};

export function initRichEditor(containerId = 'editorContainer') {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const toolbarOptions = [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],
    ['clean']
  ];

  const quill = new Quill(`#${containerId}`, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: () => handleImageUpload(containerId),
          video: () => handleVideoInsert(containerId)
        }
      }
    },
    placeholder: 'اكتب المحتوى الاحترافي هنا... يمكنك إضافة صور وفيديوهات وتنسيقات غنية.',
    dir: 'rtl'
  });

  quillInstances[containerId] = quill;
  return quill;
}

export function getEditorHTML(containerId = 'editorContainer') {
  const quill = quillInstances[containerId];
  if (!quill) return '';
  const html = quill.root.innerHTML;
  return html === '<p><br></p>' ? '' : html;
}

export function setEditorHTML(html, containerId = 'editorContainer') {
  const quill = quillInstances[containerId];
  if (!quill) return;
  quill.root.innerHTML = html || '';
}

// ============================================================
// Image Upload → ImgBB
// ============================================================
function handleImageUpload(containerId) {
  const quill = quillInstances[containerId];
  if (!quill) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    const choice = await showUploadChoice();
    if (choice === 'url') {
      const url = prompt('الصق رابط الصورة:');
      if (url) insertImage(quill, url);
      return;
    }
    if (choice !== 'upload') return;

    const range = quill.getSelection(true);
    quill.insertText(range.index, '⏳ جاري رفع الصورة...');
    try {
      const url = await uploadImageToImgBB(file);
      quill.deleteText(range.index, '⏳ جاري رفع الصورة...'.length);
      insertImage(quill, url);
    } catch (err) {
      console.error(err);
      quill.deleteText(range.index, '⏳ جاري رفع الصورة...'.length);
      alert('فشل رفع الصورة. تأكد من صحة مفتاح ImgBB API.');
    }
  };
  input.click();
}

function showUploadChoice() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-[#0E0B1A] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
        <h3 class="text-white font-bold">إدراج صورة</h3>
        <div class="flex flex-col gap-2">
          <button data-choice="upload" class="py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm">
            <i class="fa-solid fa-cloud-arrow-up ml-2"></i> رفع من الجهاز
          </button>
          <button data-choice="url" class="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm">
            <i class="fa-solid fa-link ml-2"></i> رابط URL
          </button>
          <button data-choice="cancel" class="py-2 rounded-xl text-slate-400 text-xs">إلغاء</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const c = btn.dataset.choice;
        modal.remove();
        resolve(c);
      });
    });
  });
}

async function uploadImageToImgBB(file) {
  if (!IMGBB_API_KEY || IMGBB_API_KEY === "YOUR_IMGBB_API_KEY_HERE") {
    throw new Error("لم يتم إعداد مفتاح ImgBB API.");
  }
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error(`ImgBB upload failed: ${response.statusText}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error?.message || 'ImgBB upload error');
  return data.data.url;
}

function insertImage(quill, url) {
  const range = quill.getSelection(true);
  quill.insertEmbed(range.index, 'image', url);
  quill.setSelection(range.index + 1);
}

// ============================================================
// Video Insert
// ============================================================
function handleVideoInsert(containerId) {
  const quill = quillInstances[containerId];
  if (!quill) return;

  const url = prompt('الصق رابط الفيديو (YouTube/Vimeo):');
  if (!url) return;
  const embed = parseVideoEmbed(url);
  if (!embed) { alert('الرابط غير صالح.'); return; }
  const range = quill.getSelection(true);
  quill.insertEmbed(range.index, 'video', embed);
  quill.setSelection(range.index + 1);
}

export function parseVideoEmbed(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace('www.', '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host.endsWith('youtube.com')) {
      if (u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
      if (u.pathname.startsWith('/embed/')) {
        const id = u.pathname.split('/')[2];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch (_) {}
  return null;
}

// ============================================================
// SEO Helpers
// ============================================================
export function generateSlug(title) {
  if (!title) return '';
  return String(title)
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-|\-$/g, '')
    .slice(0, 80);
}

export function calculateReadingTime(html) {
  if (!html) return 1;
  const text = String(html).replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function analyzeKeywordDensity(html, keyword) {
  if (!html || !keyword) return { count: 0, density: 0, status: 'na' };
  const text = String(html).replace(/<[^>]+>/g, ' ').toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const kw = keyword.toLowerCase().trim();
  if (!kw || !words.length) return { count: 0, density: 0, status: 'na' };
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'g');
  const matches = text.match(regex);
  const count = matches ? matches.length : 0;
  const density = (count / words.length) * 100;
  let status = 'good';
  if (density < 0.5) status = 'low';
  else if (density > 2.5) status = 'high';
  return { count, density: parseFloat(density.toFixed(2)), status };
}

// ============================================================
// Tag Input
// ============================================================
export function initTagInput(containerId, hiddenInputId) {
  const container = document.getElementById(containerId);
  const hidden = document.getElementById(hiddenInputId);
  if (!container || !hidden) return;
  let tags = [];

  function render() {
    container.innerHTML = `
      <div class="flex flex-wrap gap-1.5 mb-2">
        ${tags.map((t, i) => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[11px] font-bold">
            ${escapeHtml(t)}
            <button type="button" data-remove="${i}" class="hover:text-white">✕</button>
          </span>
        `).join('')}
      </div>
      <input type="text" id="${containerId}_input" placeholder="أضف كلمة مفتاحية واضغط Enter..."
        class="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-xs" />
    `;
    const input = document.getElementById(`${containerId}_input`);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = input.value.trim().toLowerCase();
        if (val && !tags.includes(val)) {
          tags.push(val);
          hidden.value = JSON.stringify(tags);
          render();
          document.getElementById(`${containerId}_input`)?.focus();
        }
      }
    });
    container.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.remove, 10);
        tags.splice(i, 1);
        hidden.value = JSON.stringify(tags);
        render();
      });
    });
    input?.focus();
  }

  function setValue(newTags) {
    tags = Array.isArray(newTags) ? newTags.slice() : [];
    hidden.value = JSON.stringify(tags);
    render();
  }
  function getValue() { return tags.slice(); }
  render();
  return { setValue, getValue };
}

function escapeHtml(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ============================================================
// FAQ Builder
// ============================================================
export function initFaqBuilder(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let items = [];

  function render() {
    container.innerHTML = items.map((item, i) => `
      <div class="faq-row p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-[10px] text-slate-400">سؤال ${i + 1}</span>
          <button type="button" data-remove="${i}" class="text-red-400 text-[11px]">حذف</button>
        </div>
        <input type="text" data-q="${i}" placeholder="السؤال..." value="${escapeHtml(item.question)}"
          class="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-xs" />
        <textarea data-a="${i}" rows="2" placeholder="الإجابة..."
          class="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-xs">${escapeHtml(item.answer)}</textarea>
      </div>
    `).join('') + `
      <button type="button" id="${containerId}_add" class="w-full py-2 rounded-lg border border-dashed border-white/20 text-slate-300 text-xs hover:border-pink-500/50 hover:text-pink-400">
        <i class="fa-solid fa-plus ml-1"></i> إضافة سؤال
      </button>
    `;
    container.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        items.splice(parseInt(btn.dataset.remove, 10), 1);
        render();
      });
    });
    container.querySelectorAll('[data-q]').forEach((input) => {
      input.addEventListener('input', () => {
        items[parseInt(input.dataset.q, 10)].question = input.value;
      });
    });
    container.querySelectorAll('[data-a]').forEach((input) => {
      input.addEventListener('input', () => {
        items[parseInt(input.dataset.a, 10)].answer = input.value;
      });
    });
    document.getElementById(`${containerId}_add`)?.addEventListener('click', () => {
      items.push({ question: '', answer: '' });
      render();
    });
  }

  function setValue(newItems) {
    items = Array.isArray(newItems) ? newItems.map(x => ({ question: x.question || '', answer: x.answer || '' })) : [];
    render();
  }
  function getValue() {
    return items.filter(x => x.question.trim() && x.answer.trim());
  }
  render();
  return { setValue, getValue };
}

// ============================================================
// Media Gallery Builder
// ============================================================
export function initGalleryBuilder(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let items = [];

  function render() {
    container.innerHTML = items.map((item, i) => `
      <div class="gallery-row p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-[10px] text-slate-400">عنصر ${i + 1}</span>
          <button type="button" data-remove="${i}" class="text-red-400 text-[11px]">حذف</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select data-type="${i}" class="bg-black/50 border border-white/10 rounded-lg p-2 text-white text-xs">
            <option value="image" ${item.type === 'image' ? 'selected' : ''}>صورة</option>
            <option value="video" ${item.type === 'video' ? 'selected' : ''}>فيديو</option>
          </select>
          <input type="url" data-url="${i}" placeholder="https://..." value="${escapeHtml(item.url || '')}"
            class="sm:col-span-2 bg-black/50 border border-white/10 rounded-lg p-2 text-white text-xs" dir="ltr" />
        </div>
        <input type="text" data-caption="${i}" placeholder="وصف مختصر (اختياري)" value="${escapeHtml(item.caption || '')}"
          class="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-xs" />
        ${item.type === 'video' ? `<input type="url" data-thumbnail="${i}" placeholder="رابط صورة الغلاف للفيديو (اختياري)" value="${escapeHtml(item.thumbnail || '')}" class="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-xs" dir="ltr" />` : ''}
      </div>
    `).join('') + `
      <button type="button" id="${containerId}_add" class="w-full py-2 rounded-lg border border-dashed border-white/20 text-slate-300 text-xs hover:border-pink-500/50 hover:text-pink-400">
        <i class="fa-solid fa-plus ml-1"></i> إضافة صورة/فيديو للمعرض
      </button>
    `;
    container.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        items.splice(parseInt(btn.dataset.remove, 10), 1);
        render();
      });
    });
    container.querySelectorAll('[data-type]').forEach((sel) => {
      sel.addEventListener('change', () => {
        items[parseInt(sel.dataset.type, 10)].type = sel.value;
        render();
      });
    });
    container.querySelectorAll('[data-url]').forEach((inp) => {
      inp.addEventListener('input', () => { items[parseInt(inp.dataset.url, 10)].url = inp.value; });
    });
    container.querySelectorAll('[data-caption]').forEach((inp) => {
      inp.addEventListener('input', () => { items[parseInt(inp.dataset.caption, 10)].caption = inp.value; });
    });
    container.querySelectorAll('[data-thumbnail]').forEach((inp) => {
      inp.addEventListener('input', () => { items[parseInt(inp.dataset.thumbnail, 10)].thumbnail = inp.value; });
    });
    document.getElementById(`${containerId}_add`)?.addEventListener('click', () => {
      items.push({ type: 'image', url: '', caption: '', thumbnail: '' });
      render();
    });
  }

  function setValue(newItems) {
    items = Array.isArray(newItems)
      ? newItems.map(x => ({ type: x.type || 'image', url: x.url || '', caption: x.caption || '', thumbnail: x.thumbnail || '' }))
      : [];
    render();
  }
  function getValue() {
    return items.filter(x => x.url.trim()).map(x => ({
      type: x.type,
      url: x.url.trim(),
      caption: x.caption.trim(),
      thumbnail: x.type === 'video' ? (x.thumbnail || '').trim() : ''
    }));
  }
  render();
  return { setValue, getValue };
}

// ============================================================
// SERP Preview
// ============================================================
export function updateSerpPreview(previewId, { title, slug, description }) {
  const el = document.getElementById(previewId);
  if (!el) return;
  const displayTitle = title ? `${title} | إسلام سعيد` : 'العنوان | إسلام سعيد';
  const url = slug ? `islamsaeid.me/case/${slug}` : 'islamsaeid.me/case/...';
  el.innerHTML = `
    <div class="p-4 rounded-xl bg-white border border-slate-200 text-right" dir="rtl">
      <div class="text-[11px] text-slate-600 mb-0.5">${escapeHtml(url)}</div>
      <div class="text-[#1a0dab] text-base font-medium leading-snug mb-1 cursor-pointer hover:underline" style="font-family: arial, sans-serif;">
        ${escapeHtml(displayTitle)}
      </div>
      <div class="text-[13px] text-slate-600 leading-snug" style="font-family: arial, sans-serif;">
        ${escapeHtml(description || 'الوصف الذي يظهر للزوار في نتائج البحث.')}
      </div>
    </div>
  `;
}

// ============================================================
// Character Counter
// ============================================================
export function bindCounter(inputId, counterId, max) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(counterId);
  if (!input || !counter) return;
  function update() {
    const len = input.value.length;
    counter.textContent = `${len} / ${max}`;
    counter.className = len > max
      ? 'text-red-400 text-[10px] font-bold'
      : len > max * 0.9
        ? 'text-amber-400 text-[10px] font-bold'
        : 'text-green-400 text-[10px] font-bold';
  }
  input.addEventListener('input', update);
  update();
}
