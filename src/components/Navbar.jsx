import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { VARIANTS, getVariant } from '../data/variants';
import { INSTAGRAM_URL } from '../data/products';
import { getScrollEl, subscribeScrollEl } from '../scrollStore';
import { openCart, openShop, setVariant, useCartCount, useStore } from '../cartStore';
import { preloadVariant } from '../modelUtils';
import { openNotes } from '../cartStore';

const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M3 4h2.5l2 11h10.5l2-8H7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9.5" cy="19.5" r="1.2" />
    <circle cx="17" cy="19.5" r="1.2" />
  </svg>
);

function CartButton({ count }) {
  return (
    <button
      onClick={openCart}
      className="relative cursor-pointer"
      aria-label={`Buka keranjang, ${count} barang`}
    >
      <CartIcon />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-paper">
          {count}
        </span>
      )}
    </button>
  );
}

// Titik kecil menunjukkan warna cairan: Yisery oranye (terisi), Midbel bening (kosong)
function LiquidDot({ liquid }) {
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={liquid.clear ? { boxShadow: 'inset 0 0 0 1.5px currentColor' } : { background: liquid.color }}
    />
  );
}

// Pilihan parfum: mengganti model 3D, bahan, latar, dan seluruh isi halaman
function VariantSwitch() {
  const current = useStore((s) => s.variant);
  return (
    <div role="group" aria-label="Pilih parfum" className="flex items-center gap-5 text-sm md:gap-7 md:text-base">
      {Object.values(VARIANTS).map((v) => {
        const on = v.id === current;
        return (
          <button
            key={v.id}
            onClick={() => setVariant(v.id)}
            onPointerEnter={() => preloadVariant(v)}
            onFocus={() => preloadVariant(v)}
            aria-pressed={on}
            className={`flex cursor-pointer items-center gap-2 border-b pb-1 font-display transition-colors ${
              on ? 'border-gold text-ink' : 'border-transparent text-mute hover:text-ink'
            }`}
          >
            <LiquidDot liquid={v.liquid} />
            {v.name}
          </button>
        );
      })}
    </div>
  );
}

export default function Navbar({ onNavigate }) {
  const scrollEl = useSyncExternalStore(subscribeScrollEl, getScrollEl);
  const variant = getVariant(useStore((s) => s.variant));
  const cartCount = useCartCount();
  const pages = variant.pages;

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false); // dropdown Bahan (desktop)
  const menuRef = useRef(null);

  const links = useMemo(
    () => [
      { label: 'Beranda', page: 0 },
      ...variant.ingredients.map((ing, i) => ({ label: ing.name, page: i + 1 })),
      { label: 'Pesan', page: pages - 1 },
    ],
    [variant, pages]
  );
  const ingredientLinks = links.slice(1, -1);

  useEffect(() => {
    if (!scrollEl) {
      setProgress(0);
      setActive(0);
      return;
    }
    const onScroll = () => {
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      const p = max > 0 ? scrollEl.scrollTop / max : 0;
      setProgress(p);
      setActive(Math.round(p * (pages - 1)));
    };
    onScroll();
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [scrollEl, pages]);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!menu) return;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenu(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  const go = (page) => {
    onNavigate(page);
    setOpen(false);
    setMenu(false);
  };

  const inIngredients = active >= 1 && active <= ingredientLinks.length;
  const linkCls = (on) =>
    `cursor-pointer border-b pb-0.5 transition-colors hover:text-ink ${on ? 'border-gold text-ink' : 'border-transparent text-mute'}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-linear-to-b from-paper from-60% to-paper/0 pb-4 text-ink">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 pt-4 md:px-10 md:pt-5">
        <button
          onClick={() => go(0)}
          className="cursor-pointer font-display text-2xl font-medium tracking-[0.08em]"
          aria-label="Kembali ke awal"
        >
          VNS
        </button>

        <VariantSwitch />

        <ul className="hidden items-center gap-7 text-sm md:flex">
          <li>
            <button onClick={() => go(0)} className={linkCls(active === 0)}>
              Beranda
            </button>
          </li>

          <li ref={menuRef} className="relative">
            <button
              onClick={() => setMenu((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menu}
              className={linkCls(inIngredients)}
            >
              Bahan
            </button>
            {menu && (
              <ul className="absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 bg-paper p-2 shadow-xl shadow-ink/15 ring-1 ring-line">
                {ingredientLinks.map((l) => (
                  <li key={l.page}>
                    <button
                      onClick={() => go(l.page)}
                      className={`w-full cursor-pointer px-3 py-2 text-left transition hover:bg-ink/5 ${
                        active === l.page ? 'text-gold' : ''
                      }`}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                <li className="border-t border-line">
                  <button
                    onClick={() => { openNotes(); setMenu(false); }}
                    className="w-full cursor-pointer px-3 py-2 text-left font-bold transition hover:bg-ink/5"
                  >
                    Semua bahan
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-mute hover:text-ink">
              Instagram
            </a>
          </li>
          <li>
            <CartButton count={cartCount} />
          </li>
          <li>
            <button
              onClick={() => openShop()}
              className="cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-bold text-paper transition hover:bg-gold"
            >
              Pre-order
            </button>
          </li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <CartButton count={cartCount} />
          <button
            className="flex h-10 w-8 cursor-pointer flex-col items-center justify-center gap-1.5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
            aria-expanded={open}
          >
            <span className={`h-px w-6 bg-ink transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-ink transition ${open ? 'translate-y-[-3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {open && (
        <ul className="mx-4 mt-2 max-h-[70vh] overflow-y-auto bg-paper px-5 py-3 shadow-xl shadow-ink/15 ring-1 ring-line md:hidden">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.page)}
                className={`w-full py-3 text-left ${active === l.page ? 'text-gold' : 'text-mute'}`}
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                openShop();
                setOpen(false);
              }}
              className="w-full py-3 text-left font-bold"
            >
              Katalog dan pre-order
            </button>
          </li>
          <li>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block py-3 text-mute">
              Instagram
            </a>
          </li>
        </ul>
      )}

      <div className="absolute bottom-3 left-0 h-px bg-gold transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
    </header>
  );
}
