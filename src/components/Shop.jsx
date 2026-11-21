import { useEffect, useState } from 'react';
import ProductViewer from './ProductViewer';
import { getVariant } from '../data/variants';
import { INSTAGRAM_URL, PRODUCTS, SIZES, formatRupiah, getProduct, getSize } from '../data/products';
import { addItem, closeShop, openCart, selectProduct, useCartCount, useStore } from '../cartStore';

const NO_BODY = []; // referensi tetap supaya model tidak dibuat ulang tiap render

const tab = (on) =>
  `cursor-pointer border-b pb-1 font-display text-lg transition-colors ${
    on ? 'border-gold text-ink' : 'border-transparent text-mute hover:text-ink'
  }`;

export default function Shop() {
  const open = useStore((s) => s.shopOpen);
  const productId = useStore((s) => s.shopProduct);
  const cartCount = useCartCount();

  const [sizeId, setSizeId] = useState('15ml');
  const [view, setView] = useState('bottle'); // 'bottle' | 'ingredients'
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeShop();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(id);
  }, [added]);

  if (!open) return null;

  const product = getProduct(productId) ?? PRODUCTS[0];
  const variant = getVariant(product.id);
  const size = getSize(sizeId);
  const url = view === 'ingredients' ? product.models.ingredients : product.models[sizeId];
  const bottleView = view === 'bottle';
  const bottle15 = bottleView && sizeId === '15ml';

  const add = () => {
    addItem(product.id, size.id, qty);
    setAdded(true);
  };

  return (
    <div
      data-theme={product.id}
      className="fixed inset-0 z-60 overflow-y-auto bg-paper bg-cover bg-center text-ink"
      style={{ backgroundImage: `url(${variant.bg.base})` }}
      role="dialog"
      aria-modal="true"
      aria-label="Katalog dan pre-order VNS"
    >
      <header className="sticky top-0 z-10 bg-linear-to-b from-paper from-60% to-paper/0 pb-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-4 md:px-10 md:pt-5">
          <button onClick={closeShop} className="cursor-pointer text-sm text-mute hover:text-ink">
            Kembali
          </button>
          <p className="font-display text-2xl font-medium tracking-[0.08em]">VNS</p>
          <button onClick={openCart} className="cursor-pointer text-sm font-bold hover:text-gold">
            Keranjang ({cartCount})
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 pb-12 pt-4 md:grid-cols-2 md:gap-14 md:px-10">
        {/* Kiri: model 3D */}
        <div>
          <div className="mb-3 flex gap-7">
            {PRODUCTS.map((p) => (
              <button key={p.id} onClick={() => selectProduct(p.id)} className={tab(p.id === product.id)}>
                {p.name}
              </button>
            ))}
          </div>

          <div className="h-[46vh] md:h-[64vh]">
            <ProductViewer
              url={url}
              body={bottle15 ? variant.bodyNodes : NO_BODY}
              liquid={bottleView ? variant.liquid : null}
              items={view === 'ingredients' ? variant.ingredients : null}
              light={variant.light}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <button
              onClick={() => setView('bottle')}
              className={`cursor-pointer border-b pb-0.5 ${view === 'bottle' ? 'border-gold font-bold' : 'border-transparent text-mute hover:text-ink'}`}
            >
              Botol {size.volume}
            </button>
            <button
              onClick={() => setView('ingredients')}
              className={`cursor-pointer border-b pb-0.5 ${view === 'ingredients' ? 'border-gold font-bold' : 'border-transparent text-mute hover:text-ink'}`}
            >
              Bahan
            </button>
            <span className="text-xs text-mute">
              Geser untuk memutar{bottle15 ? '. Sorot botol untuk melihat cairannya.' : '.'}
            </span>
          </div>
        </div>

        {/* Kanan: info dan pembelian */}
        <div className="flex flex-col md:pt-10">
          <h1 className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-medium leading-none tracking-tight">{product.name}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-gold">{product.tagline}</p>
          <p className="mt-5 max-w-md leading-relaxed text-mute">{product.desc}</p>

          <div role="radiogroup" aria-label="Pilih ukuran" className="mt-8 border-t border-line">
            {SIZES.map((s) => {
              const on = s.id === sizeId;
              return (
                <button
                  key={s.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setSizeId(s.id);
                    setView('bottle');
                  }}
                  className="flex w-full cursor-pointer items-center gap-4 border-b border-line py-4 text-left"
                >
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/50"
                    aria-hidden
                  >
                    {on && <span className="h-2 w-2 rounded-full bg-gold" />}
                  </span>
                  <span className={`flex-1 ${on ? 'font-bold' : 'text-mute'}`}>
                    {s.label} <span className="text-mute">{s.volume}</span>
                  </span>
                  <span className="font-display text-2xl">{formatRupiah(s.price)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-5 text-sm">
            <span className="text-mute">Jumlah</span>
            <div className="flex items-center">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 cursor-pointer rounded-full text-lg hover:bg-ink/5"
                aria-label="Kurangi jumlah"
              >
                −
              </button>
              <span className="w-8 text-center font-bold" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="h-10 w-10 cursor-pointer rounded-full text-lg hover:bg-ink/5"
                aria-label="Tambah jumlah"
              >
                +
              </button>
            </div>
            <span className="ml-auto font-display text-2xl">{formatRupiah(size.price * qty)}</span>
          </div>

          <button
            onClick={add}
            className="mt-6 cursor-pointer rounded-full bg-ink px-8 py-4 text-sm font-bold text-paper transition hover:bg-gold"
          >
            Tambah ke keranjang
          </button>
          <p className="mt-3 h-5 text-sm text-gold" aria-live="polite">
            {added && (
              <>
                Ditambahkan.{' '}
                <button onClick={openCart} className="cursor-pointer underline">
                  Lihat keranjang
                </button>
              </>
            )}
          </p>

          <p className="mt-6 max-w-md text-xs leading-relaxed text-mute">
            Pesanan dikirim lewat WhatsApp. Teksnya sudah kami tuliskan, kamu tinggal menekan kirim. Pertanyaan lain? Hubungi kami di{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
              Instagram @vns.scent
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}