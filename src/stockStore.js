import { useSyncExternalStore } from 'react';
import { supabase } from './lib/supabase';

let state = { map: {}, loaded: false };
const subs = new Set();
const emit = () => subs.forEach((fn) => fn());
const keyOf = (p, s) => `${p}:${s}`;

export async function loadStock() {
  if (!supabase) return;
  const { data, error } = await supabase.from('stock').select('product_id,size_id,qty');
  if (error || !data) return;
  const map = {};
  data.forEach((r) => {
    map[keyOf(r.product_id, r.size_id)] = r.qty;
  });
  state = { map, loaded: true };
  emit();
}

let started = false;
function init() {
  if (started || !supabase) return;
  started = true;
  loadStock();
  supabase
    .channel('stock-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stock' }, loadStock)
    .subscribe();
}

const subscribe = (fn) => {
  init();
  subs.add(fn);
  return () => subs.delete(fn);
};

// Non-hook: dipakai cartStore untuk membatasi jumlah. null = belum diketahui (jangan membatasi).
export const getStock = (productId, sizeId) => state.map[keyOf(productId, sizeId)] ?? null;

// number = jumlah stok, null = belum diketahui atau Supabase tidak terjangkau (pembeli tetap boleh memesan)
export const useStock = (productId, sizeId) =>
  useSyncExternalStore(subscribe, () => state.map[keyOf(productId, sizeId)] ?? null);

// Seluruh peta stok (kunci "productId:sizeId"). Referensinya berubah hanya saat data dimuat ulang.
export const useStockMap = () => useSyncExternalStore(subscribe, () => state.map);