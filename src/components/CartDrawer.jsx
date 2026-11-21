import { useEffect, useState } from 'react';
import { PAYMENT, PICKUP, buildWhatsAppUrl, formatRupiah, getProduct, getSize } from '../data/products';
import { clearCart, closeCart, removeItem, setQty, useStore } from '../cartStore';

const fieldCls =
  'mt-1 w-full border-0 border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-mute/70 focus:border-gold focus:outline-none';

export default function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const items = useStore((s) => s.items);
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  if (!open) return null;

  const copyRek = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT.number);
      setCopied(true);
    } catch {
      /* clipboard tidak tersedia, abaikan */
    }
  };

  const lines = items
    .map((it) => ({ ...it, product: getProduct(it.productId), size: getSize(it.sizeId) }))
    .filter((l) => l.product && l.size);
  const total = lines.reduce((sum, l) => sum + l.size.price * l.qty, 0);
  const ready = lines.length > 0 && name.trim().length > 0;
  const href = ready ? buildWhatsAppUrl(lines, { name }) : undefined;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Keranjang">
      <div className="absolute inset-0 bg-black/45" onClick={closeCart} />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper text-ink shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="font-display text-3xl font-medium">Keranjang</h2>
          <button onClick={closeCart} className="cursor-pointer text-sm text-mute hover:text-ink">
            Tutup
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="py-12">
              <p className="text-mute">Keranjang masih kosong.</p>
              <button
                onClick={closeCart}
                className="mt-4 cursor-pointer border-b border-ink pb-0.5 text-sm font-bold hover:border-gold hover:text-gold"
              >
                Pilih parfum
              </button>
            </div>
          ) : (
            <ul className="border-t border-line">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 border-b border-line py-4">
                  <div className="flex-1">
                    <p className="font-display text-xl leading-tight">{l.product.name}</p>
                    <p className="text-xs text-mute">
                      {l.size.label}, {l.size.volume}. {formatRupiah(l.size.price)} per botol
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <button
                          onClick={() => setQty(l.key, l.qty - 1)}
                          className="h-8 w-8 cursor-pointer rounded-full hover:bg-ink/5"
                          aria-label={`Kurangi ${l.product.name} ${l.size.volume}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-bold">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.key, l.qty + 1)}
                          className="h-8 w-8 cursor-pointer rounded-full hover:bg-ink/5"
                          aria-label={`Tambah ${l.product.name} ${l.size.volume}`}
                        >
                          +
                        </button>
                      </div>
                      <button onClick={() => removeItem(l.key)} className="cursor-pointer text-xs text-mute underline hover:text-gold">
                        Hapus
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-xl">{formatRupiah(l.size.price * l.qty)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="px-6 pb-6 pt-4">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-mute">Total</span>
              <span className="font-display text-3xl">{formatRupiah(total)}</span>
            </div>

            <label className="block text-xs text-mute">
              Nama
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" className={fieldCls} />
            </label>

            <div className="mt-4 border-t border-line pt-3 text-sm">
              <p className="text-xs text-mute">Pengambilan</p>
              <p className="mt-0.5 font-bold">{PICKUP.place}</p>
              <p className="text-mute">Pukul {PICKUP.time}</p>
            </div>

            <div className="mt-3 text-sm">
              <p className="text-xs text-mute">Pembayaran, transfer {PAYMENT.bank}</p>
              <div className="mt-0.5 flex items-center justify-between gap-3">
                <p className="font-bold tracking-wide">{PAYMENT.number}</p>
                <button
                  type="button"
                  onClick={copyRek}
                  className="cursor-pointer text-xs text-mute underline hover:text-gold"
                  aria-live="polite"
                >
                  {copied ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <p className="text-mute">a.n. {PAYMENT.holder}</p>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!ready) e.preventDefault();
              }}
              aria-disabled={!ready}
              className={`mt-5 block rounded-full px-8 py-4 text-center text-sm font-bold text-paper transition ${
                ready ? 'bg-ink hover:bg-gold' : 'cursor-not-allowed bg-ink/35'
              }`}
            >
              Pre-order lewat WhatsApp
            </a>
            <p className="mt-2 text-center text-xs text-mute">
              {ready ? 'Pesan sudah tertulis di WhatsApp, tinggal kirim.' : 'Isi nama dulu untuk melanjutkan.'}
            </p>

            <div className="mt-3 flex justify-between text-xs text-mute">
              <button onClick={closeCart} className="cursor-pointer underline hover:text-gold">
                Lanjut belanja
              </button>
              <button onClick={clearCart} className="cursor-pointer underline hover:text-gold">
                Kosongkan keranjang
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}