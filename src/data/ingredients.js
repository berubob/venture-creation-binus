// Bahan UTAMA Yisery: punya model 3D dan satu halaman scroll sendiri.
// Top    : Cherry, Lavender            (pendukung: Bergamot, lihat supporting.js)
// Middle : Orange Blossom, Jasmine
// Base   : Vanilla, Amber              (pendukung: Musk, lihat supporting.js)

// Nama node di yisery_ingredients_3d.glb
// CATATAN: GLB yang ada sekarang baru memuat cherry, orange blossom, vanilla, dan amber.
// Node lavender_* dan jasmine_* di bawah harus ditambahkan ke GLB (tanpa itu keduanya belum tampil, tetapi halaman tidak error).
const pod = (n) => [
  ...[1, 2, 3, 4, 5, 6].map((i) => `vanilla_pod_${n}_segment_${i}`),
  ...[1, 2, 3, 4, 5].map((i) => `vanilla_pod_${n}_joint_${i}`),
  `vanilla_ridge_${n}`,
];
const crystal = (i) => [`amber_resin_crystal_${i}`];
const lavender = (n) => [`lavender_stem_${n}`, `lavender_florets_${n}`, `lavender_leaves_${n}`];
const jasmineBlossom = (n) => [`jasmine_b${n}_petals`, `jasmine_b${n}_tube`, `jasmine_b${n}_calyx`, `jasmine_b${n}_dew`];
const jasmineBud = (n) => [`jasmine_bud_${n}`, `jasmine_bud_${n}_calyx`];

export const INGREDIENTS = [
  {
    id: 'cherry',
    name: 'Cherry',
    latin: 'Prunus avium',
    note: 'top',
    color: '#a3122f',
    accent: '#ff6b81',
    description:
      'Membawa ledakan manis buah beri merah yang pekat, sedikit asam, dan menggoda di semprotan pertama. Memberikan karakter bold dan sensual yang langsung mencuri perhatian sejak detik awal.',
    facts: [
      { label: 'Asal', value: 'Eropa dan Asia Barat' },
      { label: 'Ekstraksi', value: 'Rekonstruksi molekul aromatik (benzaldehyde dan ekstrak buah)' },
      { label: 'Kesan', value: 'Manis pekat, juicy, sensual, berani' },
    ],
    particles: {
      count: 10,
      size: 0.6,
      dir: -1,
      glow: '#3d0010',
      variants: [['black_cherry_1', 'black_cherry_2', 'black_cherry_3', 'cherry_stem_1', 'cherry_stem_2']],
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    latin: 'Lavandula angustifolia',
    note: 'top',
    color: '#7a5aa8',
    accent: '#b79ae0',
    description:
      'Bunga herbal aromatik yang memberikan kesan bersih, menenangkan, dan elegan. Kehadirannya menyeimbangkan rasa manis ceri agar terasa lebih dewasa, segar, dan berkelas.',
    facts: [
      { label: 'Asal', value: 'Provence, Prancis dan Mediterania' },
      { label: 'Ekstraksi', value: 'Distilasi uap pucuk bunga segar' },
      { label: 'Kesan', value: 'Aromatik bersih, herbal segar, menenangkan, elegan' },
    ],
    particles: {
      count: 14,
      size: 0.75,
      dir: 1,
      glow: '#2a1a4a',
      variants: [lavender(1), lavender(2)],
    },
  },
  {
    id: 'orange-blossom',
    name: 'Orange Blossom',
    latin: 'Citrus × sinensis',
    note: 'middle',
    color: '#f3e1b0',
    accent: '#fff0c9',
    description:
      'Bunga putih dari pohon jeruk yang memancarkan aroma madu lembut, cerah, dan bersih. Menjadi jembatan transisi yang bercahaya antara kesegaran buah di awal dan kehangatan dasar parfum.',
    facts: [
      { label: 'Asal', value: 'Tunisia, Maroko, dan Mediterania' },
      { label: 'Ekstraksi', value: 'Ekstraksi pelarut dan distilasi uap kelopak bunga' },
      { label: 'Kesan', value: 'Floral cerah, manis madu lembut, bersih, mewah' },
    ],
    particles: {
      count: 30,
      size: 0.5,
      dir: -1,
      glow: '#ffe9b0',
      variants: [
        [
          'orange_blossom_center',
          ...[1, 2, 3, 4, 5].map((i) => `orange_blossom_petal_${i}`),
        ],
      ],
    },
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    latin: 'Jasminum grandiflorum',
    note: 'middle',
    color: '#d9d4b8',
    accent: '#f6f1df',
    description:
      'Bunga putih klasik yang memberikan dimensi sensual, kaya, dan memikat pada inti parfum. Memperkuat karakter elegan dari Orange Blossom dengan sentuhan floral yang lebih dalam.',
    facts: [
      { label: 'Asal', value: 'India, Mesir, dan Grasse (Prancis)' },
      { label: 'Ekstraksi', value: 'Enfleurage modern atau ekstraksi pelarut kelopak bunga' },
      { label: 'Kesan', value: 'Floral mewah, sensual, lembut, memikat' },
    ],
    particles: {
      count: 22,
      size: 0.55,
      dir: 1,
      glow: '#fff3c4',
      variants: [jasmineBlossom(1), jasmineBlossom(2), jasmineBud(1), jasmineBud(2)],
    },
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    latin: 'Vanilla planifolia',
    note: 'base',
    color: '#b8864b',
    accent: '#e9c58a',
    description:
      'Diambil dari polong anggrek yang difermentasi, vanila menghadirkan selimut manis yang creamy dan hangat. Ia menyatu sempurna dengan jejak ceri dari fase awal, menciptakan akhir aroma yang lembut dan adiktif.',
    facts: [
      { label: 'Asal', value: 'Madagaskar dan Meksiko' },
      { label: 'Ekstraksi', value: 'Ekstraksi pelarut dari polong kering terfermentasi' },
      { label: 'Kesan', value: 'Manis lembut, creamy, hangat, menenangkan' },
    ],
    particles: {
      count: 20,
      size: 0.8,
      dir: -1,
      glow: '#6b4423',
      variants: [pod(1), pod(2)],
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    latin: 'Resina fossilis (resin fosil, akord balsamik)',
    note: 'base',
    color: '#c77a1c',
    accent: '#f0b45a',
    description:
      'Memberikan kedalaman resin keemasan yang hangat, kaya, dan tahan lama di kulit. Amber mengunci seluruh susunan bunga putih dan vanila agar meninggalkan jejak aroma yang berkelas hingga berjam-jam.',
    facts: [
      { label: 'Asal', value: 'Wilayah Baltik dan Timur Tengah' },
      { label: 'Ekstraksi', value: 'Infusi resin alam (labdanum, benzoin) dan molekul amber' },
      { label: 'Kesan', value: 'Hangat keemasan, balsamik, dalam, tahan lama' },
    ],
    particles: {
      count: 20,
      size: 0.35,
      dir: 1,
      flat: true,
      glow: '#7a3d00',
      variants: [1, 2, 3, 4, 5].map(crystal),
    },
  },
];

export const PAGES = INGREDIENTS.length + 2;

export const NOTE_LEVELS = [
  { key: 'top', label: 'Top' },
  { key: 'middle', label: 'Middle' },
  { key: 'base', label: 'Base' },
];