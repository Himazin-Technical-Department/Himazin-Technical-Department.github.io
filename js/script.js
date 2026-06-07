const SITE_NAME = '暇人技術部';
const SECTIONS = ['updates', 'products', 'blog'];
const registryCache = {};
const metaCache = {};
const mdCache = {};

function updatePageMeta(title, description) {
  document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Himazin Technical Department`;
  const desc = description || '暇人技術部 (Himazin Technical Department) は、技術好きが集まってプロダクト開発や研究を行うコミュニティです。';
  document.querySelector('meta[name="description"]').setAttribute('content', desc);
  document.querySelector('meta[property="og:title"]').setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]').setAttribute('content', desc);
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', document.title);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', desc);
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

function renderProducts(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!items || !items.length) {
    container.innerHTML = '<p style="color:#999;">まだプロダクトがありません</p>';
    return;
  }
  container.innerHTML = items.map(item =>
    `<div class="product-card">
      ${item.icon ? `<div class="product-icon"><img src="${esc(item.icon)}" alt="${esc(item.title)}" loading="lazy"></div>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt || '')}</p>
      <div class="product-actions">
        <a href="#products/${item.slug}" class="product-btn product-btn-primary">${esc(item.detailLabel || '詳細')}</a>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="product-btn product-btn-secondary">${esc(item.urlLabel || 'サイトへ')}</a>` : ''}
      </div>
    </div>`
  ).join('');
}

function renderItemList(containerId, items, section) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!items || !items.length) {
    container.innerHTML = '<p style="color:#999;">まだコンテンツがありません</p>';
    return;
  }
  container.innerHTML = items.map(item =>
    `<a href="#${section}/${item.slug}" class="item-list-item">
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
      updatePageMeta(meta.title, meta.excerpt);
      let html = '';
      if (meta.icon) {
        html += `<div class="detail-icon"><img src="${esc(meta.icon)}" alt="${esc(meta.title)}" loading="lazy"></div>`;
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
      if (meta.author) {
        html += `<span class="detail-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;opacity:.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${esc(meta.author)}</span>`;
      }
      if (meta.tags) {
        html += `<span class="detail-meta-item">${meta.tags.map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}</span>`;
      }
      html += '</div>';
      html += `<article class="detail-content">${renderMD(md)}</article>`;
      container.innerHTML = html;
    })
    .catch(err => {
      container.innerHTML = `<p style="color:#999;">読み込みに失敗しました (${err.message})</p>`;
    });
}

const DEFAULT_ABOUT = '**暇人技術部 (Himazin Technical Department)** は、技術好きが集まってプロダクト開発や研究を行うコミュニティです。\n\n部員それぞれが自由な発想でものづくりに取り組み、開発したツールや知見を発信しています。';

function renderMD(text) {
  if (typeof markdownit === 'function') {
    try {
      return markdownit().render(text);
    } catch {}
  }
  const escHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let html = '';
  let inCode = false, inList = false, codeBuf = '';
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) {
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
      const level = line.match(/^#+/)[0].length;
      html += `<h${level}>${parseInline(escHtml(line.replace(/^#+\s/, '')))}</h${level}>\n`;
    } else if (/^>\s/.test(line)) {
      html += `<blockquote><p>${parseInline(escHtml(line.replace(/^>\s/, '')))}</p></blockquote>\n`;
    } else if (/^[-*]\s/.test(line)) {
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${parseInline(escHtml(line.replace(/^[-*]\s/, '')))}</li>\n`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${parseInline(escHtml(line.replace(/^\d+\.\s/, '')))}</li>\n`;
    } else if (line.trim() === '') {
      html += '\n';
    } else {
      html += `<p>${parseInline(escHtml(line))}</p>\n`;
    }
  }
  if (inCode) html += '<pre><code>' + escHtml(codeBuf.replace(/\n$/, '')) + '</code></pre>';
  if (inList) html += '</ul>\n';
  return html;
  function parseInline(s) {
    return s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
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
    const navLink = document.querySelector(`[data-nav][href="#${navKey}"]`);
    if (navLink) {
      navLink.classList.add('active');
      navLink.setAttribute('aria-current', 'page');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'home';

  const detailMatch = hash.match(/^(updates|products|blog)\/(.+)$/);
  if (detailMatch) {
    const section = detailMatch[1];
    const slug = detailMatch[2];
    const pageId = section === 'blog' ? 'blog-detail' : `${section}-detail`;
    showPage(pageId);
    const backLink = document.querySelector(`#page-${pageId} .back-link`);
    if (backLink) backLink.href = `#${section}`;
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
      loadRegistry(hash).then(d => renderProducts(`${hash}-list`, d)).catch(() => {
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
      out.push({ label: labels[section], items: items.map(i => ({ ...i, _page: `${section}/${i.slug}` })) });
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
        `<a href="#${item._page}" class="search-result-item">
          <div class="search-result-title">${highlight(item.title, query)}</div>
          ${item.excerpt ? `<div class="search-result-desc">${highlight(item.excerpt.slice(0, 100), query)}</div>` : ''}
        </a>`
      ).join('')}
    </div>`
  ).join('');

  results.querySelectorAll('.search-result-item').forEach(el => {
    el.addEventListener('click', closeSearch);
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

  document.querySelectorAll('[data-nav], .hero-btn, .section-more').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const href = el.getAttribute('href');
      if (href) window.location.hash = href.replace('#', '');
    });
  });

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
