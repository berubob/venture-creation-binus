let el = null;
const subscribers = new Set();

export function setScrollEl(next) {
  if (el === next) return;
  el = next;
  subscribers.forEach((fn) => fn());
}

export const getScrollEl = () => el;

export function subscribeScrollEl(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function scrollToPage(page, pages) {
  if (!el) return;
  const max = el.scrollHeight - el.clientHeight;
  el.scrollTo({ top: (max * page) / (pages - 1), behavior: 'smooth' });
}