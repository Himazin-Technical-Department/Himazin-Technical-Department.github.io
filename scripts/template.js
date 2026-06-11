import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SECTIONS = ['blog', 'updates', 'products'];

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const section = process.argv[2];
const title = process.argv[3];
const explicitSlug = process.argv[4];

if (!section || !title || !SECTIONS.includes(section)) {
  console.error(`Usage: npm run template:${SECTIONS.join('|')} "<title>" [slug]`);
  process.exit(1);
}

let slug = explicitSlug || toSlug(title);
if (!slug) {
  console.error(`✖ Could not generate slug from title. Provide a slug as the 3rd argument.
  Usage: node scripts/scaffold.js ${section} "${title}" my-slug`);
  process.exit(1);
}
const dir = join(root, 'data', section, slug);

if (existsSync(dir)) {
  console.error(`✖ Already exists: data/${section}/${slug}/`);
  process.exit(1);
}

const date = today();

let frontmatter;
switch (section) {
  case 'blog':
    frontmatter = `---
title: ${title}
date: ${date}
author: 
excerpt: 
tags:
---
`;
    break;
  case 'updates':
    frontmatter = `---
title: ${title}
date: ${date}
excerpt: 
---
`;
    break;
  case 'products':
    frontmatter = `---
title: ${title}
date: ${date}
excerpt: 
icon: data/products/${slug}/icon.svg
detailLabel: 詳細を見る
---
`;
    break;
}

const body = section === 'products'
  ? `## ${title}\n\n`
  : `## ${title}\n\n`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.md'), frontmatter + body, 'utf-8');

console.log(`✓ Created data/${section}/${slug}/index.md`);
console.log();
console.log('Next:');
console.log(`  npm run generate`);
console.log(`  npm run build`);
