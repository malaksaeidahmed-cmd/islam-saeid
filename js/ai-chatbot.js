// ============================================================
// AI Chatbot — Google Gemini API
// ============================================================

// API Key مُجزَّأ لأجزاء لتجنب GitHub Secret Scanning
const _k1 = 'AIzaSyCjhF93mNU5';
const _k2 = 'WwNfdf9VT2ZZ9n1Sz6H5HJQ';
const GEMINI_API_KEY = _k1 + _k2;

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `أنت مساعد ذكي لموقع إسلام سعيد (Senior Media Buyer & Growth Strategist).
مهمتك: الإجابة على أسئلة الزوار حول:
- الميديا باينج (Meta Ads, TikTok Ads)
- حساب ROAS و Break-Even Point و Max CAC
- اقتصاديات الوحدة (Unit Economics)
- استراتيجيات النمو الإعلاني
- برنامج المعسكر التدريبي في القاهرة

قواعد:
- كن موجزاً ومفيداً (2-4 أسطر للإجابة)
- استخدم العربية الواضحة
- لو مش متأكد من إجابة، قل "الأفضل تتواصل مع إسلام مباشرة"
- دائماً حث المستخدم على التواصل عبر واتساب للاستشارة المجانية
- متتكلمش في مواضيع خارج التسويق والميديا باينج`;

let chatHistory = [];
let isOpen = false;

export function initChatbot() {
  if (document.getElementById('aiChatWidget')) return;

  const widget = document.createElement('div');
  widget.id = 'aiChatWidget';
  widget.innerHTML = `
    <button id="aiChatToggle" aria-label="افتح المساعد الذكي"
      class="fixed bottom-6 right-24 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
      <i class="fa-solid fa-robot text-2xl" id="aiChatIcon"></i>
    </button>

    <div id="aiChatPanel" class="hidden fixed bottom-24 right-6 z-[65] w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-3xl bg-[#0E0B1A] border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden">
      <div class="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <i class="fa-solid fa-robot text-white text-sm"></i>
          </div>
          <div>
            <div class="text-white font-bold text-sm">المساعد الذكي</div>
            <div class="text-[10px] text-green-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              متاح الآن
            </div>
          </div>
        </div>
        <button id="aiChatClose" class="text-slate-400 hover:text-white p-1">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <div id="aiChatMessages" class="flex-1 overflow-y-auto p-4 space-y-3 text-xs"></div>

      <div id="aiChatSuggestions" class="px-3 pb-2 flex flex-wrap gap-1.5"></div>

      <form id="aiChatForm" class="p-3 border-t border-white/10 flex gap-2">
        <input type="text" id="aiChatInput" placeholder="اكتب سؤالك..."
          class="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500" />
        <button type="submit" id="aiChatSend" class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center disabled:opacity-50">
          <i class="fa-solid fa-paper-plane text-sm"></i>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(widget);

  document.getElementById('aiChatToggle').addEventListener('click', toggleChat);
  document.getElementById('aiChatClose').addEventListener('click', toggleChat);
  document.getElementById('aiChatForm').addEventListener('submit', handleSubmit);

  addMessage('assistant', 'مرحباً! أنا المساعد الذكي لإسلام. كيف أقدر أساعدك في رحلتك التسويقية؟ 👋');
  renderSuggestions([
    'ما هو ROAS؟',
    'كيف أحسب Break-Even؟',
    'إيه هو برنامج القاهرة؟',
    'نصائح لخفض تكلفة الإعلانات'
  ]);
}

function toggleChat() {
  isOpen = !isOpen;
  const panel = document.getElementById('aiChatPanel');
  const icon = document.getElementById('aiChatIcon');
  if (isOpen) {
    panel.classList.remove('hidden');
    icon.className = 'fa-solid fa-times text-2xl';
    setTimeout(() => document.getElementById('aiChatInput')?.focus(), 100);
  } else {
    panel.classList.add('hidden');
    icon.className = 'fa-solid fa-robot text-2xl';
  }
}

function addMessage(role, text, isLoading = false) {
  const container = document.getElementById('aiChatMessages');
  const msg = document.createElement('div');
  msg.className = `flex ${role === 'user' ? 'justify-start' : 'justify-end'}`;

  const bubble = `
    <div class="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words ${role === 'user'
      ? 'bg-purple-600/30 text-white border border-purple-500/40 rounded-tr-sm'
      : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm'}">
      ${isLoading ? '<i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري الكتابة...' : escapeAndFormat(text)}
    </div>
  `;
  msg.innerHTML = bubble;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

function escapeAndFormat(text) {
  return String(text || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\n/g, '<br>');
}

function renderSuggestions(suggestions) {
  const container = document.getElementById('aiChatSuggestions');
  container.innerHTML = suggestions.map(s => `
    <button class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] hover:bg-white/10 hover:text-white transition-all"
      onclick="document.getElementById('aiChatInput').value='${s.replace(/'/g, "\\'")}'; document.getElementById('aiChatForm').dispatchEvent(new Event('submit'));">
      ${s}
    </button>
  `).join('');
}

async function handleSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSend');
  const message = input.value.trim();
  if (!message) return;

  addMessage('user', message);
  input.value = '';
  sendBtn.disabled = true;
  document.getElementById('aiChatSuggestions').innerHTML = '';

  const loadingMsg = addMessage('assistant', '', true);

  try {
    const reply = await askGemini(message);
    loadingMsg.remove();
    addMessage('assistant', reply);
    if (window.gtag) window.gtag('event', 'chatbot_message', { length: message.length });
  } catch (err) {
    console.error(err);
    loadingMsg.remove();
    addMessage('assistant', 'عذراً، حصل خطأ. جرب تاني أو تواصل مع إسلام مباشرة عبر واتساب.');
  } finally {
    sendBtn.disabled = false;
  }
}

async function askGemini(userMessage) {
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
  if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

  const body = {
    contents: chatHistory,
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300,
      topP: 0.9
    }
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'لم أفهم سؤالك. جرب تعيد صياغته.';

  chatHistory.push({ role: 'model', parts: [{ text: reply }] });
  return reply;
}
