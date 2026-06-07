import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE_URL = 'https://himazin-technical-department.github.io';
const SITE_NAME = '暇人技術部';

/* ── helpers ── */

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const readJSON = path => JSON.parse(readFileSync(path, 'utf-8'));

const formatDate = str => {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

let md;
try {
  const MarkdownIt = (await import('markdown-it')).default;
  md = new MarkdownIt();
} catch {
  md = { render: s => s };
}

/* ── templates ── */

function shell(title, description, canonical, activeNav, content, extraHead) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Himazin Technical Department`;
  const desc = description || '暇人技術部 (Himazin Technical Department) は、技術好きが集まってプロダクト開発や研究を行うコミュニティです。';
  const canonicalUrl = canonical || SITE_URL + '/';

  const navs = [
    { label: 'ホーム', href: '/', key: 'home' },
    { label: 'お知らせ', href: '/updates/', key: 'updates' },
    { label: 'プロダクト', href: '/products/', key: 'products' },
    { label: 'ブログ', href: '/blog/', key: 'blog' },
    { label: 'メンバー', href: '/members/', key: 'members' },
  ];

  return ko`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="暇人技術部,Himazin Technical Department,HTD,プロダクト開発,コミュニティ">
  <meta name="author" content="暇人技術部">
  <meta name="theme-color" content="#0a0a0f">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" type="image/svg+xml" href="/HTD.svg">
  <link rel="apple-touch-icon" href="/logo.svg">
  <meta name="msapplication-TileColor" content="#0a0a0f">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Yuji+Syuku&display=swap&font-display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  ${extraHead || ''}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${SITE_URL}/logo.svg">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${desc}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "${SITE_NAME}",
    "alternateName": "Himazin Technical Department",
    "url": "${SITE_URL}/",
    "logo": "${SITE_URL}/logo.svg",
    "description": "技術好きが集まってプロダクト開発や研究を行うコミュニティです。"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "${SITE_NAME}",
    "url": "${SITE_URL}/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "${SITE_URL}/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
  </script>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="/" class="logo">
        <img src="/logo.svg" alt="HTD" class="logo-icon">
        <span class="logo-text">${SITE_NAME}</span>
      </a>
      <button class="search-btn" aria-label="検索" onclick="openSearch()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <nav class="nav">
        ${navs.map(n => `<a href="${n.href}" class="nav-link${activeNav === n.key ? ' active' : ''}"${activeNav === n.key ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n        ')}
      </nav>
      <button class="menu-toggle" aria-label="メニュー" onclick="document.querySelector('.nav').classList.toggle('open')">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="search-overlay" id="search-overlay">
    <div class="search-overlay-inner">
      <div class="search-input-wrap">
        <svg class="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" class="search-input" id="search-input" placeholder="サイト内を検索..." autofocus>
        <button class="search-close" id="search-close">✕</button>
      </div>
      <div class="search-results" id="search-results"></div>
    </div>
  </div>

  <main class="main">
    ${content}
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p>&copy; 2026 ${SITE_NAME}</p>
    </div>
  </footer>

  <script src="/js/script.js"></script>
</body>
</html>`;
}

/* tagged template helper — just joins arrays */
function ko(strs, ...vals) {
  let out = strs[0];
  for (let i = 0; i < vals.length; i++) {
    out += String(vals[i] ?? '') + strs[i + 1];
  }
  return out;
}

/* ── page builders ── */

function writePage(filePath, title, description, canonical, activeNav, content, extraHead) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, shell(title, description, canonical, activeNav, content, extraHead), 'utf-8');
  console.log(`  ${filePath}`);
}

function buildHomepage(aboutHtml, updates, products, blog) {
  writePage(join(root, 'index.html'), null, null, null, 'home', `
<div class="hero">
  <div class="hero-heading">
    <img src="/logo.svg" alt="" class="hero-heading-icon">
    <h1 class="hero-title">${SITE_NAME}</h1>
  </div>
  <p class="hero-sub">Himazin Technical Department</p>
  <div class="hero-links">
    <a href="/updates/" class="hero-btn">お知らせ</a>
    <a href="/products/" class="hero-btn">プロダクト</a>
    <a href="/blog/" class="hero-btn">ブログ</a>
    <a href="/members/" class="hero-btn">メンバー</a>
  </div>
</div>
<div class="section section-about">
  <h2 class="section-title">${SITE_NAME}とは？</h2>
  <div class="about-content">${aboutHtml}</div>
</div>
<div class="section">
  <h2 class="section-title">最新のお知らせ</h2>
  <div class="item-list">${updates.slice(0, 5).map(item => `
    <a href="/updates/${item.slug}/" class="item-list-item">
      <div class="item-date">${formatDate(item.date)}</div>
      <h3>${esc(item.title)}</h3>
      ${item.excerpt ? `<div class="item-excerpt">${esc(item.excerpt)}</div>` : ''}
    </a>`).join('')}
  </div>
  ${updates.length > 5 ? `<a href="/updates/" class="section-more">すべて見る →</a>` : ''}
</div>
<div class="section">
  <h2 class="section-title">プロダクト</h2>
  <div class="products-grid">${products.slice(0, 3).map(item => `
    <div class="product-card">
      ${item.icon ? `<div class="product-icon"><img src="/${esc(item.icon)}" alt="${esc(item.title)}" loading="lazy"></div>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt || '')}</p>
      <div class="product-actions">
        <a href="/products/${item.slug}/" class="product-btn product-btn-primary">${esc(item.detailLabel || '詳細')}</a>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.urlLabel || 'サイトへ')}</a>` : ''}
      </div>
    </div>`).join('')}
  </div>
  ${products.length > 3 ? `<a href="/products/" class="section-more">すべて見る →</a>` : ''}
</div>
<div class="section">
  <h2 class="section-title">最近のブログ</h2>
  <div class="item-list">${blog.slice(0, 3).map(item => `
    <a href="/blog/${item.slug}/" class="item-list-item">
      <div class="item-date">${formatDate(item.date)}</div>
      <h3>${esc(item.title)}</h3>
      ${item.excerpt ? `<div class="item-excerpt">${esc(item.excerpt)}</div>` : ''}
    </a>`).join('')}
  </div>
  ${blog.length > 3 ? `<a href="/blog/" class="section-more">すべて見る →</a>` : ''}
</div>`);
}

const SECTION_META = {
  updates: { title: 'お知らせ', label: 'お知らせ', back: '#updates' },
  products: { title: 'プロダクト', label: 'プロダクト', back: '#products' },
  blog: { title: 'ブログ', label: 'ブログ', back: '#blog' },
  members: { title: 'メンバー', label: 'メンバー', back: '#members' },
};

function buildListing(sectionKey, registry) {
  const meta = SECTION_META[sectionKey];
  const listingExtra = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "${SITE_NAME}", "item": "${SITE_URL}/" },
    { "@type": "ListItem", "position": 2, "name": "${esc(meta.label)}", "item": "${SITE_URL}/${sectionKey}/" }
  ]
}
</script>`;
  if (sectionKey === 'products') {
    writePage(join(root, sectionKey, 'index.html'), meta.title, null, null, sectionKey, `
<div class="section">
  <h2 class="section-title">${esc(meta.label)}</h2>
  <div class="products-grid">${registry.map(item => `
    <div class="product-card">
      ${item.icon ? `<div class="product-icon"><img src="/${esc(item.icon)}" alt="${esc(item.title)}" loading="lazy"></div>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt || '')}</p>
      <div class="product-actions">
        <a href="/products/${item.slug}/" class="product-btn product-btn-primary">${esc(item.detailLabel || '詳細')}</a>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.urlLabel || 'サイトへ')}</a>` : ''}
      </div>
    </div>`).join('')}
  </div>
</div>`, listingExtra);
  } else {
    writePage(join(root, sectionKey, 'index.html'), meta.title, null, null, sectionKey, `
<div class="section">
  <h2 class="section-title">${esc(meta.label)}</h2>
  <div class="item-list">${registry.map(item => `
    <a href="/${sectionKey}/${item.slug}/" class="item-list-item">
      <div class="item-date">${formatDate(item.date)}</div>
      <h3>${esc(item.title)}</h3>
      ${item.excerpt ? `<div class="item-excerpt">${esc(item.excerpt)}</div>` : ''}
    </a>`).join('')}
  </div>
</div>`, listingExtra);
  }
}

function buildDetail(sectionKey, item) {
  const meta = SECTION_META[sectionKey];
  const mdPath = join(root, 'data', sectionKey, item.slug, 'index.md');
  let bodyHtml = '';
  if (existsSync(mdPath)) {
    bodyHtml = md.render(readFileSync(mdPath, 'utf-8'));
  } else if (item.body) {
    bodyHtml = md.render(item.body);
  }

  let detailHtml = '';

  if (sectionKey === 'products') {
    if (item.icon) {
      detailHtml += `<div class="detail-icon"><img src="/${esc(item.icon)}" alt="${esc(item.title)}" loading="lazy"></div>`;
    }
    detailHtml += `<h1 class="detail-title">${esc(item.title)}</h1>`;
    if (item.url) {
      detailHtml += `<div style="margin-bottom:24px"><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-primary" style="display:inline-block;padding:10px 28px;font-size:14px">${esc(item.urlLabel || 'サイトへ')}</a></div>`;
    }
  } else {
    detailHtml += `<h1 class="${sectionKey === 'blog' ? 'blog-post-title' : 'detail-title'}">${esc(item.title)}</h1>`;
  }

  detailHtml += '<div class="' + (sectionKey === 'blog' ? 'blog-post-meta' : 'detail-meta') + '">';
  detailHtml += `<span class="${sectionKey === 'blog' ? 'blog-post-meta-item' : 'detail-meta-item'}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ${formatDate(item.date)}</span>`;
  if (item.author) {
    detailHtml += `<span class="${sectionKey === 'blog' ? 'blog-post-meta-item' : 'detail-meta-item'}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ${esc(item.author)}</span>`;
  }
  if (item.tags) {
    detailHtml += `<span class="${sectionKey === 'blog' ? 'blog-post-meta-item' : 'detail-meta-item'}">${item.tags.map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}</span>`;
  }
  detailHtml += '</div>';

  if (sectionKey === 'products') {
    detailHtml += `<div class="detail-content">${bodyHtml}</div>`;
  } else {
    detailHtml += bodyHtml;
  }

  const slugUrl = `${SITE_URL}/${sectionKey}/${item.slug}/`;

  let extraLd = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "${SITE_NAME}", "item": "${SITE_URL}/" },
    { "@type": "ListItem", "position": 2, "name": "${esc(meta.label)}", "item": "${SITE_URL}/#${sectionKey}" },
    { "@type": "ListItem", "position": 3, "name": "${esc(item.title)}", "item": "${slugUrl}" }
  ]
}
</script>`;

  if (sectionKey === 'products') {
    extraLd += `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${esc(item.title)}",
  "description": "${esc(item.excerpt || '')}",
  ${item.icon ? `"image": "${SITE_URL}/${esc(item.icon)}",` : ''}
  "url": "${esc(item.url || slugUrl)}",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "JPY",
    "availability": "https://schema.org/OnlineOnly"
  }
}
</script>`;
  } else if (sectionKey === 'blog') {
    extraLd += `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${esc(item.title)}",
  "description": "${esc(item.excerpt || '')}",
  ${item.author ? `"author": { "@type": "Person", "name": "${esc(item.author)}" },` : ''}
  "datePublished": "${item.date}",
  "publisher": {
    "@type": "Organization",
    "name": "${SITE_NAME}",
    "logo": { "@type": "ImageObject", "url": "${SITE_URL}/logo.svg" }
  }
}
</script>`;
  } else {
    extraLd += `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "${esc(item.title)}",
  "description": "${esc(item.excerpt || '')}",
  "datePublished": "${item.date}",
  "publisher": {
    "@type": "Organization",
    "name": "${SITE_NAME}",
    "logo": { "@type": "ImageObject", "url": "${SITE_URL}/logo.svg" }
  }
}
</script>`;
  }

  writePage(join(root, sectionKey, item.slug, 'index.html'), item.title, item.excerpt, slugUrl, sectionKey, `
<div class="section section-detail">
  <a href="${meta.back}" class="back-link">← ${esc(meta.label)}一覧に戻る</a>
  ${detailHtml}
</div>`, extraLd);
}

function buildMembers(data) {
  const typeLabel = { developer: '開発者', creator: 'クリエイター', supporter: 'サポーター' };
  writePage(join(root, 'members', 'index.html'), 'メンバー', null, null, 'members', `
<div class="section">
  <h2 class="section-title">メンバー</h2>
  <div class="members-grid">${data.map(item => `
    <div class="member-card">
      <div class="member-icon">
        ${item.icon ? `<img src="${esc(item.icon)}" alt="${esc(item.name)}" loading="lazy">` : esc(item.name.charAt(0))}
      </div>
      ${item.type ? `<span class="member-type ${esc(item.type)}">${esc(typeLabel[item.type] || item.type)}</span>` : ''}
      <h3>${esc(item.name)}</h3>
      <div class="member-role">${esc(item.role)}</div>
      <div class="member-desc">${esc(item.description)}</div>
      ${item.links && item.links.length ? `<div class="member-links">${item.links.map(link => link.url ? `<a href="${esc(link.url)}" class="member-link" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>${esc(link.label)}</a>` : '').join('')}</div>` : ''}
    </div>`).join('')}
  </div>
</div>`);
}

/* ── listing redirects ── */
function buildRedirect(dir, hash) {
  const html = ko`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${SITE_NAME} - Himazin Technical Department</title>
  <meta http-equiv="refresh" content="0;url=/${hash}">
  <link rel="canonical" href="${SITE_URL}/">
  <script>location.href="/${hash}"</script>
</head>
<body>
  <p><a href="/${hash}">${SITE_NAME}</a></p>
</body>
</html>`;
  const outPath = join(root, dir, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf-8');
  console.log(`  ${outPath} (redirect → /${hash})`);
}

/* ── main ── */

console.log('Building pages...');

const sections = ['updates', 'products', 'blog'];
const registries = {};
for (const section of sections) {
  const path = join(root, 'data', section, 'registry.json');
  registries[section] = existsSync(path) ? readJSON(path) : [];
}

// Listing redirects (so /updates/ → /#updates, etc.)
buildRedirect('updates', '#updates');
buildRedirect('products', '#products');
buildRedirect('blog', '#blog');
buildRedirect('members', '#members');

// Detail pages (separate HTML for SEO / crawlers)
for (const section of sections) {
  for (const item of registries[section]) {
    buildDetail(section, item);
  }
}

console.log('Done.');
