import { formatRupiah } from '../data/products';

const ALIGN = { start: 'items-start', center: 'items-center', end: 'items-end' };

// Harga sebuah ukuran. Kalau size.normalPrice lebih tinggi dari size.price, harga normal
// dicoret di atas harga diskon. Ukuran font diatur lewat className dari pemanggil.
export default function Price({ size, qty = 1, align = 'end', className = '' }) {
  const sale = size.normalPrice && size.normalPrice > size.price;
  return (
    <span className={`inline-flex flex-col leading-tight ${ALIGN[align]} ${className}`}>
      {sale && <del className="font-sans text-xs text-mute">{formatRupiah(size.normalPrice * qty)}</del>}
      <span>{formatRupiah(size.price * qty)}</span>
    </span>
  );
}