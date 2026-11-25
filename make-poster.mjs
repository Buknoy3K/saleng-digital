// Re-takes assets/img/hero-poster.webp (still of the first 3D icon). Run 'node serve.mjs . 8770' first, then:
//   node make-poster.mjs assets/img/hero-poster.webp
// Uses the taste-skill browser helper; 2.4 = crop size in icon units, matching .intro-poster in index.html.
import { Browser, sleep } from 'file:///C:/Users/User/.claude/skills/taste-skill/scripts/lib/cdp.mjs';
const out = process.argv[2], k = +(process.argv[3] || 2.4);
const b = await Browser.launch({ width: 500, height: 1300 });
const p = await b.newPage({ width: 500, height: 1300, dsf: 2, reducedMotion: true });
await p.goto('http://127.0.0.1:8770/', { settleMs: 4000 });
const r = await p.eval(() => { const c = document.querySelector('[data-hero3d]').getBoundingClientRect(); return { w: c.width, h: c.height, x: c.left, y: c.top, off: document.querySelector('[data-hero-poster]').className }; });
const unit = Math.min(r.w * .33, r.h * .16), side = unit * k, cx = r.x + r.w / 2, cy = r.y + r.h * .4;
console.log(r, unit, side);
await p.screenshot({ path: out, format: 'webp', quality: 82, clip: { x: cx - side / 2, y: cy - side / 2, width: side, height: side } });
await b.close();
