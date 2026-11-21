import { useEffect, useRef, useSyncExternalStore } from 'react';
import { VARIANTS } from '../data/variants';
import { getScrollEl, subscribeScrollEl } from '../scrollStore';
import { useStore } from '../cartStore';

export default function InkBackground() {
  const el = useSyncExternalStore(subscribeScrollEl, getScrollEl);
  const current = useStore((s) => s.variant);
  const baseRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const update = () => {
      let p = 0;
      if (el) {
        const max = el.scrollHeight - el.clientHeight;
        p = max > 0 ? el.scrollTop / max : 0;
      }
      if (baseRef.current) baseRef.current.style.transform = `translate3d(0, ${-p * 40}px, 0)`;
      if (lineRef.current) lineRef.current.style.transform = `translate3d(0, ${-p * 110}px, 0)`;
    };
    update();
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [el]);

  const layer = (key) =>
    Object.values(VARIANTS).map((v) => (
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

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-paper transition-colors duration-700">
      <div ref={baseRef} className="absolute inset-x-0 bottom-[-5%] top-[-5%] will-change-transform">
        {layer('base')}
      </div>
      <div ref={lineRef} className="absolute inset-x-0 bottom-[-12%] top-[-12%] will-change-transform">
        {layer('line')}
      </div>
    </div>
  );
}
