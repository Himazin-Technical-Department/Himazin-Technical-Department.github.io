const YAML_MATCHER = /^---\n([\s\S]*?)\n(?:---|\.\.\.)\n?/;

export function parseFrontmatter(text, filePath) {
  const match = text.match(YAML_MATCHER);
  if (!match) {
    if (filePath) {
      console.error(`  ⚠ WARNING: ${filePath} に YAML frontmatter（--- で囲まれたヘッダー）が見つかりません。`);
    }
    return { data: {}, content: text };
  }

  const yaml = match[1];
  const content = text.slice(match[0].length);
  const data = {};
  const errors = [];

  let currentKey = null;
  const lines = yaml.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();
      if (val === '' || val === '|') {
        data[currentKey] = '';
      } else {
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        data[currentKey] = val;
      }
    } else if (currentKey && line.match(/^\s*-\s+/)) {
      if (!Array.isArray(data[currentKey])) {
        if (data[currentKey] === '') {
          data[currentKey] = [];
        } else {
          continue;
        }
      }
      let item = line.replace(/^\s*-\s+/, '').trim();
      if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
        item = item.slice(1, -1);
      }
      data[currentKey].push(item);
    } else if (line.trim() !== '' && !line.match(/^\s*#/)) {
      errors.push(`    line ${lineNum}: 解釈できませんでした → "${line}"`);
    }
  }

  if (errors.length > 0 && filePath) {
    console.error(`  ⚠ WARNING: ${filePath} の YAML frontmatter に解釈できない行があります`);
    errors.forEach(e => console.error(e));
    console.error('    （インデントはタブではなくスペース、キー: 値 の形式で記述してください）');
  }

  return { data, content };
}
