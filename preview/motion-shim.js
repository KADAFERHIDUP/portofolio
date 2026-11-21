// Lightweight stand-in for the subset of framer-motion used by src/app.jsx.
// Used ONLY for the offline preview build; the real project uses framer-motion.
import React, { useRef, useEffect, useLayoutEffect, useState, useCallback, createElement, Fragment } from 'react';

let MVID = 0;
class MotionValue {
  constructor(v) { this.v = v; this.subs = new Set(); this.id = ++MVID; }
  get() { return this.v; }
  set(v) { if (v === this.v) return; this.v = v; this.subs.forEach(f => f(v)); }
  on(_evt, f) { this.subs.add(f); return () => this.subs.delete(f); }
}
const isMV = v => v instanceof MotionValue;

function useMV(init) { const r = useRef(null); if (!r.current) r.current = new MotionValue(init); return r.current; }

function bezier(x1, y1, x2, y2) {
  const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = a => 3 * a;
  const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const s = slope(t, x1, x2); if (Math.abs(s) < 1e-6) break; t -= (calc(t, x1, x2) - x) / s; }
    return calc(Math.min(1, Math.max(0, t)), y1, y2);
  };
}
const easeFn = e => Array.isArray(e) ? bezier(...e) : e === 'linear' ? (t => t) : bezier(0.22, 1, 0.36, 1);

const NUM = /-?\d*\.?\d+/g;
function lerp(a, b, t) {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t;
  if (typeof a === 'string' && typeof b === 'string') {
    const na = a.match(NUM), nb = b.match(NUM);
    if (na && nb && na.length === nb.length) { let i = 0; return b.replace(NUM, () => { const v = +na[i] + (+nb[i] - +na[i]) * t; i++; return String(+v.toFixed(3)); }); }
  }
  return t < 1 ? a : b;
}

const TKEYS = ['x', 'y', 'scale', 'scaleX', 'scaleY'];
const ANIM = new Set([...TKEYS, 'opacity', 'clipPath']);
const DEFAULTS = { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1, clipPath: 'inset(0 0 0% 0)' };
const px = v => typeof v === 'number' ? v + 'px' : (v ?? '0px');

function styleFrom(vals) {
  const s = {}, t = [];
  if (vals.x != null || vals.y != null) t.push(`translate3d(${px(vals.x)},${px(vals.y)},0)`);
  if (vals.scale != null) t.push(`scale(${vals.scale})`);
  if (vals.scaleX != null) t.push(`scaleX(${vals.scaleX})`);
  if (vals.scaleY != null) t.push(`scaleY(${vals.scaleY})`);
  if (t.length) s.transform = t.join(' ');
  if (vals.opacity != null) s.opacity = vals.opacity;
  if (vals.clipPath != null) s.clipPath = vals.clipPath;
  return s;
}
function pick(src) { const o = {}; if (src && typeof src === 'object') for (const k in src) if (ANIM.has(k)) o[k] = src[k]; return o; }

function makeMotion(tag) {
  function M(props) {
    const { initial, animate, whileInView, viewport, transition, exit, layout, layoutId, style, ref, ...rest } = props;
    const node = useRef(null);
    const vals = useRef(null);
    const tween = useRef(0);
    const usedTransform = useRef(false);
    if (vals.current === null) {
      vals.current = initial && typeof initial === 'object' ? pick(initial) : pick(animate && typeof animate === 'object' ? animate : whileInView);
    }
    const plain = {}, mvs = {};
    if (style) for (const k in style) { const v = style[k]; if (isMV(v) || TKEYS.includes(k)) mvs[k] = v; else plain[k] = v; }
    const mvRef = useRef(mvs); mvRef.current = mvs;
    const first = useRef(null);
    if (!first.current) {
      const merged = { ...vals.current }; for (const k in mvs) merged[k] = isMV(mvs[k]) ? mvs[k].get() : mvs[k];
      first.current = styleFrom(merged);
    }
    const write = useCallback(() => {
      const el = node.current; if (!el) return;
      const merged = { ...vals.current };
      for (const k in mvRef.current) { const v = mvRef.current[k]; merged[k] = isMV(v) ? v.get() : v; }
      const s = styleFrom(merged);
      if (s.transform) { el.style.transform = s.transform; usedTransform.current = true; }
      else if (usedTransform.current) { el.style.transform = ''; usedTransform.current = false; }
      if (s.opacity != null) el.style.opacity = s.opacity;
      if (s.clipPath != null) el.style.clipPath = s.clipPath;
    }, []);
    const run = useCallback((target, tr) => {
      cancelAnimationFrame(tween.current);
      const to = pick(target); const keys = Object.keys(to); if (!keys.length) return;
      const from = {}; keys.forEach(k => { from[k] = vals.current[k] ?? DEFAULTS[k]; });
      const t = { ...(tr || {}), ...((target && target.transition) || {}) };
      const dur = (t.duration ?? 0.5) * 1000, delay = (t.delay ?? 0) * 1000, ease = easeFn(t.ease);
      if (dur <= 0 && delay <= 0) { Object.assign(vals.current, to); write(); return; }
      const start = performance.now() + delay;
      const step = now => {
        const p = Math.min(1, Math.max(0, (now - start) / Math.max(1, dur)));
        const e = ease(p);
        keys.forEach(k => { vals.current[k] = lerp(from[k], to[k], e); });
        write();
        if (p < 1) tween.current = requestAnimationFrame(step);
      };
      tween.current = requestAnimationFrame(step);
    }, [write]);
    const setRef = useCallback(el => {
      node.current = el;
      if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
    }, [ref]);
    // style motion values
    const mvKey = Object.entries(mvs).map(([k, v]) => k + ':' + (isMV(v) ? '#' + v.id : v)).join(',');
    useLayoutEffect(() => {
      write();
      const offs = Object.values(mvs).filter(isMV).map(v => v.on('change', write));
      return () => offs.forEach(f => f());
    }, [mvKey]);
    // animate prop
    const animKey = JSON.stringify(animate ?? null);
    useLayoutEffect(() => { if (animate && typeof animate === 'object') run(animate, transition); }, [animKey]);
    // whileInView
    const viewKey = JSON.stringify(whileInView ?? null);
    useEffect(() => {
      if (!whileInView || !node.current) return;
      const once = viewport?.once;
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { run(whileInView, transition); if (once) io.disconnect(); }
        else if (!once && initial && typeof initial === 'object') run(initial, { ...transition, delay: 0 });
      }, { threshold: viewport?.amount ?? 0 });
      io.observe(node.current);
      return () => io.disconnect();
    }, [viewKey, initial === false]);
    useEffect(() => () => cancelAnimationFrame(tween.current), []);
    return createElement(tag, { ...rest, ref: setRef, style: { ...plain, ...first.current } });
  }
  M.displayName = `motion.${String(tag)}`;
  return M;
}
const cache = {};
export const motion = new Proxy({}, { get: (_, tag) => cache[tag] || (cache[tag] = makeMotion(tag)) });

export const AnimatePresence = ({ children }) => createElement(Fragment, null, children);
export const MotionConfig = ({ children }) => createElement(Fragment, null, children);

export function useScroll({ target, offset } = {}) {
  const mv = useMV(0);
  const offKey = JSON.stringify(offset || null);
  useEffect(() => {
    const edge = t => t === 'start' ? 0 : t === 'end' ? 1 : t === 'center' ? .5 : String(t).endsWith('%') ? parseFloat(t) / 100 : parseFloat(t);
    const off = (offset || ['start start', 'end end']).map(s => s.split(' ').map(edge));
    const update = () => {
      if (!target) {
        const max = document.documentElement.scrollHeight - innerHeight;
        mv.set(max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0); return;
      }
      const el = target.current; if (!el) return;
      const r = el.getBoundingClientRect(), top = r.top + scrollY, h = el.offsetHeight || r.height, vh = innerHeight;
      const s0 = top + off[0][0] * h - off[0][1] * vh, s1 = top + off[1][0] * h - off[1][1] * vh;
      mv.set(s1 === s0 ? 0 : Math.min(1, Math.max(0, (scrollY - s0) / (s1 - s0))));
    };
    update();
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, [target, offKey]);
  return { scrollYProgress: mv };
}

export function useTransform(src, input, output) {
  const map = v => {
    const n = input.length;
    if (v <= input[0]) return output[0];
    if (v >= input[n - 1]) return output[n - 1];
    for (let i = 1; i < n; i++) if (v <= input[i]) { const t = (v - input[i - 1]) / (input[i] - input[i - 1]); return output[i - 1] + (output[i] - output[i - 1]) * t; }
    return output[n - 1];
  };
  const out = useMV(map(src.get()));
  useEffect(() => { out.set(map(src.get())); return src.on('change', v => out.set(map(v))); }, [src]);
  return out;
}

export function useSpring(source, { stiffness = 100, damping = 10, mass = 1, restDelta = 0.001 } = {}) {
  const fromMV = isMV(source);
  const out = useMV(fromMV ? source.get() : source);
  const st = useRef(null);
  if (!st.current) {
    const rawSet = MotionValue.prototype.set.bind(out);
    const s = { target: out.get(), vel: 0, raf: 0 };
    const start = () => {
      if (s.raf) return;
      let last = performance.now();
      const tick = now => {
        const dt = Math.min(0.032, (now - last) / 1000); last = now;
        const x = out.v; const f = -stiffness * (x - s.target) - damping * s.vel;
        s.vel += (f / mass) * dt; let nx = x + s.vel * dt;
        if (Math.abs(nx - s.target) < restDelta && Math.abs(s.vel) < restDelta * 10) { s.vel = 0; rawSet(s.target); s.raf = 0; return; }
        rawSet(nx); s.raf = requestAnimationFrame(tick);
      };
      s.raf = requestAnimationFrame(tick);
    };
    out.set = v => { s.target = v; start(); };
    st.current = s;
  }
  useEffect(() => { if (!fromMV) return; return source.on('change', v => out.set(v)); }, [source]);
  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);
  return out;
}

export function useReducedMotion() {
  const q = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const [r, setR] = useState(!!q?.matches);
  useEffect(() => { if (!q) return; const f = e => setR(e.matches); q.addEventListener?.('change', f); return () => q.removeEventListener?.('change', f); }, []);
  return r;
}

export function useMotionValueEvent(mv, _evt, cb) {
  const ref = useRef(cb); ref.current = cb;
  useEffect(() => mv.on('change', v => ref.current(v)), [mv]);
}

export function useAnimationFrame(cb) {
  const ref = useRef(cb); ref.current = cb;
  useEffect(() => {
    let raf, last = performance.now();
    const tick = now => { ref.current(now, now - last); last = now; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}

export function useInView(ref, opts = {}) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: opts.amount ?? 0 });
    io.observe(ref.current); return () => io.disconnect();
  }, [ref]);
  return v;
}
