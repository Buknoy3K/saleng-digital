// Home page first screen ("One at a time"): one large 3D icon above the words. Every 1.8 seconds it spins away
// and the next one spins in. Swipe sideways or tap to change it; tap the icon itself to make it hop and spin.
import { stage, icons, toy, shadow, still } from './icons3d.js';

const canvas = document.querySelector('[data-hero3d]');
if (canvas) {
  const S = stage(canvas);
  const order = [0, 1, 2, 3, 4];      // laptop, kiosk, POS, PC, tablet with phone
  const all = icons(), toys = order.map((k, i) => toy(all[k], i));
  toys.forEach(t => { S.scene.add(t.pivot); t.pivot.visible = false; });
  const sh = shadow(.16); S.scene.add(sh);
  const dots = [...document.querySelectorAll('[data-hero-dots] i')];

  let unit = 1, cy = 0;
  S.onResize(s => { const tall = s.h > s.w; unit = tall ? Math.min(s.vw * .33, s.vh * .16) : s.vh * .2; cy = s.vh * (tall ? .10 : .12); });

  let cur = 0, prev = -1, since = 0, swap = 1;          // swap: 0..1 progress of the change
  const go = d => { prev = cur; cur = (cur + d + toys.length) % toys.length; swap = 0; since = 0; dots.forEach((el, i) => el.classList.toggle('on', i === cur)); };
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = e.clientX; });
  canvas.addEventListener('pointercancel', () => { down = null; });   // the page is being scrolled
  canvas.addEventListener('pointerup', e => {
    if (down === null) return; const dx = e.clientX - down; down = null;
    if (Math.abs(dx) > 40) return go(dx < 0 ? 1 : -1);
    const [px, py] = S.local(e);
    if (S.pick(px, py, [toys[cur].pivot]) === 0) toys[cur].kick(); else go(1);
  });

  const ease = x => 1 - Math.pow(1 - x, 3);
  const poster = document.querySelector('[data-hero-poster]');   // still picture shown until this first frame
  S.loop((dt, t) => {
    if (poster) poster.classList.add('off');
    since += dt; if (!still && since > 1.8 && swap >= 1) go(1);
    swap = Math.min(1, swap + dt / .45);
    toys.forEach((ty, i) => {
      const lift = ty.update(dt, t);
      let k = 0, turn = 0;                                // k: visible size 0..1, turn: extra spin while changing
      if (i === cur) { k = ease(swap); turn = (1 - ease(swap)) * -Math.PI; }
      else if (i === prev && swap < 1) { k = 1 - ease(swap); turn = ease(swap) * Math.PI; }
      ty.pivot.visible = k > .001;
      if (!ty.pivot.visible) return;
      ty.pivot.scale.setScalar(unit * k);
      ty.pivot.position.set(0, cy + (still ? 0 : Math.sin(t * 1.1) * .05 * unit) + lift * .3 * unit, 0);
      ty.pivot.rotation.set(.22, -.45 + turn + (still ? 0 : Math.sin(t * 1.4) * .25), 0);
    });
    sh.position.set(0, cy - unit * .75, 0); sh.scale.setScalar(unit * 1.6); sh.material.opacity = .16;
  });
}
