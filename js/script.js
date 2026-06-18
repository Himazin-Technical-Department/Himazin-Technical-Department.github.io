const SITE_NAME = '暇人技術部';
const SECTIONS = ['updates', 'products', 'blog'];
const PATH_TO_HASH = {
  '/': 'home',
  '/updates/': 'updates',
  '/products/': 'products',
  '/blog/': 'blog',
  '/members/': 'members',
};
const registryCache = {};
const metaCache = {};
const mdCache = {};

function updatePageMeta(title, description, image) {
  document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Himazin Technical Department`;
  const desc = description || '暇人技術部 (Himazin Technical Department) とは、SNSの運営やソフトの開発を行う日本のコミュニティです。';
  document.querySelector('meta[name="description"]').setAttribute('content', desc);
  document.querySelector('meta[property="og:title"]').setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]').setAttribute('content', desc);
  document.querySelector('meta[property="og:url"]').setAttribute('content', 'https://himazin-technical-department.github.io' + location.pathname);
  document.querySelector('meta[property="og:image"]').setAttribute('content', image || 'https://himazin-technical-department.github.io/logo.svg');
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', document.title);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', desc);
  document.querySelector('meta[name="twitter:card"]').setAttribute('content', image ? 'summary_large_image' : 'summary');
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseFrontMatter(text) {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return { attrs: {}, body: text };
  const attrs = {};
  m[1].split('\n').forEach(line => {
    const sep = line.indexOf(':');
    if (sep === -1) return;
    const key = line.slice(0, sep).trim();
    let val = line.slice(sep + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    attrs[key] = val;
  });
  return { attrs, body: text.slice(m[0].length) };
}

async function loadRegistry(section) {
  if (registryCache[section]) return registryCache[section];
  const data = await fetchJSON(`data/${section}/registry.json`);
  registryCache[section] = data;
  return data;
}

async function loadPostMeta(section, slug) {
  const key = `${section}/${slug}`;
  if (metaCache[key]) return metaCache[key];
  const data = await fetchJSON(`data/${section}/${slug}/meta.json`);
  metaCache[key] = data;
  return data;
}

async function loadPostMD(section, slug) {
  const key = `${section}/${slug}`;
  if (mdCache[key]) return mdCache[key];
  try {
    const text = await fetchText(`data/${section}/${slug}/index.md`);
    mdCache[key] = text;
    return text;
  } catch {
    const meta = await loadPostMeta(section, slug);
    if (meta && meta.body) {
      mdCache[key] = meta.body;
      return meta.body;
    }
    throw new Error('Markdown content not found');
  }
}

function renderProducts(containerId, items, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!items || !items.length) {
    container.innerHTML = '<p style="color:#999;">まだプロダクトがありません</p>';
    return;
  }

  items = [...items].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  const catOrder = {};
  items.forEach(i => { if (i.category) catOrder[i.category] = Math.min(catOrder[i.category] ?? Infinity, i.categoryOrder ?? Infinity); });
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))].sort((a, b) => (catOrder[a] ?? Infinity) - (catOrder[b] ?? Infinity));
  const activeCategory = options.activeCategory || 'all';

  let html = '';

  if (options.showFilters && categories.length) {
    html += '<div class="category-filters">';
    html += `<button class="category-filter${activeCategory === 'all' ? ' active' : ''}" data-category="all">すべて</button>`;
    categories.forEach(cat => {
      html += `<button class="category-filter${activeCategory === cat ? ' active' : ''}" data-category="${cat}">${esc(cat)}</button>`;
    });
    html += '</div>';
  }

  if (activeCategory !== 'all') {
    const filtered = items.filter(i => i.category === activeCategory);
    html += '<div class="products-grid">';
    html += renderProductCards(filtered);
    html += '</div>';
  } else {
    categories.forEach(cat => {
      const group = items.filter(i => i.category === cat);
      if (!group.length) return;
      html += `<h3 class="products-group-title">${esc(cat)}</h3>`;
      html += '<div class="products-grid">';
      html += renderProductCards(group);
      html += '</div>';
    });
    const uncategorized = items.filter(i => !i.category);
    if (uncategorized.length) {
      html += '<div class="products-grid">';
      html += renderProductCards(uncategorized);
      html += '</div>';
    }
  }

  container.innerHTML = html;
}

function renderProductCards(items) {
  return items.map(item => {
    const catLabel = item.category || '';
    const catBadge = catLabel ? `<span class="product-category-badge">${esc(catLabel)}</span>` : '';
    return `<div class="product-card">
      ${catBadge}
      ${item.icon ? `<div class="product-icon"><img src="${esc(item.icon)}" alt="${esc(item.title)}" loading="lazy" width="64" height="64"></div>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt || '')}</p>
      <div class="product-actions">
        <a href="/products/${item.slug}/" class="product-btn product-btn-primary">${esc(item.detailLabel || '詳細')}</a>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.urlLabel || 'サイトへ')}</a>` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderItemList(containerId, items, section) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!items || !items.length) {
    container.innerHTML = '<p style="color:#999;">まだコンテンツがありません</p>';
    return;
  }
  container.innerHTML = items.map(item =>
    `<a href="/${section}/${item.slug}/" class="item-list-item">
      <div class="item-date">${esc(formatDate(item.date))}</div>
      <h3>${esc(item.title)}</h3>
      ${item.excerpt ? `<div class="item-excerpt">${esc(item.excerpt)}</div>` : ''}
    </a>`
  ).join('');
}

function renderDetail(section, slug) {
  const contentId = `${section}-detail-content`;
  const container = document.getElementById(contentId);
  if (!container) return;

  container.innerHTML = '<p style="color:#999;">読み込み中...</p>';

  Promise.all([loadPostMeta(section, slug), loadPostMD(section, slug)])
    .then(([meta, md]) => {
      const { attrs, body } = parseFrontMatter(md);
      const category = meta.category || attrs.category;
      if (category && !meta.category) meta.category = category;

      updatePageMeta(meta.title, meta.excerpt, meta.icon ? 'https://himazin-technical-department.github.io/' + meta.icon : null);
      let html = '';
      if (meta.icon) {
        html += `<div class="detail-icon"><img src="${esc(meta.icon)}" alt="${esc(meta.title)}" loading="lazy" width="80" height="80"></div>`;
      }
      html += `<h1 class="detail-title">${esc(meta.title)}</h1>`;

      if (section === 'products' && meta.url) {
        html += `<div style="margin-bottom:24px">
          <a href="${esc(meta.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-primary" style="display:inline-block;padding:10px 28px;font-size:14px">${esc(meta.urlLabel || 'サイトへ')}</a>
        </div>`;
      }

      html += '<div class="detail-meta">';
      html += `<span class="detail-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${esc(formatDate(meta.date))}</span>`;
      if (section === 'products' && category) {
        html += `<span class="detail-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          ${esc(category)}</span>`;
      }
      if (meta.author) {
        html += `<span class="detail-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${esc(meta.author)}</span>`;
      }
      if (meta.tags) {
        html += `<span class="detail-meta-item">${meta.tags.map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}</span>`;
      }
      html += '</div>';
      html += `<article class="detail-content">${renderMD(body)}</article>`;
      container.innerHTML = html;
      processExternalLinks(container);
    })
    .catch(err => {
      container.innerHTML = `<p style="color:#999;">読み込みに失敗しました (${err.message})</p>`;
    });
}

/* ── link preview cards ── */

const SITE_DOMAIN = 'himazin-technical-department.github.io';

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

async function fetchOG(url, proxy) {
  try {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(proxy(url), { signal: ctrl.signal });
    clearTimeout(id);
    if (!res.ok) return null;
    const html = await res.text();
    const m = p => { const r = new RegExp('<meta\\s[^>]*(?:property|name)=["\']' + p + '["\'][^>]*content=["\']([^"\']*)["\']', 'i'); const x = html.match(r); return x ? x[1].replace(/&amp;/g,'&').replace(/&#x27;/g,"'") : null; };
    const resolve = (img, base) => {
      if (!img) return '';
      if (/^https?:\/\//i.test(img) || img.startsWith('//')) return img;
      try { return new URL(img, base).href; } catch { return img; }
    };
    return {
      title: m('og:title') || m('twitter:title') || (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '',
      description: m('og:description') || m('twitter:description') || m('description') || '',
      image: resolve(m('og:image') || m('twitter:image') || '', url),
    };
  } catch { return null; }
}

const OG_PROXIES = [
  url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

let ogQueue = Promise.resolve();

function insertCardAfterLink(link, card) {
  const parent = link.parentNode;
  if (parent.tagName === 'P') {
    let ref = parent.nextSibling;
    while (ref && ref.nodeType === 1 && ref.classList.contains('link-preview')) {
      ref = ref.nextSibling;
    }
    parent.parentNode.insertBefore(card, ref || null);
  } else {
    parent.insertBefore(card, link.nextSibling);
  }
}

function processExternalLinks(root) {
  if (!root) return;
  const links = root.querySelectorAll('a[href^="http"]:not([data-og])');
  links.forEach(link => {
    link.setAttribute('data-og', '1');
    const href = link.getAttribute('href');
    if (!href || href.includes(SITE_DOMAIN) || href.includes('youtube.com') || href.includes('youtu.be')) return;
    if (link.textContent.trim() !== href) return;
    if (link.closest('.detail-meta, .blog-post-meta, .product-actions, .product-btn, .back-link, .header, .footer, .member-links, .member-link')) return;

    const placeholder = document.createElement('div');
    placeholder.className = 'link-preview-loading';
    placeholder.textContent = getDomain(href) + ' のプレビューを読み込み中...';
    link.parentNode.insertBefore(placeholder, link.nextSibling);
    if (link.parentNode.tagName === 'P') {
      const p = link.parentNode;
      p.parentNode.insertBefore(placeholder, p.nextSibling);
    }

    ogQueue = ogQueue.then(() =>
      Promise.race(OG_PROXIES.map(p => fetchOG(href, p)))
        .then(og => {
          placeholder.remove();
          if (og && (og.title || og.description)) {
            const card = document.createElement('a');
            card.href = href;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'link-preview';
            const hasImg = og.image;
            const fbHtml = hasImg ? '' : '<div class="link-preview-fallback">🔗</div>';
            card.innerHTML = `<div class="link-preview-image">${fbHtml}</div><div class="link-preview-body"><div class="link-preview-title">${esc(og.title)}</div>${og.description ? `<div class="link-preview-desc">${esc(og.description)}</div>` : ''}<div class="link-preview-domain">${esc(getDomain(href))}</div></div>`;
            if (hasImg) {
              const imgDiv = card.querySelector('.link-preview-image');
              const url = og.image.replace(/"/g, '%22');
              imgDiv.style.backgroundImage = 'url("' + url + '")';
              imgDiv.style.backgroundSize = 'cover';
              imgDiv.style.backgroundPosition = 'center';
              imgDiv.style.backgroundRepeat = 'no-repeat';
            }
            insertCardAfterLink(link, card);
          } else {
            const card = document.createElement('a');
            card.href = href;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'link-preview';
            card.innerHTML = `<div class="link-preview-image"><div class="link-preview-fallback">🔗</div></div><div class="link-preview-body"><div class="link-preview-domain">${esc(getDomain(href))}</div></div>`;
            insertCardAfterLink(link, card);
          }
          link.style.display = 'none';
          const p = link.parentNode;
          if (p.tagName === 'P' && !p.innerText.trim()) p.remove();
        })
        .catch(() => { placeholder.remove(); })
    );
  });
}

const DEFAULT_ABOUT = '**暇人技術部 (Himazin Technical Department)** とは、SNSの運営やソフトの開発を行う日本のコミュニティです。\n\n部員それぞれが自由な発想でものづくりに取り組み、開発したツールや知見を発信しています。';

function convertYouTubeEmbeds(html) {
  return html.replace(
    /<a\s[^>]*href="(?:https?:)?\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)(?:&[^"]*)?"[^>]*>.*?<\/a>/gi,
    (_, id) => `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`
  );
}

/* ── smooth standalone navigation ── */

async function navigateTo(url, push = true) {
  if (url === location.pathname + location.search) return;
  const main = document.querySelector('main');
  if (!main) { window.location.href = url; return; }
  const scrollY = window.scrollY;
  try {
    const res = await fetch(url);
    if (!res.ok) { window.location.href = url; return; }
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const newMain = doc.querySelector('main');
    const newTitle = doc.querySelector('title');
    if (!newMain) { window.location.href = url; return; }
    main.innerHTML = newMain.innerHTML;
    if (push) history.pushState({ url, scrollY }, '', url);
    if (newTitle) document.title = newTitle.textContent;
    ['description', 'og:title', 'og:description', 'og:url', 'og:image'].forEach(p => {
      const el = doc.querySelector(p.includes(':') ? `meta[property="${p}"]` : `meta[name="${p}"]`);
      const cur = document.querySelector(p.includes(':') ? `meta[property="${p}"]` : `meta[name="${p}"]`);
      if (el && cur) cur.setAttribute('content', el.getAttribute('content'));
    });
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    processExternalLinks(main);
    updateActiveNav(url);
  } catch {
    window.location.href = url;
  }
}

function updateActiveNav(url) {
  const p = url.replace(/\/$/, '');
  let key = PATH_TO_HASH[p + '/'] || PATH_TO_HASH[p] || null;
  if (!key) {
    const m = p.match(/^\/(updates|products|blog)\//);
    if (m) key = m[1];
  }
  document.querySelectorAll('[data-nav]').forEach(n => {
    const isActive = n.getAttribute('data-section') === key;
    n.classList.toggle('active', isActive);
    if (isActive) n.setAttribute('aria-current', 'page');
    else n.removeAttribute('aria-current');
  });
}

function setupStandaloneNav() {
  history.replaceState({ url: location.pathname }, '');
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('/') || href === '/' || href.startsWith('//') || href.startsWith('http') || href.startsWith('#')) return;
    e.preventDefault();
    navigateTo(href);
  });
  window.addEventListener('popstate', e => {
    if (e.state?.url) navigateTo(e.state.url, false);
  });
}

function renderMD(text) {
  if (typeof markdownit === 'function') {
    try {
      return convertYouTubeEmbeds(markdownit({ breaks: true }).render(text));
    } catch {}
  }
  const escHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let html = '';
  let inCode = false, inList = false, inPara = false, codeBuf = '', paraBuf = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flushPara();
      if (inCode) {
        html += '<pre><code>' + escHtml(codeBuf.replace(/\n$/, '')) + '</code></pre>';
        codeBuf = ''; inCode = false;
      } else { inCode = true; }
      continue;
    }
    if (inCode) { codeBuf += line + '\n'; continue; }
    if (inList && !/^\s*[-*]\s/.test(line) && !/^\s*\d+\.\s/.test(line)) {
      html += '</ul>\n'; inList = false;
    }
    if (/^#{1,3}\s/.test(line)) {
      flushPara();
      const level = line.match(/^#+/)[0].length;
      html += `<h${level}>${parseInline(escHtml(line.replace(/^#+\s/, '')))}</h${level}>\n`;
    } else if (/^>\s/.test(line)) {
      flushPara();
      html += `<blockquote><p>${parseInline(escHtml(line.replace(/^>\s/, '')))}</p></blockquote>\n`;
    } else if (/^[-*]\s/.test(line)) {
      flushPara();
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${parseInline(escHtml(line.replace(/^[-*]\s/, '')))}</li>\n`;
    } else if (/^\d+\.\s/.test(line)) {
      flushPara();
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${parseInline(escHtml(line.replace(/^\d+\.\s/, '')))}</li>\n`;
    } else if (line.trim() === '') {
      flushPara();
    } else {
      paraBuf.push(parseInline(escHtml(line)));
      inPara = true;
    }
  }
  flushPara();
  if (inCode) html += '<pre><code>' + escHtml(codeBuf.replace(/\n$/, '')) + '</code></pre>';
  if (inList) html += '</ul>\n';
  return convertYouTubeEmbeds(html);
  function flushPara() {
    if (!inPara) return;
    html += '<p>' + paraBuf.join('<br>\n') + '</p>\n';
    paraBuf = []; inPara = false;
  }
  function parseInline(s) {
    return s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" title="$2">$1</a>')
      .replace(/(^|[^">])(https?:\/\/[^\s<>$)+]+(?:(?!\.(?:$|[\s<>)\]]))[^\s<>$)+])*)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="link-auto" title="$2">$2</a>');
  }
}

function renderAbout() {
  const container = document.getElementById('about-content');
  if (!container) return;
  const show = (text) => { container.innerHTML = renderMD(text); };
  fetch('data/about.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      if (data && data.content) show(data.content);
      else show(DEFAULT_ABOUT);
    })
    .catch(() => show(DEFAULT_ABOUT));
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-nav]').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('[data-nav]').forEach(n => n.removeAttribute('aria-current'));

  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  const navMap = {
    home: 'home', updates: 'updates', 'updates-detail': 'updates',
    products: 'products', 'products-detail': 'products',
    blog: 'blog', 'blog-detail': 'blog', members: 'members'
  };
  const navKey = navMap[pageId];
  if (navKey) {
    const navLink = document.querySelector(`[data-nav][data-section="${navKey}"]`);
    if (navLink) {
      navLink.classList.add('active');
      navLink.setAttribute('aria-current', 'page');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRoute() {
  if (!document.getElementById('page-home')) return;
  const hash = window.location.hash.replace('#', '') || 'home';

  const detailMatch = hash.match(/^(updates|products|blog)\/(.+)$/);
  if (detailMatch) {
    const section = detailMatch[1];
    const slug = detailMatch[2];
    const pageId = section === 'blog' ? 'blog-detail' : `${section}-detail`;
    showPage(pageId);
    const backLink = document.querySelector(`#page-${pageId} .back-link`);
    if (backLink) backLink.href = `/${section}/`;
    renderDetail(section, slug);
    return;
  }

  if (hash === 'home') {
    showPage('home');
    updatePageMeta();
    renderAbout();
    loadRegistry('updates').then(d => renderItemList('home-updates', d.slice(0, 5), 'updates')).catch(() => {});
    loadRegistry('products').then(d => renderProducts('home-products', d.slice(0, 3))).catch(() => {});
    loadRegistry('blog').then(d => renderItemList('home-blog', d.slice(0, 3), 'blog')).catch(() => {});
    return;
  }

  if (SECTIONS.includes(hash)) {
    showPage(hash);
    const labels = { updates: 'お知らせ', products: 'プロダクト', blog: 'ブログ' };
    updatePageMeta(labels[hash]);
    if (hash === 'products') {
      loadRegistry(hash).then(d => {
        window.__productsCache = d;
        renderProducts(`${hash}-list`, d, { showFilters: true, activeCategory: 'all' });
      }).catch(() => {
        const el = document.getElementById(`${hash}-list`);
        if (el) el.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>';
      });
    } else {
      loadRegistry(hash).then(d => renderItemList(`${hash}-list`, d, hash)).catch(() => {
        const el = document.getElementById(`${hash}-list`);
        if (el) el.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>';
      });
    }
    return;
  }

  if (hash === 'members') {
    showPage('members');
    updatePageMeta('メンバー');
    renderMembers();
    return;
  }

  window.location.hash = 'home';
}

window.addEventListener('hashchange', handleRoute);

function renderMembers() {
  const container = document.getElementById('members-grid');
  if (!container) return;

  fetchJSON('data/members/members.json')
    .then(data => {
      const typeLabel = { developer: '開発者', creator: 'クリエイター', supporter: 'サポーター' };
      container.innerHTML = data.map(item => `
        <div class="member-card">
          <div class="member-icon">
            ${item.icon ? `<img src="${esc(item.icon)}" alt="${esc(item.name)}" loading="lazy">` : esc(item.name.charAt(0))}
          </div>
          ${item.type ? `<span class="member-type ${esc(item.type)}">${esc(typeLabel[item.type] || item.type)}</span>` : ''}
          <h3>${esc(item.name)}</h3>
          <div class="member-role">${esc(item.role)}</div>
          <div class="member-desc">${esc(item.description)}</div>
          ${item.links && item.links.length ? `<div class="member-links">${item.links.map(link => link.url ? `<a href="${esc(link.url)}" class="member-link" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>${esc(link.label)}</a>` : '').join('')}</div>` : ''}
        </div>
      `).join('');
    })
    .catch(() => { container.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>'; });
}

function preloadAll() {
  SECTIONS.forEach(s => loadRegistry(s).catch(() => {}));
}

function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  setTimeout(() => document.getElementById('search-input').focus(), 100);
  preloadAll();
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
}

function performSearch(query) {
  const results = document.getElementById('search-results');
  if (!query.trim()) { results.innerHTML = ''; return; }

  const q = query.toLowerCase();
  const out = [];
  const labels = { updates: 'お知らせ', products: 'プロダクト', blog: 'ブログ' };

  for (const section of SECTIONS) {
    const items = (registryCache[section] || []).filter(i =>
      i.title.toLowerCase().includes(q) || (i.excerpt || '').toLowerCase().includes(q)
    );
    if (items.length) {
      out.push({ label: labels[section], items: items.map(i => ({ ...i, _page: `/${section}/${i.slug}/` })) });
    }
  }

  if (!out.length) {
    results.innerHTML = '<p class="search-noresult">該当する結果が見つかりませんでした</p>';
    return;
  }

  results.innerHTML = out.map(s =>
    `<div class="search-section">
      <div class="search-section-label">${esc(s.label)}</div>
      ${s.items.map(item =>
        `<a href="${item._page}" class="search-result-item">
          <div class="search-result-title">${highlight(item.title, query)}</div>
          ${item.excerpt ? `<div class="search-result-desc">${highlight(item.excerpt.slice(0, 100), query)}</div>` : ''}
        </a>`
      ).join('')}
    </div>`
  ).join('');

  results.querySelectorAll('.search-result-item').forEach(el => {
    el.addEventListener('click', (e) => {
      closeSearch();
      const href = el.getAttribute('href');
      if (href && document.getElementById('page-home')) {
        e.preventDefault();
        const m = href.match(/^\/(updates|products|blog)\/([^/]+)\/$/);
        if (m) {
          window.location.hash = `${m[1]}/${m[2]}`;
        }
      }
    });
  });
}

function highlight(text, query) {
  if (!text) return '';
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return esc(text).replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
}

let searchTimer;

document.addEventListener('DOMContentLoaded', () => {
  handleRoute();

  document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav').classList.remove('open');
    });
  });

  document.querySelectorAll('[data-nav], .hero-btn, .section-more, .back-link').forEach(el => {
    el.addEventListener('click', (e) => {
      const href = el.getAttribute('href');
      let hash = null;
      if (href && href.startsWith('/')) {
        hash = PATH_TO_HASH[href];
      } else if (href && href.startsWith('#')) {
        hash = href.replace('#', '');
      }
      if (hash && document.getElementById('page-home')) {
        e.preventDefault();
        window.location.hash = hash;
      }
    });
  });

  if (!document.getElementById('page-home')) {
    processExternalLinks(document.querySelector('.section-detail'));
  }

  if (!document.getElementById('page-home')) {
    setupStandaloneNav();
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.category-filter');
    if (!btn) return;
    const cat = btn.dataset.category;
    const filters = btn.closest('.category-filters');
    if (!filters) return;
    filters.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const container = filters.parentElement;
    const staticCards = container?.querySelectorAll('.product-card[data-category]');
    if (staticCards?.length) {
      if (cat === 'all') {
        container.querySelectorAll('.products-group-title, .products-grid').forEach(el => el.style.display = '');
        staticCards.forEach(card => card.style.display = '');
      } else {
        container.querySelectorAll('.products-grid').forEach(grid => {
          const hasMatch = [...grid.querySelectorAll('.product-card[data-category]')].some(c => c.dataset.category === cat);
          grid.style.display = hasMatch ? '' : 'none';
        });
        container.querySelectorAll('.products-group-title').forEach(title => {
          const grid = title.nextElementSibling;
          title.style.display = grid && grid.classList.contains('products-grid') ? grid.style.display : '';
        });
        staticCards.forEach(card => {
          card.style.display = card.dataset.category === cat ? '' : 'none';
        });
      }
      return;
    }

    const containerId = container?.id || 'products-list';
    const items = window.__productsCache || [];
    renderProducts(containerId, items, { showFilters: true, activeCategory: cat });
  });

  document.querySelectorAll('.category-filters').forEach(filters => {
    const container = filters.parentElement;
    const cards = container?.querySelectorAll('.product-card[data-category]');
    if (!cards?.length) return;
    const seen = new Set();
    filters.querySelectorAll('.category-filter').forEach(btn => seen.add(btn.dataset.category));
    cards.forEach(card => {
      const cat = card.dataset.category;
      if (!cat || seen.has(cat)) return;
      seen.add(cat);
      const btn = document.createElement('button');
      btn.className = 'category-filter';
      btn.dataset.category = cat;
      btn.textContent = cat;
      filters.appendChild(btn);
    });
  });

  // Carousel
  (function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
  })();

  document.querySelector('.search-btn').addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', closeSearch);
  document.getElementById('search-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSearch();
  });
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => performSearch(e.target.value), 200);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
  });
});
