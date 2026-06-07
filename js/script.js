const SECTIONS = ['updates', 'products', 'blog'];
const registryCache = {};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  setTimeout(() => document.getElementById('search-input').focus(), 100);
  SECTIONS.forEach(s => loadRegistry(s).catch(() => {}));
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
}

async function loadRegistry(section) {
  if (registryCache[section]) return registryCache[section];
  const data = await fetchJSON(`/data/${section}/registry.json`);
  registryCache[section] = data;
  return data;
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
        `<a href="/${item._page}/" class="search-result-item">
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

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

let searchTimer;

document.addEventListener('DOMContentLoaded', () => {
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
