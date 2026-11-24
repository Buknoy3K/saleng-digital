/* Saleng 3D kit: the same isometric drawing the live site uses (biz.js / clients.js), grown into a model library.
   Parts (y is up; the viewer sees the top, the +x face on the right and the +z face on the left):
     box  p=[x,y,z] s=[w,h,d]          cyl p=[cx,y,cz] r h          sph p=[cx,cy,cz] r
     roof gable roof over p/s, ridge along x
     dec  a flat mark on a face: f 'L' (plane z=Z, u along x), 'R' (plane x=X, u along z), 'T' (plane y=Y, u along x, v along z)
          rect (u v w h) · circle (r) · img (a screenshot fills u v w h) · txt (centred at u, baseline v, size h)
   a = animation: consecutive parts holding the same array move together. Models are listed back to front. */
(() => {
  const C = { fog: '#f0ece0', soft: '#c3c8bd', pine: '#1b4430', pine2: '#2f6b4c', leaf: '#6fae5a', night: '#10251b', ink: '#0b1b12',
    resin: '#e3a42b', ember: '#d12a38', flame: '#ff7a3d', wood: '#8a5a2b', bark: '#5a3a1c', skin: '#c98b5a', hair: '#2a1a0e',
    cream: '#F6F3EA', gold: '#C9A227', steel: '#c9ccd0', dark: '#1d2024', pink: '#e0457b', navy: '#2c3c5c', sky: '#7fb6d9',
    road: '#3a3f3b', grass: '#a9c48f', soil: '#6b4423', white: '#ffffff', glow: '#5bd38a' };
  const c30 = Math.cos(Math.PI / 6), f2 = v => +v.toFixed(2);
  let bb = null;
  const pr = (x, y, z) => { const sx = f2((x - z) * c30), sy = f2((x + z) * .5 - y); if (bb) { bb[0] = Math.min(bb[0], sx); bb[1] = Math.min(bb[1], sy); bb[2] = Math.max(bb[2], sx); bb[3] = Math.max(bb[3], sy); } return [sx, sy]; };
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16), t = k > 0 ? 255 : 0, a = Math.abs(k);
    const ch = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v + (t - v) * a));
    return '#' + ((1 << 24) | (ch[0] << 16) | (ch[1] << 8) | ch[2]).toString(16).slice(1);
  }
  const poly = (pts, fill) => `<polygon points="${pts.map(p => pr(...p).join(',')).join(' ')}" fill="${fill}"/>`;
  const ISO = { C, shade, base: '' };

  function part(q) {
    if (q.t === 'box') {
      const [x, y, z] = q.p, [w, h, d] = q.s;
      return poly([[x, y + h, z], [x + w, y + h, z], [x + w, y + h, z + d], [x, y + h, z + d]], shade(q.c, .14))
        + poly([[x + w, y, z], [x + w, y, z + d], [x + w, y + h, z + d], [x + w, y + h, z]], q.c)
        + poly([[x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d]], shade(q.c, -.2));
    }
    if (q.t === 'roof') { // gable, ridge along x at the middle of z
      const [x, y, z] = q.p, [w, h, d] = q.s, m = z + d / 2;
      return poly([[x, y, z], [x + w, y, z], [x + w, y + h, m], [x, y + h, m]], shade(q.c, -.05))
        + poly([[x + w, y, z], [x + w, y, z + d], [x + w, y + h, m]], q.e || C.fog)
        + poly([[x, y, z + d], [x + w, y, z + d], [x + w, y + h, m], [x, y + h, m]], shade(q.c, .12));
    }
    if (q.t === 'cyl') {
      const [sx, sb] = pr(...q.p), st = f2(sb - q.h), rx = f2(1.2247 * q.r), ry = f2(.7071 * q.r), side = shade(q.c, -.12);
      if (bb) { pr(q.p[0] - q.r, q.p[1] + q.h, q.p[2] + q.r); pr(q.p[0] + q.r, q.p[1] + q.h, q.p[2] - q.r); pr(q.p[0] + q.r, q.p[1], q.p[2] + q.r); }
      return `<ellipse cx="${sx}" cy="${sb}" rx="${rx}" ry="${ry}" fill="${side}"/><rect x="${f2(sx - rx)}" y="${st}" width="${f2(2 * rx)}" height="${q.h}" fill="${side}"/><ellipse cx="${sx}" cy="${st}" rx="${rx}" ry="${ry}" fill="${shade(q.c, .12)}"/>`;
    }
    if (q.t === 'sph') {
      const [sx, sy] = pr(...q.p), r = f2(1.2247 * q.r);
      if (bb) { bb[1] = Math.min(bb[1], sy - r); bb[3] = Math.max(bb[3], sy + r); }
      return `<circle cx="${sx}" cy="${sy}" r="${r}" fill="${q.c}"/><circle cx="${f2(sx - r * .3)}" cy="${f2(sy - r * .3)}" r="${f2(r * .45)}" fill="${shade(q.c, .2)}"/>`;
    }
    // dec: draw in the face's own flat coordinates (v up), then map onto the face
    const f = q.f || 'R';
    const m = f === 'L' ? [c30, .5, 0, -1, -q.Z * c30, q.Z * .5] : f === 'T' ? [c30, .5, -c30, .5, 0, -q.Y] : [-c30, .5, 0, -1, q.X * c30, q.X * .5];
    const flip = f === 'R' ? -1 : 1, fill = q.c ? (f === 'L' ? shade(q.c, -.15) : q.c) : 'none', op = q.op ? ` opacity="${q.op}"` : '';
    let mark;
    if (q.img) mark = `<g transform="translate(${f2(flip < 0 ? q.u + q.w : q.u)} ${f2(q.v + q.h)}) scale(${flip} -1)"><image href="${ISO.base}assets/img/${q.img}" width="${q.w}" height="${q.h}" preserveAspectRatio="xMidYMin slice"/>${f === 'L' ? `<rect width="${q.w}" height="${q.h}" fill="#000" opacity=".06"/>` : ''}</g>`;
    else if (q.txt) mark = `<text transform="translate(${q.u} ${q.v}) scale(${flip} -1)" font-size="${q.h}" fill="${fill}" text-anchor="middle" font-weight="800" font-family="'Bricolage Grotesque',system-ui,sans-serif" font-stretch="80%" letter-spacing="-.02em">${q.txt}</text>`;
    else if (q.r) mark = `<circle cx="${q.u}" cy="${q.v}" r="${q.r}" fill="${fill}"${op}/>`;
    else mark = `<rect x="${q.u}" y="${q.v}" width="${q.w}" height="${q.h}" fill="${fill}"${op}>${q.spin ? `<animateTransform attributeName="transform" type="rotate" from="0 ${q.spin[0]} ${q.spin[1]}" to="360 ${q.spin[0]} ${q.spin[1]}" dur="${q.spin[2]}s" repeatCount="indefinite"/>` : ''}</rect>`;
    return `<g transform="matrix(${m.map(f2).join(' ')})">${mark}</g>`;
  }

  // ── loops ──
  const ease = 'calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"';
  function loop(inner, a) {
    const [k, dur, delay, amt, piv] = a, rep = `dur="${dur}s" begin="${delay}s" repeatCount="indefinite"`;
    if (k === 'bob') return `<g>${inner}<animateTransform attributeName="transform" type="translate" values="0 0;0 -${amt};0 0" keyTimes="0;.5;1" ${ease} ${rep}/></g>`;
    if (k === 'blink') return `<g>${inner}<animate attributeName="opacity" values="1;${amt ?? .35};1" keyTimes="0;.5;1" ${ease} ${rep}/></g>`;
    if (k === 'lid') return `<g opacity="0">${inner}<animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.93;.96;1" ${rep}/></g>`;
    if (k === 'rise') return `<g opacity="0">${inner}<animateTransform attributeName="transform" type="translate" values="0 .4;0 -${amt || 2.6}" ${rep}/><animate attributeName="opacity" values="0;.95;0" keyTimes="0;.3;1" ${rep}/></g>`;
    if (k === 'drop') return `<g opacity="0">${inner}<animateTransform attributeName="transform" type="translate" values="0 -${amt || 3.2};0 0;0 0;0 0" keyTimes="0;.28;.82;1" calcMode="spline" keySplines=".5 0 1 1;0 0 1 1;0 0 1 1" ${rep}/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.82;1" ${rep}/></g>`;
    if (k === 'drive') { const dx = f2(c30 * amt), dy = f2(.5 * amt); return `<g opacity="0">${inner}<animateTransform attributeName="transform" type="translate" values="${-dx} ${-dy};${dx} ${dy}" ${rep}/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.92;1" ${rep}/></g>`; }
    if (k === 'swayS') return `<g>${inner}<animateTransform attributeName="transform" type="rotate" values="-${amt} ${piv[0]} ${piv[1]};${amt} ${piv[0]} ${piv[1]};-${amt} ${piv[0]} ${piv[1]}" ${ease} ${rep}/></g>`;
    const [px, py] = (() => { const s = bb; bb = null; const r = pr(...piv); bb = s; return r; })();
    if (k === 'sway') return `<g>${inner}<animateTransform attributeName="transform" type="rotate" values="-${amt} ${px} ${py};${amt} ${px} ${py};-${amt} ${px} ${py}" keyTimes="0;.5;1" ${ease} ${rep}/></g>`;
    if (k === 'pulse') return `<g transform="translate(${px} ${py})"><g><animateTransform attributeName="transform" type="scale" values="1;1.14;1;1.07;1" keyTimes="0;.14;.28;.42;1" ${rep}/><g transform="translate(${-px} ${-py})">${inner}</g></g></g>`;
    if (k === 'flick') return `<g transform="translate(${px} ${py})"><g><animateTransform attributeName="transform" type="scale" values="1 1;${1 - amt / 2} ${1 + amt};1 ${1 - amt / 2};1 1" keyTimes="0;.35;.7;1" ${ease.replace(';.45 0 .55 1"', ';.45 0 .55 1;.45 0 .55 1"')} ${rep}/><g transform="translate(${-px} ${-py})">${inner}</g></g></g>`;
    return inner;
  }

  // ── helpers for authoring ──
  const B = (x, y, z, w, h, d, c, a) => ({ t: 'box', p: [x, y, z], s: [w, h, d], c, a });
  const Cy = (x, y, z, r, h, c, a) => ({ t: 'cyl', p: [x, y, z], r, h, c, a });
  const S = (x, y, z, r, c, a) => ({ t: 'sph', p: [x, y, z], r, c, a });
  const RF = (x, y, z, w, h, d, c, e, a) => ({ t: 'roof', p: [x, y, z], s: [w, h, d], c, e, a });
  const DL = (Z, u, v, w, h, c, x = {}) => ({ t: 'dec', f: 'L', Z, u, v, w, h, c, ...x });
  const DR = (X, u, v, w, h, c, x = {}) => ({ t: 'dec', f: 'R', X, u, v, w, h, c, ...x });
  const DT = (Y, u, v, w, h, c, x = {}) => ({ t: 'dec', f: 'T', Y, u, v, w, h, c, ...x });
  const dot = (D, F, u, v, r, c, a) => ({ ...D(F, u, v, 0, 0, c), r, a });
  const text = (D, F, u, v, size, c, txt, a) => ({ ...D(F, u, v, 0, size, c), txt, a });

  // ── devices: the real screenshots sit on the screens ──
  const M = {};
  M.pos = (() => { const pa = ['bob', 2.6, 0, .35]; return [
    B(0, 0, 0, 6, 2.4, 3, C.wood),
    DL(3, .25, .3, 5.5, .12, C.bark), DL(3, .25, 2.05, 5.5, .12, C.bark),
    text(DL, 3, 3, .95, .72, C.cream, 'SNACK STOP'),
    B(-.1, 2.4, -.1, 6.2, .22, 3.2, C.fog),
    B(3.8, 2.62, .3, 1.8, .5, 1.3, C.dark), DR(5.6, .5, 2.75, .9, .1, '#555'),
    B(1.25, 2.62, .7, 1.1, .1, .9, '#9aa0a6'), B(1.6, 2.72, .85, .4, .7, .3, '#9aa0a6'),
    B(.55, 3.15, 1.15, 2.6, 1.75, .16, C.ink), DL(1.31, .66, 3.26, 2.38, 1.5, null, { img: 'pos.webp' }),
    B(4.05, 2.62, 1.95, 1.15, .62, .95, C.fog), DT(3.24, 4.25, 2.2, .75, .12, C.ink),
    B(4.3, 3.0, 2.15, .62, .9, .04, C.white, pa), DL(2.19, 4.4, 3.6, .42, .05, '#999', { a: pa }), DL(2.19, 4.4, 3.4, .3, .05, '#999', { a: pa }), DL(2.19, 4.4, 3.2, .38, .05, '#999', { a: pa }),
  ]; })();
  M.kiosk = (() => { const bub = ['bob', 2.2, 0, .3]; return [
    B(0, 0, 0, 3, .3, 2.4, '#33373b'),
    B(.6, .3, .6, 1.8, 3.1, 1.2, C.pink), text(DL, 1.8, 1.5, 1.6, .6, C.fog, 'ACA'),
    B(.2, 3.4, .75, 2.6, 3.7, .45, C.fog), DL(1.2, .36, 3.58, 2.28, 3.36, null, { img: 'kiosk.webp' }),
    B(3.3, 5.2, .9, 2.4, 1.2, .25, C.white, bub), B(3.5, 4.95, 1.0, .35, .3, .15, C.white, bub),
    text(DL, 1.15, 4.5, 5.6, .5, C.pine, 'Ready!', bub),
  ]; })();
  M.docgen = (() => { const up = ['bob', 2.8, 0, .5]; return [
    B(0, 0, 0, 7.2, .4, 4.4, C.wood),
    B(.7, .4, 1.4, 3.8, .16, 2.5, C.steel), DT(.56, 1, 2.2, 3.2, 1.2, '#8d939a'),
    B(.7, .56, 1.2, 3.8, 2.5, .16, C.steel), DL(1.36, .84, .7, 3.52, 2.22, null, { img: 'docgen.webp' }),
    B(5.0, .4, 1.3, 1.7, .1, 2.2, C.white), B(5.02, .5, 1.32, 1.7, .08, 2.2, C.white),
    B(5.0, .9, 1.3, 1.7, .06, 2.2, C.white, up), DT(.96, 5.25, 1.6, 1.2, .1, C.ink, { a: up }), DT(.96, 5.25, 1.9, .9, .08, C.soft, { a: up }), DT(.96, 5.25, 2.15, 1, .08, C.soft, { a: up }),
    dot(DT, .96, 6.2, 3.05, .3, C.gold, up),
  ]; })();
  M.tracker = [
    B(0, 0, 0, 7.2, .4, 4.4, '#b98a55'),
    B(.6, .4, 1.4, 3.8, .16, 2.5, C.dark), DT(.56, .9, 2.2, 3.2, 1.2, '#3a3f45'),
    B(.6, .56, 1.2, 3.8, 2.5, .16, C.dark), DL(1.36, .74, .7, 3.52, 2.22, null, { img: 'garcia.webp' }),
    B(5.1, .4, .5, 1.5, .26, 1.2, C.resin), B(5.15, .66, .55, 1.5, .26, 1.2, C.ember), B(5.05, .92, .5, 1.5, .26, 1.2, C.sky),
    B(5.4, .4, 2.6, .9, .14, .9, C.dark), B(5.55, .54, 2.95, .95, 1.9, .12, C.ink), DL(3.07, 5.61, .64, .83, 1.7, null, { img: 'garcia-phone.webp' }),
  ];
  M.coop = [
    B(0, 0, 0, 8, .4, 4.2, '#2a2d31'),
    B(1.9, .4, 1.5, 1.6, .1, 1.1, C.dark), B(2.5, .5, 1.75, .4, 1.1, .3, C.dark),
    B(.4, 1.3, 1.9, 4.4, 2.75, .2, C.ink), DL(2.1, .52, 1.42, 4.16, 2.5, null, { img: 'coop-dash.webp' }),
    B(1, .4, 3.05, 3.1, .12, .8, '#3a3f45'),
    B(5.6, .4, .7, 1.6, 3.5, 3, '#121416'), DR(7.2, .3, .5, 2.4, 2.6, '#16382a'),
    dot(DR, 7.2, 1.5, 2.45, .5, C.glow, ['blink', 1.8, 0, .4]), dot(DR, 7.2, 1.5, 1.25, .5, C.glow, ['blink', 1.8, .6, .4]),
    DL(3.7, 5.8, 3.2, .3, .08, C.glow),
  ];
  M.vo = (() => { const steam = ['rise', 2.4, 0, 1.6], leaf = ['sway', 3, 0, 4, [6.3, 1.1, 1.2]]; return [
    B(0, 0, 0, 7.4, .4, 4.2, '#6b4a2c'),
    B(5.9, .4, .8, .85, .75, .85, '#b5582f'),
    B(6.05, 1.15, .95, .55, .9, .55, C.pine2, leaf), B(5.85, 1.75, 1.15, .45, .7, .45, C.leaf, leaf), B(6.35, 1.6, .75, .4, .8, .4, C.pine2, leaf),
    B(2.5, .4, 1.1, 1.2, .1, .9, C.dark), B(2.95, .5, 1.25, .3, .5, .2, C.dark),
    B(.3, .9, 1.45, 5.2, 2.8, .2, C.ink), DL(1.65, .42, 1.02, 4.96, 2.56, null, { img: 'vo-office.webp' }),
    B(1.4, .4, 2.8, 2.8, .12, .8, '#3a3f45'),
    Cy(6, .4, 3.1, .35, .65, C.fog),
    B(5.9, 1.2, 3.05, .14, .4, .14, '#ffffff', steam), B(6.05, 1.3, 3.15, .12, .35, .12, '#ffffff', ['rise', 2.4, 1.1, 1.6]),
  ]; })();

  // ── town: the client buildings ──
  const win = (D, F, u, v, w, h, c, k, n) => Array.from({ length: n }, (_, i) => D(F, u + i * k, v, w, h, c));
  M.shop = [
    B(1, 0, 1, 4, 3, 4, C.fog),
    DR(5, 1.4, 1.2, 2.6, 1.3, C.resin, { a: ['blink', 3.2, 0] }), DR(5, 1.4, .95, 2.6, .25, C.wood),
    DL(5, 2.4, 0, 1.2, 2.1, C.pine),
    B(.8, 3, .8, 4.4, .45, 4.4, C.ember),
    B(1, 2.2, 5, 4, .22, .9, C.resin), ...win(DL, 5.9, 1.05, 2.2, .45, .22, C.ember, .9, 5),
    B(1.4, 3.45, 4.2, 3.2, .95, .25, C.resin, ['bob', 2.4, 0, .25]), text(DL, 4.45, 3, 3.72, .5, C.ink, 'SNACK STOP', ['bob', 2.4, 0, .25]),
  ];
  M.laundry = (() => { const sg = ['bob', 2.8, .4, .2]; return [
    B(1, 0, 1, 4, 3.2, 4, C.pink),
    DR(5, 1.3, .9, 2.4, 1.6, '#f6cad7'),
    B(.8, 3.2, .8, 4.4, .35, 4.4, C.fog),
    dot(DL, 5, 2.1, 1.35, .62, C.fog), dot(DL, 5, 2.1, 1.35, .45, '#26323a'), DL(5, 1.85, 1.3, .5, .1, C.sky, { spin: [2.1, 1.35, 2] }),
    dot(DL, 5, 3.9, 1.35, .62, C.fog), dot(DL, 5, 3.9, 1.35, .45, '#26323a'), DL(5, 3.65, 1.3, .5, .1, C.sky, { spin: [3.9, 1.35, 1.6] }),
    B(1.7, 3.55, 4.4, 2.6, 1, .2, C.fog, sg), text(DL, 4.6, 3, 3.78, .66, C.pink, 'ACA', sg),
  ]; })();
  M.school = [
    B(.6, 0, .8, 4.8, 2.8, 3.8, C.fog),
    ...win(DR, 5.4, 1.2, 1.2, .6, .9, C.sky, 1.1, 3),
    DL(4.6, 2.5, 0, 1, 1.7, C.bark),
    RF(.4, 2.8, .6, 5.2, 1.4, 4.4, C.ember, C.fog),
    ...[0, 1, 2, 3].map(i => B(1 + i * 1.15, 0, 4.7, .32, 2.6, .32, C.white)),
    B(.7, 2.6, 4.6, 4.6, .3, .5, C.white), text(DL, 5.1, 3, 2.66, .26, C.ember, 'CCDC'),
    B(5.9, 0, 5.3, .1, 5, .1, C.soft),
    B(6, 4.1, 5.32, 1.3, .8, .06, C.resin, ['sway', 2.6, 0, 6, [6, 4.9, 5.35]]),
  ];
  M.office = [
    B(1, 0, 1, 4, 4.8, 4, C.navy),
    ...[0, 1, 2].flatMap(r => win(DR, 5, 1.4, .8 + r * 1.3, .55, .8, C.sky, 1.05, 3).map((d, i) => (r + i) % 3 === 1 ? { ...d, c: C.resin, a: ['blink', 2.6, r * .4 + i * .3, .4] } : d)),
    ...[0, 1, 2].flatMap(r => win(DL, 5, 1.4, .8 + r * 1.3, .55, .8, C.ice || '#d5e5f4', 1.05, 3)),
    B(.9, 4.8, .9, 4.2, .25, 4.2, shade(C.navy, -.25)),
    B(1.3, 5.05, 4.3, 3.4, .8, .18, C.white), text(DL, 4.48, 3, 5.25, .46, C.navy, 'GARCIA CPA'),
  ];
  M.barn = [
    B(1, 0, 1, 4, 2.6, 4, C.pine2),
    RF(.8, 2.6, .8, 4.4, 1.8, 4.4, C.ember, C.pine2),
    DL(5, 2, 0, 2, 2, C.ember), DL(5, 2.1, .1, 1.8, 1.8, shade(C.ember, -.25)), DL(5, 2.95, .1, .1, 1.8, C.fog), DL(5, 2.1, .95, 1.8, .1, C.fog),
    DR(5, 2.3, 1.4, 1.4, .8, C.fog),
    B(5.4, 0, 2.2, .9, .6, .9, C.wood), B(5.45, .6, 2.3, .8, .25, .7, C.ember), B(5.4, 0, 3.4, .9, .6, .9, C.wood), B(5.45, .6, 3.5, .8, .25, .7, C.leaf),
    B(1.2, 2.2, 5, 3.6, .7, .15, C.cream), text(DL, 5.15, 3, 2.38, .42, C.pine, 'FRESH CROPS'),
  ];
  M.hq = [
    B(1.5, 0, 1.5, 3, 6.6, 3, '#1b1c1e'),
    ...[0, 1, 2, 3].flatMap(r => win(DR, 4.5, 1.9, .9 + r * 1.35, .55, .8, C.resin, .8, 3).map((d, i) => ({ ...d, a: ['blink', 3 + i * .5, r * .7 + i * .4, .3] }))),
    ...[0, 1, 2, 3].flatMap(r => win(DL, 4.5, 1.9, .9 + r * 1.35, .55, .8, '#3a3d40', .8, 3)),
    B(1.4, 6.6, 1.4, 3.2, .2, 3.2, '#2a2c2e'),
    B(2.95, 6.8, 2.95, .1, 1.4, .1, C.soft), S(3, 8.3, 3, .16, C.ember, ['blink', 1.4, 0, .2]),
    text(DL, 4.5, 3, .35, .5, C.resin, 'SALENG'),
  ];
  const pine = (s = 1, x = 0, z = 0, sw = 0) => { const a = ['sway', 3 + sw, sw, 2.5, [x + .55 * s, .8 * s, z + .55 * s]]; return [
    B(x + .4 * s, 0, z + .4 * s, .3 * s, .8 * s, .3 * s, C.bark),
    B(x, .8 * s, z, 1.1 * s, .8 * s, 1.1 * s, C.pine, a), B(x + .15 * s, 1.6 * s, z + .15 * s, .8 * s, .75 * s, .8 * s, C.pine2, a), B(x + .3 * s, 2.35 * s, z + .3 * s, .5 * s, .6 * s, .5 * s, C.pine, a),
  ]; };
  M.pine = pine(1.6);
  M.berries = [
    B(0, 0, 0, 4.4, .3, 3.4, C.soil),
    ...[0, 1, 2].map(i => B(.3, .3, .35 + i * 1, 3.8, .3, .55, C.leaf)),
    ...[0, 1, 2].flatMap(i => [.6, 1.4, 2.2, 3.1, 3.7].map((u, j) => dot(DT, .6, u + (i % 2) * .2, .62 + i * 1, .13, C.ember))),
  ];
  M.jeep = (() => { const go = ['drive', 9, 0, 14]; return [
    B(.4, 0, -.05, .8, .8, .2, C.ink, go), B(3.6, 0, -.05, .8, .8, .2, C.ink, go),
    B(0, .45, 0, 3.8, 1.35, 1.6, '#ece5d3', go), B(3.8, .45, .15, 1.1, .95, 1.3, '#ece5d3', go),
    DL(1.6, .1, .75, 3.6, .14, C.ember, { a: go }), DL(1.6, .1, .95, 3.6, .1, C.pine2, { a: go }),
    ...[0, 1, 2].map(i => DL(1.6, .35 + i * 1.1, 1.15, .8, .5, '#2a3238', { a: go })),
    B(-.1, 1.8, -.05, 4, .2, 1.7, C.resin, go), text(DL, 1.65, 1.9, 1.84, .16, C.ink, 'LA TRINIDAD', go),
    DR(4.9, .3, .6, .7, .35, '#9aa0a6', { a: go }), B(4.3, 1.4, .7, .25, .35, .2, C.gold, go),
    B(.4, 0, 1.45, .8, .8, .25, C.ink, go), B(3.6, 0, 1.45, .8, .8, .25, C.ink, go),
  ]; })();

  // ── how we build ──
  M.visit = [
    B(0, 0, 0, 6, .3, 6, C.grass), DT(.3, 0, 2.4, 6, 1.2, C.road), ...[0, 1, 2].map(i => DT(.3, .5 + i * 2, 2.95, 1, .1, C.fog)),
    ...pine(1, .4, .4), ...pine(.8, 4.4, .6, .5),
    B(1.2, .3, 4, 2.4, 1.6, 1.6, C.fog), B(1, 1.9, 3.8, 2.8, .3, 2, C.ember), DL(5.6, 2.1, .3, .6, 1, C.pine),
    Cy(4.8, .3, 4.8, .35, .04, '#86a56f'), ...(() => { const b = ['bob', 1.6, 0, .4]; return [B(4.7, 2.1, 4.7, .2, .9, .2, C.ember, b), S(4.8, 3.2, 4.8, .55, C.ember, b)]; })(),
  ];
  M.blocks = [
    B(0, 0, 0, 6, .3, 6, C.pine),
    B(.8, .3, .8, 2, 2, 2, C.resin), B(3.2, .3, .8, 2, 2, 2, C.fog), B(.8, .3, 3.2, 2, 2, 2, C.ember),
    B(1.4, 2.3, 1.4, 2, 2, 2, C.sky, ['drop', 2.6, 0, 3]),
    B(3.4, .3, 3.4, 1.6, 1.6, 1.6, C.leaf, ['drop', 2.6, 1.3, 3]),
  ];
  M.support = (() => { const b1 = ['bob', 2.2, 0, .3], b2 = ['bob', 2.2, .7, .3]; return [
    B(0, 0, 0, 6, .3, 6, C.pine2),
    B(1.4, .3, 2.2, 2.2, 4.2, .3, C.ink), DL(2.5, 1.55, .5, 1.9, 3.8, '#e9efe9'),
    DL(2.5, 1.7, 3.3, 1.2, .5, C.pine2), DL(2.5, 2.2, 2.6, 1.1, .5, C.resin), DL(2.5, 1.7, 1.9, 1.3, .5, C.pine2),
    B(3.9, 3.7, 3, 1.8, .9, .2, C.white, b1), ...[0, 1, 2].map(i => dot(DL, 3.2, 4.3 + i * .5, 4.15, .12, C.pine, b1)),
    B(3.6, 1.6, 4, 1.2, 1.2, .3, C.ember, b2),
  ]; })();

  // ── pricing: Spark, Flame, Bonfire ──
  const fire = (n) => {
    const out = [];
    const L = n === 1 ? 2.4 : n === 2 ? 3.2 : 4.2, o = (6 - L) / 2;
    if (n === 3) [[.4, .4], [2.6, .1], [4.8, .4], [5.2, 2.6], [4.8, 4.8], [2.6, 5.1], [.4, 4.8], [.1, 2.6]].forEach(([x, z]) => out.push(B(x, 0, z, .8, .45, .8, C.soft)));
    out.push(B(o, 0, 2.6, L, .55, .7, C.wood), B(2.65, .55, o, .7, .55, L, C.bark));
    if (n > 1) out.push(B(o + .3, 1.1, 2.0, L - .6, .5, .6, C.wood), B(3.1, 1.1, o + .3, .6, .5, L - .6, C.bark));
    const base = n === 1 ? 1.1 : 1.6, s = n === 1 ? .7 : n === 2 ? 1 : 1.35;
    const fl = (d) => ['flick', .9 + d * .2, d * .15, .18, [3, base, 3]];
    out.push(B(3 - .9 * s, base, 3 - .9 * s, 1.8 * s, 1.1 * s, 1.8 * s, C.ember, fl(0)));
    out.push(B(3 - .6 * s, base + 1.1 * s, 3 - .6 * s, 1.2 * s, 1 * s, 1.2 * s, C.flame, fl(1)));
    out.push(B(3 - .3 * s, base + 2.1 * s, 3 - .3 * s, .6 * s, .8 * s, .6 * s, C.resin, fl(2)));
    if (n === 3) [0, .7, 1.4].forEach((d, i) => out.push(B(2.4 + i * .5, base + 3.4, 2.8 - i * .3, .18, .18, .18, C.resin, ['rise', 2.1, d, 3])));
    return out;
  };
  M.spark = fire(1); M.flame = fire(2); M.bonfire = fire(3);

  // ── people (same figures as the live testimonials) ──
  const R = (u, v, w, h, c, a) => ({ t: 'dec', X: 1.6, u, v, w, h, c, a });
  const T2 = (u, v, w, h, c) => ({ t: 'dec', X: 1.4, u, v, w, h, c });
  const Ls = (u, v, w, h, c, Z = 1.9) => ({ t: 'dec', f: 'L', Z, u, v, w, h, c });
  const LID = d => ['lid', 4 + d, 0];
  const body = (shirt, skin) => [B(.1, 0, 0, 1.2, 1.7, .34, shade(shirt, -.08)), B(0, 0, .3, 1.4, 1.9, 1.8, shirt), B(.1, 0, 2.1, 1.2, 1.7, .36, shade(shirt, -.08)), B(.55, 1.9, .9, .6, .3, .6, skin)];
  const head = sk => [B(.2, 2.1, .5, 1.4, 1.6, 1.4, sk)];
  const eyes = (sk, d, iris = C.ink) => { const l = LID(d); return [R(.74, 2.8, .24, .3, iris), R(1.42, 2.8, .24, .3, iris), R(.82, 2.98, .08, .08, C.fog), R(1.5, 2.98, .08, .08, C.fog), R(.7, 2.78, .32, .34, sk, l), R(1.38, 2.78, .32, .34, sk, l)]; };
  const smile = (c, sk) => [R(1.0, 2.36, .6, .12, c), R(.9, 2.44, .12, .1, c), R(1.58, 2.44, .12, .1, c), R(.55, 2.5, .22, .14, shade(sk, -.12)), R(1.63, 2.5, .22, .14, shade(sk, -.12))];
  M.rena = (() => { const sk = '#d9a273', h = '#1c120b'; return [
    B(-.15, 1.5, .4, .8, 2.3, 1.6, h), ...body(C.fog, sk),
    T2(.95, .7, .7, 1.2, '#2e9c94'), T2(.85, 1.1, .1, .8, C.soft), T2(1.6, 1.1, .1, .8, C.soft),
    T2(.75, .5, .08, 1.3, C.ink), T2(1.7, .5, .08, 1.3, C.ink), { t: 'dec', X: 1.4, u: 1.25, v: .45, r: .14, c: '#9aa3a8' },
    T2(.35, 1.1, .1, .4, C.ember), T2(.28, 1.05, .45, .06, C.soft),
    ...head(sk), ...eyes(sk, 0), ...smile('#a8344a', sk),
    R(.6, 2.72, .54, .46, C.ink), R(.66, 2.78, .42, .34, '#cfe8f2'), R(.76, 2.82, .2, .24, C.ink),
    R(1.28, 2.72, .54, .46, C.ink), R(1.34, 2.78, .42, .34, '#cfe8f2'), R(1.44, 2.82, .2, .24, C.ink), R(1.14, 2.98, .14, .07, C.ink),
    R(.5, 3.3, 1.4, .4, h), R(.5, 3.05, .25, .35, h), R(1.55, 3.15, .35, .25, h),
    B(.15, 3.7, .45, 1.5, .3, 1.5, h), B(.1, 1.5, 1.9, .9, 2.3, .2, h),
  ]; })();
  M.aca = (() => { const sk = '#c98b5a', h = '#2a1a0e', tail = ['swayS', 1.8, 0, 7, [-1.13, -2.35]]; return [
    B(-.75, 2.55, 1, .7, .5, .4, h, tail), B(-.5, 1.8, 1.02, .4, .9, .36, h, tail),
    B(-.1, 2.8, .95, .25, .55, .5, C.resin), ...body(C.pink, sk),
    T2(.5, 0, 1.4, 1.3, C.fog), T2(.6, 1.3, .14, .6, C.fog), T2(1.66, 1.3, .14, .6, C.fog), T2(.9, .35, .6, .4, C.soft),
    ...head(sk), ...eyes(sk, .7), ...smile('#8e2b2b', sk),
    R(.5, 3.3, 1.4, .4, h), R(.5, 3.1, .2, .3, h), R(1.7, 3.1, .2, .3, h),
    B(.15, 3.7, .45, 1.5, .3, 1.5, h), B(.1, 2.6, 1.9, .95, 1.4, .14, h), Ls(1.1, 2.55, .12, .14, C.resin, 2.04),
  ]; })();
  M.garcia = (() => { const sk = '#e0ac7e', h = '#22150c', nv = C.navy; return [
    ...body(nv, sk),
    T2(.95, .6, .7, 1.3, C.fog), T2(.85, 1.2, .14, .7, shade(nv, -.2)), T2(1.6, 1.2, .14, .7, shade(nv, -.2)), T2(1.2, .8, .2, .1, C.resin), T2(.35, .9, .35, .25, C.resin),
    ...head(sk), ...eyes(sk, 1.4, '#3a2414'), ...smile(C.ember, sk),
    R(.68, 3.22, .34, .07, h), R(1.36, 3.22, .34, .07, h), R(.5, 3.45, 1.4, .25, h),
    B(.15, 3.7, .45, 1.5, .25, 1.5, h), B(.1, 2.7, 1.9, .7, 1.25, .14, h), B(.35, 3.95, .85, .75, .55, .7, h),
    B(.75, 3.25, 1.96, .9, .1, .1, C.resin), Ls(1.1, 2.5, .12, .18, C.resin, 2.04),
  ]; })();
  M.farmer = (() => { const sk = '#a86a3c', st = '#e3bf73', ln = '#2b4f7a'; return [
    ...body('#3d6fa8', sk),
    ...[.5, .9, 1.3, 1.7, 2.0].map(u => T2(u, 0, .07, 1.9, ln)), ...[.4, .9, 1.4].map(v => T2(.3, v, 1.8, .07, ln)), T2(.45, 1.1, .5, .4, ln),
    B(.3, 1.75, .55, 1.2, .4, 1.3, C.fog),
    ...head(sk), ...eyes(sk, 2.1), ...smile('#5a1f14', sk),
    R(.7, 3.15, .34, .08, '#1a0f08'), R(1.38, 3.15, .34, .08, '#1a0f08'), R(.5, 3.5, 1.4, .2, '#1a0f08'),
    B(.15, 3.7, .45, 1.5, .12, 1.5, '#1a0f08'), B(-.3, 3.82, 0, 2.4, .12, 2.4, st), B(.25, 3.94, .55, 1.3, .55, 1.3, st),
    { t: 'dec', X: 1.55, u: .55, v: 3.94, w: 1.3, h: .16, c: C.ember }, Ls(.25, 3.94, 1.3, .16, C.ember, 1.85),
  ]; })();
  // a builder from Saleng: hoodie, laptop under the arm
  M.builder = (() => { const sk = '#c08552', h = '#15100b', hd = C.pine; return [
    B(.2, 1.9, .4, 1.4, .6, 1.6, shade(hd, -.1)),
    ...body(hd, sk), T2(1.1, 1.0, .07, .8, C.fog), T2(1.4, 1.0, .07, .8, C.fog), T2(.7, .2, 1.2, .5, shade(hd, -.15)),
    ...head(sk), ...eyes(sk, 1), ...smile('#7a2a1a', sk),
    R(.5, 3.4, 1.4, .3, h), R(1.45, 3.1, .45, .35, h), B(.15, 3.7, .45, 1.5, .35, 1.5, h), B(.1, 2.9, 1.9, .9, .9, .14, h),
    B(1.0, .3, 2.3, 1.1, 1.3, .2, C.steel), dot(DL, 2.5, 1.55, 1.0, .14, C.fog),
  ]; })();

  ISO.at = (model, dx = 0, dy = 0, dz = 0) => {
    const memo = new Map();
    const shiftA = a => { if (!a || !a[4] || a[0] === 'swayS') return a; if (!memo.has(a)) { const n = a.slice(); n[4] = [a[4][0] + dx, a[4][1] + dy, a[4][2] + dz]; memo.set(a, n); } return memo.get(a); };
    return (typeof model === 'string' ? M[model] : model).map(q => {
      const n = { ...q, a: shiftA(q.a) };
      if (q.p) n.p = [q.p[0] + dx, q.p[1] + dy, q.p[2] + dz];
      if (q.t === 'dec') { const f = q.f || 'R'; if (f === 'L') { n.Z = q.Z + dz; n.u = q.u + dx; n.v = q.v + dy; if (q.spin) n.spin = [q.spin[0] + dx, q.spin[1] + dy, q.spin[2]]; } else if (f === 'R') { n.X = q.X + dx; n.u = q.u + dz; n.v = q.v + dy; } else { n.Y = q.Y + dy; n.u = q.u + dx; n.v = q.v + dz; } }
      return n;
    });
  };
  // ── gadgets on their own (no desk), real screens ──
  M.g_pc = [
    B(1.6, 0, 1.1, 1.6, .1, 1.1, C.dark), B(2.2, .1, 1.35, .4, 1.1, .3, C.dark),
    B(0, 1.0, 1.65, 4.8, 3.0, .22, C.ink), DL(1.87, .12, 1.12, 4.56, 2.76, null, { img: 'coop-dash.webp' }),
    B(.8, 0, 2.6, 3.2, .12, .9, '#3a3f45'),
    B(5.4, 0, .6, 1.5, 3.4, 2.6, '#121416'), DR(6.9, .3, .5, 2, 2.5, '#16382a'),
    dot(DR, 6.9, 1.3, 2.3, .45, C.glow, ['blink', 1.8, 0, .4]), dot(DR, 6.9, 1.3, 1.2, .45, C.glow, ['blink', 1.8, .6, .4]),
  ];
  M.g_laptop = [
    B(0, .18, .8, 4.6, 3, .18, C.steel), DL(.98, .15, .33, 4.3, 2.72, null, { img: 'docgen.webp' }),
    B(0, 0, 1.0, 4.6, .18, 3, C.steel), DT(.18, .4, 1.5, 3.8, 1.5, '#8d939a'), DT(.18, 1.7, 3.2, 1.2, .5, '#b5b9be'),
  ];
  M.g_tab = (() => { const pa = ['bob', 2.6, 0, .3]; return [
    B(1, 0, 1, 1.4, .12, 1.2, '#9aa0a6'), B(1.5, .12, 1.2, .4, 1.1, .3, '#9aa0a6'),
    B(0, 1.0, 1.5, 3.6, 2.4, .16, C.ink), DL(1.66, .14, 1.14, 3.32, 2.12, null, { img: 'pos.webp' }),
    B(4.1, 0, 1.3, 1.3, .75, 1.1, C.fog), DT(.75, 4.3, 1.5, .9, .12, C.ink),
    B(4.4, .62, 1.55, .7, 1.1, .04, C.white, pa), DL(1.59, 4.5, 1.4, .45, .05, '#999', { a: pa }), DL(1.59, 4.5, 1.2, .3, .05, '#999', { a: pa }),
  ]; })();
  M.g_phone = [
    B(0, 0, 0, 1.7, .3, 1.5, C.dark),
    B(.25, .3, .55, 1.2, 2.5, .14, C.ink), DL(.69, .33, .42, 1.04, 2.3, null, { img: 'pos-phone.webp' }),
  ];
  M.g_kiosk = M.kiosk.slice(0, 5);

  // ── a snack counter at night, for the receipt hero ──
  M.store = (() => {
    const out = [B(-6, -.3, -4, 24, .3, 14, '#2b231c'), B(-6, 0, -4, 24, 7, .6, '#3a2f25')];
    const cols = [C.ember, C.resin, C.pink, C.sky, C.leaf, C.fog, C.flame];
    for (let r = 0; r < 3; r++) {
      out.push(B(-5, 1 + r * 1.9, -3.4, 22, .18, 1.2, C.wood));
      for (let i = 0; i < 18; i++) out.push(B(-4.8 + i * 1.2, 1.18 + r * 1.9, -3.2, .9, 1.1 - (i % 3) * .15, .8, cols[(i * 3 + r * 2) % cols.length]));
    }
    out.push(B(5.2, 4.6, 2.4, .06, 2.4, .06, '#222'), S(5.23, 4.4, 2.43, .45, '#ffd98a', ['blink', 4, 0, .75]));
    return [...out, ...ISO.at(M.pos, 2, 0, 3)];
  })();

  // ── the La Trinidad valley: terraces of strawberries, greenhouses, pines, ridges ──
  M.valley = (() => {
    const out = [];
    const ridge = [[-12, -20, 22, 2.6, '#8fa886'], [8, -20, 20, 3.2, '#839e7b'], [20, -14, 10, 2.4, '#97ae8e']];
    ridge.forEach(([x, z, w, h, c]) => { for (let s = 0; s < 3; s++) out.push(B(x + s * 1.6, 0, z + s * 1.2, w - s * 3.2, h * (s + 1) / 3, 6 - s * 1.6, shade(c, -s * .05))); });
    for (let i = 0; i < 14; i++) out.push(...pine(1 + (i % 3) * .35, -11 + i * 2.1 + (i % 2) * .6, -9.5 + (i % 3) * .9, i * .3));
    const rows = 7;
    for (let k = 0; k < rows; k++) {
      const z = -6 + k * 2.4, h = (rows - k) * .75, x0 = -8 + (k % 3) * .8, w = 30 - (k % 2) * 2;
      out.push(B(x0, 0, z, w, h, 2.4, k % 2 ? '#7a5a36' : '#6e5030'));
      if (k === 2 || k === 5) { out.push(RF(x0 + 3, h, z + .3, 7, 1.1, 1.8, '#e8ece6', '#d9ded6'), RF(x0 + 11, h, z + .3, 5, 1.1, 1.8, '#e8ece6', '#d9ded6')); out.push(B(x0 + 18, h, z + .4, .2, .25, 1.6, C.leaf)); }
      else {
        out.push(B(x0 + .4, h, z + .35, w - .8, .28, .55, C.leaf), B(x0 + .4, h, z + 1.25, w - .8, .28, .55, C.pine2));
        for (let j = 0; j < 22; j++) out.push(dot(DT, h + .3, x0 + 1 + j * 1.3 + (k % 2) * .5, z + .62 + (j % 2) * .9, .13, C.ember));
      }
      if (k === 1) out.push(B(x0 + 22, h, z + .3, 1.8, 1.2, 1.6, C.fog), B(x0 + 21.9, h + 1.2, z + .2, 2, .25, 1.8, '#3d6fa8'));
      if (k === 3) out.push(B(x0 + 1, h, z + .3, 1.6, 1.1, 1.5, C.fog), B(x0 + .9, h + 1.1, z + .2, 1.8, .25, 1.7, C.ember));
      if (k === 4) out.push(...ISO.at(pine(1.2, 0, 0, .4), x0 + 26, h, z + .4));
    }
    return out;
  })();

  // ── saleng: a bundle of resin-rich pine sticks, the wood that starts the fire ──
  M.saleng = (() => {
    const out = [B(-1.5, -.3, -1.5, 8.6, .3, 8.6, '#3d4a50')];
    out.push(B(-1, 0, 4.4, 6, .5, .5, '#b5733a'), B(4.6, 0, -.6, .5, .45, 5.8, '#a8672f'));
    const wood = ['#c98a4a', '#b8783c', '#d49a58'];
    const sticks = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) sticks.push([.4 + i * 1.15, .4 + j * 1.15, 6.4 + ((i * 2 + j) % 3) * .45, wood[(i + j) % 3]]);
    sticks.sort((a, b) => a[0] + a[1] - b[0] - b[1]).forEach(([x, z, h, c]) => {
      out.push(B(x, 0, z, 1, h, 1, c), DL(z + 1, x + .2, 1 + (x * 7 % 3), .14, 2.2, '#9a5420'), DR(x + 1, z + .5, 2 + (z * 5 % 2), .12, 1.6, '#9a5420'));
    });
    [2.2, 4.4].forEach(v => out.push(DL(3.7, .4, v, 3.3, .3, C.ember), DR(3.7, .4, v, 3.3, .3, C.ember)));
    out.push(S(3.95, 3.3, 3.2, .16, C.resin), S(2.8, 1.6, 3.95, .14, C.resin));
    const fl = d => ['flick', .9 + d * .2, d * .15, .2, [2.15, 7.3, 2.15]];
    out.push(B(1.15, 7.3, 1.15, 2, 1.3, 2, C.ember, fl(0)), B(1.5, 8.6, 1.5, 1.3, 1.1, 1.3, C.flame, fl(1)), B(1.85, 9.7, 1.85, .6, .9, .6, C.resin, fl(2)));
    [0, .8, 1.6].forEach((d, i) => out.push(B(1.6 + i * .5, 10.4, 2.2 - i * .3, .2, .2, .2, C.resin, ['rise', 2.2, d, 3.4])));
    return out;
  })();

  // ── a town block for heroes ──
  // a scene: [[model, x, y, z, key?], ...] drawn back to front by where each model stands
  ISO.scene = (list, sort = true) => { const r = list.map(([m, x = 0, y = 0, z = 0, k]) => ({ k, parts: ISO.at(m, x, y, z), d: x + z + y * .01 })); return sort ? r.sort((a, b) => a.d - b.d) : r; };
  // listed back to front by hand (rows), so the jeepney passes in front of the back row and behind the front row
  M.town = ISO.scene([
    [[B(-2, -.6, -2, 31, .6, 23, C.grass), B(-2, -.02, 7.4, 31, .04, 3, C.road), ...Array.from({ length: 10 }, (_, i) => DT(.03, -1 + i * 3.1, 8.8, 1.4, .14, C.fog))]],
    ['shop', 0, 0, 0, 'pos'], ['laundry', 7, 0, 0, 'kiosk'], ['school', 14, 0, 0, 'doc'], ['pine', 21.5, 0, 1.5], [pine(1), 20.8, 0, 4.3], [pine(1.2), 23.5, 0, 3.6],
    ['jeep', 10, 0, 7.9],
    ['office', 0, 0, 11, 'track'], ['barn', 7, 0, 11, 'coop'], ['hq', 14, 0, 11, 'vo'], ['berries', 21, 0, 12.3], [pine(1.3), 25.2, 0, 11.4], [pine(1), -1.6, 0, 18.6],
  ], false);

  // ── render ──
  // opts: cls, build (blocks drop into place), bob (whole model floats), pad
  ISO.svg = (model, o = {}) => {
    const src = typeof model === 'string' ? M[model] : model;
    const inst = src[0] && src[0].parts ? src : [{ parts: src }];
    bb = [1e9, 1e9, -1e9, -1e9];
    let out = '', i = 0;
    for (const it of inst) {
      let run = '', a = null, body = '';
      const flush = () => { if (run) body += a ? loop(run, a) : run; run = ''; };
      for (const q of it.parts) {
        if (q.a !== a) { flush(); a = q.a || null; }
        const s = part(q);
        run += o.build ? `<g class="vx" style="--i:${q.t === 'dec' ? Math.max(0, i - 1) : i++}">${s}</g>` : s;
      }
      flush();
      out += it.k ? `<g class="hot" data-k="${it.k}" tabindex="0" role="button" aria-label="${it.k}">${body}</g>` : body;
    }
    const p = o.pad ?? .6, [x0, y0, x1, y1] = bb; bb = null;
    const vb = [x0 - p, y0 - p - (o.bob ? .3 : 0), x1 - x0 + 2 * p, y1 - y0 + 2 * p + (o.bob ? .3 : 0)].map(f2);
    if (o.bob) out = `<g>${out}<animateTransform attributeName="transform" type="translate" values="0 0;0 -.14;0 0" dur="${o.bob}s" repeatCount="indefinite"/></g>`;
    return `<svg class="iso3 ${o.cls || ''}${o.build ? ' build' : ''}" viewBox="${vb.join(' ')}" style="--d:${f2(vb[3] * .5)}" aria-hidden="true" focusable="false">${out}</svg>`;
  };
  ISO.M = M;

  // fill every [data-iso="name"]; data-build = assemble when it scrolls in; data-bob = float
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  ISO.mount = (root = document) => root.querySelectorAll('[data-iso]').forEach(el => {
    el.innerHTML = ISO.svg(el.dataset.iso, { build: 'build' in el.dataset && !RM, bob: el.dataset.bob ? +el.dataset.bob : 0, cls: el.dataset.cls });
    const svg = el.firstElementChild;
    if (RM) { svg.pauseAnimations(); return; }
    if (!('IntersectionObserver' in window)) { svg.classList.add('in'); return; }
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { svg.unpauseAnimations(); svg.classList.add('in'); } else { svg.pauseAnimations(); if ('rebuild' in el.dataset) svg.classList.remove('in'); }
    }), { threshold: .25 }).observe(svg);
  });
  window.ISO = ISO;
})();
