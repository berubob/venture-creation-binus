// Komposisi AURA terinspirasi dari dua parfum:
// YSL Libre Intense  : tangerine, bergamot, lavender / jasmine sambac, orange blossom, orchid / tonka, vanilla, ambergris, vetiver
// Escada Cherry in the Air : black cherry, raspberry, mandarin / gardenia, orchid, vanilla, marshmallow / sandalwood, oak, musk

// Nama node di aura_ingredients_3d.glb
const pod = (n) => [
  ...[1, 2, 3, 4, 5, 6].map((i) => `vanilla_pod_${n}_segment_${i}`),
  ...[1, 2, 3, 4, 5].map((i) => `vanilla_pod_${n}_joint_${i}`),
  `vanilla_ridge_${n}`,
];
const crystal = (i) => [`amber_resin_crystal_${i}`];

export const INGREDIENTS = [
  {
    id: 'mandarin',
    name: 'Mandarin',
    latin: 'Citrus reticulata',
    note: 'top',
    color: '#f28c28',
    accent: '#ffb866',
    description:
      'Mandarin dan tangerine adalah kerabat dekat bergamot yang lebih manis dan berair. Minyaknya dipress dingin dari kulit buah segar, dan kesan cerahnya muncul paling awal begitu botol dibuka. Bahan ini jadi benang merah dua inspirasi VNS: ia berada di puncak Libre Intense sekaligus Cherry in the Air.',
    facts: [
      { label: 'Asal', value: 'Mediterania dan Asia' },
      { label: 'Ekstraksi', value: 'Cold-press kulit buah' },
      { label: 'Kesan', value: 'Segar, manis, berair' },
    ],
    particles: {
      count: 12,
      size: 0.5,
      dir: 1,
      glow: '#7a3200',
      variants: [
        ['mandarin_fruit_1', 'mandarin_stem_1'],
        ['mandarin_fruit_2', 'mandarin_stem_2'],
        ['mandarin_fruit_3', 'mandarin_stem_3'],
      ],
    },
  },
  {
    id: 'cherry',
    name: 'Black Cherry',
    latin: 'Prunus cerasus (akord)',
    note: 'top',
    color: '#a3122f',
    accent: '#ff6b81',
    description:
      'Aroma ceri dalam parfum hampir selalu dibangun sebagai akord, karena buahnya tidak menghasilkan minyak yang bisa diekstraksi langsung. Hasilnya tidak sekadar manis: ada sisi asam yang segar dan sentuhan almond. Di AURA, ceri hitam membawa karakter ceria ala kebun ceri musim panas.',
    facts: [
      { label: 'Asal', value: 'Inspirasi kebun ceri' },
      { label: 'Ekstraksi', value: 'Akord, dirakit dari aroma buah' },
      { label: 'Kesan', value: 'Manis, sedikit asam, ceria' },
    ],
    particles: {
      count: 10,
      size: 0.6,
      dir: -1,
      glow: '#3d0010',
      variants: [
        ['black_cherry_1', 'black_cherry_2', 'black_cherry_3', 'cherry_stem_1', 'cherry_stem_2'],
      ],
    },
  },
  {
    id: 'orange-blossom',
    name: 'Orange Blossom',
    latin: 'Citrus aurantium (bunga)',
    note: 'heart',
    color: '#f3e6c4',
    accent: '#fff0c9',
    description:
      'Bunga jeruk pahit yang diolah menjadi absolut. Di Libre Intense, absolut orange blossom asal Maroko berhadapan dengan lavender dari Prancis, dan ketegangan itulah tanda tangannya. Di VNS ia menjadi inti floral yang lembut, creamy, dan hangat.',
    facts: [
      { label: 'Asal', value: 'Maroko' },
      { label: 'Ekstraksi', value: 'Absolut dari kuntum bunga' },
      { label: 'Kesan', value: 'Floral, creamy, hangat' },
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
    id: 'vanilla',
    name: 'Vanilla',
    latin: 'Vanilla planifolia',
    note: 'base',
    color: '#b8864b',
    accent: '#e9c58a',
    description:
      'Polong anggrek vanila diserbuki satu per satu dengan tangan, lalu dikeringkan berbulan-bulan sampai aromanya matang. Madagaskar adalah produsen terbesar dunia. Vanila adalah titik temu kedua inspirasi VNS: berpadu dengan tonka di Libre Intense, dan melembutkan ceri di Cherry in the Air.',
    facts: [
      { label: 'Asal', value: 'Madagaskar' },
      { label: 'Ekstraksi', value: 'Ekstrak dari polong kering' },
      { label: 'Kesan', value: 'Manis, creamy, nyaman' },
    ],
    particles: {
      count: 20,
      size: 0.8,
      dir: 1,
      glow: '#6b4423',
      variants: [pod(1), pod(2)],
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    latin: 'Ambergris, tonka, vetiver',
    note: 'base',
    color: '#c77a1c',
    accent: '#f0b45a',
    description:
      'Dasar yang menutup piramida aroma. Akord ambergris memberi kehangatan, biji tonka dari Amerika Selatan menambah sisi manis seperti kacang dan vanila, sementara vetiver (akar wangi) dari Haiti dan Jawa memberi tulang berkayu. Dialah jejak yang bertahan di kulit setelah note lain menghilang.',
    facts: [
      { label: 'Asal', value: 'Amerika Selatan, Haiti, Jawa' },
      { label: 'Ekstraksi', value: 'Akord, biji tonka, akar wangi' },
      { label: 'Kesan', value: 'Hangat, manis, berkayu' },
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
  { key: 'heart', label: 'Heart' },
  { key: 'base', label: 'Base' },
];