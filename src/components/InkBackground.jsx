import { useEffect, useRef, useSyncExternalStore } from 'react';
import { VARIANTS } from '../data/variants';
import { getScrollEl, subscribeScrollEl } from '../scrollStore';
import { useStore } from '../cartStore';
import { LITE } from '../perf';

export default function InkBackground() {
  const el = useSyncExternalStore(subscribeScrollEl, getScrollEl);
  const current = useStore((s) => s.variant);
  const baseRef = useRef(null);
  const goldRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (LITE) return; // mobile: tanpa parallax, jadi tidak ada update style tiap event scroll
    const update = () => {
      let p = 0;
      if (el) {
        const max = el.scrollHeight - el.clientHeight;
        p = max > 0 ? el.scrollTop / max : 0;
      }
      if (baseRef.current) baseRef.current.style.transform = `translate3d(0, ${-p * 40}px, 0)`;
      if (goldRef.current) goldRef.current.style.transform = `translate3d(0, ${-p * 75}px, 0)`;
      if (lineRef.current) lineRef.current.style.transform = `translate3d(0, ${-p * 110}px, 0)`;
    };
    update();
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [el]);

  const layer = (key) =>
    Object.values(VARIANTS)
      .filter((v) => !LITE || v.id === current)
      .map((v) => (
        <img
          key={v.id}
          src={v.bg[key]}
          alt=""
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            v.id === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ));

  const move = LITE ? '' : 'will-change-transform';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-paper transition-colors duration-700">
      <div ref={baseRef} className={`absolute inset-x-0 bottom-[-5%] top-[-5%] ${move}`}>
        {layer('base')}
      </div>
      <div ref={goldRef} className={`absolute inset-x-0 bottom-[-8%] top-[-8%] ${move}`}>
        <img src="/bg/ink-gold.webp" alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div ref={lineRef} className={`absolute inset-x-0 bottom-[-12%] top-[-12%] ${move}`}>
        {layer('line')}
      </div>
    </div>
  );
}