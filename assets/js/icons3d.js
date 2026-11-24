// 3D kit for the home page first screen: a stage (renderer, camera, light), five device icons, toy behaviour.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export { THREE };
export const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- stage: a canvas that fills its box; world units at z = 0 ---------- */
export function stage(canvas, { fov = 30, z = 12 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  const camera = new THREE.PerspectiveCamera(fov, 1, .1, 100); camera.position.set(0, 0, z);
  const key = new THREE.DirectionalLight(0xfff4e0, 1.6); key.position.set(-4, 6, 8); scene.add(key);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d2bf, .6));
  const s = { THREE, renderer, scene, camera, w: 1, h: 1, vw: 1, vh: 1, active: true }, subs = [];
  s.onResize = f => { subs.push(f); f(s); };
  // pointer event -> canvas pixels (safe under CSS zoom)
  s.local = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) * s.w / r.width, (e.clientY - r.top) * s.h / r.height]; };
  s.toWorld = (px, py) => [(px / s.w - .5) * s.vw, (.5 - py / s.h) * s.vh];
  const ray = new THREE.Raycaster(), v = new THREE.Vector2();
  s.pick = (px, py, list) => {          // canvas pixels, list of Object3D; returns index or -1
    v.set(px / s.w * 2 - 1, -(py / s.h) * 2 + 1); ray.setFromCamera(v, camera);
    const hit = ray.intersectObjects(list, true)[0];
    return hit ? list.findIndex(o => o.getObjectById(hit.object.id)) : -1;
  };
  function resize() {
    s.w = canvas.clientWidth || 1; s.h = canvas.clientHeight || 1;
    renderer.setSize(s.w, s.h, false); camera.aspect = s.w / s.h; camera.updateProjectionMatrix();
    s.vh = 2 * z * Math.tan(THREE.MathUtils.degToRad(fov / 2)); s.vw = s.vh * camera.aspect;
    subs.forEach(f => f(s));
  }
  new ResizeObserver(resize).observe(canvas); resize();
  // only draw while the canvas is on screen
  new IntersectionObserver(([e]) => { s.active = e.isIntersecting; }).observe(canvas);
  s.loop = f => { const c = new THREE.Clock(); const tick = () => { const dt = Math.min(c.getDelta(), .05); if (s.active) { f(dt, c.elapsedTime); renderer.render(scene, camera); } requestAnimationFrame(tick); }; tick(); };
  return s;
}

/* ---------- materials: glossy toy plastic ---------- */
const M = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: .32, clearcoat: .8, clearcoatRoughness: .25, ...o });
export const LIGHT = { deep: 0x17402c, gold: 0xd6ac2c, body: 0xfbf9f3, frame: 0x17191a, screen: 0x0b1f15, soft: 0xc9d8cd, cream: 0xeadfbf };
export const DARK  = { deep: 0x2f7a52, gold: 0xe0b63a, body: 0xf6f3ea, frame: 0x17191a, screen: 0x0b1f15, soft: 0xbfd2c4, cream: 0xeadfbf };

const RB = (w, h, d, r, m) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), m);
const at = (o, x, y, z) => (o.position.set(x, y, z), o);
const ext = (shapes, depth, m, bevel = .05) => {
  const g = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 24 });
  g.center(); return new THREE.Mesh(g, m);
};

/* five devices (laptop, kiosk, POS, PC, tablet with phone), each about 1.3-1.6 units across and centred on its middle */
export function icons(colors = LIGHT) {
  const c = {}; for (const k in colors) c[k] = M(colors[k], k === 'screen' ? { roughness: .12, clearcoat: 1 } : {});
  const laptop = () => {
    const g = new THREE.Group();
    g.add(at(RB(1.5, .09, 1, .04, c.frame), 0, -.42, .12));
    g.add(at(RB(1.1, .02, .5, .01, c.soft), 0, -.37, .04));
    const lid = new THREE.Group(); lid.position.set(0, -.38, -.36); lid.rotation.x = -.22;
    lid.add(at(RB(1.5, 1, .07, .04, c.frame), 0, .5, 0));
    lid.add(at(RB(1.34, .84, .02, .01, c.screen), 0, .5, .035));
    lid.add(at(RB(.42, .07, .02, .02, c.cream), -.38, .8, .05));
    [.22, .34, .28, .48, .58].forEach((h, i) => lid.add(at(RB(.14, h, .02, .02, i === 4 ? c.gold : c.soft), -.42 + i * .21, .2 + h / 2, .05)));
    g.add(lid); return g;
  };
  // screen content helpers: rows of bars and a gold button, drawn on a group facing +z
  const rows = (g, x, y, z, ws, gap = .1, th = .05) => ws.forEach((w, i) => g.add(at(RB(w, th, .015, .02, c.soft), x + w / 2, y - i * gap, z)));
  const kiosk = () => {
    const g = new THREE.Group();
    g.add(at(RB(.72, .06, .5, .03, c.deep), 0, -.66, 0));
    g.add(at(RB(.14, .6, .12, .05, c.frame), 0, -.36, 0));
    const head = new THREE.Group(); head.position.set(0, .3, 0); head.rotation.x = -.12;
    head.add(RB(.66, .84, .12, .06, c.frame));
    head.add(at(RB(.54, .62, .02, .01, c.screen), 0, .05, .065));
    head.add(at(RB(.3, .06, .02, .02, c.cream), -.08, .26, .08));
    rows(head, -.2, .14, .08, [.4, .28, .34]);
    head.add(at(RB(.4, .1, .02, .03, c.gold), 0, -.16, .08));
    head.add(at(RB(.22, .03, .02, .01, c.deep), 0, -.34, .07));
    g.add(head); return g;
  };
  const pos = () => {
    const g = new THREE.Group();
    g.add(at(RB(1.3, .26, .8, .06, c.deep), 0, -.5, 0));
    g.add(at(RB(.9, .025, .02, .01, c.soft), 0, -.52, .405));
    g.add(at(RB(.12, .3, .1, .04, c.frame), -.18, -.22, -.12));
    const scr = new THREE.Group(); scr.position.set(-.18, .2, -.08); scr.rotation.x = -.28;
    scr.add(RB(.98, .66, .07, .04, c.frame));
    scr.add(at(RB(.88, .56, .02, .01, c.screen), 0, 0, .035));
    for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) scr.add(at(RB(.16, .12, .015, .02, c.soft), -.34 + k * .2, .14 - r * .17, .05));
    scr.add(at(RB(.2, .29, .015, .02, c.gold), .3, .055, .05));
    scr.add(at(RB(.56, .05, .015, .02, c.cream), -.14, -.2, .05));
    g.add(scr);
    g.add(at(RB(.3, .18, .3, .05, c.frame), .44, -.28, .14));
    g.add(at(RB(.18, .16, .01, .005, c.cream), .44, -.14, .2));
    return g;
  };
  const pc = () => {
    const g = new THREE.Group(), m = new THREE.Group(); m.position.x = -.22;
    m.add(at(RB(1.16, .74, .06, .04, c.frame), 0, .22, 0));
    m.add(at(RB(1.04, .62, .02, .01, c.screen), 0, .22, .035));
    m.add(at(RB(.3, .06, .02, .02, c.cream), -.3, .43, .05));
    [.2, .3, .26, .42, .5].forEach((h, i) => m.add(at(RB(.12, h, .02, .02, i === 4 ? c.gold : c.soft), -.36 + i * .18, -.02 + h / 2, .05)));
    m.add(at(RB(.12, .3, .08, .03, c.frame), 0, -.28, -.04));
    m.add(at(RB(.5, .04, .3, .02, c.frame), 0, -.44, 0));
    m.add(at(RB(.86, .04, .26, .02, c.frame), 0, -.6, .42));
    g.add(m);
    g.add(at(RB(.34, .92, .66, .05, c.deep), .64, -.16, -.06));
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .02, 24), c.gold).rotateX(Math.PI / 2), .64, .2, .28));
    [0, 1, 2].forEach(i => g.add(at(RB(.2, .025, .01, .01, c.soft), .64, .02 - i * .06, .275)));
    return g;
  };
  const tabletPhone = () => {
    const g = new THREE.Group(), t = new THREE.Group(); t.position.set(-.18, .06, -.1); t.rotation.x = -.1;
    t.add(RB(1.36, .94, .06, .07, c.frame));
    t.add(at(RB(1.22, .8, .02, .02, c.screen), 0, 0, .035));
    t.add(at(RB(.34, .06, .015, .02, c.cream), -.36, .28, .05));
    for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) t.add(at(RB(.2, .16, .015, .03, r === 1 && k === 3 ? c.gold : c.soft), -.4 + k * .27, .08 - r * .24, .05));
    g.add(t);
    const p = new THREE.Group(); p.position.set(.56, -.2, .32); p.rotation.set(-.06, -.15, 0);
    p.add(RB(.42, .82, .07, .07, c.deep));
    p.add(at(RB(.36, .7, .02, .03, c.screen), 0, 0, .04));
    p.add(at(RB(.24, .13, .015, .04, c.frame), -.03, .16, .055));
    p.add(at(RB(.2, .11, .015, .04, c.gold), .04, -.02, .055));
    p.add(at(RB(.1, .02, .01, .01, c.soft), 0, -.3, .055));
    g.add(p); return g;
  };
  return [laptop, kiosk, pos, pc, tabletPhone].map(f => f());
}

/* ---------- toy: pivot (place) > spin (tap spin) > icon; small idle life ---------- */
export function toy(icon, phase = 0) {
  const pivot = new THREE.Group(), spin = new THREE.Group(); spin.add(icon); pivot.add(spin);
  const t = { pivot, spin, icon, spinV: 0, hop: 0, phase };
  t.kick = () => { t.spinV += 14; t.hop = 1; };
  t.update = (dt, time) => {            // returns the hop lift (0..1) for the caller to use
    spin.rotation.y += t.spinV * dt; t.spinV *= Math.pow(.15, dt);
    if (t.spinV < .3) spin.rotation.y += (Math.round(spin.rotation.y / (Math.PI * 2)) * Math.PI * 2 - spin.rotation.y) * Math.min(1, dt * 4);
    t.hop = Math.max(0, t.hop - dt * 1.6);
    if (!still) {
      if (icon.userData.dots) icon.userData.dots.forEach((d, j) => d.position.y = .05 + Math.max(0, Math.sin(time * 5 - j * .7)) * .1);
      if (icon.userData.turn) icon.userData.turn.rotation.z = time * .5;
    }
    return Math.sin(t.hop * Math.PI);
  };
  return t;
}

/* soft round shadow lying on the floor under an icon */
let shadowTex;
export function shadow(opacity = .18) {
  if (!shadowTex) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const x = cv.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(15,42,29,1)'); g.addColorStop(1, 'rgba(15,42,29,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    shadowTex = new THREE.CanvasTexture(cv);
  }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity, depthWrite: false }));
  m.rotation.x = -1.2; return m;
}

export const pop = t => t >= 1 ? 1 : 1 - Math.pow(2, -9 * t) * Math.cos(t * 9.5);   // springy arrival 0..1
