const SECTIONS = ['updates', 'products', 'blog'];
const registryCache = {};
const metaCache = {};
const mdCache = {};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch failed');
  return res.text();
}

async function loadRegistry(section) {
  if (registryCache[section]) return registryCache[section];
  const data = await fetchJSON(`${section}/registry.json`);
  registryCache[section] = data;
  return data;
}

async function loadPostMeta(section, slug) {
  const key = `${section}/${slug}`;
  if (metaCache[key]) return metaCache[key];
  const data = await fetchJSON(`${section}/${slug}/meta.json`);
  metaCache[key] = data;
  return data;
}

async function loadPostMD(section, slug) {
  const key = `${section}/${slug}`;
  if (mdCache[key]) return mdCache[key];
  const text = await fetchText(`${section}/${slug}/index.md`);
  mdCache[key] = text;
  return text;
}

function renderItemList(containerId, items, section) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <a href="#${section}/${item.slug}" class="item-list-item">
      <div class="item-date">${escapeHtml(formatDate(item.date))}</div>
      <h3>${escapeHtml(item.title)}</h3>
      ${item.excerpt ? `<div class="item-excerpt">${escapeHtml(item.excerpt)}</div>` : ''}
    </a>
  `).join('');
}

async function renderDetail(section, slug) {
  const contentId = `${section}-detail-content`;
  const container = document.getElementById(contentId);
  if (!container) return;

  try {
    const [meta, md] = await Promise.all([
      loadPostMeta(section, slug),
      loadPostMD(section, slug),
    ]);

    const titleHtml = `<h1 class="detail-title">${escapeHtml(meta.title)}</h1>`;

    let metaHtml = '<div class="detail-meta">';
    metaHtml += `<span class="detail-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${escapeHtml(formatDate(meta.date))}</span>`;
    if (meta.author) {
      metaHtml += `<span class="detail-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${escapeHtml(meta.author)}</span>`;
    }
    if (meta.url) {
      metaHtml += `<span class="detail-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> <a href="${escapeHtml(meta.url)}" target="_blank" rel="noopener">${escapeHtml(meta.url)}</a></span>`;
    }
    if (meta.tags) {
      metaHtml += `<span class="detail-meta-item">${meta.tags.map(t => `<span class="blog-tag">${escapeHtml(t)}</span>`).join('')}</span>`;
    }
    metaHtml += '</div>';

    const bodyHtml = marked.parse(md);
    container.innerHTML = titleHtml + metaHtml + `<div class="detail-content">${bodyHtml}</div>`;
  } catch {
    container.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>';
  }
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-nav]').forEach(n => n.classList.remove('active'));

  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  const navMap = {
    home: 'home', updates: 'updates', 'updates-detail': 'updates',
    products: 'products', 'products-detail': 'products',
    blog: 'blog', 'blog-detail': 'blog', members: 'members'
  };
  const navKey = navMap[pageId] || null;
  if (navKey) {
    const navLink = document.querySelector(`[data-nav][href="#${navKey}"]`);
    if (navLink) navLink.classList.add('active');
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
    const backPage = section;
    showPage(pageId);

    const backLink = document.querySelector(`#page-${pageId} .back-link`);
    if (backLink) backLink.href = `#${backPage}`;

    renderDetail(section, slug);
    return;
  }

  if (hash === 'home') {
    showPage('home');
    loadRegistry('updates').then(data => renderItemList('home-updates', data.slice(0, 5), 'updates')).catch(() => {});
    loadRegistry('products').then(data => renderItemList('home-products', data.slice(0, 3), 'products')).catch(() => {});
    loadRegistry('blog').then(data => renderItemList('home-blog', data.slice(0, 3), 'blog')).catch(() => {});
    return;
  }

  if (SECTIONS.includes(hash)) {
    showPage(hash);
    const listId = `${hash}-list`;
    loadRegistry(hash).then(data => renderItemList(listId, data, hash)).catch(() => {
      const el = document.getElementById(listId);
      if (el) el.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>';
    });
    return;
  }

  if (hash === 'members') {
    showPage('members');
    renderMembers();
    return;
  }

  window.location.hash = 'home';
}

/* ── メンバー ── */
function renderMembers() {
  const container = document.getElementById('members-grid');
  if (!container) return;

  fetchJSON('data/members.json')
    .then(data => {
      const typeLabel = { developer: '開発者', creator: 'クリエイター', supporter: 'サポーター' };
      container.innerHTML = data.map(item => `
        <div class="member-card">
          <div class="member-icon">
            ${item.icon ? `<img src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.name)}">` : escapeHtml(item.name.charAt(0))}
          </div>
          ${item.type ? `<span class="member-type ${escapeHtml(item.type)}">${escapeHtml(typeLabel[item.type] || item.type)}</span>` : ''}
          <h3>${escapeHtml(item.name)}</h3>
          <div class="member-role">${escapeHtml(item.role)}</div>
          <div class="member-desc">${escapeHtml(item.description)}</div>
          ${item.links && item.links.length ? `<div class="member-links">${item.links.map(link => link.url ? `<a href="${escapeHtml(link.url)}" class="member-link" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>${escapeHtml(link.label)}</a>` : '').join('')}</div>` : ''}
        </div>
      `).join('');
    })
    .catch(() => { container.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>'; });
}

/* ── 検索 ── */
async function preloadAll() {
  for (const s of SECTIONS) {
    try { await loadRegistry(s); } catch {}
  }
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
  const sections = [];

  for (const section of SECTIONS) {
    const items = (registryCache[section] || []).filter(i =>
      i.title.toLowerCase().includes(q) || (i.excerpt || '').toLowerCase().includes(q)
    );
    if (items.length) {
      const labels = { updates: 'お知らせ', products: 'プロダクト', blog: 'ブログ' };
      sections.push({
        label: labels[section] || section,
        items: items.map(i => ({ ...i, _page: `${section}/${i.slug}` })),
      });
    }
  }

  if (!sections.length) {
    results.innerHTML = '<p class="search-noresult">該当する結果が見つかりませんでした</p>';
    return;
  }

  results.innerHTML = sections.map(s => `
    <div class="search-section">
      <div class="search-section-label">${escapeHtml(s.label)}</div>
      ${s.items.map(item => `
        <a href="#${item._page}" class="search-result-item">
          <div class="search-result-title">${highlight(item.title, query)}</div>
          ${item.excerpt ? `<div class="search-result-desc">${highlight(item.excerpt.slice(0, 100), query)}</div>` : ''}
        </a>
      `).join('')}
    </div>
  `).join('');

  results.querySelectorAll('.search-result-item').forEach(el => {
    el.addEventListener('click', () => closeSearch());
  });
}

function highlight(text, query) {
  if (!text) return '';
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escapeHtml(text).replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
}

let searchTimer;

window.addEventListener('hashchange', handleRoute);

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

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = link.getAttribute('href').replace('#', '');
    });
  });

  document.querySelectorAll('.hero-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = btn.getAttribute('href').replace('#', '');
    });
  });

  document.querySelectorAll('.section-more').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = link.getAttribute('href').replace('#', '');
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
