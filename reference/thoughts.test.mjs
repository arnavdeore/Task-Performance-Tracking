// Run with:  node reference/thoughts.test.mjs
import { createThoughtLib } from './thoughts.js';
const lib = createThoughtLib();
let bad = 0;
for (let k = 0; k < 60; k++) {
  const base = new Date(2026, 9, 13 + k);
  const seen = new Set();
  for (let s = 0; s < 144; s++) {
    const t = lib.thoughtAt(new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, s * 10 + 3).getTime());
    const core = t.id[0] === 'C' ? t.id.split(':')[0] : t.id;
    if (seen.has(core)) bad++;
    seen.add(core);
  }
}
console.log('library size ~', lib.approxCount(), '| repeats within a day:', bad);
console.log(lib.panchang(new Date(2026, 9, 13, 18, 0).getTime()));
if (bad) process.exit(1);
