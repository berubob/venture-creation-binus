import { useEffect, useRef } from 'react';
import { subscribeProgress } from '../scrollStore';

export default function InkBackground() {
  const washRef = useRef(null);
  const goldRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    let p = 0;
    const apply = () => {
      raf = 0;
      if (washRef.current) washRef.current.style.transform = `translate3d(0, ${-p * 40}px, 0)`;
      if (goldRef.current) goldRef.current.style.transform = `translate3d(0, ${-p * 90}px, 0)`;
    };
    const unsub = subscribeProgress((next) => {
      p = next;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    return () => {
      unsub();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-paper">
      <img
        ref={washRef}
        src="/bg/ink-wash.webp"
        alt=""
        decoding="async"
        draggable={false}
        className="absolute inset-[-10%] h-[120%] w-[120%] max-w-none object-cover will-change-transform"
      />
      <img
        ref={goldRef}
        src="/bg/ink-gold.webp"
        alt=""
        decoding="async"
        draggable={false}
        className="absolute inset-[-10%] h-[120%] w-[120%] max-w-none object-cover will-change-transform"
      />
    </div>
  );
}