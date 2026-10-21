let el = null;
let max = 1;
let progress = 0;
let ro = null;

const elSubs = new Set();
const progressSubs = new Set();

export const pointer = { x: 0, y: 0 };

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function measure() {
  if (!el) return;
  max = Math.max(1, el.scrollHeight - el.clientHeight);
  progress = clamp01(el.scrollTop / max);
}

function onScroll() {
  progress = clamp01(el.scrollTop / max);
  progressSubs.forEach((fn) => fn(progress));
}

function onResize() {
  measure();
  progressSubs.forEach((fn) => fn(progress));
}

function observeAll() {
  ro?.disconnect();
  ro = new ResizeObserver(onResize);
  ro.observe(el);
  Array.from(el.children).forEach((c) => ro.observe(c));
}

export function refreshScrollEl() {
  if (!el) return;
  observeAll();
  measure();
  progressSubs.forEach((fn) => fn(progress));
}

export function setScrollEl(next) {
  if (el === next) return;
  if (el) {
    el.removeEventListener('scroll', onScroll);
    ro?.disconnect();
    ro = null;
  }
  el = next;
  if (el) {
    measure();
    el.addEventListener('scroll', onScroll, { passive: true });
    observeAll();
  } else {
    progress = 0;
  }
  elSubs.forEach((fn) => fn());
}

export const getScrollEl = () => el;
export const getProgress = () => progress;

export function subscribeScrollEl(fn) {
  elSubs.add(fn);
  return () => elSubs.delete(fn);
}

export function subscribeProgress(fn) {
  progressSubs.add(fn);
  fn(progress);
  return () => progressSubs.delete(fn);
}

export function scrollToPage(page, pages) {
  if (!el) return;
  el.scrollTo({ top: (max * page) / (pages - 1), behavior: 'smooth' });
}

let pointerBound = false;
export function bindPointer() {
  if (pointerBound || typeof window === 'undefined') return () => {};
  pointerBound = true;
  const onMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    window.removeEventListener('pointermove', onMove);
    pointerBound = false;
  };
}