export const CITHEA_INGREDIENTS = [
  {
    id: 'green-apple',
    name: 'Green Apple',
    latin: 'Malus domestica (akord)',
    note: 'top',
    color: '#8fb82a',
    accent: '#c3e06a',
    description:
      'Aroma apel hijau dalam parfum dibangun sebagai akord, karena buahnya tidak menghasilkan minyak yang bisa diekstraksi langsung. Karakternya renyah, berair, dan sedikit asam, mengingatkan pada apel Granny Smith yang baru dipotong. Di Cithea ia membuka aroma dengan kesan segar yang bersih.',
    facts: [
      { label: 'Asal', value: 'Inspirasi apel Granny Smith' },
      { label: 'Ekstraksi', value: 'Akord, dirakit dari molekul aroma' },
      { label: 'Kesan', value: 'Renyah, segar, sedikit asam' },
    ],
    particles: {
      count: 12,
      size: 0.55,
      dir: -1,
      glow: '#2f4a00',
      variants: [
        ['apple_body', 'apple_stem', 'apple_lenticels'],
        ['apple_wedge_skin', 'apple_wedge_flesh', 'apple_wedge_core', 'apple_seeds'],
      ],
    },
  },
  {
    id: 'earl-grey',
    name: 'Earl Grey Tea',
    latin: 'Camellia sinensis (akord)',
    note: 'top',
    color: '#5b4a38',
    accent: '#7f9be0',
    description:
      'Earl Grey adalah teh hitam yang diberi aroma bergamot, dan kelopak cornflower biru biasa ditaburkan di dalamnya sebagai hiasan. Dalam parfum, aroma tehnya dirakit sebagai akord dari ekstrak daun teh dan bergamot. Kesannya aromatik, bersih, dengan sedikit rasa pahit yang membedakan Cithea dari parfum buah biasa.',
    facts: [
      { label: 'Asal', value: 'Teh hitam beraroma bergamot' },
      { label: 'Ekstraksi', value: 'Akord, ekstrak daun teh' },
      { label: 'Kesan', value: 'Aromatik, bersih, sedikit pahit' },
    ],
    particles: {
      count: 20,
      size: 0.6,
      dir: 1,
      glow: '#2a1d12',
      variants: [
        ['earlgrey_leaf_1', 'earlgrey_petals_a'],
        ['earlgrey_leaf_2', 'earlgrey_leaf_3', 'earlgrey_petals_b'],
        ['earlgrey_leaf_4'],
      ],
    },
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    latin: 'Jasminum grandiflorum',
    note: 'middle',
    color: '#f2ecd8',
    accent: '#fffaf0',
    description:
      'Melati dipetik dari kebunnya saat bunga masih kuncup, lalu diolah menjadi absolut. India, Mesir, dan Prancis dikenal sebagai penghasil utamanya. Aromanya floral yang bersih dan lembut, dengan sisi hijau tipis. Di jantung Cithea ia membawa kesan bunga putih yang anggun.',
    facts: [
      { label: 'Asal', value: 'India, Mesir, Prancis' },
      { label: 'Ekstraksi', value: 'Absolut dari kuntum bunga' },
      { label: 'Kesan', value: 'Floral, bersih, lembut' },
    ],
    particles: {
      count: 16,
      size: 0.55,
      dir: -1,
      glow: '#fff3d6',
      variants: [
        ['jasmine_b1_petals', 'jasmine_b1_tube', 'jasmine_b1_calyx', 'jasmine_b1_dew'],
        ['jasmine_b2_petals', 'jasmine_b2_tube', 'jasmine_b2_calyx', 'jasmine_b2_dew'],
        ['jasmine_bud_1', 'jasmine_bud_1_calyx'],
        ['jasmine_bud_2', 'jasmine_bud_2_calyx'],
        ['jasmine_leaf'],
      ],
    },
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    latin: 'Bambusoideae (akord)',
    note: 'middle',
    color: '#6fae45',
    accent: '#a9d77d',
    description:
      'Bambu tidak menghasilkan minyak yang bisa disuling, jadi aromanya dirakit sebagai akord hijau yang segar dan bersih. Kesannya seperti batang yang baru dipotong, dengan sisi basah yang menenangkan. Di fase inti ia menjaga Cithea tetap ringan di antara melati dan kayu.',
    facts: [
      { label: 'Asal', value: 'Inspirasi rumpun bambu' },
      { label: 'Ekstraksi', value: 'Akord, dirakit dari molekul aroma' },
      { label: 'Kesan', value: 'Hijau, segar, bersih' },
    ],
    particles: {
      count: 14,
      size: 0.6,
      dir: 1,
      glow: '#1f4a10',
      variants: [
        ['bamboo_stalk_1', 'bamboo_cut_1', 'bamboo_leaf_1', 'bamboo_leaf_2', 'bamboo_leaf_3'],
        ['bamboo_stalk_2', 'bamboo_cut_2', 'bamboo_leaf_4', 'bamboo_leaf_5'],
      ],
    },
  },
  {
    id: 'cedarwood',
    name: 'Virginian Cedarwood',
    latin: 'Juniperus virginiana',
    note: 'base',
    color: '#a05a3a',
    accent: '#c98a62',
    description:
      'Minyak cedar Virginia disuling dengan uap dari serpihan kayunya, dengan Amerika Serikat sebagai sumber utama. Aromanya kering, bersih, berkayu, dan sedikit seperti serutan pensil. Ia menjadi tulang punggung dasar Cithea dan memberi kesan earthy yang bertahan lama di kulit.',
    facts: [
      { label: 'Asal', value: 'Amerika Serikat' },
      { label: 'Ekstraksi', value: 'Destilasi uap dari serpihan kayu' },
      { label: 'Kesan', value: 'Kering, bersih, berkayu' },
    ],
    particles: {
      count: 14,
      size: 0.6,
      dir: -1,
      glow: '#3a2410',
      variants: [['cedar_block'], ['cedar_curl_1'], ['cedar_curl_2'], ['cedar_curl_3']],
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    latin: 'Akord labdanum, benzoin, vanila',
    note: 'base',
    color: '#d98a1c',
    accent: '#f3b94a',
    description:
      'Amber dalam parfum adalah akord, bukan batu. Ia dirakit dari getah labdanum dari kawasan Mediterania, benzoin dari Asia Tenggara, dan vanila. Hasilnya hangat, manis, dan sedikit seperti bedak. Ia menutup piramida aroma Cithea dengan jejak yang lembut dan sensual.',
    facts: [
      { label: 'Asal', value: 'Mediterania dan Asia Tenggara' },
      { label: 'Ekstraksi', value: 'Akord resin dan vanila' },
      { label: 'Kesan', value: 'Hangat, manis, sensual' },
    ],
    particles: {
      count: 16,
      size: 0.5,
      dir: 1,
      flat: true,
      glow: '#7a3d00',
      variants: [
        ['amber_chunk_1', 'amber_core_1', 'amber_inclusions_1', 'amber_bubbles_1'],
        ['amber_chunk_2', 'amber_core_2', 'amber_inclusions_2', 'amber_bubbles_2'],
      ],
    },
  },
];