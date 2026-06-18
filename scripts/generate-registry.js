import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { parseFrontmatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SITE_URL = 'https://himazin-technical-department.github.io';
const sections = ['updates', 'products', 'blog'];

function escXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── registry.json + meta.json (from frontmatter) ── */
function generateRegistries() {
  const catOrdersPath = join(root, 'data', 'products', 'categories.json');
  const catOrders = existsSync(catOrdersPath) ? JSON.parse(readFileSync(catOrdersPath, 'utf-8')) : {};

  for (const section of sections) {
    const dir = join(root, 'data', section);
    const entries = readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isDirectory());

    let hasError = false;
    const items = entries
      .map(e => {
        const slug = e.name;
        const sectionRel = `data/${section}/${slug}`;
        const mdPath = join(dir, slug, 'index.md');
        if (!existsSync(mdPath)) {
          console.error(`  ✖ ERROR: ${sectionRel}/ に index.md が見つかりません。
    データフォルダは作成したが記事ファイルがない状態です。
    解消法: ${sectionRel}/index.md を作成するか、不要ならフォルダごと削除してください。`);
          hasError = true;
          return null;
        }
        const text = readFileSync(mdPath, 'utf-8');
        const { data, content } = parseFrontmatter(text, mdPath);

        if (!data.title) {
          console.error(`  ✖ ERROR: ${sectionRel}/index.md に title が設定されていません。
    YAML frontmatter の先頭に title: 記事タイトル を追加してください。
    例:
      ---
      title: ここにタイトル
      date: 2026-06-08
      ---`);
          hasError = true;
          return null;
        }

        if (!data.date) {
          console.error(`  ✖ ERROR: ${sectionRel}/index.md に date が設定されていません。
    YAML frontmatter に date: YYYY-MM-DD 形式の日付を追加してください。
    例:
      date: 2026-06-08`);
          hasError = true;
          return null;
        }

        const dateObj = new Date(data.date);
        if (isNaN(dateObj.getTime())) {
          console.error(`  ✖ ERROR: ${sectionRel}/index.md の date の形式が正しくありません。
    現在の値: "${data.date}"
    正しい形式: YYYY-MM-DD（例: 2026-06-08）`);
          hasError = true;
          return null;
        }

        if (data.tags && !Array.isArray(data.tags)) {
          console.error(`  ✖ ERROR: ${sectionRel}/index.md の tags の形式が正しくありません。
    tags は YAML のリスト形式（各行 - で始める）で記述してください。
    例:
      tags:
        - タグ1
        - タグ2`);
          hasError = true;
          return null;
        }

        if (content.trim() === '') {
          console.error(`  ⚠ WARNING: ${sectionRel}/index.md に本文がありません。空の記事になります。`);
        }

        if (section !== 'products' && !data.thumbnail) {
          const thumbPath = `${sectionRel}/thumb-auto.svg`;
          const titleLine = (data.title || '').split('\n')[0];
          const titleLen = titleLine.length;
          const authorText = data.author ? escXml(data.author) : '';

          let parts, size;
          if (titleLen <= 8) {
            parts = [titleLine];
            size = 20;
          } else if (titleLen <= 12) {
            parts = [titleLine];
            size = 16;
          } else {
            const mid = Math.floor(titleLen / 2);
            let sp = titleLine.indexOf(' ', mid);
            if (sp === -1) sp = titleLine.lastIndexOf(' ', mid);
            if (sp === -1) sp = mid;
            parts = [titleLine.slice(0, sp), titleLine.slice(sp).trim()];
            size = 14;
          }

          const titleSvg = parts.length === 1
            ? `<text x="120" y="80" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-size="${size}" font-weight="700" fill="#333">${escXml(parts[0])}</text>`
            : `<text x="120" y="71" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-size="${size}" font-weight="700" fill="#333">${escXml(parts[0])}</text>\n  <text x="120" y="92" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-size="${size}" font-weight="700" fill="#333">${escXml(parts[1])}</text>`;

          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="135" viewBox="0 0 240 135">
  <defs>
    <pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#000" stroke-width="1.2" opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="240" height="135" fill="#fafafa"/>
  <rect width="240" height="135" fill="url(#g)"/>
  <rect x="0.5" y="0.5" width="239" height="134" fill="none" stroke="#e0e0e0" stroke-width="1" rx="2"/>
  ${authorText ? `<text x="232" y="26" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-size="13" font-weight="500" fill="#666">${authorText}</text>` : ''}
  ${titleSvg}
</svg>
`;
          writeFileSync(join(root, thumbPath), svg, 'utf-8');
          data.thumbnail = thumbPath;
        }

        if (section === 'products' && !data.icon) {
          const iconPath = `${sectionRel}/icon.svg`;
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#f5f5f5"/>
  <rect x="0.5" y="0.5" width="99" height="99" rx="20" fill="none" stroke="#e0e0e0" stroke-width="1"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="#ccc" stroke-width="2"/>
  <circle cx="50" cy="50" r="8" fill="none" stroke="#ccc" stroke-width="1.5"/>
  <path d="M50 28v-4m0 52v-4M28 50h-4m52 0h-4M34 34l-3-3m38 38 3-3m0-38 3 3m-38 38-3-3" stroke="#ddd" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;
          writeFileSync(join(root, iconPath), svg, 'utf-8');
          data.icon = iconPath;
        }

        const metaPath = join(dir, slug, 'meta.json');
        writeFileSync(metaPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

        if (section === 'products' && data.category && catOrders[data.category] != null) {
          data.categoryOrder = catOrders[data.category];
        }
        if (section === 'products' && data.order != null) data.order = Number(data.order);
        return { slug, ...data };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.order != null && b.order != null) return a.order - b.order;
        if (a.order != null) return -1;
        if (b.order != null) return 1;
        return new Date(b.date) - new Date(a.date);
      });

    if (hasError) {
      console.error(`  ✖ エラーがあるため ${section} の registry.json は生成しませんでした。`);
      continue;
    }

    const outPath = join(dir, 'registry.json');
    writeFileSync(outPath, JSON.stringify(items, null, 2) + '\n', 'utf-8');
    console.log(`✓ Generated ${outPath} (${items.length} items)`);
  }
}

/* ── sitemap.xml ── */
function generateSitemap() {
  const urls = [{ loc: '', priority: '1.0', changefreq: 'weekly' }];

  for (const section of sections) {
    urls.push({ loc: `${section}/`, priority: '0.8', changefreq: 'weekly' });

    const registryPath = join(root, 'data', section, 'registry.json');
    if (!existsSync(registryPath)) continue;
    try {
      const items = JSON.parse(readFileSync(registryPath, 'utf-8'));
      for (const item of items) {
        urls.push({
          loc: `${section}/${item.slug}/`,
          priority: section === 'products' ? '0.7' : '0.6',
          changefreq: 'monthly',
          lastmod: item.date || undefined,
        });
      }
    } catch {}
  }

  urls.push({ loc: 'members/', priority: '0.5', changefreq: 'monthly' });
  urls.push({ loc: 'about/', priority: '0.6', changefreq: 'monthly' });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}/${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  writeFileSync(join(root, 'sitemap.xml'), xml, 'utf-8');
  console.log(`Generated sitemap.xml (${urls.length} URLs)`);
}

generateRegistries();
generateSitemap();
