export const MIDBEL_INGREDIENTS = [
  {
    id: 'pineapple',
    name: 'Pineapple',
    latin: 'Ananas comosus (akord)',
    note: 'top',
    color: '#e3b021',
    accent: '#f5d46b',
    description:
      'Nanas tidak menghasilkan minyak atsiri yang bisa diekstraksi langsung, jadi aromanya dibangun sebagai akord dari molekul aroma buah. Hasilnya juicy, manis, dan tropis. Bahan ini membuka Midbel dengan kesan segar yang langsung terasa begitu botol dibuka.',
    facts: [
      { label: 'Asal', value: 'Inspirasi buah tropis' },
      { label: 'Ekstraksi', value: 'Akord, dirakit dari molekul aroma' },
      { label: 'Kesan', value: 'Juicy, manis, tropis' },
    ],
    particles: {
      count: 12,
      size: 0.7,
      dir: 1,
      glow: '#6b4a00',
      variants: [
        ['pineapple_slice_flesh', 'pineapple_slice_core', 'pineapple_slice_skin', 'pineapple_slice_droplets'],
        ['pineapple_chunk'],
      ],
    },
  },
  {
    id: 'green-apple',
    name: 'Green Apple',
    latin: 'Malus domestica (akord)',
    note: 'top',
    color: '#8fb82a',
    accent: '#c3e06a',
    description:
      'Seperti nanas, aroma apel hijau dibuat sebagai akord. Karakternya renyah dan sedikit asam, memberi sisi basah yang bersih di puncak aroma sebelum bahan yang lebih hangat mengambil alih.',
    facts: [
      { label: 'Asal', value: 'Inspirasi apel hijau' },
      { label: 'Ekstraksi', value: 'Akord, dirakit dari molekul aroma' },
      { label: 'Kesan', value: 'Renyah, segar, sedikit asam' },
    ],
    particles: {
      count: 12,
      size: 0.55,
      dir: -1,
      glow: '#2f4a00',
      variants: [
        ['apple_body', 'apple_stem'],
        ['apple_wedge_skin', 'apple_wedge_flesh', 'apple_wedge_core', 'apple_seeds'],
      ],
    },
  },
  {
    id: 'bergamot',
    name: 'Bergamot',
    latin: 'Citrus bergamia',
    note: 'top',
    color: '#c6c43a',
    accent: '#e8e68a',
    description:
      'Bergamot terkenal berasal dari wilayah Calabria di Italia. Minyaknya dipress dingin dari kulit buah dan memberi kesan citrus yang cerah dengan sedikit rasa pahit. Bahan ini menjembatani puncak yang segar dengan jantung yang lebih hangat.',
    facts: [
      { label: 'Asal', value: 'Calabria, Italia' },
      { label: 'Ekstraksi', value: 'Cold-press kulit buah' },
      { label: 'Kesan', value: 'Citrus, cerah, sedikit pahit' },
    ],
    particles: {
      count: 14,
      size: 0.5,
      dir: 1,
      glow: '#4a4a00',
      variants: [
        ['bergamot_peel', 'bergamot_rim', 'bergamot_pith', 'bergamot_pulp', 'bergamot_core'],
        ['bergamot_b_peel', 'bergamot_b_rim', 'bergamot_b_pith', 'bergamot_b_pulp', 'bergamot_b_core'],
      ],
    },
  },
  {
    id: 'cardamom',
    name: 'Cardamom',
    latin: 'Elettaria cardamomum',
    note: 'heart',
    color: '#8a9a4f',
    accent: '#b9c682',
    description:
      'Kapulaga adalah biji dari polong rempah yang masih sekeluarga dengan jahe. Minyaknya disuling dengan uap dari bijinya, dan aromanya hangat, pedas-segar, dengan sentuhan kamper yang tipis. Di Midbel ia memberi sisi rempah yang membuat kesan malamnya terasa modern.',
    facts: [
      { label: 'Asal', value: 'Guatemala dan India' },
      { label: 'Ekstraksi', value: 'Destilasi uap dari biji' },
      { label: 'Kesan', value: 'Hangat, rempah, aromatik' },
    ],
    particles: {
      count: 18,
      size: 0.45,
      dir: -1,
      glow: '#2a3300',
      variants: [
        ['cardamom_pod_1'],
        ['cardamom_pod_2'],
        ['cardamom_pod_3_husk', 'cardamom_pod_3_inner', 'cardamom_seeds'],
      ],
    },
  },
  {
    id: 'midbel-vanilla',
    name: 'Vanilla',
    latin: 'Vanilla planifolia',
    note: 'heart',
    color: '#b8864b',
    accent: '#e9c58a',
    description:
      'Polong vanila dikeringkan berbulan-bulan sampai aromanya matang, dengan Madagaskar sebagai produsen terbesar dunia. Di Midbel vanila melunakkan rempah dan kayu, memberi kehangatan manis yang tidak berlebihan.',
    facts: [
      { label: 'Asal', value: 'Madagaskar' },
      { label: 'Ekstraksi', value: 'Ekstrak dari polong kering' },
      { label: 'Kesan', value: 'Manis, creamy, hangat' },
    ],
    particles: {
      count: 16,
      size: 0.8,
      dir: 1,
      glow: '#6b4423',
      variants: [['vanilla_bean_1'], ['vanilla_bean_2'], ['vanilla_crystals']],
    },
  },
  {
    id: 'caramel',
    name: 'Caramel',
    latin: 'Akord gula terkaramelisasi',
    note: 'base',
    color: '#c9822a',
    accent: '#f0b45a',
    description:
      'Karamel dalam parfum adalah akord gourmand yang dirakit dari molekul aroma manis seperti ethyl maltol. Kesannya manis, legit, dan sedikit gosong. Ia memberi dasar yang nyaman sebelum aroma kayu mengambil bagian.',
    facts: [
      { label: 'Asal', value: 'Inspirasi gula terkaramelisasi' },
      { label: 'Ekstraksi', value: 'Akord, dirakit dari molekul aroma' },
      { label: 'Kesan', value: 'Manis, legit, hangat' },
    ],
    particles: {
      count: 14,
      size: 0.5,
      dir: -1,
      glow: '#7a3d00',
      variants: [['caramel_cube', 'caramel_ribbon'], ['caramel_drop']],
    },
  },
  {
    id: 'sandalwood',
    name: 'Sandalwood',
    latin: 'Santalum album',
    note: 'base',
    color: '#a8734a',
    accent: '#d6a47c',
    description:
      'Cendana disuling dari kayu pohon Santalum, dan India serta Australia dikenal sebagai sumbernya. Aromanya lembut, creamy, dan berkayu, serta bertahan lama di kulit. Ia menjadi tulang punggung dasar Midbel.',
    facts: [
      { label: 'Asal', value: 'India dan Australia' },
      { label: 'Ekstraksi', value: 'Destilasi uap dari kayu' },
      { label: 'Kesan', value: 'Creamy, lembut, berkayu' },
    ],
    particles: {
      count: 14,
      size: 0.55,
      dir: 1,
      glow: '#4a2a10',
      variants: [['sandalwood_block_1'], ['sandalwood_log_bark', 'sandalwood_log_ends'], ['sandalwood_chips']],
    },
  },
  {
    id: 'cedarwood',
    name: 'Cedarwood',
    latin: 'Cedrus atlantica',
    note: 'base',
    color: '#7a5230',
    accent: '#b58a5c',
    description:
      'Minyak cedar disuling dari serpihan kayu, dengan Maroko dan Amerika Utara sebagai sumber yang umum. Aromanya kering, bersih, dan sedikit seperti serutan pensil. Ia memberi penutup berkayu yang tegas di dasar aroma.',
    facts: [
      { label: 'Asal', value: 'Maroko dan Amerika Utara' },
      { label: 'Ekstraksi', value: 'Destilasi uap dari serpihan kayu' },
      { label: 'Kesan', value: 'Kering, bersih, berkayu' },
    ],
    particles: {
      count: 14,
      size: 0.6,
      dir: -1,
      glow: '#3a2410',
      variants: [['cedar_curls'], ['cedar_bark'], ['cedar_block_carved']],
    },
  },
];
