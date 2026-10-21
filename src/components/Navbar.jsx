import { useEffect, useRef, useState } from 'react';
import { INGREDIENTS, PAGES } from '../data/ingredients';
import { subscribeProgress } from '../scrollStore';

const LINKS = [
  { label: 'Beranda', page: 0 },
  ...INGREDIENTS.map((ing, i) => ({ label: ing.name, page: i + 1 })),
  { label: 'Pesan', page: PAGES - 1 },
];

export default function Navbar({ onNavigate }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(
    () =>
      subscribeProgress((p) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        setActive(Math.round(p * (PAGES - 1)));
      }),
    []
  );

  const go = (page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/20 bg-paper shadow-sm shadow-ink/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <button
          onClick={() => go(0)}
          className="cursor-pointer font-serif text-2xl font-black tracking-[0.3em] text-ink"
          aria-label="Kembali ke awal"
        >
          VNS
        </button>

        <ul className="hidden items-center gap-8 font-sans text-sm font-medium text-ink lg:flex">
          {LINKS.slice(0, -1).map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.page)}
                aria-current={active === l.page ? 'page' : undefined}
                className={`cursor-pointer border-b-2 pb-1 transition-colors hover:text-gold-deep ${
                  active === l.page ? 'border-gold-deep text-ink' : 'border-transparent text-ink-soft'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => go(PAGES - 1)}
              className="cursor-pointer rounded-full border-2 border-gold-deep px-5 py-2 text-gold-deep transition hover:bg-ink hover:text-paper"
            >
              Pre-order
            </button>
          </li>
        </ul>

        <button
          className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          <span className={`h-0.5 w-6 bg-ink transition ${open ? 'translate-y-1 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition ${open ? '-translate-y-1 -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <ul className="border-t border-ink/20 bg-paper px-6 py-3 font-sans text-base font-medium text-ink lg:hidden">
          {LINKS.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.page)}
                className={`w-full py-3 text-left ${active === l.page ? 'text-gold-deep' : ''}`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        ref={barRef}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gold-deep will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </header>
  );
}