import { VARIANTS } from './variants';

export const WA_NUMBER = '6281316612997';

export const PICKUP = {
  place: 'Binus Anggrek, Balkon Lt. 3 Table 8',
  time: '09:00-11:00',
};

export const INSTAGRAM_URL =
  'https://www.instagram.com/vns.scent?utm_source=ig_web_button_share_sheet&dmpr=ZDNlZDc0MzIxNw==';

export const SIZES = [
  { id: '15ml', label: 'Small', volume: '15 ml', price: 50000 },
  { id: '3ml', label: 'Travel size', volume: '3 ml', price: 10000 },
];

const SPRAY_3ML = '/models/VNS_Spray_3ml_realsize_m.glb';

export const PRODUCTS = Object.values(VARIANTS).map((v) => ({
  id: v.id,
  name: v.name,
  tagline: v.tagline,
  desc: v.desc,
  color: v.color,
  models: { '15ml': v.model, '3ml': SPRAY_3ML, ingredients: v.ingredientsModel },
}));

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const getSize = (id) => SIZES.find((s) => s.id === id);

export const formatRupiah = (n) => `Rp ${n.toLocaleString('id-ID')}`;

export function buildWhatsAppUrl(lines, { name }) {
  const total = lines.reduce((sum, l) => sum + l.size.price * l.qty, 0);
  const rows = lines.map(
    (l, i) =>
      `${i + 1}. ${l.product.name} - ${l.size.label} ${l.size.volume} x${l.qty} = ${formatRupiah(l.size.price * l.qty)}`
  );
  const text = [
    'Halo VNS Scent, saya mau pre-order:',
    '',
    ...rows,
    '',
    `Total: ${formatRupiah(total)}`,
    '',
    `Nama: ${name.trim()}`,
    `Pengambilan: ${PICKUP.place}, pukul ${PICKUP.time}`,
    `Pembayaran: Transfer ${PAYMENT.bank}`,
    '',
    'Terima kasih!',
  ].join('\n');

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const PAYMENT = {
  bank: 'BCA',
  number: '7402365636', 
  holder: 'Johan Hendrawan', 
};