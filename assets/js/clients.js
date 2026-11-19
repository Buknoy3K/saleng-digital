/* Saleng Digital: the Clients section ("In their words").
   Four half-body 3D people on one stage, each with a speech bubble; tap one and their quote opens below.
   Drawn with the same isometric method as biz.js. Fills <div data-tm> in index.html. */
(() => {
  const root = document.querySelector('[data-tm]');
  if (!root) return;
  const T = [
    { k: 'snack', name: 'Rena Tilado', role: 'Proprietor, Snackstop Milkshake Station', where: 'La Trinidad, Benguet', url: 'work/doc-rena.html',
      pull: 'A point of sale I can monitor remotely is a huge advantage.',
      body: ['Having a point of sale system that I can monitor remotely is a <b>huge advantage</b> for me and my staffs as well.',
        'Keeping track of my sales record was always a dilemma. I work with 3 staffs, I seldomly visit our shop during my busy days at work. My staff would always write me sales report daily and manually.',
        'It is very user-friendly that even my 10-yr old daughter can operate. The receipt printing function is also exceptional! It also includes graphs and tally of my daily, weekly, and even monthly sales. For a small business like Snackstop, the system is perfect!'] },
    { k: 'laundry', name: 'ACA Laundry', role: 'Owner, ACA Laundry', where: 'La Trinidad, Benguet', url: 'work/auntie-analyn.html',
      pull: 'Less hassle for me and my staff.',
      body: ['Before, I need to write all the laundry in a notebook and sometimes I forget to update the customer.',
        'Now we have this self-service kiosk where all the laundry is being tracked, and it also sends an <b>automatic text message</b> to the customer when there is an update on their laundry.',
        'Less hassle for me and my staff. Very helpful for our laundry.'] },
    { k: 'garcia', name: 'Garcia, CPA', role: 'Garcia Accounting / Mini Macro', where: 'La Trinidad, Benguet', url: 'work/garcia.html',
      pull: 'Everything is already there. Big help for my everyday work!',
      body: ['As an accountant, every client has different needs. Some need help with BIR, some with business permits and registration, and some with monthly bookkeeping. It\'s really hard to keep track of everything, especially when you have many clients.',
        'This system helps me see what is happening with each client: their payments, billings and all the records. I can also check which work is already finished and what still needs my attention.',
        'Now I don\'t have to open many files just to find one piece of information. <b>Everything is already there.</b> Big help for my everyday work!'] },
    { k: 'coop', name: 'Fresh Crops Cooperative', role: 'Board member, Fresh Crops Coop', where: 'La Trinidad, Benguet', url: '',
      pull: 'A big improvement in how we manage our daily operations.',
      body: ['Managing a cooperative comes with a lot of responsibilities. We handle member records, savings, loans, payments, share capital, and many other things that need to be monitored regularly.',
        'Having our own coop management system makes things much easier. We can now manage member information, monitor transactions, track loans and payments, and generate reports <b>all in one place</b>.',
        'It helps our staff work more efficiently and gives our board a better view of how the cooperative is doing. A big improvement in how we manage our daily operations.'] },
  ];

  // ── isometric drawing (same method as biz.js) ──
  const C = { fog: '#f0ece0', soft: '#c3c8bd', pine: '#1b4430', pine2: '#2f6b4c', leaf: '#6fae5a', night: '#10251b', ink: '#0b1b12',
    resin: '#e3a42b', ember: '#d12a38', flame: '#ff7a3d', wood: '#8a5a2b', bark: '#5a3a1c', skin: '#c98b5a', hair: '#2a1a0e' };
  const c30 = Math.cos(Math.PI / 6), s30 = .5, f2 = v => +v.toFixed(2);
  const pr = (x, y, z) => [f2((x - z) * c30), f2((x + z) * s30 - y)];
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16), t = k > 0 ? 255 : 0, a = Math.abs(k);
    const ch = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v + (t - v) * a));
    return '#' + ((1 << 24) | (ch[0] << 16) | (ch[1] << 8) | ch[2]).toString(16).slice(1);
  }
  const poly = (pts, fill) => `<polygon points="${pts.map(p => pr(...p).join(',')).join(' ')}" fill="${fill}"/>`;
  function part(q) {
    if (q.t === 'box') {
      const [x, y, z] = q.p, [w, h, d] = q.s;
      return poly([[x, y + h, z], [x + w, y + h, z], [x + w, y + h, z + d], [x, y + h, z + d]], shade(q.c, .14))
        + poly([[x + w, y, z], [x + w, y, z + d], [x + w, y + h, z + d], [x + w, y + h, z]], q.c)
        + poly([[x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d]], shade(q.c, -.2));
    }
    if (q.t === 'cyl') {
      const [sx, sb] = pr(...q.p), st = f2(sb - q.h), rx = f2(1.2247 * q.r), ry = f2(.7071 * q.r), side = shade(q.c, -.12);
      return `<ellipse cx="${sx}" cy="${sb}" rx="${rx}" ry="${ry}" fill="${side}"/><rect x="${f2(sx - rx)}" y="${st}" width="${f2(2 * rx)}" height="${q.h}" fill="${side}"/><ellipse cx="${sx}" cy="${st}" rx="${rx}" ry="${ry}" fill="${shade(q.c, .12)}"/>`;
    }
    if (q.t === 'sph') {
      const [sx, sy] = pr(...q.p), r = f2(1.2247 * q.r);
      return `<circle cx="${sx}" cy="${sy}" r="${r}" fill="${q.c}"/><circle cx="${f2(sx - r * .3)}" cy="${f2(sy - r * .3)}" r="${f2(r * .45)}" fill="${shade(q.c, .2)}"/>`;
    }
    // flat mark on a face: f 'L' = plane z=Z (u along x), otherwise plane x=X (u along z); v = height
    const L = q.f === 'L', m = L ? [c30, s30, 0, -1, -q.Z * c30, q.Z * s30] : [-c30, s30, 0, -1, q.X * c30, q.X * s30];
    const fill = L ? shade(q.c, -.15) : q.c;
    const mark = q.r ? `<circle cx="${q.u}" cy="${q.v}" r="${q.r}" fill="${fill}"/>` : `<rect x="${q.u}" y="${q.v}" width="${q.w}" height="${q.h}" fill="${fill}"/>`;
    return `<g transform="matrix(${m.map(f2).join(' ')})">${mark}</g>`;
  }
  /* ── half-body people for style D ──
     Facing +x (the face is on the plane x=1.6). Head x .2-1.6, y 2.1-3.7, z .5-1.9. Torso y 0-1.9.
     g 'blink' = eyelids that close for a moment; g 'tail' = ponytail swing; everything bobs gently. */
  const R = (u, v, w, h, c, g) => ({ t: 'dec', X: 1.6, u, v, w, h, c, g });   // on the face
  const T2 = (u, v, w, h, c) => ({ t: 'dec', X: 1.4, u, v, w, h, c });       // on the chest
  const Ls = (u, v, w, h, c, Z = 1.9) => ({ t: 'dec', f: 'L', Z, u, v, w, h, c }); // on the side
  const body = (shirt, skin) => [
    { t: 'box', p: [.1, 0, 0], s: [1.2, 1.7, .34], c: shade(shirt, -.08) },
    { t: 'box', p: [0, 0, .3], s: [1.4, 1.9, 1.8], c: shirt },
    { t: 'box', p: [.1, 0, 2.1], s: [1.2, 1.7, .36], c: shade(shirt, -.08) },
    { t: 'box', p: [.55, 1.9, .9], s: [.6, .3, .6], c: skin },
  ];
  const head = skin => [{ t: 'box', p: [.2, 2.1, .5], s: [1.4, 1.6, 1.4], c: skin }];
  const eyes = (skin, iris = C.ink) => [
    R(.74, 2.8, .24, .3, iris), R(1.42, 2.8, .24, .3, iris),
    R(.82, 2.98, .08, .08, C.fog), R(1.5, 2.98, .08, .08, C.fog),
    R(.7, 2.78, .32, .34, skin, 'blink'), R(1.38, 2.78, .32, .34, skin, 'blink'),
  ];
  const smile = (c = '#8e2b2b', skin) => [R(1.0, 2.36, .6, .12, c), R(.9, 2.44, .12, .1, c), R(1.58, 2.44, .12, .1, c), R(.55, 2.5, .22, .14, shade(skin, -.12)), R(1.63, 2.5, .22, .14, shade(skin, -.12))];
  const P = {
    // eye doctor: white coat over teal scrubs, stethoscope, glasses, long dark hair
    snack: (() => { const sk = '#d9a273', h = '#1c120b'; return [
      { t: 'box', p: [-.15, 1.5, .4], s: [.8, 2.3, 1.6], c: h },
      ...body(C.fog, sk),
      T2(.95, .7, .7, 1.2, '#2e9c94'), T2(.85, 1.1, .1, .8, C.soft), T2(1.6, 1.1, .1, .8, C.soft),
      T2(.75, .5, .08, 1.3, C.ink), T2(1.7, .5, .08, 1.3, C.ink), { t: 'dec', X: 1.4, u: 1.25, v: .45, r: .14, c: '#9aa3a8' },
      T2(.35, 1.1, .1, .4, C.ember), T2(.28, 1.05, .45, .06, C.soft),
      ...head(sk), ...eyes(sk), ...smile('#a8344a', sk),
      R(.6, 2.72, .54, .46, C.ink), R(.66, 2.78, .42, .34, '#cfe8f2'), R(.76, 2.82, .2, .24, C.ink),
      R(1.28, 2.72, .54, .46, C.ink), R(1.34, 2.78, .42, .34, '#cfe8f2'), R(1.44, 2.82, .2, .24, C.ink),
      R(1.14, 2.98, .14, .07, C.ink),
      R(.5, 3.3, 1.4, .4, h), R(.5, 3.05, .25, .35, h), R(1.55, 3.15, .35, .25, h),
      { t: 'box', p: [.15, 3.7, .45], s: [1.5, .3, 1.5], c: h },
      { t: 'box', p: [.1, 1.5, 1.9], s: [.9, 2.3, .2], c: h },
    ]; })(),
    // laundry owner: ACA pink shirt, apron, ponytail with a yellow scrunchie
    laundry: (() => { const sk = '#c98b5a', h = '#2a1a0e'; return [
      { t: 'box', p: [-.75, 2.55, 1], s: [.7, .5, .4], c: h, g: 'tail' },
      { t: 'box', p: [-.5, 1.8, 1.02], s: [.4, .9, .36], c: h, g: 'tail' },
      { t: 'box', p: [-.1, 2.8, .95], s: [.25, .55, .5], c: C.resin },
      ...body('#e0457b', sk),
      T2(.5, 0, 1.4, 1.3, C.fog), T2(.6, 1.3, .14, .6, C.fog), T2(1.66, 1.3, .14, .6, C.fog), T2(.9, .35, .6, .4, C.soft),
      ...head(sk), ...eyes(sk), ...smile('#8e2b2b', sk),
      R(.5, 3.3, 1.4, .4, h), R(.5, 3.1, .2, .3, h), R(1.7, 3.1, .2, .3, h),
      { t: 'box', p: [.15, 3.7, .45], s: [1.5, .3, 1.5], c: h },
      { t: 'box', p: [.1, 2.6, 1.9], s: [.95, 1.4, .14], c: h },
      Ls(1.1, 2.55, .12, .14, C.resin, 2.04),
    ]; })(),
    // accountant: navy blazer, white blouse, hair in a bun, pencil behind the ear
    garcia: (() => { const sk = '#e0ac7e', h = '#22150c', nv = '#2c3c5c'; return [
      ...body(nv, sk),
      T2(.95, .6, .7, 1.3, C.fog), T2(.85, 1.2, .14, .7, shade(nv, -.2)), T2(1.6, 1.2, .14, .7, shade(nv, -.2)),
      T2(1.2, .8, .2, .1, C.resin), T2(.35, .9, .35, .25, C.resin),
      ...head(sk), ...eyes(sk, '#3a2414'), ...smile(C.ember, sk),
      R(.68, 3.22, .34, .07, h), R(1.36, 3.22, .34, .07, h),
      R(.5, 3.45, 1.4, .25, h),
      { t: 'box', p: [.15, 3.7, .45], s: [1.5, .25, 1.5], c: h },
      { t: 'box', p: [.1, 2.7, 1.9], s: [.7, 1.25, .14], c: h },
      { t: 'box', p: [.35, 3.95, .85], s: [.75, .55, .7], c: h },
      { t: 'box', p: [.75, 3.25, 1.96], s: [.9, .1, .1], c: C.resin },
      Ls(1.1, 2.5, .12, .18, C.resin, 2.04),
    ]; })(),
    // farmer: straw hat, checked work shirt, towel around the neck, sun-tanned
    coop: (() => { const sk = '#a86a3c', st = '#e3bf73'; return [
      ...body('#3d6fa8', sk),
      T2(.5, .0, .07, 1.9, '#2b4f7a'), T2(.9, .0, .07, 1.9, '#2b4f7a'), T2(1.3, .0, .07, 1.9, '#2b4f7a'), T2(1.7, .0, .07, 1.9, '#2b4f7a'), T2(2.0, .0, .07, 1.9, '#2b4f7a'),
      T2(.3, .4, 1.8, .07, '#2b4f7a'), T2(.3, .9, 1.8, .07, '#2b4f7a'), T2(.3, 1.4, 1.8, .07, '#2b4f7a'),
      T2(.45, 1.1, .5, .4, '#2b4f7a'),
      { t: 'box', p: [.3, 1.75, .55], s: [1.2, .4, 1.3], c: C.fog },
      ...head(sk), ...eyes(sk), ...smile('#5a1f14', sk),
      R(.7, 3.15, .34, .08, '#1a0f08'), R(1.38, 3.15, .34, .08, '#1a0f08'), R(.5, 3.5, 1.4, .2, '#1a0f08'),
      { t: 'box', p: [.15, 3.7, .45], s: [1.5, .12, 1.5], c: '#1a0f08' },
      { t: 'box', p: [-.3, 3.82, 0], s: [2.4, .12, 2.4], c: st },
      { t: 'box', p: [.25, 3.94, .55], s: [1.3, .55, 1.3], c: st },
      { t: 'dec', X: 1.55, u: .55, v: 3.94, w: 1.3, h: .16, c: C.ember }, Ls(.25, 3.94, 1.3, .16, C.ember, 1.85),
    ]; })(),
  };
  function bust(k, i) {
    let out = '', run = '', g = null;
    const wrap = (inner, gg) => gg === 'blink'
      ? `<g opacity="0">${inner}<animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.93;.96;1" dur="${4 + i * .7}s" repeatCount="indefinite"/></g>`
      : `<g>${inner}<animateTransform attributeName="transform" type="rotate" values="-7 -1.13 -2.35;7 -1.13 -2.35;-7 -1.13 -2.35" dur="1.8s" repeatCount="indefinite"/></g>`;
    const flush = () => { if (run) out += g ? wrap(run, g) : run; run = ''; };
    for (const q of P[k]) { const qg = q.g || null; if (qg !== g) { flush(); g = qg; } run += part(q); }
    flush();
    return `<svg class="fig bust" viewBox="-3 -4.4 5.4 6.8" aria-hidden="true" focusable="false"><g>${out}<animateTransform attributeName="transform" type="translate" values="0 0;0 -.12;0 0" dur="${3 + i * .3}s" repeatCount="indefinite"/></g></svg>`;
  }

  const arrow = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const link = t => t.url ? `<a class="tm-link" href="${t.url}">See what we built ${arrow}</a>` : '<span class="tm-link wip">System in progress now</span>';
  const quote = t => `<blockquote><p class="q-pull">${t.pull}</p>${t.body.map(p => `<p>${p}</p>`).join('')}</blockquote>`;

  root.innerHTML = `<div class="tD"><p class="tD-h">Tap someone to hear it from them.</p><div class="tD-stage">${T.map((t, i) => `<button class="tD-p" data-i="${i}" aria-expanded="false"><span class="tD-b">${i === 0 ? '&ldquo;Huge advantage&rdquo;' : i === 1 ? '&ldquo;Less hassle&rdquo;' : i === 2 ? '&ldquo;Big help&rdquo;' : '&ldquo;All in one place&rdquo;'}</span>${bust(t.k, i)}<span class="n">${t.name}</span></button>`).join('')}</div><div class="tD-card"><span class="tD-notch"></span><div class="tD-in"></div></div></div>`;
  const ps = root.querySelectorAll('.tD-p'), card = root.querySelector('.tD-card'), inn = root.querySelector('.tD-in'), notch = root.querySelector('.tD-notch');
  ps.forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-expanded') === 'true';
      ps.forEach(p => p.setAttribute('aria-expanded', 'false'));
      if (on) { card.classList.remove('open'); return; }
      const t = T[b.dataset.i]; b.setAttribute('aria-expanded', 'true');
      inn.innerHTML = `<div class="tD-who"><strong>${t.name}</strong><span>${t.role} · ${t.where}</span></div>${quote(t)}${link(t)}`;
      // phone: the stage is 2 across, so the quote opens right under the person's own row
      const stage = b.parentElement, i = +b.dataset.i;
      root.querySelector('.tD').appendChild(card); // park it first so the people's positions are clean
      if (matchMedia('(max-width: 760px)').matches) stage.insertBefore(card, stage.children[(i | 1) + 1] || null);
      const r = b.getBoundingClientRect(), cr = card.getBoundingClientRect();
      notch.style.left = (r.left + r.width / 2 - cr.left) + 'px';
      card.classList.add('open');
    }));
  let lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; card.classList.remove('open'); ps.forEach(p => p.setAttribute('aria-expanded', 'false')); });
})();
