import { useSyncExternalStore } from 'react';
import { DEFAULT_VARIANT, VARIANTS } from './data/variants';
import { getStock } from './stockStore';

const KEY = 'vns-cart-v1';
const VARIANT_KEY = 'vns-variant-v1';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function loadVariant() {
  try {
    const v = localStorage.getItem(VARIANT_KEY);
    return v && VARIANTS[v] ? v : DEFAULT_VARIANT;
  } catch {
    return DEFAULT_VARIANT;
  }
}

const initialVariant = loadVariant();

let state = {
  items: load(),
  variant: initialVariant,
  shopOpen: false,
  shopProduct: initialVariant,
  cartOpen: false,
};
const subs = new Set();

function set(patch) {
  state = { ...state, ...patch };
  if (patch.items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.items));
    } catch {
      /* penyimpanan tidak tersedia, abaikan */
    }
  }
  if (patch.variant) {
    try {
      localStorage.setItem(VARIANT_KEY, state.variant);
    } catch {
      /* abaikan */
    }
  }
  subs.forEach((fn) => fn());
}

const subscribe = (fn) => {
  subs.add(fn);
  return () => subs.delete(fn);
};

export const useStore = (selector) => useSyncExternalStore(subscribe, () => selector(state));

export const useCartCount = () => useStore((s) => s.items.reduce((n, it) => n + it.qty, 0));

export function setVariant(id) {
  if (!VARIANTS[id] || id === state.variant) return;
  set({ variant: id, shopProduct: id });
}

// Batas jumlah satu baris: stok di database (kalau diketahui), maksimal 99.
const cap = (productId, sizeId) => {
  const stock = getStock(productId, sizeId);
  return stock == null ? 99 : Math.min(99, stock);
};

export function addItem(productId, sizeId, qty = 1) {
  const key = `${productId}:${sizeId}`;
  const found = state.items.find((it) => it.key === key);
  const current = found?.qty ?? 0;
  const next = Math.min(cap(productId, sizeId), current + qty);
  if (next <= 0 || next === current) return; // stok habis atau sudah di batas
  const items = found
    ? state.items.map((it) => (it.key === key ? { ...it, qty: next } : it))
    : [...state.items, { key, productId, sizeId, qty: next }];
  set({ items });
}

export function setQty(key, qty) {
  if (qty <= 0) return removeItem(key);
  const it = state.items.find((x) => x.key === key);
  if (!it) return;
  // Menambah dibatasi stok; mengurangi selalu boleh (termasuk saat stok sudah di bawah isi keranjang)
  const next = qty > it.qty ? Math.min(qty, Math.max(it.qty, cap(it.productId, it.sizeId))) : qty;
  if (next === it.qty) return;
  set({ items: state.items.map((x) => (x.key === key ? { ...x, qty: next } : x)) });
}

// Dipakai saat stok berubah setelah barang masuk keranjang: turunkan ke stok yang tersedia, hapus yang habis.
export function fitCartToStock() {
  const items = state.items.flatMap((it) => {
    const stock = getStock(it.productId, it.sizeId);
    if (stock == null || it.qty <= stock) return [it];
    return stock > 0 ? [{ ...it, qty: stock }] : [];
  });
  set({ items });
}

export const removeItem = (key) => set({ items: state.items.filter((it) => it.key !== key) });
export const clearCart = () => set({ items: [] });

export const openShop = (productId) => set({ shopOpen: true, shopProduct: productId ?? state.variant });
export const closeShop = () => set({ shopOpen: false });
export const selectProduct = (productId) => set({ shopProduct: productId });
export const openCart = () => set({ cartOpen: true });
export const closeCart = () => set({ cartOpen: false });
export const openNotes = () => set({ notesOpen: true });
export const closeNotes = () => set({ notesOpen: false });