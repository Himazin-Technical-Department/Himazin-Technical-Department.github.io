export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n(?:---|\.\.\.)\n?/);
  if (!match) return { data: {}, content: text };

  const yaml = match[1];
  const content = text.slice(match[0].length);
  const data = {};

  let currentKey = null;
  for (const line of yaml.split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();
      if (val === '' || val === '|') {
        data[currentKey] = [];
      } else {
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        data[currentKey] = val;
      }
    } else if (currentKey && Array.isArray(data[currentKey]) && line.match(/^\s*-\s+/)) {
      let item = line.replace(/^\s*-\s+/, '').trim();
      if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
        item = item.slice(1, -1);
      }
      data[currentKey].push(item);
    }
  }

  return { data, content };
}
