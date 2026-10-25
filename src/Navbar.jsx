import { useEffect, useState, useSyncExternalStore } from 'react';
import { INGREDIENTS, PAGES } from '../data/ingredients';
import { getScrollEl, subscribeScrollEl } from '../scrollStore';

const LINKS = [
  { label: 'Beranda', page: 0 },
  ...INGREDIENTS.map((ing, i) => ({ label: ing.name, page: i + 1 })),
  { label: 'Pesan', page: PAGES - 1 },
];

export default function Navbar({ onNavigate }) {
  const scrollEl = useSyncExternalStore(subscribeScrollEl, getScrollEl);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!scrollEl) return;
    const onScroll = () => {
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      const p = max > 0 ? scrollEl.scrollTop / max : 0;
      setProgress(p);
      setActive(Math.round(p * (PAGES - 1)));
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [scrollEl]);

  const go = (page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neon-cyan/25 bg-void/80 shadow-[0_0_30px_-10px_rgba(46,230,214,0.5)] backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <button
          onClick={() => go(0)}
          className="cursor-pointer font-display text-2xl font-bold tracking-[0.3em] text-fg [text-shadow:0_0_12px_rgba(46,230,214,0.8)]"
          aria-label="Kembali ke awal"
        >
          VNS
        </button>

        <ul className="hidden items-center gap-8 font-sans text-sm font-medium text-fg/80 md:flex">
          {LINKS.slice(0, -1).map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.page)}
                className={`cursor-pointer border-b pb-1 transition-colors hover:text-fg ${
                  active === l.page ? 'border-neon-cyan text-neon-cyan' : 'border-transparent'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => go(PAGES - 1)}
              className="cursor-pointer rounded-full border border-neon-pink px-5 py-2 text-neon-pink shadow-[0_0_14px_-2px_rgba(255,62,165,0.6)] transition hover:bg-neon-pink hover:text-void"
            >
              Pre-order
            </button>
          </li>
        </ul>

        <button
          className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          <span className={`h-px w-6 bg-fg transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-fg transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <ul className="border-t border-neon-cyan/20 bg-void/95 px-6 py-4 font-sans text-fg/80 md:hidden">
          {LINKS.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.page)}
                className={`w-full py-3 text-left ${active === l.page ? 'text-neon-cyan' : ''}`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className="absolute bottom-0 left-0 h-px bg-neon-cyan shadow-[0_0_10px_2px_rgba(46,230,214,0.8)] transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </header>
  );
}
