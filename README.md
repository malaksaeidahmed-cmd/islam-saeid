# islam-saeid

موقع عربي (RTL) ثابت لـ **Islam Saeid** مبني بصفحات HTML/CSS/JS ويُنشر عبر **GitHub Pages**.

## التشغيل المحلي

لا يحتاج المشروع إلى build step.

1. افتح المجلد محليًا.
2. شغّل خادمًا ثابتًا بسيطًا (مثال):

```bash
python -m http.server 8080
```

3. افتح `http://localhost:8080`.

> يفضّل التشغيل عبر خادم محلي بدل `file://` لضمان عمل المسارات والـ modules بشكل صحيح.

## التحقق السريع (Lightweight Checks)

- فحص مراجع الملفات الداخلية واتساق أساسيات HTML/CSS:

```bash
node scripts/validate-site.mjs
```

- فحص صياغة JavaScript:

```bash
node --check js/main.js
node --check js/calculator.js
node --check js/cms-data.js
node --check js/firebase-cms.js
node --check js/app-features.js
```

## الاعتماديات الخارجية

الموقع يعتمد على CDNs التالية:
- Tailwind CDN
- Font Awesome CDN
- Google Fonts
- html2pdf.js
- Chart.js
- Firebase (Firestore + App SDK)

تم تحسين الموقع بحيث يظل المحتوى الأساسي متاحًا حتى عند تعذر تحميل Firebase/بعض التكاملات السحابية (باستخدام fallback محلي للبيانات في الصفحات العامة).

## النشر

- النشر مستهدف لـ **GitHub Pages** على الدومين: `https://islamsaeid.me`.
- الملفات ثابتة ولا تتطلب build/compile.

## ملخص التحسينات المنفذة

- إصلاح ملف `css/style.css` (كان يحتوي HTML بدل CSS) واستعادة الأنماط المشتركة.
- توحيد مسارات الشعار/الأيقونة إلى `logo.png` لتفادي المراجع المكسورة.
- تحسين سلوك التنقل على الموبايل (إغلاق بعد الضغط/خارج القائمة/Escape + ARIA).
- تحسين التحقق في نموذج الانتظار: منع الإرسال المكرر، التحقق من رقم الهاتف، وتحذير مغادرة قبل الإرسال.
- تحسين حاسبة القرار المالي للتعامل مع القيم الفارغة/السالبة/غير المنطقية بشكل أكثر أمانًا.
- تحسين الأمان في العرض الديناميكي (escaping/safe rendering) للمدونة والمقال ودراسات الحالة.
- إضافة fallback محلي للمدونة/المقال/دراسة الحالة عند فشل Firebase.
- تحسين SEO الأساسي (description/canonical/Open Graph) للصفحات العامة.
- تحديث `sitemap.xml` ليشمل الصفحات العامة الأساسية.
