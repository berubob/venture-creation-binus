import { INGREDIENTS as YISERY_INGREDIENTS, NOTE_LEVELS } from './ingredients';
import { CITHEA_INGREDIENTS } from './citheaIngredients';
import { SUPPORTING } from './supporting';

export { NOTE_LEVELS };

// pages = hero + satu halaman per bahan UTAMA + halaman pemesanan.
// Bahan pendukung (supporting) tidak menambah halaman: tampil di panel "Semua bahan".
const make = (v) => ({ ...v, pages: v.ingredients.length + 2 });

export const VARIANTS = {
  yisery: make({
    id: 'yisery',
    name: 'Yisery',
    tagline: 'Sweet Fruity',
    quote: 'Elegansi yang tak lekang oleh waktu.',
    desc: 'Kotak krem-pink dengan aroma manis dan fruity.',
    footer:
      'Eau de parfum dengan tiga lapis aroma: ceri, bergamot, dan lavender di puncak; orange blossom dan melati di jantung; lalu vanila, amber, dan musk di dasar.',
    color: '#d98aa0',
    model: '/models/VNS_Yisery.glb',
    ingredientsModel: '/models/yisery_ingredients_3d.glb',
    bg: { base: '/bg/yisery.webp', line: '/bg/yisery-line.webp' },
    bodyNodes: ['Bottle_Body'],
    liquid: { color: '#f28a21', emissive: 0.35 }, // oranye
    light: { env: 1, rim: '#ffd9c2', rimIntensity: 1.4, shadow: '#5a3a30', shadowOpacity: 0.3 },
    ingredients: YISERY_INGREDIENTS,
    supporting: SUPPORTING.yisery,
  }),
  cithea: make({
    id: 'cithea',
    name: 'Cithea',
    tagline: 'Sunny Fresh',
    quote: 'Cerah seperti matahari pagi.',
    desc: 'Kemasan krem kekuningan dengan aroma segar, manis, dan hangat.',
    footer:
      'Eau de parfum 15 ml dengan tiga lapis aroma: earl grey, apel hijau, dan lemon Sisilia di puncak; melati, mawar, dan bambu di jantung; lalu cedar Virginia, cendana, dan musk di dasar.',
    color: '#e9dd8a',
    model: '/models/VNS_Cithea.glb',
    ingredientsModel: '/models/cithea_ingredients_3d.glb',
    bg: { base: '/bg/cithea.webp', line: '/bg/cithea-line.webp' },
    bodyNodes: ['Bottle_Body'],
    liquid: { color: '#f3e27a', emissive: 0.35 }, // kuning pucat
    light: { env: 1, rim: '#fff3c4', rimIntensity: 1.4, shadow: '#5a4a20', shadowOpacity: 0.3 },
    ingredients: CITHEA_INGREDIENTS,
    supporting: SUPPORTING.cithea,
  }),
};

export const DEFAULT_VARIANT = 'yisery';
export const getVariant = (id) => VARIANTS[id] ?? VARIANTS[DEFAULT_VARIANT];