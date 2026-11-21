import { useEffect, useState } from 'react';
import { getProduct, getSize } from '../data/products';
import {
  buildWhatsAppUrl, cartTotal, clearCart, lineTotal, removeItem, rupiah, setQty, useCart,
} from '../cartStore';

const FIELD =
  'mt-1 w-full rounded-sm border-2 border-ink/50 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-gold-deep focus:outline-none';

export default function Cart({ open, onClose, onShop }) {
  const items = useCart();
  const [form, setForm] = useState({ name: '', address: '', note: '' });

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const ready = items.length > 0 && form.name.trim() && form.address.trim();

  const send = (e) => {
    e.preventDefault();
    if (!ready) return;
    window.open(buildWhatsAppUrl(items, form), '_blank', 'noopener');
  };

  return (
    <div className="fixed inset-0 z-70 flex justify-end" role="dialog" aria-modal="true" aria-label="Keranjang">
      <button aria-label="Tutup keranjang" onClick={onClose} className="absolute inset-0 cursor-default bg-ink/50" />

      <form onSubmit={send} className="relative flex h-full w-full max-w-md flex-col bg-paper-card font-sans text-ink shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-ink/20 px-5 py-4">
          <h2 className="font-serif text-2xl font-black">Keranjang</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-sm font-semibold hover:text-gold-deep">Tutup ✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-ink-soft">Keranjang masih kosong.</p>
              <button type="button" onClick={onShop} className="mt-4 cursor-pointer rounded-full bg-ink px-6 py-2 text-sm font-semibold text-paper hover:bg-gold-deep">
                Lihat koleksi
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-ink/15">
                {items.map((it) => {
                  const p = getProduct(it.productId);
                  const s = getSize(it.sizeId);
                  return (
                    <li key={`${it.productId}-${it.sizeId}`} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-ink-soft">{s.label} · {rupiah(s.price)}</p>
                        <button type="button" onClick={() => removeItem(it.productId, it.sizeId)} className="mt-1 cursor-pointer text-xs underline hover:text-gold-deep">Hapus</button>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center rounded-full border-2 border-ink">
                          <button type="button" aria-label="Kurangi" onClick={() => setQty(it.productId, it.sizeId, it.qty - 1)} className="h-8 w-8 cursor-pointer">&minus;</button>
                          <span className="w-7 text-center text-sm font-semibold">{it.qty}</span>
                          <button type="button" aria-label="Tambah" onClick={() => setQty(it.productId, it.sizeId, it.qty + 1)} className="h-8 w-8 cursor-pointer">+</button>
                        </div>
                        <p className="mt-1 text-sm font-bold text-gold-deep">{rupiah(lineTotal(it))}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 space-y-3">
                <label className="block text-sm font-semibold">Nama
                  <input required value={form.name} onChange={set('name')} placeholder="Nama penerima" className={FIELD} />
                </label>
                <label className="block text-sm font-semibold">Alamat
                  <textarea required rows={3} value={form.address} onChange={set('address')} placeholder="Alamat lengkap pengiriman" className={FIELD} />
                </label>
                <label className="block text-sm font-semibold">Catatan (opsional)
                  <input value={form.note} onChange={set('note')} placeholder="Contoh: bungkus kado" className={FIELD} />
                </label>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t-2 border-ink/20 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-xl font-bold">{rupiah(cartTotal(items))}</span>
            </div>
            <button
              type="submit"
              disabled={!ready}
              className="mt-3 w-full cursor-pointer bg-gold-deep px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pre-order via WhatsApp
            </button>
            <p className="mt-2 text-center text-xs text-ink-soft">Pesan sudah tertulis otomatis, tinggal tekan kirim di WhatsApp.</p>
            <button type="button" onClick={clearCart} className="mt-2 w-full cursor-pointer text-xs underline hover:text-gold-deep">Kosongkan keranjang</button>
          </div>
        )}
      </form>
    </div>
  );
}
