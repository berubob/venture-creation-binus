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
      setProgress(max > 0 ? scrollEl.scrollTop / max : 0);
      setActive(Math.round((max > 0 ? scrollEl.scrollTop / max : 0) * (PAGES - 1)));
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [scrollEl]);

  const go = (page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <button
          onClick={() => go(0)}
          className="font-serif text-2xl font-black tracking-[0.3em] text-amber-200 cursor-pointer"
          aria-label="Kembali ke awal"
        >
          AURA
        </button>

        <ul className="hidden items-center gap-8 font-sans text-sm text-white/70 md:flex">
          {LINKS.slice(0, -1).map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.page)}
                className={`cursor-pointer pb-1 transition-colors hover:text-white border-b ${
                  active === l.page ? 'border-amber-200 text-white' : 'border-transparent'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => go(PAGES - 1)}
              className="cursor-pointer rounded-full border border-amber-200/60 px-5 py-2 text-amber-100 transition hover:bg-amber-200 hover:text-black"
            >
              Pre-order
            </button>
          </li>
        </ul>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          <span className={`h-px w-6 bg-white transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-white transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <ul className="border-t border-white/10 bg-black/80 px-6 py-4 font-sans text-white/80 md:hidden">
          {LINKS.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.page)}
                className={`w-full py-3 text-left ${active === l.page ? 'text-amber-200' : ''}`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className="absolute bottom-0 left-0 h-px bg-amber-200 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </header>
  );
}