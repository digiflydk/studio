import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);
const ignored = ['node_modules', '.next', 'dist', 'build', '.git'];

const hits = [];

function scan(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (ignored.includes(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) { scan(p); continue; }
    if (!exts.has(path.extname(name))) continue;
    const txt = fs.readFileSync(p, 'utf8');

    // Fang korruption som bogstavelige "..." inde i ord/imports (ikke spread {...props})
    const re = /[A-Za-z0-9_-]\.\.\.[A-Za-z0-9_-]/g;
    const reQuoted = /["']\.\.\.["']/g;

    if (re.test(txt) || reQuoted.test(txt)) {
      const lines = txt.split('\n');
      lines.forEach((line, i) => {
        if (re.test(line) || reQuoted.test(line)) {
          hits.push(`${p}:${i + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

scan(ROOT);

if (hits.length) {
  console.error('❌ Found possible "..." corruption in:');
  console.error(hits.join('\n'));
  process.exit(1);
} else {
  console.log('✅ No "..." corruption detected.');
}
