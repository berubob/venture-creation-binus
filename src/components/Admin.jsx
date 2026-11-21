import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PRODUCTS, SIZES, formatRupiah, getProduct, getSize } from '../data/products';

const input =
  'w-full border-0 border-b border-line bg-transparent py-2 text-ink focus:border-gold focus:outline-none';
const select = `${input} cursor-pointer`;

const tabCls = (on) =>
  `cursor-pointer border-b pb-1 font-display text-lg transition-colors ${
    on ? 'border-gold text-ink' : 'border-transparent text-mute hover:text-ink'
  }`;

/* ------------------------------------------------------------------ Login */

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr('Email atau password salah.');
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-24 max-w-sm px-6">
      <h1 className="font-display text-4xl font-medium">Admin VNS</h1>
      <label className="mt-8 block text-xs text-mute">
        Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
      </label>
      <label className="mt-4 block text-xs text-mute">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />
      </label>
      {err && <p className="mt-3 text-sm text-gold">{err}</p>}
      <button
        disabled={busy}
        className="mt-6 w-full cursor-pointer rounded-full bg-ink px-8 py-3.5 text-sm font-bold text-paper transition hover:bg-gold disabled:opacity-50"
      >
        Masuk
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------- Stok */

function StockRow({ product, size, qty, onSaved }) {
  const [value, setValue] = useState(String(qty ?? 0));
  const [status, setStatus] = useState('');

  useEffect(() => setValue(String(qty ?? 0)), [qty]);

  const next = Math.max(0, Math.floor(Number(value) || 0));
  const changed = next !== (qty ?? 0);

  const save = async (n = next) => {
    setStatus('Menyimpan…');
    const { error } = await supabase
      .from('stock')
      .upsert(
        { product_id: product.id, size_id: size.id, qty: n, updated_at: new Date().toISOString() },
        { onConflict: 'product_id,size_id' }
      );
    if (error) {
      setStatus('Gagal: ' + error.message);
      return;
    }
    setStatus('Tersimpan');
    onSaved();
    setTimeout(() => setStatus(''), 1500);
  };

  const bump = (d) => {
    const n = Math.max(0, next + d);
    setValue(String(n));
    save(n);
  };

  return (
    <li className="flex flex-wrap items-center gap-4 border-b border-line py-4">
      <div className="min-w-40 flex-1">
        <p className="font-display text-xl">{product.name}</p>
        <p className="text-xs text-mute">
          {size.label}, {size.volume}
        </p>
      </div>

      <div className="flex items-center">
        <button onClick={() => bump(-1)} className="h-9 w-9 cursor-pointer rounded-full hover:bg-ink/5" aria-label="Kurangi">
          −
        </button>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-16 border-0 border-b border-line bg-transparent text-center font-bold focus:border-gold focus:outline-none"
        />
        <button onClick={() => bump(1)} className="h-9 w-9 cursor-pointer rounded-full hover:bg-ink/5" aria-label="Tambah">
          +
        </button>
      </div>

      <button
        onClick={() => save()}
        disabled={!changed}
        className="cursor-pointer rounded-full bg-ink px-5 py-2 text-xs font-bold text-paper transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-30"
      >
        Simpan
      </button>
      <span className="w-28 text-xs text-mute" aria-live="polite">
        {status}
      </span>
    </li>
  );
}

function StockTable() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    const { data, error } = await supabase.from('stock').select('product_id,size_id,qty');
    if (error) return setErr(error.message);
    const map = {};
    data.forEach((r) => (map[`${r.product_id}:${r.size_id}`] = r.qty));
    setRows(map);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      {err && <p className="text-sm text-gold">Gagal memuat: {err}</p>}
      {!rows && !err && <p className="text-mute">Memuat…</p>}

      {rows && (
        <ul className="border-t border-line">
          {PRODUCTS.flatMap((p) =>
            SIZES.map((s) => (
              <StockRow key={`${p.id}:${s.id}`} product={p} size={s} qty={rows[`${p.id}:${s.id}`]} onSaved={load} />
            ))
          )}
        </ul>
      )}

      <p className="mt-8 text-xs text-mute">
        Stok juga berkurang otomatis saat kamu mencatat penjualan di tab Penjualan (kalau opsinya dicentang).
        Jangan kurangi manual di sini untuk pesanan yang sama, supaya tidak terpotong dua kali.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- Penjualan */

const PERIODS = [
  { id: 'all', label: 'Semua' },
  { id: 'today', label: 'Hari ini' },
  { id: '7d', label: '7 hari' },
  { id: 'month', label: 'Bulan ini' },
];

function inPeriod(iso, period) {
  if (period === 'all') return true;
  const d = new Date(iso);
  const now = new Date();
  if (period === 'today') return d.toDateString() === now.toDateString();
  if (period === '7d') return now - d <= 7 * 24 * 3600 * 1000;
  if (period === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  return true;
}

const emptyLine = () => ({ productId: PRODUCTS[0].id, sizeId: SIZES[0].id, qty: 1 });

function SaleForm({ onSaved }) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [lines, setLines] = useState([emptyLine()]);
  const [deduct, setDeduct] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const patch = (i, p) => setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...p } : l)));
  const total = lines.reduce((sum, l) => sum + getSize(l.sizeId).price * l.qty, 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr('Isi nama pembeli.');
    setBusy(true);
    setErr('');
    const items = lines.map((l) => ({
      product_id: l.productId,
      size_id: l.sizeId,
      qty: l.qty,
      unit_price: getSize(l.sizeId).price,
    }));
    const { error } = await supabase.rpc('record_sale', {
      p_customer: name,
      p_note: note,
      p_items: items,
      p_deduct: deduct,
    });
    setBusy(false);
    if (error) {
      setErr(error.message.includes('stock_qty_check') ? 'Stok tidak cukup untuk salah satu barang.' : error.message);
      return;
    }
    setName('');
    setNote('');
    setLines([emptyLine()]);
    onSaved();
  };

  return (
    <form onSubmit={submit} className="border border-line p-5">
      <h2 className="font-display text-2xl">Catat penjualan</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block text-xs text-mute">
          Nama pembeli
          <input required value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </label>
        <label className="block text-xs text-mute">
          Catatan (opsional)
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: transfer BCA, ambil Senin"
            className={input}
          />
        </label>
      </div>

      <ul className="mt-5 space-y-3">
        {lines.map((l, i) => (
          <li key={i} className="flex flex-wrap items-end gap-3">
            <label className="min-w-32 flex-1 text-xs text-mute">
              Parfum
              <select value={l.productId} onChange={(e) => patch(i, { productId: e.target.value })} className={select}>
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-32 flex-1 text-xs text-mute">
              Ukuran
              <select value={l.sizeId} onChange={(e) => patch(i, { sizeId: e.target.value })} className={select}>
                {SIZES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} {s.volume}
                  </option>
                ))}
              </select>
            </label>
            <label className="w-20 text-xs text-mute">
              Jumlah
              <input
                type="number"
                min="1"
                value={l.qty}
                onChange={(e) => patch(i, { qty: Math.max(1, Math.floor(Number(e.target.value) || 1)) })}
                className={`${input} text-center`}
              />
            </label>
            <span className="w-28 pb-2 text-right font-display text-lg">
              {formatRupiah(getSize(l.sizeId).price * l.qty)}
            </span>
            {lines.length > 1 && (
              <button
                type="button"
                onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))}
                className="cursor-pointer pb-2 text-xs text-mute underline hover:text-gold"
              >
                Hapus
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setLines((ls) => [...ls, emptyLine()])}
        className="mt-3 cursor-pointer border-b border-ink pb-0.5 text-xs font-bold hover:border-gold hover:text-gold"
      >
        + Tambah barang
      </button>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={deduct} onChange={(e) => setDeduct(e.target.checked)} />
          Kurangi stok otomatis
        </label>
        <div className="flex items-center gap-5">
          <span className="font-display text-2xl">{formatRupiah(total)}</span>
          <button
            disabled={busy}
            className="cursor-pointer rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper transition hover:bg-gold disabled:opacity-50"
          >
            {busy ? 'Menyimpan…' : 'Catat'}
          </button>
        </div>
      </div>
      {err && (
        <p className="mt-3 text-sm text-gold" aria-live="polite">
          {err}
        </p>
      )}
    </form>
  );
}

const itemText = (it) =>
  `${getProduct(it.product_id)?.name ?? it.product_id} ${getSize(it.size_id)?.volume ?? it.size_id} ×${it.qty}`;

function SalesTab() {
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState('');
  const [period, setPeriod] = useState('all');

  const load = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id,created_at,customer_name,note,total,order_items(product_id,size_id,qty,unit_price)')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) {
      setErr(error.message);
      return;
    }
    setErr('');
    setOrders(data);
  };

  useEffect(() => {
    load();
  }, []);

  const shown = useMemo(() => (orders ?? []).filter((o) => inPeriod(o.created_at, period)), [orders, period]);

  const summary = useMemo(() => {
    let revenue = 0;
    let bottles = 0;
    const by = {};
    shown.forEach((o) => {
      revenue += o.total;
      o.order_items.forEach((it) => {
        bottles += it.qty;
        const k = `${it.product_id}:${it.size_id}`;
        by[k] = by[k] || { key: k, productId: it.product_id, sizeId: it.size_id, qty: 0, revenue: 0 };
        by[k].qty += it.qty;
        by[k].revenue += it.qty * it.unit_price;
      });
    });
    return {
      revenue,
      bottles,
      count: shown.length,
      rows: Object.values(by).sort((a, b) => b.revenue - a.revenue),
    };
  }, [shown]);

  const remove = async (o) => {
    if (!window.confirm(`Hapus transaksi ${o.customer_name} (${formatRupiah(o.total)})?`)) return;
    const restock = window.confirm(
      'Kembalikan stok botolnya ke inventaris?\n\nOK = kembalikan stok. Batal = transaksi tetap dihapus, stok tidak diubah.'
    );
    const { error } = await supabase.rpc('delete_sale', { p_order_id: o.id, p_restock: restock });
    if (error) {
      setErr(error.message);
      return;
    }
    load();
  };

  return (
    <div className="space-y-8">
      <SaleForm onSaved={load} />

      {err && (
        <p className="text-sm text-gold">
          Gagal memuat transaksi: {err}
          {/relation|schema cache|function/i.test(err) && ' (Sudah menjalankan transactions.sql di Supabase?)'}
        </p>
      )}
      {!orders && !err && <p className="text-mute">Memuat…</p>}

      {orders && (
        <>
          <div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {PERIODS.map((p) => (
                <button key={p.id} onClick={() => setPeriod(p.id)} className={tabCls(p.id === period)}>
                  {p.label}
                </button>
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-4 border-y border-line py-5">
              <div>
                <dt className="text-xs text-mute">Pendapatan</dt>
                <dd className="mt-1 font-display text-2xl md:text-3xl">{formatRupiah(summary.revenue)}</dd>
              </div>
              <div>
                <dt className="text-xs text-mute">Transaksi</dt>
                <dd className="mt-1 font-display text-2xl md:text-3xl">{summary.count}</dd>
              </div>
              <div>
                <dt className="text-xs text-mute">Botol terjual</dt>
                <dd className="mt-1 font-display text-2xl md:text-3xl">{summary.bottles}</dd>
              </div>
            </dl>

            {summary.rows.length > 0 && (
              <ul className="mt-4 text-sm">
                {summary.rows.map((r) => (
                  <li key={r.key} className="flex justify-between gap-4 border-b border-line py-2">
                    <span>
                      {getProduct(r.productId)?.name ?? r.productId} {getSize(r.sizeId)?.volume ?? r.sizeId}
                      <span className="text-mute"> · {r.qty} botol</span>
                    </span>
                    <span className="font-bold">{formatRupiah(r.revenue)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl">Riwayat transaksi</h2>
            {shown.length === 0 ? (
              <p className="mt-3 text-sm text-mute">Belum ada transaksi pada periode ini.</p>
            ) : (
              <ul className="mt-3 border-t border-line">
                {shown.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-line py-4">
                    <div className="min-w-48 flex-1">
                      <p className="font-bold">{o.customer_name}</p>
                      <p className="text-xs text-mute">
                        {new Date(o.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      <p className="mt-1 text-sm text-mute">{o.order_items.map(itemText).join(', ')}</p>
                      {o.note && <p className="mt-1 text-xs italic text-mute">{o.note}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl">{formatRupiah(o.total)}</p>
                      <button
                        onClick={() => remove(o)}
                        className="mt-1 cursor-pointer text-xs text-mute underline hover:text-gold"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {orders.length >= 1000 && (
              <p className="mt-3 text-xs text-mute">Menampilkan 1000 transaksi terbaru.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- Dashboard */

function Dashboard({ session }) {
  const [tab, setTab] = useState('stok');

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-4xl font-medium">Admin VNS</h1>
        <div className="text-right text-xs text-mute">
          <p>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} className="cursor-pointer underline hover:text-gold">
            Keluar
          </button>
        </div>
      </div>

      <div className="mb-6 mt-6 flex gap-7">
        <button onClick={() => setTab('stok')} className={tabCls(tab === 'stok')}>
          Stok
        </button>
        <button onClick={() => setTab('penjualan')} className={tabCls(tab === 'penjualan')}>
          Penjualan
        </button>
      </div>

      {tab === 'stok' ? <StockTable /> : <SalesTab />}
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = masih mengecek

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div data-theme="yisery" className="fixed inset-0 overflow-y-auto bg-paper font-sans text-ink">
      {!supabase ? (
        <p className="p-10 text-mute">VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY belum diisi.</p>
      ) : session === undefined ? null : session ? (
        <Dashboard session={session} />
      ) : (
        <Login />
      )}
    </div>
  );
}