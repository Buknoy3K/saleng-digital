/* Saleng Digital: business types.
   One home for the 10 business types, our builds for each, the little 3D models (with their looping
   animations), and the business page (business.html?type=food). Used by index.html and business.html. */
(function () {
  const C = { fog: '#f0ece0', soft: '#c3c8bd', pine: '#1b4430', pine2: '#2f6b4c', night: '#10251b', ink: '#0b1b12',
    resin: '#e3a42b', ember: '#d12a38', flame: '#ff7a3d', wood: '#8a5a2b', bark: '#5a3a1c' };

  // ── our real builds ──
  const BUILDS = {
    snack:   { name: 'Snack Stop POS', what: 'POS + live owner view on her phone', res: 'She sees every sale as it happens, 9 km away.', img: 'assets/img/pos.webp', url: 'work/doc-rena.html', where: 'La Trinidad, Benguet' },
    laundry: { name: 'ACA Laundry Kiosk', what: 'Customer and order kiosk', res: 'No more lost clothes. Every sale tracked.', img: 'assets/img/kiosk-orders.webp', url: 'work/auntie-analyn.html', where: 'La Trinidad, Benguet' },
    ccdc:    { name: 'CCDC Document Generator', what: "Registrar's office documents", res: '10 to 30 minutes per document. Now seconds.', img: 'assets/img/docgen.webp', url: 'work/ccdc.html', where: 'La Trinidad, Benguet' },
    garcia:  { name: 'Garcia Accounting Tracker', what: 'BIR deadline tracker', res: "Every client's BIR deadlines in one place.", img: 'assets/img/garcia.webp', url: 'work/garcia.html', where: 'La Trinidad, Benguet' },
    vo:      { name: 'Virtual Office', what: 'AI agents at their desks', res: 'Every job started, stored and tracked in one place.', img: 'assets/img/vo-office.webp', url: 'work/virtual-office.html', where: 'Baguio City, Benguet' },
    coop:    { name: 'Cooperative system', what: 'For an agricultural cooperative', res: 'In progress now.', where: 'La Trinidad, Benguet', wip: true },
  };

  // ── the 6 business types: description, builds made for it, closest builds when there are none, ideas ──
  const CATS = [
    { id: 'retail', name: 'Retail and hospitality', short: 'Retail', desc: 'Shops, retail, restaurants, cafés, hotels, and lodging.', ex: ['shops', 'retail', 'restaurants', 'cafés', 'hotels', 'lodging'], builds: ['snack'], near: [], ideas: ['A POS with receipt printer', 'Stock that counts itself down', 'Sales live on your phone', 'Bookings and room status'] },
    { id: 'services', name: 'Services', short: 'Services', desc: 'Auto shops, accounting and law firms, and service providers.', ex: ['auto shops', 'accounting firms', 'law firms', 'laundries', 'service providers'], builds: ['laundry', 'garcia', 'vo'], near: [], ideas: ['Order or job-ticket kiosk', 'Client deadline tracker', 'Customer records', 'Billing and receipts'] },
    { id: 'health', name: 'Health and education', short: 'Health', desc: 'Clinics, pharmacies, schools, universities.', ex: ['clinics', 'pharmacies', 'schools', 'universities'], builds: ['ccdc'], near: [], ideas: ['Document and certificate generator', 'Patient or student records', 'Appointments and queue', 'Fees and payments'] },
    { id: 'make', name: 'Manufacturing and trade', short: 'Trade', desc: 'Manufacturers, wholesalers, distributors, suppliers.', ex: ['manufacturers', 'wholesalers', 'distributors', 'suppliers'], builds: [], near: ['snack', 'garcia'], ideas: ['Inventory and orders', 'Delivery tracking', 'Supplier records', 'Quotes and invoices'] },
    { id: 'org', name: 'Organizations and institutions', short: 'Orgs', desc: 'Cooperatives, NGOs, government offices.', ex: ['cooperatives', 'NGOs', 'government offices'], builds: ['coop'], near: ['ccdc', 'garcia'], ideas: ['Member records and shares', 'Loans and dues', 'Documents and permits', 'Reports for the board'] },
    { id: 'other', name: 'Something else', short: 'Yours', desc: "For anything that doesn't fit the categories above.", ex: ['tell us about your business'], builds: [], near: ['snack', 'laundry', 'ccdc', 'garcia'], ideas: ['Tell us what slows you down', 'We visit for a free audit', 'We build around how you work'] },
  ];
  const live = c => c.builds.filter(k => !BUILDS[k].wip).length;

  /* ── models ──
     Parts are listed back-to-front, bottom-to-top (that is the draw order).
     box p=[x,y,z] min corner, s=[w,h,d] · cyl p=[cx,y,cz] r h · sph p=[cx,cy,cz] r
     dec = flat mark on a face: f 'R' (plane x=X) or 'L' (plane z=Z), u along the face, v height; rect or circle
     g = animation group: consecutive parts with the same g move together (see A below)
     spin = [cu, cv, seconds] turns a mark around a point on its face (the laundry drum) */
  const slab = { t: 'box', p: [0, 0, 0], s: [6, .4, 6], c: C.pine };
  const M = {
    retail: [slab,
      { t: 'box', p: [1, .4, 1], s: [4, 3, 4], c: C.fog },
      { t: 'dec', f: 'R', X: 5, u: 1.6, v: 1.4, w: 2.8, h: 1.2, c: C.resin, g: 'win' },
      { t: 'dec', f: 'R', X: 5, u: 1.6, v: 1.1, w: 2.8, h: .3, c: C.wood },
      { t: 'dec', f: 'L', Z: 5, u: 2.4, v: .4, w: 1.2, h: 2, c: C.pine },
      { t: 'box', p: [.8, 3.4, .8], s: [4.4, .45, 4.4], c: C.ember },
      { t: 'box', p: [1, 2.5, 5], s: [4, .25, .9], c: C.resin },
      { t: 'box', p: [1.5, 3.85, 4.2], s: [3, 1, .25], c: C.resin, g: 'sign' },
    ],
    services: [slab,
      { t: 'box', p: [1.2, .4, .9], s: [3.4, .5, 2.4], c: C.fog },
      { t: 'box', p: [1.3, .9, 1], s: [3.2, .3, 2.2], c: C.soft },
      { t: 'box', p: [1.6, 1.2, 1.2], s: [2.6, .12, 1.8], c: C.fog, g: 'sheet' },
      { t: 'box', p: [1, .4, 3.4], s: [4, 2.6, 1.7], c: C.wood, g: 'case' },
      { t: 'dec', f: 'L', Z: 5.1, u: 1.5, v: 2.1, w: .6, h: .45, c: C.resin, g: 'case' },
      { t: 'dec', f: 'L', Z: 5.1, u: 3.9, v: 2.1, w: .6, h: .45, c: C.resin, g: 'case' },
      { t: 'dec', f: 'L', Z: 5.1, u: 1, v: 1.6, w: 4, h: .12, c: C.bark, g: 'case' },
      { t: 'box', p: [2.3, 3, 4], s: [1.4, .55, .45], c: C.bark, g: 'case' },
    ],
    health: [slab,
      { t: 'box', p: [1, .4, 1.2], s: [4, .7, 3.4], c: C.ember },
      { t: 'box', p: [1.2, 1.1, 1.3], s: [3.7, .7, 3.2], c: C.resin },
      { t: 'box', p: [1, 1.8, 1.2], s: [4, .7, 3.4], c: C.fog },
      { t: 'cyl', p: [3, 2.5, 2.9], r: 1.1, h: .6, c: C.ink, g: 'cap' },
      { t: 'box', p: [1.4, 3.1, 1.3], s: [3.2, .25, 3.2], c: C.ink, g: 'cap' },
      { t: 'box', p: [4.45, 2.3, 4.3], s: [.15, 1, .15], c: C.resin, g: 'cap' },
      { t: 'box', p: [4.15, .4, 5.05], s: [.18, .5, .18], c: C.soft, g: 'plus' },
      { t: 'box', p: [3.7, .9, 5.05], s: [1.6, 1.6, .2], c: C.fog, g: 'plus' },
      { t: 'dec', f: 'L', Z: 5.25, u: 4.25, v: 1.15, w: .5, h: 1.1, c: C.ember, g: 'plus' },
      { t: 'dec', f: 'L', Z: 5.25, u: 3.95, v: 1.45, w: 1.1, h: .5, c: C.ember, g: 'plus' },
    ],
    make: [slab,
      { t: 'box', p: [.7, .4, .7], s: [2.3, 2.3, 2.3], c: C.wood },
      { t: 'dec', f: 'R', X: 3, u: .7, v: 1.4, w: 2.3, h: .2, c: C.bark },
      { t: 'dec', f: 'L', Z: 3, u: .7, v: 1.4, w: 2.3, h: .2, c: C.bark },
      { t: 'box', p: [3.3, .4, .7], s: [2, 2, 2], c: C.wood },
      { t: 'dec', f: 'L', Z: 2.7, u: 3.3, v: 1.3, w: 2, h: .2, c: C.bark },
      { t: 'cyl', p: [1.85, 2.7, 1.85], r: .85, h: .35, c: C.fog },
      { t: 'cyl', p: [1.85, 2.7, 1.85], r: .3, h: .4, c: C.soft },
      { t: 'box', p: [.8, .4, 3.5], s: [1.8, 1.2, 1.8], c: C.resin },
      { t: 'box', p: [3.2, .4, 3.3], s: [2.2, 1.4, 2.2], c: C.ember },
      { t: 'dec', f: 'L', Z: 5.5, u: 3.2, v: 1.1, w: 2.2, h: .2, c: C.fog },
      { t: 'box', p: [3.7, 1.8, 3.8], s: [1.2, .9, 1.2], c: C.resin, g: 'drop' },
    ],
    org: [slab,
      { t: 'cyl', p: [3, .4, 1.5], r: .65, h: 1.5, c: C.resin, g: 'p1' },
      { t: 'sph', p: [3, 2.45, 1.5], r: .55, c: C.resin, g: 'p1' },
      { t: 'cyl', p: [3, .4, 3.2], r: 1.1, h: .8, c: C.fog },
      { t: 'cyl', p: [1.5, .4, 4.3], r: .65, h: 1.5, c: C.ember, g: 'p2' },
      { t: 'sph', p: [1.5, 2.45, 4.3], r: .55, c: C.ember, g: 'p2' },
      { t: 'cyl', p: [4.5, .4, 4.3], r: .65, h: 1.5, c: C.flame, g: 'p3' },
      { t: 'sph', p: [4.5, 2.45, 4.3], r: .55, c: C.flame, g: 'p3' },
    ],
    other: [slab,
      { t: 'box', p: [.8, .4, .8], s: [1.9, 1.9, 1.9], c: C.ember },
      { t: 'box', p: [3.3, .4, .8], s: [1.9, 1.9, 1.9], c: C.fog },
      { t: 'box', p: [.8, .4, 3.3], s: [1.9, 1.9, 1.9], c: C.resin },
      { t: 'box', p: [1.8, 2.3, 1.8], s: [1.9, 1.9, 1.9], c: C.wood },
      { t: 'cyl', p: [2.75, 4.2, 2.75], r: .7, h: 1, c: C.fog, g: 'top' },
      { t: 'box', p: [3.6, .4, 3.6], s: [1.2, 1.2, 1.2], c: C.pine2, g: 'blk' },
    ],
  };

  /* ── the loops: what each animation group does ──
     bob: up and down · rise: steam floating up and fading · blink: a light dimming
     sway: rocking around a point · pulse: a heartbeat · drop: a box falling onto the pile */
  const A = {
    retail: { sign: ['bob', 2.4, 0, .3], win: ['blink', 3.2, 0] },
    services: { case: ['bob', 1.8, 0, .35], sheet: ['bob', 1.8, .4, .5] },
    health: { cap: ['bob', 2.2, 0, .35], plus: ['pulse', 1.5, 0, 0, [4.5, 1.7, 5.15]] },
    make: { drop: ['drop', 2.6, 0] },
    org: { p1: ['bob', 1.6, 0, .35], p2: ['bob', 1.6, .5, .35], p3: ['bob', 1.6, 1, .35] },
    other: { top: ['bob', 2, 0, .45], blk: ['bob', 2, .7, .3] },
  };

  // ── isometric SVG drawing ──
  const c30 = Math.cos(Math.PI / 6), s30 = .5, f2 = v => +v.toFixed(2);
  const pr = (x, y, z) => [f2((x - z) * c30), f2((x + z) * s30 - y)];
  function shade(hex, k) { // k > 0 lighter, k < 0 darker
    const n = parseInt(hex.slice(1), 16), t = k > 0 ? 255 : 0, a = Math.abs(k);
    const ch = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v + (t - v) * a));
    return '#' + ((1 << 24) | (ch[0] << 16) | (ch[1] << 8) | ch[2]).toString(16).slice(1);
  }
  const poly = (pts, fill) => `<polygon points="${pts.map(p => pr(...p).join(',')).join(' ')}" fill="${fill}"/>`;
  const ease = 'calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"';
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
    // dec: draw in the face's own flat coordinates, then map onto the face
    const m = q.f === 'R' ? [-c30, s30, 0, -1, q.X * c30, q.X * s30] : [c30, s30, 0, -1, -q.Z * c30, q.Z * s30];
    const fill = q.f === 'R' ? q.c : shade(q.c, -.15);
    const spin = q.spin ? `<animateTransform attributeName="transform" type="rotate" from="0 ${q.spin[0]} ${q.spin[1]}" to="360 ${q.spin[0]} ${q.spin[1]}" dur="${q.spin[2]}s" repeatCount="indefinite"/>` : '';
    const mark = q.shape === 'circle' ? `<circle cx="${q.u}" cy="${q.v}" r="${q.r}" fill="${fill}">${spin}</circle>` : `<rect x="${q.u}" y="${q.v}" width="${q.w}" height="${q.h}" fill="${fill}">${spin}</rect>`;
    return `<g transform="matrix(${m.map(f2).join(' ')})">${mark}</g>`;
  }
  function loop(inner, a) {
    const [k, dur, delay, amt, piv] = a, rep = `dur="${dur}s" begin="${delay}s" repeatCount="indefinite"`;
    if (k === 'bob') return `<g>${inner}<animateTransform attributeName="transform" type="translate" values="0 0;0 -${amt};0 0" keyTimes="0;.5;1" ${ease} ${rep}/></g>`;
    if (k === 'blink') return `<g>${inner}<animate attributeName="opacity" values="1;.35;1" keyTimes="0;.5;1" ${ease} ${rep}/></g>`;
    if (k === 'rise') return `<g opacity="0">${inner}<animateTransform attributeName="transform" type="translate" values="0 .4;0 -2.6" ${rep}/><animate attributeName="opacity" values="0;.95;0" keyTimes="0;.3;1" ${rep}/></g>`;
    if (k === 'drop') return `<g opacity="0">${inner}<animateTransform attributeName="transform" type="translate" values="0 -3.2;0 0;0 0;0 0" keyTimes="0;.28;.82;1" calcMode="spline" keySplines=".5 0 1 1;0 0 1 1;0 0 1 1" ${rep}/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.82;1" ${rep}/></g>`;
    const [px, py] = pr(...piv);
    if (k === 'sway') return `<g>${inner}<animateTransform attributeName="transform" type="rotate" values="-${amt} ${px} ${py};${amt} ${px} ${py};-${amt} ${px} ${py}" keyTimes="0;.5;1" ${ease} ${rep}/></g>`;
    if (k === 'pulse') return `<g transform="translate(${px} ${py})"><g><animateTransform attributeName="transform" type="scale" values="1;1.14;1;1.07;1" keyTimes="0;.14;.28;.42;1" ${rep}/><g transform="translate(${-px} ${-py})">${inner}</g></g></g>`;
    return inner;
  }
  function isoSVG(id) {
    let out = '', run = '', g = null;
    const flush = () => { if (run) out += g ? loop(run, A[id][g]) : run; run = ''; };
    for (const q of M[id]) { const qg = q.g || null; if (qg !== g) { flush(); g = qg; } run += part(q); }
    flush();
    return `<svg class="iso" viewBox="-6 -6.6 12 13" aria-hidden="true" focusable="false">${out}</svg>`;
  }

  // ── small flat icons, for the "other business types" links on the business page ──
  const I = {
    retail: '<path d="M8 20h32v20H8z"/><path d="M6 12h36l-2 8H8z"/><path d="M20 40V28h8v12"/>',
    services: '<rect x="6" y="16" width="36" height="24" rx="3"/><path d="M18 16v-5h12v5M6 27h36"/>',
    health: '<path d="M24 41s-16-9-16-21a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 12-16 21-16 21z"/><path d="M24 20v10M19 25h10"/>',
    make: '<circle cx="24" cy="24" r="6"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4"/>',
    org: '<circle cx="24" cy="15" r="5"/><circle cx="11" cy="20" r="4"/><circle cx="37" cy="20" r="4"/><path d="M15 40v-6a9 9 0 0 1 18 0v6M4 38v-3a7 7 0 0 1 9-6M44 38v-3a7 7 0 0 0-9-6"/>',
    other: '<path d="M18 18a6 6 0 1 1 9 5c-2 1-3 2-3 5"/><circle cx="24" cy="35" r="1.5" fill="currentColor"/><rect x="6" y="6" width="36" height="36" rx="10"/>',
  };
  const icon = id => `<svg class="ic" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[id]}</svg>`;

  // ── put the models in: any element with data-biz="<id>" gets its model ──
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mount(el, id) {
    el.innerHTML = isoSVG(id);
    const svg = el.firstElementChild;
    if (RM) { svg.pauseAnimations(); return; }
    if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations())).observe(svg);
  }
  document.querySelectorAll('[data-biz]').forEach(a => {
    const c = CATS.find(x => x.id === a.dataset.biz); if (!c) return;
    mount(a.querySelector('.m'), c.id);
    const n = live(c), wip = c.builds.length > n;
    if (n || wip) a.insertAdjacentHTML('afterbegin', `<span class="live${n ? '' : ' wip'}">${n ? `<i></i>${n} live` : 'In progress'}</span>`);
  });

  // ── business page ──
  const page = document.querySelector('[data-bizpage]');
  if (page) {
    const want = new URLSearchParams(location.search).get('type');
    const c = CATS.find(x => x.id === want) || CATS[CATS.length - 1];
    const $ = id => document.getElementById(id);
    document.title = c.name + ' · Saleng Digital';
    const card = k => {
      const b = BUILDS[k];
      return b.wip
        ? `<div class="bp-build wip"><div class="t"><span class="lbl">In progress · ${b.where}</span><h3>${b.name}</h3><p class="res">${b.what}. ${b.res}</p></div></div>`
        : `<a class="bp-build" href="${b.url}"><figure><img src="${b.img}" alt="${b.name} screenshot, demo data" loading="lazy"></figure><div class="t"><span class="lbl">${b.what} · ${b.where}</span><h3>${b.name}</h3><p class="res">${b.res}</p><span class="link">Read the full story <i data-arrow></i></span></div></a>`;
    };
    $('bpName').innerHTML = `<span>${c.short}</span>`;
    $('bpLead').textContent = c.name;
    mount($('bpModel'), c.id);
    $('bpEx').innerHTML = c.ex.map(e => `<span>${e}</span>`).join('');
    $('bpBuilt').innerHTML = c.builds.length
      ? `<h2 class="bp-h">What we've built for <span>${c.name.toLowerCase()}</span></h2><div class="bp-builds">${c.builds.map(card).join('')}</div>`
      : `<h2 class="bp-h">${c.id === 'other' ? 'Tell us <span>what you run</span>' : `Nothing built for <span>${c.name.toLowerCase()}</span> yet`}</h2>
         <div class="bp-empty"><p>${c.id === 'other' ? "Every system we've made started with an owner explaining their day. Yours can too." : "You could be the first. These are the closest things we've built, and they work the same way."}</p><a class="btn amber" href="index.html#contact">Book a free audit <i data-arrow></i></a></div>
         <div class="bp-near">${c.near.map(card).join('')}</div>`;
    $('bpIdeas').innerHTML = c.ideas.map(t => `<li>${t}</li>`).join('');
    $('bpOthers').innerHTML = CATS.filter(x => x.id !== c.id).map(x => `<a href="business.html?type=${x.id}">${icon(x.id)}${x.name}</a>`).join('');
  }
})();
