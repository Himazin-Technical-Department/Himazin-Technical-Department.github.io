import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseFrontmatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE_URL = 'https://himazin-technical-department.github.io';
const SITE_NAME = '暇人技術部';
const BUILD_ID = Date.now().toString(36);

/* ── helpers ── */

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const imgPath = p => p ? (p.startsWith('/') ? p : '/' + p) : '';

const readJSON = path => JSON.parse(readFileSync(path, 'utf-8'));

const memberCount = (() => {
  try { return readJSON(join(root, 'data/members/members.json')).length; } catch { return 0; }
})();

const formatDate = str => {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) {
    console.error(`  ⚠ WARNING: 日付の形式が不正です: "${str}"（有効な日付として扱えません。そのまま表示します）`);
    return str;
  }
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

let md;
try {
  const MarkdownIt = (await import('markdown-it')).default;
  md = new MarkdownIt({ linkify: true, breaks: true });
} catch {
  md = { render: s => s };
}

/* ── templates ── */

function shell(title, description, canonical, activeNav, content, extraHead) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Himazin Technical Department`;
  const desc = description || '暇人技術部 (Himazin Technical Department) とは、SNSの運営やソフトの開発を行う日本のコミュニティです。';
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
  <link rel="stylesheet" href="/css/style.css?v=${BUILD_ID}">
  <meta name="robots" content="index, follow">
  <meta name="format-detection" content="telephone=no, email=no, address=no">
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
  ${extraHead || ''}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "${SITE_NAME}",
    "alternateName": "Himazin Technical Department",
    "url": "${SITE_URL}/",
    "logo": "${SITE_URL}/logo.svg",
    "description": "SNSの運営やソフトの開発を行う日本のコミュニティです。"
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
        ${navs.map(n => `<a href="${n.href}" class="nav-link${activeNav === n.key ? ' active' : ''}"${activeNav === n.key ? ' aria-current="page"' : ''} data-nav data-section="${n.key}">${esc(n.label)}</a>`).join('\n        ')}
      </nav>
      <button class="menu-toggle" aria-label="メニュー">
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
      <div class="footer-grid">
        <div class="footer-col">
          <h4>${SITE_NAME}</h4>
          <p>SNSの運営やソフトの開発を行う日本のコミュニティです。</p>
        </div>
        <div class="footer-col">
          <h4>ナビゲーション</h4>
          <ul class="footer-links">
            <li><a href="/">ホーム</a></li>
            <li><a href="/updates/">お知らせ</a></li>
            <li><a href="/products/">プロダクト</a></li>
            <li><a href="/blog/">ブログ</a></li>
            <li><a href="/members/">メンバー</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>リンク</h4>
          <ul class="footer-links">
            <li><a href="https://github.com/Himazin-Technical-Department" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ${SITE_NAME}</p>
      </div>
    </div>
  </footer>

  <script src="/js/script.js?v=${BUILD_ID}"></script>
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

/* ── youtube embed ── */

function convertYouTubeEmbeds(html) {
  return html.replace(
    /<a\s[^>]*href="(?:https?:)?\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)(?:&[^"]*)?"[^>]*>.*?<\/a>/g,
    (_, id) => `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`
  );
}

/* ── page builders ── */

function writePage(filePath, title, description, canonical, activeNav, content, extraHead) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, shell(title, description, canonical, activeNav, content, extraHead), 'utf-8');
  console.log(`  ${filePath}`);
}

function buildHomepage(aboutHtml, updates, products, blog, featured) {
  let carouselSlides = '';
  if (featured.length > 0) {
    carouselSlides = featured.map((item, i) => `
    <a href="/${item.section}/${item.slug}/" class="carousel-slide${i === 0 ? ' active' : ''}" data-index="${i}">
      <div class="carousel-slide-img"><img src="/${esc(item.thumbnail)}" alt="${esc(item.title)}" width="240" height="135"></div>
      <div class="carousel-slide-body">
        <span class="carousel-slide-tag">${item.section === 'updates' ? 'お知らせ' : 'ブログ'}</span>
        <h3>${esc(item.title)}</h3>
      </div>
    </a>`).join('');
  }

  writePage(join(root, 'index.html'), null, null, null, 'home', `
<div class="deco-layer">
  <div class="hero-deco-ring hero-deco-ring-1"></div>
  <div class="hero-deco-ring hero-deco-ring-2"></div>
  <div class="hero-deco-ring hero-deco-ring-3"></div>
  <div class="hero-deco-ring hero-deco-ring-4"></div>
  <div class="hero-deco-ring hero-deco-ring-5"></div>
  <div class="hero-deco-ring hero-deco-ring-6"></div>
  <div class="hero-deco-ring hero-deco-ring-7"></div>
  <div class="hero-deco-ring hero-deco-ring-8"></div>
</div>
<div class="hero">
  <div class="hero-inner">
    <div class="hero-heading">
      <span class="hero-icon-wrap"><img src="/logo.svg" alt="" class="hero-heading-icon"></span>
      <h1 class="hero-title">${SITE_NAME}</h1>
    </div>
    <p class="hero-sub">Himazin Technical Department</p>
    <div class="hero-accent"></div>
    <div class="hero-links">
      <a href="/updates/" class="hero-btn">お知らせ</a>
      <a href="/products/" class="hero-btn">プロダクト</a>
      <a href="/blog/" class="hero-btn">ブログ</a>
      <a href="/members/" class="hero-btn">メンバー</a>
    </div>
  </div>
</div>
${featured.length > 0 ? `
<div class="carousel-wrap">
  <div class="carousel-thumbs">
    ${carouselSlides}
  </div>
</div>` : ''}
<div class="section section-about">
  <h2 class="section-title">${SITE_NAME}について</h2>
  <div class="about-content">${aboutHtml}</div>
  <a href="/about/" class="about-more">詳細を見る</a>
</div>
<div class="section">
  <h2 class="section-title timeline-title">最新のお知らせ</h2>
  <div class="timeline-list">${updates.slice(0, 5).map(item => `
    <a href="/updates/${item.slug}/" class="timeline-item${item.thumbnail ? ' has-thumb' : ''}">
      <div class="timeline-marker">
        <time class="timeline-date">${formatDate(item.date)}</time>
      </div>
      ${item.thumbnail ? `<div class="timeline-thumb"><img src="/${esc(item.thumbnail)}" alt="" loading="lazy" width="160" height="90"></div>` : ''}
      <div class="timeline-body">
        <h3>${esc(item.title)}</h3>
        ${item.excerpt ? `<div class="timeline-excerpt">${esc(item.excerpt)}</div>` : ''}
      </div>
    </a>`).join('')}
  </div>
  ${updates.length > 5 ? `<a href="/updates/" class="section-more">すべて見る →</a>` : ''}
</div>
<div class="section">
  <h2 class="section-title">最新のプロダクト</h2>
  <div class="products-grid">${products.slice(0, 3).map(item => `
    <div class="product-card">
      ${item.category ? `<span class="product-category-badge">${esc(item.category)}</span>` : ''}
      ${item.icon ? `<div class="product-icon"><img src="${esc(imgPath(item.icon))}" alt="${esc(item.title)}" loading="lazy" width="64" height="64"></div>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt || '')}</p>
      <div class="product-actions">
        <a href="/products/${item.slug}/" class="product-btn product-btn-primary">${esc(item.detailLabel || '詳細')}</a>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.urlLabel || 'サイトへ')}</a>` : ''}
        ${item.downloadUrl ? `<a href="${esc(item.downloadUrl)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.downloadLabel || 'ダウンロード')}</a>` : ''}
      </div>
    </div>`).join('')}
  </div>
  ${products.length > 3 ? `<a href="/products/" class="section-more">すべて見る →</a>` : ''}
</div>
<div class="section">
  <h2 class="section-title">最新のブログ</h2>
  <div class="blog-cards">${blog.slice(0, 3).map(item => `
    <a href="/blog/${item.slug}/" class="blog-card">
      <div class="blog-card-thumb">
        <img src="/${esc(item.thumbnail || '')}" alt="" loading="lazy" width="200" height="112">
      </div>
      <div class="blog-card-body">
        <time class="blog-card-date">${formatDate(item.date)}</time>
        <h3>${esc(item.title)}</h3>
        ${item.excerpt ? `<p class="blog-card-excerpt">${esc(item.excerpt)}</p>` : ''}
        ${item.tags ? `<div class="blog-card-tags">${item.tags.map(t => `<span class="blog-card-tag">${esc(t)}</span>`).join('')}</div>` : ''}
      </div>
    </a>`).join('')}
  </div>
  ${blog.length > 3 ? `<a href="/blog/" class="section-more">すべて見る →</a>` : ''}
</div>`);
}

const SECTION_META = {
  updates: { title: 'お知らせ', label: 'お知らせ', back: '/updates/' },
  products: { title: 'プロダクト', label: 'プロダクト', back: '/products/' },
  blog: { title: 'ブログ', label: 'ブログ', back: '/blog/' },
  members: { title: 'メンバー', label: 'メンバー', back: '/members/' },
};

function buildListing(sectionKey, registry) {
  const meta = SECTION_META[sectionKey];
  const canonical = `${SITE_URL}/${sectionKey}/`;
  const listingExtra = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "${SITE_NAME}", "item": "${SITE_URL}/" },
    { "@type": "ListItem", "position": 2, "name": "${esc(meta.label)}", "item": "${canonical}" }
  ]
}
</script>`;
  if (sectionKey === 'products') {
    const categories = [...new Set(registry.map(i => i.category).filter(Boolean))];
    writePage(join(root, sectionKey, 'index.html'), meta.title, null, canonical, sectionKey, `
<div class="section">
  <a href="/" class="back-link">← ホームに戻る</a>
  <h2 class="section-title">${esc(meta.label)}</h2>
  <div class="category-filters" id="products-filters">
    <button class="category-filter active" data-category="all">すべて</button>
    ${categories.map(cat => `<button class="category-filter" data-category="${esc(cat)}">${esc(cat)}</button>`).join('')}
  </div>
  ${categories.map(cat => `
  <h3 class="products-group-title">${esc(cat)}</h3>
  <div class="products-grid">${registry.filter(i => i.category === cat).map(item => `
    <div class="product-card" data-category="${esc(item.category)}">
      <span class="product-category-badge">${esc(item.category)}</span>
      ${item.icon ? `<div class="product-icon"><img src="${esc(imgPath(item.icon))}" alt="${esc(item.title)}" loading="lazy" width="64" height="64"></div>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt || '')}</p>
      <div class="product-actions">
        <a href="/products/${item.slug}/" class="product-btn product-btn-primary">${esc(item.detailLabel || '詳細')}</a>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.urlLabel || 'サイトへ')}</a>` : ''}
        ${item.downloadUrl ? `<a href="${esc(item.downloadUrl)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.downloadLabel || 'ダウンロード')}</a>` : ''}
      </div>
    </div>`).join('')}
  </div>`).join('')}
  ${registry.filter(i => !i.category).length ? `
  <div class="products-grid">${registry.filter(i => !i.category).map(item => `
    <div class="product-card">
      ${item.icon ? `<div class="product-icon"><img src="${esc(imgPath(item.icon))}" alt="${esc(item.title)}" loading="lazy" width="64" height="64"></div>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt || '')}</p>
      <div class="product-actions">
        <a href="/products/${item.slug}/" class="product-btn product-btn-primary">${esc(item.detailLabel || '詳細')}</a>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.urlLabel || 'サイトへ')}</a>` : ''}
        ${item.downloadUrl ? `<a href="${esc(item.downloadUrl)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.downloadLabel || 'ダウンロード')}</a>` : ''}
      </div>
    </div>`).join('')}
  </div>` : ''}
</div>`, listingExtra);
  } else {
    writePage(join(root, sectionKey, 'index.html'), meta.title, null, canonical, sectionKey, `
<div class="section">
  <a href="/" class="back-link">← ホームに戻る</a>
  <h2 class="section-title">${esc(meta.label)}</h2>
  <div class="item-list">${registry.map(item => `
    <a href="/${sectionKey}/${item.slug}/" class="item-list-item${item.thumbnail ? ' has-thumb' : ''}">
      ${item.thumbnail ? `<div class="item-thumb"><img src="/${esc(item.thumbnail)}" alt="" loading="lazy" width="200" height="112"></div>` : ''}
      <div class="item-body">
        <div class="item-date">${formatDate(item.date)}</div>
        <h3>${esc(item.title)}</h3>
        ${item.excerpt ? `<div class="item-excerpt">${esc(item.excerpt)}</div>` : ''}
      </div>
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
    const { content } = parseFrontmatter(readFileSync(mdPath, 'utf-8'));
    bodyHtml = convertYouTubeEmbeds(md.render(content));
  } else if (item.body) {
    bodyHtml = convertYouTubeEmbeds(md.render(item.body));
  }

  let detailHtml = '';

  if (sectionKey === 'products') {
    if (item.icon) {
      detailHtml += `<div class="detail-icon"><img src="${esc(imgPath(item.icon))}" alt="${esc(item.title)}" loading="lazy" width="80" height="80"></div>`;
    }
    detailHtml += `<h1 class="detail-title">${esc(item.title)}</h1>`;
    if (item.url) {
      detailHtml += `<div style="margin-bottom:24px"><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-primary" style="display:inline-block;padding:10px 28px;font-size:14px">${esc(item.urlLabel || 'サイトへ')}</a></div>`;
    }
    if (item.downloadUrl) {
      detailHtml += `<div style="margin-bottom:24px"><a href="${esc(item.downloadUrl)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary" style="display:inline-block;padding:10px 28px;font-size:14px">${esc(item.downloadLabel || 'ダウンロード')}</a></div>`;
    }
  } else {
    if (item.thumbnail) {
      detailHtml += `<div class="detail-thumb"><img src="/${esc(item.thumbnail)}" alt="${esc(item.title)}" loading="lazy" width="900" height="450"></div>`;
    }
    detailHtml += `<h1 class="${sectionKey === 'blog' ? 'blog-post-title' : 'detail-title'}">${esc(item.title)}</h1>`;
  }

  detailHtml += '<div class="' + (sectionKey === 'blog' ? 'blog-post-meta' : 'detail-meta') + '">';
  detailHtml += `<span class="${sectionKey === 'blog' ? 'blog-post-meta-item' : 'detail-meta-item'}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ${formatDate(item.date)}</span>`;
  if (sectionKey === 'products' && item.category) {
    detailHtml += `<span class="detail-meta-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      ${esc(item.category)}</span>`;
  }
  if (item.author) {
    detailHtml += `<span class="${sectionKey === 'blog' ? 'blog-post-meta-item' : 'detail-meta-item'}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ${esc(item.author)}</span>`;
  }
  if (item.tags) {
    detailHtml += `<span class="${sectionKey === 'blog' ? 'blog-post-meta-item' : 'detail-meta-item'}">${item.tags.map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}</span>`;
  }
  detailHtml += '</div>';

  detailHtml += `<div class="detail-content">${bodyHtml}</div>`;

  const slugUrl = `${SITE_URL}/${sectionKey}/${item.slug}/`;

  const ogImage = item.icon ? `${SITE_URL}${esc(imgPath(item.icon))}` : null;

  let extraLd = ogImage ? `<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
` : '';
  extraLd += `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "${SITE_NAME}", "item": "${SITE_URL}/" },
    { "@type": "ListItem", "position": 2, "name": "${esc(meta.label)}", "item": "${SITE_URL}/${sectionKey}/" },
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
  ${item.icon ? `"image": "${SITE_URL}${esc(imgPath(item.icon))}",` : ''}
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
  writePage(join(root, 'members', 'index.html'), 'メンバー', null, `${SITE_URL}/members/`, 'members', `
<div class="section">
  <a href="/" class="back-link">← ホームに戻る</a>
  <h2 class="section-title">メンバー</h2>
  <div class="members-grid">${data.map(item => `
    <div class="member-card">
      <div class="member-icon">
        ${item.icon ? `<img src="${esc(imgPath(item.icon))}" alt="${esc(item.name)}" loading="lazy" width="72" height="72">` : esc(item.name.charAt(0))}
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

function buildAbout(aboutHtml) {
  writePage(join(root, 'about', 'index.html'), '暇人技術部とは', null, `${SITE_URL}/about/`, 'about', `
<div class="section section-detail">
  <a href="/" class="back-link">← ホームに戻る</a>
  <div class="detail-content">${aboutHtml}</div>
</div>`);
}

/* ── main ── */

console.log('Building pages...');

const sections = ['updates', 'products', 'blog'];
const registries = {};
for (const section of sections) {
  const registryPath = join(root, 'data', section, 'registry.json');
  if (!existsSync(registryPath)) {
    console.error(`  ✖ ERROR: data/${section}/registry.json が見つかりません。
    先に \`node scripts/generate-registry.js\` を実行してください。`);
    process.exit(1);
  }
  registries[section] = readJSON(registryPath);
}

// Validate product icons
for (const item of registries.products) {
  if (item.icon) {
    const iconPath = join(root, item.icon);
    if (!existsSync(iconPath)) {
      console.error(`  ✖ ERROR: プロダクト "${item.title}" のアイコンファイルが見つかりません。
    設定パス: ${item.icon}
    期待される場所: ${iconPath}
    解消法: アイコンファイルを配置するか、frontmatter の icon のパスを修正してください。`);
      process.exit(1);
    }
  }
}

// About (homepage excerpt + detail page)
const aboutPath = join(root, 'data', 'about.json');
let aboutHtml = '';
if (existsSync(aboutPath)) {
  const aboutData = readJSON(aboutPath);
  aboutHtml = md.render(aboutData.content || aboutData.about || '');
}

const aboutMdPath = join(root, 'data', 'about', 'index.md');
let aboutPageHtml = '';
if (existsSync(aboutMdPath)) {
  const { content } = parseFrontmatter(readFileSync(aboutMdPath, 'utf-8'));
  aboutPageHtml = md.render(content);
}
const featured = [...registries.updates.map(i => ({ ...i, section: 'updates' })), ...registries.blog.map(i => ({ ...i, section: 'blog' }))]
  .filter(i => i.thumbnail)
  .sort((a, b) => {
    const af = a.featured != null ? Number(a.featured) : Infinity;
    const bf = b.featured != null ? Number(b.featured) : Infinity;
    if (af !== bf) return af - bf;
    const aSec = a.section === 'updates' ? 0 : 1;
    const bSec = b.section === 'updates' ? 0 : 1;
    if (aSec !== bSec) return aSec - bSec;
    return new Date(b.date) - new Date(a.date);
  })
  .slice(0, 5);
buildHomepage(aboutHtml, registries.updates, registries.products, registries.blog, featured);

// Listing pages
buildListing('updates', registries.updates);
buildListing('products', registries.products);
buildListing('blog', registries.blog);

// Members page
const membersPath = join(root, 'data', 'members', 'members.json');
if (existsSync(membersPath)) {
  buildMembers(readJSON(membersPath));
}

// About page
if (aboutPageHtml) {
  buildAbout(aboutPageHtml);
}

// Detail pages
for (const section of sections) {
  for (const item of registries[section]) {
    buildDetail(section, item);
  }
}

// Clean up stale directories (deleted items)
for (const section of sections) {
  const dir = join(root, section);
  if (!existsSync(dir)) continue;
  const slugs = new Set(registries[section].map(i => i.slug));
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !slugs.has(entry.name)) {
      const path = join(dir, entry.name);
      rmSync(path, { recursive: true, force: true });
      console.log(`  ✂ removed stale: ${section}/${entry.name}/`);
    }
  }
}

console.log('Done.');
