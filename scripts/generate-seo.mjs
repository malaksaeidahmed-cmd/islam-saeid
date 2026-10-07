// ============================================================
// Auto-generate SEO files from Firestore
// Runs in GitHub Actions — no manual work needed
// ============================================================

import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ID = 'my-website-e5b7e';
const SITE_URL = 'https://islamsaeid.me';
const SITE_TITLE = 'إسلام سعيد';
const SITE_DESC = 'إدارة الميزانيات الإعلانية الضخمة بتحقيق عوائد استثمارية تصل إلى 30x ROAS';

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function fetchCollection(name) {
  try {
    const url = `${FIRESTORE_BASE}/${name}?pageSize=300`;
    console.log(`📥 Fetching ${name}...`);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`⚠️ Failed to fetch ${name}: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    if (!data.documents) {
      console.log(`   No documents in ${name}`);
      return [];
    }
    return data.documents.map(doc => {
      const id = doc.name.split('/').pop();
      return { id, ...parseFields(doc.fields || {}) };
    });
  } catch (err) {
    console.error(`❌ Error fetching ${name}:`, err.message);
    return [];
  }
}

function parseFields(fields) {
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    result[key] = parseValue(val);
  }
  return result;
}

function parseValue(val) {
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('timestampValue' in val) return val.timestampValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(parseValue);
  if ('mapValue' in val) return parseFields(val.mapValue.fields || {});
  return null;
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(ts) {
  try {
    return new Date(ts || Date.now()).toISOString().split('T')[0];
  } catch (_) {
    return new Date().toISOString().split('T')[0];
  }
}

function formatRFC822(ts) {
  try {
    return new Date(ts || Date.now()).toUTCString();
  } catch (_) {
    return new Date().toUTCString();
  }
}

const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/blog.html', priority: '0.9', changefreq: 'daily' },
  { url: '/faq.html', priority: '0.7', changefreq: 'monthly' },
  { url: '/index.html#portfolio', priority: '0.8', changefreq: 'weekly' },
  { url: '/index.html#calculator', priority: '0.7', changefreq: 'monthly' },
  { url: '/index.html#course', priority: '0.8', changefreq: 'monthly' }
];

function buildSitemap(posts, projects) {
  const today = formatDate(Date.now());
  const urls = [];

  STATIC_PAGES.forEach(p => urls.push({
    loc: `${SITE_URL}${p.url}`,
    lastmod: today,
    changefreq: p.changefreq,
    priority: p.priority
  }));

  posts.forEach(p => {
    urls.push({
      loc: `${SITE_URL}/post.html?id=${encodeURIComponent(p.id)}`,
      lastmod: formatDate(p.updatedAt || p.createdAt),
      changefreq: 'monthly',
      priority: '0.8'
    });
  });

  projects.forEach(p => {
    urls.push({
      loc: `${SITE_URL}/case-study.html?id=${encodeURIComponent(p.id)}`,
      lastmod: formatDate(p.updatedAt || p.createdAt),
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function buildRSS(posts) {
  const sorted = [...posts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 20);

  const items = sorted.map(p => {
    const link = `${SITE_URL}/post.html?id=${encodeURIComponent(p.id)}`;
    const desc = String(p.excerpt || p.metaDescription || String(p.content || '').replace(/<[^>]+>/g, ' ')).slice(0, 300).trim();
    const pubDate = formatRFC822(p.createdAt);
    const category = p.category ? `<category>${escapeXml(p.category)}</category>` : '';
    const image = p.image ? `<enclosure url="${escapeXml(p.image)}" type="image/jpeg" />` : '';

    return `    <item>
      <title>${escapeXml(p.title || 'بدون عنوان')}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
      ${category}
      ${image}
    </item>`;
  }).join('\n');

  const lastBuildDate = formatRFC822(Date.now());

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)} - المدونة</title>
    <link>${SITE_URL}/blog.html</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>ar</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

async function main() {
  console.log('🚀 Starting SEO file generation...');
  console.log(`📅 ${new Date().toISOString()}`);

  const [posts, projects] = await Promise.all([
    fetchCollection('blog'),
    fetchCollection('portfolio')
  ]);

  console.log(`✅ Found ${posts.length} posts and ${projects.length} projects`);

  const root = process.cwd();

  await fs.writeFile(path.join(root, 'sitemap.xml'), buildSitemap(posts, projects), 'utf8');
  console.log('✅ sitemap.xml written');

  await fs.writeFile(path.join(root, 'feed.xml'), buildRSS(posts), 'utf8');
  console.log('✅ feed.xml written');

  const meta = {
    lastUpdated: new Date().toISOString(),
    lastUpdatedArabic: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
    postsCount: posts.length,
    projectsCount: projects.length,
    staticPagesCount: STATIC_PAGES.length
  };
  await fs.writeFile(path.join(root, 'seo-meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  console.log('✅ seo-meta.json written');

  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
