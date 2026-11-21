import { INGREDIENTS as YISERY_INGREDIENTS, NOTE_LEVELS } from './ingredients';
import { MIDBEL_INGREDIENTS } from './midbelIngredients';

export { NOTE_LEVELS };

const make = (v) => ({ ...v, pages: v.ingredients.length + 2 });

export const VARIANTS = {
  yisery: make({
    id: 'yisery',
    name: 'Yisery',
    tagline: 'Sweet Fruity',
    quote: 'Elegansi yang tak lekang oleh waktu.',
    desc: 'Kotak krem-pink dengan aroma manis dan fruity.',
    footer:
      'Eau de parfum dengan tiga lapis aroma: mandarin dan ceri hitam, orange blossom, serta vanila dan amber.',
    color: '#d98aa0',
    model: '/models/VNS_Yisery.glb',
    ingredientsModel: '/models/yisery_ingredients_3d.glb',
    bg: { base: '/bg/yisery.webp', line: '/bg/yisery-line.webp' },
    bodyNodes: ['Bottle_Body'],
    liquid: { color: '#f28a21', emissive: 0.35 }, // oranye
    light: { env: 1, rim: '#ffd9c2', rimIntensity: 1.4, shadow: '#5a3a30', shadowOpacity: 0.3 },
    ingredients: YISERY_INGREDIENTS,
  }),
  midbel: make({
    id: 'midbel',
    name: 'Midbel',
    tagline: 'Modern Evening',
    quote: 'Modern Evening, dibuat untuk pria.',
    desc: 'Kotak hitam dengan karakter malam yang modern, untuk pria.',
    footer:
      'Eau de parfum 15 ml dengan tiga lapis aroma: nanas, apel hijau, dan bergamot di puncak, kapulaga dan vanila di jantung, lalu karamel, cendana, dan cedar di dasar.',
    color: '#1b2340',
    model: '/models/VNS_Midbel.glb',
    ingredientsModel: '/models/midbel_ingredients_3d.glb',
    bg: { base: '/bg/midbel.webp', line: '/bg/midbel-line.webp' },
    bodyNodes: ['Bottle_Body'],
    liquid: { color: '#eaf6fb', clear: true }, // bening
    light: { env: 0.9, rim: '#9db4e8', rimIntensity: 3.4, shadow: '#000000', shadowOpacity: 0.55 },
    ingredients: MIDBEL_INGREDIENTS,
  }),
};

export const DEFAULT_VARIANT = 'yisery';
export const getVariant = (id) => VARIANTS[id] ?? VARIANTS[DEFAULT_VARIANT];
