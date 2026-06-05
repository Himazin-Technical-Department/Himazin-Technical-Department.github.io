const DATA_BASE = 'data';

const pages = {
  home: { id: 'page-home' },
  updates: { id: 'page-updates' },
  products: { id: 'page-products' },
  blog: { id: 'page-blog' },
  'blog-post': { id: 'page-blog-post' },
  members: { id: 'page-members' },
};

const cache = { updates: [], products: [], blog: [], members: [] };

async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

function loadAndCache(key, url) {
  return loadJSON(url).then(data => {
    cache[key] = data;
    return data;
  });
}

/* 日付フォーマット */
function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/* ── お知らせ ── */
function renderUpdates(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  (cache.updates.length ? Promise.resolve(cache.updates) : loadAndCache('updates', `${DATA_BASE}/updates.json`))
    .then(data => {
      const items = limit ? data.slice(0, limit) : data;
      container.innerHTML = items.map(item => `
        <div class="update-item">
          <div class="update-date">${escapeHtml(formatDate(item.date))}</div>
          <div class="update-title">${escapeHtml(item.title)}</div>
          ${item.description ? `<div class="update-desc">${escapeHtml(item.description)}</div>` : ''}
        </div>
      `).join('');
    })
    .catch(() => { container.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>'; });
}

/* ── プロダクト ── */
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  (cache.products.length ? Promise.resolve(cache.products) : loadAndCache('products', `${DATA_BASE}/products.json`))
    .then(data => {
      container.innerHTML = data.map(item => `
        <div class="product-card">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          ${item.url ? `<a href="${escapeHtml(item.url)}" class="product-link" target="_blank" rel="noopener">詳細を見る →</a>` : ''}
        </div>
      `).join('');
    })
    .catch(() => { container.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>'; });
}

/* ── ブログ一覧 ── */
function renderBlog() {
  const container = document.getElementById('blog-list');
  if (!container) return;

  (cache.blog.length ? Promise.resolve(cache.blog) : loadAndCache('blog', `${DATA_BASE}/blog.json`))
    .then(data => {
      cache.blog = data;
      container.innerHTML = data.map((item, i) => `
        <a href="#blog/post/${i}" class="blog-item">
          <div class="blog-meta">
            <span class="blog-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${escapeHtml(formatDate(item.date))}
            </span>
            ${item.author ? `<span>${escapeHtml(item.author)}</span>` : ''}
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          ${item.excerpt ? `<p>${escapeHtml(item.excerpt)}</p>` : ''}
          ${item.tags ? `<div class="blog-tags">${item.tags.map(t => `<span class="blog-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        </a>
      `).join('');
    })
    .catch(() => { container.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>'; });
}

/* ── ブログ個別記事 ── */
function renderBlogPost(index) {
  const container = document.getElementById('blog-post-content');
  if (!container) return;

  (cache.blog.length ? Promise.resolve(cache.blog) : loadAndCache('blog', `${DATA_BASE}/blog.json`))
    .then(data => {
      cache.blog = data;
      const item = data[index];
      if (!item) {
        container.innerHTML = '<p style="color:#999;">記事が見つかりませんでした</p>';
        return;
      }
      container.innerHTML = `
        <h1 class="blog-post-title">${escapeHtml(item.title)}</h1>
        <div class="blog-post-meta">
          <span class="blog-post-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${escapeHtml(formatDate(item.date))}
          </span>
          ${item.author ? `<span class="blog-post-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${escapeHtml(item.author)}
          </span>` : ''}
          ${item.tags ? `<span class="blog-post-meta-item">${item.tags.map(t => `<span class="blog-tag">${escapeHtml(t)}</span>`).join('')}</span>` : ''}
        </div>
        <div class="blog-post-content">${item.content}</div>
      `;
    })
    .catch(() => {
      container.innerHTML = '<p style="color:#999;">読み込みに失敗しました</p>';
    });
}

/* ── メンバー ── */
function renderMembers() {
  const container = document.getElementById('members-grid');
  if (!container) return;

  (cache.members.length ? Promise.resolve(cache.members) : loadAndCache('members', `${DATA_BASE}/members.json`))
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

  const navMap = { home: 'home', updates: 'updates', products: 'products', blog: 'blog', members: 'members' };
  const navKey = navMap[pageId] || pageId;
  const navLink = document.querySelector(`[data-nav][href="#${navKey}"]`);
  if (navLink) navLink.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'home';

  const blogPostMatch = hash.match(/^blog\/post\/(\d+)$/);
  if (blogPostMatch) {
    showPage('blog-post');
    renderBlogPost(parseInt(blogPostMatch[1]));
    return;
  }

  if (!pages[hash]) { window.location.hash = 'home'; return; }

  showPage(hash);

  switch (hash) {
    case 'home': renderUpdates('home-updates', 5); break;
    case 'updates': renderUpdates('updates-list'); break;
    case 'products': renderProducts(); break;
    case 'blog': renderBlog(); break;
    case 'members': renderMembers(); break;
  }
}

/* ── 検索 ── */
function preloadCache() {
  return Promise.all([
    loadAndCache('updates', `${DATA_BASE}/updates.json`).catch(() => {}),
    loadAndCache('products', `${DATA_BASE}/products.json`).catch(() => {}),
    loadAndCache('blog', `${DATA_BASE}/blog.json`).catch(() => {}),
    loadAndCache('members', `${DATA_BASE}/members.json`).catch(() => {}),
  ]);
}

function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  setTimeout(() => document.getElementById('search-input').focus(), 100);
  preloadCache();
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
}

function performSearch(query) {
  const results = document.getElementById('search-results');
  if (!query.trim()) { results.innerHTML = ''; return; }

  const q = query.toLowerCase();
  const sections = [];

  const updates = (cache.updates || []).filter(i =>
    i.title.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q)
  ).map(i => ({ ...i, _page: 'updates', _label: 'お知らせ' }));
  if (updates.length) sections.push({ label: 'お知らせ', items: updates });

  const products = (cache.products || []).filter(i =>
    i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
  ).map(i => ({ ...i, _page: 'products', _label: 'プロダクト', title: i.name }));
  if (products.length) sections.push({ label: 'プロダクト', items: products });

  const blog = (cache.blog || []).filter(i =>
    i.title.toLowerCase().includes(q) || (i.excerpt || '').toLowerCase().includes(q) ||
    (i.author || '').toLowerCase().includes(q) || (i.tags || []).some(t => t.toLowerCase().includes(q))
  ).map((i, idx) => ({ ...i, _page: `blog/post/${cache.blog.indexOf(i)}`, _label: 'ブログ' }));
  if (blog.length) sections.push({ label: 'ブログ', items: blog });

  const members = (cache.members || []).filter(i =>
    i.name.toLowerCase().includes(q) || i.role.toLowerCase().includes(q) ||
    (i.description || '').toLowerCase().includes(q)
  ).map(i => ({ ...i, _page: 'members', _label: 'メンバー', title: i.name }));
  if (members.length) sections.push({ label: 'メンバー', items: members });

  if (!sections.length) {
    results.innerHTML = '<p class="search-noresult">該当する結果が見つかりませんでした</p>';
    return;
  }

  results.innerHTML = sections.map(s => `
    <div class="search-section">
      <div class="search-section-label">${escapeHtml(s.label)}</div>
      ${s.items.map(item => `
        <a href="#${item._page}" class="search-result-item">
          <div class="search-result-title">${highlight(item.title || item.name, query)}</div>
          <div class="search-result-desc">${highlight((item.description || item.excerpt || item.role || '').slice(0, 100), query)}</div>
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
