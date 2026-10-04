export const INGREDIENTS = [
  {
    id: 'bergamot',
    name: 'Bergamot',
    latin: 'Citrus bergamia',
    note: 'top', 
    color: '#b9cf2a',
    accent: '#d9e86a', 
    description:
      'Jeruk berkulit hijau-kuning yang hampir seluruhnya tumbuh di pesisir Calabria, Italia selatan. Minyaknya dipress dingin dari kulit buah. Inilah kesan segar yang pertama tercium saat botol dibuka, dan aroma yang sama memberi karakter pada teh Earl Grey.',
    facts: [
      { label: 'Asal', value: 'Calabria, Italia' },
      { label: 'Ekstraksi', value: 'Cold-press kulit buah' },
      { label: 'Kesan', value: 'Segar, cerah, sedikit pahit' },
    ],
    particles: {
      shape: 'sphere', 
      count: 16,
      size: 0.2,
      stretch: [1, 0.92, 1],
      color: '#b9cf2a',
      emissive: '#4d5a00',
      emissiveIntensity: 0.25,
      roughness: 0.45,
      metalness: 0,
      dir: 1, 
    },
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    latin: 'Jasminum grandiflorum',
    note: 'heart',
    color: '#f3e9d2',
    accent: '#fff1cf',
    description:
      'Bunganya dipetik dengan tangan saat fajar, ketika kandungan minyaknya paling pekat. Dibutuhkan ribuan kuntum untuk satu gram absolut, itulah sebabnya jasmine dijuluki raja bunga dalam dunia parfum. Pusat produksinya ada di Grasse, Prancis, serta Mesir dan India.',
    facts: [
      { label: 'Asal', value: 'Grasse (Prancis), Mesir, India' },
      { label: 'Ekstraksi', value: 'Absolut, dari bunga yang dipetik saat fajar' },
      { label: 'Kesan', value: 'Floral, hangat, sensual' },
    ],
    particles: {
      shape: 'sphere',
      count: 44,
      size: 0.22,
      stretch: [0.42, 1.25, 0.1], 
      color: '#fff7e6',
      emissive: '#ffe9b0',
      emissiveIntensity: 0.3,
      roughness: 0.6,
      metalness: 0,
      dir: -1,
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    latin: 'Labdanum, benzoin, vanila',
    note: 'base',
    color: '#c77a1c',
    accent: '#f0b45a',
    description:
      'Amber dalam parfum bukan batu fosil. Ia adalah akord hangat yang disusun dari getah labdanum Mediterania, resin benzoin (kemenyan) dari Sumatra, dan vanila. Dialah jejak yang bertahan berjam-jam di kulit setelah note lain menghilang.',
    facts: [
      { label: 'Asal', value: 'Mediterania dan Sumatra' },
      { label: 'Ekstraksi', value: 'Resin getah pohon, disusun jadi akord' },
      { label: 'Kesan', value: 'Hangat, manis, tahan lama' },
    ],
    particles: {
      shape: 'dodeca',
      count: 22,
      size: 0.17,
      stretch: [1, 1, 1],
      color: '#d98b1f',
      emissive: '#7a3d00',
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.3,
      dir: 1,
    },
  },
];

export const PAGES = INGREDIENTS.length + 2;

export const NOTE_LEVELS = [
  { key: 'top', label: 'Top' },
  { key: 'heart', label: 'Heart' },
  { key: 'base', label: 'Base' },
];