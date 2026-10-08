// ============================================================
// Related Posts — المقالات ذات الصلة
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from '../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

function escapeHtml(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function buildPostUrl(post) {
  if (post.slug) return `post.html?slug=${encodeURIComponent(post.slug)}`;
  return `post.html?id=${encodeURIComponent(post.id ?? '')}`;
}

// Score posts by tag/category overlap
function scoreSimilarity(currentPost, candidate) {
  let score = 0;
  const currentTags = Array.isArray(currentPost.tags) ? currentPost.tags.map(t => t.toLowerCase()) : [];
  const candidateTags = Array.isArray(candidate.tags) ? candidate.tags.map(t => t.toLowerCase()) : [];
  const currentCat = (currentPost.category || '').toLowerCase();
  const candidateCat = (candidate.category || '').toLowerCase();

  // Category match = +5 points
  if (currentCat && currentCat === candidateCat) score += 5;

  // Tag overlap = +3 per tag
  candidateTags.forEach(t => {
    if (currentTags.includes(t)) score += 3;
  });

  // Same focus keyword = +2
  const currentKw = (currentPost.focusKeyword || '').toLowerCase();
  const candidateKw = (candidate.focusKeyword || '').toLowerCase();
  if (currentKw && currentKw === candidateKw) score += 2;

  return score;
}

export async function renderRelatedPosts(currentPostId, containerId = 'relatedPostsContainer', maxItems = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const snap = await getDocs(collection(db, 'blog'));
    let allPosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Filter only published & not current post
    allPosts = allPosts.filter(p =>
      p.id !== currentPostId &&
      (!p.status || p.status === 'published')
    );

    const currentPost = allPosts.find(p => p.id === currentPostId) ||
      { id: currentPostId, category: '', tags: [], focusKeyword: '' };

    // Score and sort
    const scored = allPosts.map(p => ({ post: p, score: scoreSimilarity(currentPost, p) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map(x => x.post);

    // Fallback: if no similar posts, take latest 3
    if (!scored.length) {
      const fallback = allPosts.slice(0, maxItems);
      renderList(container, fallback);
      return;
    }

    renderList(container, scored);
  } catch (err) {
    console.warn('Related posts error:', err);
    container.innerHTML = '';
  }
}

function renderList(container, posts) {
  if (!posts.length) {
    container.innerHTML = '';
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="pt-8 border-t border-white/10 space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fa-solid fa-diagram-project text-purple-400"></i>
        اقرأ أيضاً
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${posts.map(p => {
          const postUrl = buildPostUrl(p);
          const safeTitle = escapeHtml(p.title || 'بدون عنوان');
          const safeCat = escapeHtml(p.category || 'عام');
          const hasImage = p.image && /^https?:/i.test(p.image);
          return `
            <a href="${postUrl}" class="group p-4 rounded-xl bg-[#0E0B1A] border border-white/10 hover:border-pink-500/40 transition-all overflow-safe-card">
              ${hasImage ? `<img src="${escapeHtml(p.image)}" alt="${safeTitle}" class="w-full h-28 object-cover rounded-lg mb-3" loading="lazy" onerror="this.style.display='none'" />` : ''}
              <span class="text-[10px] text-pink-400 font-bold">${safeCat}</span>
              <h3 class="text-sm font-bold text-white mt-1 group-hover:text-pink-400 transition-colors break-words-safe line-clamp-2">${safeTitle}</h3>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
