// Shared by the 4 scroll drafts. Everything on the page is readable without this file;
// it only adds the pinned "before -> after" story on PC, the phone action bar, and number count-ups.
document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = matchMedia('(min-width: 768px)');

// Pinned story: the section is tall, the stage sticks, scroll position picks the scene.
document.querySelectorAll('[data-story]').forEach(sec => {
  const scenes = [...sec.querySelectorAll('[data-scene]')];
  const dots = [...sec.querySelectorAll('[data-dot]')];
  const update = () => {
    if (!wide.matches || reduce) return;
    const r = sec.getBoundingClientRect();
    const span = r.height - innerHeight;
    const p = Math.min(0.9999, Math.max(0, -r.top / span));
    const i = Math.floor(p * scenes.length);
    scenes.forEach((s, k) => s.classList.toggle('on', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    sec.style.setProperty('--p', p.toFixed(3));
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
});

// Phone action bar: shows once the first screen has scrolled away.
const hero = document.querySelector('[data-hero]');
const bar = document.querySelector('[data-bar]');
if (hero && bar) {
  new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { threshold: 0.05 }).observe(hero);
}

// Count-ups: the real number is already in the HTML; this only animates it once.
if (!reduce) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, pre = el.dataset.pre || '', t0 = performance.now();
    const fmt = n => pre + Math.round(n).toLocaleString('en-PH');
    const step = t => {
      const k = Math.min(1, (t - t0) / 1200), ease = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * ease);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { rootMargin: '0px 0px -20% 0px' });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}
