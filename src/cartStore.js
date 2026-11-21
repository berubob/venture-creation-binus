import { useSyncExternalStore } from 'react';
import { DEFAULT_VARIANT, VARIANTS } from './data/variants';

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

export function addItem(productId, sizeId, qty = 1) {
  const key = `${productId}:${sizeId}`;
  const found = state.items.find((it) => it.key === key);
  const items = found
    ? state.items.map((it) => (it.key === key ? { ...it, qty: Math.min(99, it.qty + qty) } : it))
    : [...state.items, { key, productId, sizeId, qty }];
  set({ items });
}

export function setQty(key, qty) {
  if (qty <= 0) return removeItem(key);
  set({ items: state.items.map((it) => (it.key === key ? { ...it, qty: Math.min(99, qty) } : it)) });
}

export const removeItem = (key) => set({ items: state.items.filter((it) => it.key !== key) });
export const clearCart = () => set({ items: [] });

export const openShop = (productId) => set({ shopOpen: true, shopProduct: productId ?? state.variant });
export const closeShop = () => set({ shopOpen: false });
export const selectProduct = (productId) => set({ shopProduct: productId });
export const openCart = () => set({ cartOpen: true });
export const closeCart = () => set({ cartOpen: false });
