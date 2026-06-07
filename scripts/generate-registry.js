import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
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

    const items = entries
      .map(e => {
        const mdPath = join(dir, e.name, 'index.md');
        if (!existsSync(mdPath)) return null;
        const text = readFileSync(mdPath, 'utf-8');
        const { data, content } = parseFrontmatter(text);
        if (!data.title) return null;

        const metaPath = join(dir, e.name, 'meta.json');
        writeFileSync(metaPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

        return { slug: e.name, ...data };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const outPath = join(dir, 'registry.json');
    writeFileSync(outPath, JSON.stringify(items, null, 2) + '\n', 'utf-8');
    console.log(`Generated ${outPath} (${items.length} items)`);
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
