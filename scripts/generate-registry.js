import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { parseFrontmatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SITE_URL = 'https://himazin-technical-department.github.io';
const sections = ['updates', 'products', 'blog'];

/* ── registry.json + meta.json (from frontmatter) ── */
function generateRegistries() {
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

        const metaPath = join(dir, slug, 'meta.json');
        writeFileSync(metaPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

        return { slug, ...data };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

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
