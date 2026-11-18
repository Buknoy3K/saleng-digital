// Saleng Digital: shared header, footer, growth rings and small interactions.
// The header and footer are written here once, so a menu change is one edit.
(() => {
  const C = window.CONTENT || {};
  const root = document.body.dataset.root || '';
  const page = document.body.dataset.page || '';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // One long home page: each menu item scrolls to its section (case pages link back into it).
  const pages = [['home', 'Home', 'index.html#top'], ['services', 'Services', 'index.html#services'], ['work', 'Work', 'index.html#work'], ['pricing', 'Pricing', 'index.html#pricing'], ['about', 'About', 'index.html#about'], ['contact', 'Contact', 'index.html#contact']];
  const cur = id => id === page ? ' aria-current="page"' : '';
  const contact = `${root}index.html#contact`;
  document.querySelectorAll('i[data-arrow]').forEach(i => i.outerHTML = arrow);

  // ── header + mobile menu ──
  const head = document.createElement('header');
  head.className = 'top wrap';
  head.innerHTML = `<div class="in nav">
      <a class="wm" href="${root}index.html" aria-label="Saleng Digital home">saleng<b>*</b>digital</a>
      <nav class="links" aria-label="Main">${pages.map(([id, n, h]) => `<a href="${root}${h}"${cur(id)}>${n}</a>`).join('')}</nav>
      <a class="btn" href="${contact}">Book a free audit</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 6h16M2 14h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
    </div>`;
  const menu = document.createElement('div');
  menu.className = 'menu'; menu.id = 'menu';
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-label', 'Menu');
  menu.innerHTML = `<div class="menu-top"><span class="wm">saleng<b>*</b>digital</span>
      <button class="burger" style="display:grid" aria-label="Close menu"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4l12 12M16 4 4 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>
    <nav aria-label="Menu">${pages.map(([id, n, h], i) => `<a href="${root}${h}"${cur(id)}>${n}<span>0${i + 1}</span></a>`).join('')}</nav>
    <a class="btn" href="${contact}">Book a free audit ${arrow}</a>`;
  document.body.prepend(menu);
  document.body.prepend(head);
  const skip = document.createElement('a');
  skip.className = 'skip'; skip.href = '#main'; skip.textContent = 'Skip to content';
  document.body.prepend(skip);

  const openBtn = head.querySelector('.burger'), closeBtn = menu.querySelector('.burger');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    openBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? closeBtn : openBtn).focus();
  };
  openBtn.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => setMenu(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); openBtn.setAttribute('aria-expanded', false); document.body.style.overflow = ''; }));

  // ── on the home page, highlight the section you're reading ──
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  if (chapters.length) {
    const mark = id => document.querySelectorAll('.links a, .menu nav a').forEach(a => {
      if (a.hash === '#' + id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const spy = () => {
      const line = innerHeight * .35;
      let id = 'top';
      chapters.forEach(c => { if (c.getBoundingClientRect().top < line) id = c.id; });
      mark(id);
    };
    addEventListener('scroll', spy, { passive: true }); spy();
  }

  // ── footer ──
  const panelIn = document.querySelector('.panel .in');
  if (panelIn) {
    const foot = document.createElement('footer');
    foot.className = 'foot';
    foot.innerHTML = `<div><a class="wm" href="${root}index.html">saleng<b>*</b>digital</a>
        <p style="margin-top:12px;max-width:34ch">Simple systems for the businesses and offices of La Trinidad and Baguio. Built here. Priced for here. Supported here.</p></div>
      <div><h4>Sections</h4><ul>${pages.slice(0, 3).map(([, n, h]) => `<li><a href="${root}${h}">${n}</a></li>`).join('')}</ul></div>
      <div><h4>&nbsp;</h4><ul>${pages.slice(3).map(([, n, h]) => `<li><a href="${root}${h}">${n}</a></li>`).join('')}</ul></div>
      <div><h4>Call us</h4><ul><li><span data-c="phone"></span></li><li><a data-mail data-c="email" href="#"></a></li><li>La Trinidad &amp; Baguio, Benguet</li></ul></div>
      <div class="foot-base"><span>© ${new Date().getFullYear()} Saleng Digital</span><span>Limitless La Trinidad</span></div>`;
    panelIn.append(foot);
  }

  // ── content.js values ──
  document.querySelectorAll('[data-c]').forEach(el => {
    const v = C[el.dataset.c];
    if (v == null) return;
    el.textContent = v;
    if (String(v).includes('___')) el.classList.add('todo');
  });
  // tap-to-call links only once the number is real
  document.querySelectorAll('[data-tel]').forEach(a => {
    if (!C.phone || C.phone.includes('___')) { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); return; }
    a.href = 'tel:' + C.phone.replace(/[^\d+]/g, '');
  });
  // email links (a convenience: some browsers can't follow mailto, so the address is always shown and copyable)
  document.querySelectorAll('[data-mail]').forEach(a => {
    if (!C.email || C.email.includes('___')) { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); return; }
    a.href = 'mailto:' + C.email;
  });
  document.querySelectorAll('[data-copy]').forEach(b => {
    const key = b.dataset.copy || 'phone';
    const out = b.parentElement.querySelector('.copied');
    b.addEventListener('click', () => {
      const done = () => { if (out) { out.textContent = 'Copied'; setTimeout(() => out.textContent = '', 2200); } };
      const pick = () => { const n = document.querySelector(`[data-c="${key}"]`); if (!n) return; const r = document.createRange(); r.selectNodeContents(n); const s = getSelection(); s.removeAllRanges(); s.addRange(r); if (out) out.textContent = 'Selected, press copy'; };
      if (navigator.clipboard) navigator.clipboard.writeText(C[key] || '').then(done, pick); else pick();
    });
  });

  // ── clock in La Trinidad (Asia/Manila) ──
  const tick = () => { const t = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila' }); document.querySelectorAll('[data-clock]').forEach(e => e.textContent = t); };
  tick(); setInterval(tick, 15000);

  // ── header turns dark once it's over the dark panel ──
  const panel = document.querySelector('.panel');
  const onScroll = () => { if (panel) head.classList.toggle('dark', panel.getBoundingClientRect().top < head.offsetHeight); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ── fit the giant word to the width ──
  function fit() {
    document.querySelectorAll('[data-fit]').forEach(el => {
      el.style.fontSize = '100px';
      const avail = el.parentElement.clientWidth;
      const word = el.firstElementChild || el; // the inline-block word, not the full-width line
      let px = 100 * avail / word.offsetWidth * .99;
      // inner pages: keep short words from swallowing the first screen
      if (el.closest('.hero.small')) px = Math.min(px, innerHeight * .34);
      if (el.closest('.chapter')) px = Math.min(px, innerHeight * .3);
      el.style.fontSize = px + 'px';
    });
  }

  // ── growth rings on the amber hero ──
  const hero = document.querySelector('.hero'), cv = hero && hero.querySelector('canvas');
  let raf = 0, W = 0, H = 0, ctx;
  const m = { x: +(hero && hero.dataset.cx || .32), y: +(hero && hero.dataset.cy || .62) }; m.tx = m.x; m.ty = m.y;
  function size() {
    if (!cv) return;
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.max(1, W * d); cv.height = Math.max(1, H * d);
    ctx = cv.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    m.x += (m.tx - m.x) * .05; m.y += (m.ty - m.y) * .05;
    const cx = W * m.x, cy = H * m.y, n = 46, sp = Math.max(W, H) / 34, ts = t * .00035;
    for (let i = 1; i <= n; i++) {
      const base = i * sp * (1 + .015 * Math.sin(i * 1.7));
      ctx.beginPath();
      for (let k = 0; k <= 160; k++) {
        const a = k / 160 * 6.2832;
        const r = base * (1 + .05 * Math.sin(3 * a + i * .21 + ts) + .03 * Math.sin(5 * a - i * .13 - ts * 1.3)) + 5 * Math.sin(9 * a + i);
        const x = cx + Math.cos(a) * r * 1.25, y = cy + Math.sin(a) * r;
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      const late = i % 3 === 0;
      ctx.strokeStyle = late ? 'rgba(90,58,28,.42)' : 'rgba(138,90,43,.24)';
      ctx.lineWidth = late ? 2.2 : 1;
      ctx.stroke();
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sp * 3);
    g.addColorStop(0, 'rgba(209,42,56,.32)'); g.addColorStop(1, 'rgba(209,42,56,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, sp * 3, 0, 6.283); ctx.fill();
  }
  let visible = true;
  const loop = t => { draw(t); if (!RM && visible && !document.hidden) raf = requestAnimationFrame(loop); };
  const start = () => { cancelAnimationFrame(raf); if (!cv) return; size(); if (RM) draw(4000); else raf = requestAnimationFrame(loop); };
  if (hero) {
    const bx = +(hero.dataset.cx || .32), by = +(hero.dataset.cy || .62);
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); m.tx = bx + ((e.clientX - r.left) / r.width - .5) * .5; m.ty = by + ((e.clientY - r.top) / r.height - .5) * .4; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else cancelAnimationFrame(raf); }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { fit(); start(); }, 120); });
  fit(); start();
  if (document.fonts) document.fonts.ready.then(fit);

  // ── pricing rows open on tap too ──
  document.querySelectorAll('.pk').forEach(pk => pk.addEventListener('click', () => pk.classList.toggle('open')));

  // ── phone: work rows and pricing cards line up one by one as you scroll ──
  if (!RM && matchMedia('(hover: none), (max-width: 760px)').matches && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('.rows .row, .stack .pk');
    items.forEach(el => el.classList.add('lineup'));
    const io = new IntersectionObserver(es => {
      es.filter(e => e.isIntersecting).forEach((e, i) => {
        e.target.style.transitionDelay = (i * 140) + 'ms';
        e.target.classList.add('in'); io.unobserve(e.target);
      });
    }, { threshold: .2, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
    // the item nearest the middle of the screen lights up, like hover on a computer
    const lightable = [...document.querySelectorAll('a.row, .stack .pk')];
    let tick = false;
    const light = () => {
      tick = false;
      const mid = innerHeight / 2; let best = null, bd = innerHeight * .3;
      lightable.forEach(el => { const r = el.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid); if (d < bd) { bd = d; best = el; } });
      lightable.forEach(el => el.classList.toggle('lit', el === best));
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(light); } }, { passive: true });
    light();
  }

  // ── work rows: screenshot follows the cursor ──
  const rows = document.querySelectorAll('.row[data-peek]');
  if (rows.length && matchMedia('(hover: hover)').matches) {
    const peek = document.createElement('div'); peek.className = 'peek'; peek.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img'); img.alt = ''; peek.append(img); document.body.append(peek);
    let px = 0, py = 0, tx = 0, ty = 0, on = false;
    const follow = () => { px += (tx - px) * .18; py += (ty - py) * .18; peek.style.left = px + 'px'; peek.style.top = py + 'px'; if (on) requestAnimationFrame(follow); };
    rows.forEach(r => {
      r.addEventListener('pointerenter', e => { img.src = r.dataset.peek; tx = px = e.clientX; ty = py = e.clientY; on = true; peek.classList.add('on'); requestAnimationFrame(follow); });
      r.addEventListener('pointermove', e => { tx = e.clientX + 40; ty = e.clientY; });
      r.addEventListener('pointerleave', () => { on = false; peek.classList.remove('on'); });
    });
  }

  // ── services: character-select stage. Scrolling down turns the ring of devices ──
  const pin = document.querySelector('.cs-pin');
  if (pin) {
    const stick = pin.querySelector('.cs-stick'), stage = pin.querySelector('.cs-stage');
    const items = [...pin.querySelectorAll('.cs-item')], n = items.length;
    const nameA = pin.querySelector('.cs-name'), nameS = nameA.querySelector('span'), count = pin.querySelector('.cs-count');
    const dots = [...pin.querySelectorAll('.cs-dots button')];
    let range = 1, target = 0, pos = 0, active = -1, running = false;
    const stickTop = () => parseFloat(getComputedStyle(stick).top) || 0;
    const size = () => { range = Math.round(innerHeight * .7) * (n - 1); pin.style.height = (stick.offsetHeight + range) + 'px'; };
    // scroll -> ring position; each device rests a moment in front before the ring turns on
    const read = () => {
      const p = Math.min(1, Math.max(0, (stickTop() - pin.getBoundingClientRect().top) / range));
      const raw = p * (n - 1), i = Math.floor(raw), f = raw - i, g = Math.min(1, Math.max(0, (f - .2) / .6));
      target = Math.min(n - 1, i + g * g * (3 - 2 * g));
    };
    const draw = () => {
      const W = items[0].offsetWidth, R = W * (innerWidth <= 760 ? .8 : .85);
      items.forEach((el, i) => {
        let d = i - pos; d = ((d % n) + n * 1.5) % n - n / 2;
        const t = d * 2 * Math.PI / n, c = Math.cos(t), k = (c + 1) / 2;
        el.style.transform = `translate3d(${Math.sin(t) * R}px, 0, ${(c - 1) * R * 1.15}px) rotateY(${t * 28}deg)`;
        el.style.zIndex = Math.round(k * 100);
        el.style.opacity = (.25 + .75 * k * k).toFixed(3);
        el.firstElementChild.style.filter = `brightness(${(.35 + .65 * k).toFixed(3)})`;
      });
      const a = Math.round(pos) % n;
      if (a !== active) {
        active = a;
        items.forEach((el, i) => { el.classList.toggle('is-mid', i === a); el.tabIndex = i === a ? 0 : -1; });
        nameA.href = items[a].getAttribute('href');
        nameS.textContent = items[a].dataset.name;
        nameS.style.animation = 'none'; void nameS.offsetWidth; nameS.style.animation = '';
        count.textContent = `0${a + 1} / 0${n}`;
        dots.forEach((b, i) => b.setAttribute('aria-current', i === a));
      }
    };
    const loop = () => {
      pos = RM ? target : pos + (target - pos) * .12;
      if (Math.abs(target - pos) < .001) pos = target;
      draw();
      running = pos !== target; if (running) requestAnimationFrame(loop);
    };
    const kick = () => { read(); if (!running) { running = true; requestAnimationFrame(loop); } };
    const goTo = i => {
      i = Math.max(0, Math.min(n - 1, i));
      const top = pin.getBoundingClientRect().top + scrollY - stickTop();
      scrollTo({ top: top + i / (n - 1) * range + 1, behavior: RM ? 'auto' : 'smooth' });
    };
    items.forEach((el, i) => el.addEventListener('click', e => { if (i !== active) { e.preventDefault(); goTo(i); } }));
    dots.forEach((b, i) => b.addEventListener('click', () => goTo(i)));
    pin.querySelector('.prev').addEventListener('click', () => goTo(active - 1));
    pin.querySelector('.next').addEventListener('click', () => goTo(active + 1));
    // a sideways swipe on the stage also turns it
    let sx = null, swiped = false;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; swiped = false; });
    stage.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) { swiped = true; goTo(active + (dx < 0 ? 1 : -1)); } });
    stage.addEventListener('click', e => { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', () => { size(); kick(); });
    addEventListener('load', () => { size(); kick(); });
    size(); read(); pos = target; draw();
  }
})();
