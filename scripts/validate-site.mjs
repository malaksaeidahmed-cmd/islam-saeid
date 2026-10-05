import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = [
  'index.html',
  'blog.html',
  'case-study.html',
  'faq.html',
  'post.html',
  'admin/login.html',
  'admin/dashboard.html'
];

const publicPages = ['index.html', 'blog.html', 'case-study.html', 'faq.html', 'post.html'];

const errors = [];
const warnings = [];

const shouldCheckPath = (ref) => {
  if (!ref) return false;
  if (ref.includes('${')) return false;
  if (ref.startsWith('#')) return false;
  if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(ref)) return false;
  return true;
};

for (const relFile of htmlFiles) {
  const absFile = path.join(root, relFile);
  const html = fs.readFileSync(absFile, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((m) => m[1]);

  for (const ref of refs) {
    if (!shouldCheckPath(ref)) continue;
    const normalized = ref.split('?')[0].split('#')[0];
    const target = path.resolve(path.dirname(absFile), normalized);
    if (!fs.existsSync(target)) {
      errors.push(`${relFile}: missing reference -> ${ref}`);
    }
  }

  if (!/<title>[^<]+<\/title>/i.test(html)) {
    errors.push(`${relFile}: missing <title>`);
  }

  if (publicPages.includes(relFile)) {
    if (!/<meta\s+name=["']description["']/i.test(html)) {
      warnings.push(`${relFile}: missing meta description`);
    }
    if (!/<link\s+rel=["']canonical["']/i.test(html)) {
      warnings.push(`${relFile}: missing canonical URL`);
    }
  }
}

const cssPath = path.join(root, 'css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');
if (/<!DOCTYPE html>/i.test(css) || /<html/i.test(css)) {
  errors.push('css/style.css: appears to contain HTML, expected CSS rules');
}

if (errors.length) {
  console.error('Site validation failed:\n');
  errors.forEach((err) => console.error(`- ${err}`));
  if (warnings.length) {
    console.error('\nWarnings:');
    warnings.forEach((warn) => console.error(`- ${warn}`));
  }
  process.exit(1);
}

console.log('Site validation passed.');
if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach((warn) => console.log(`- ${warn}`));
}
