import { INGREDIENTS, NOTE_LEVELS } from '../data/ingredients';
import Footer from './Footer';

// Warna bahan dibuat lebih pekat (campur navy) supaya terbaca di atas kertas krem
const tone = (c) => `color-mix(in srgb, ${c} 55%, #1b2340)`;

function NotePyramid({ note, color }) {
  return (
    <div className="flex items-center gap-2 font-sans text-xs text-ink/40">
      {NOTE_LEVELS.map((lvl) => {
        const on = lvl.key === note;
        return (
          <span
            key={lvl.key}
            className="rounded-full border px-3 py-1 transition"
            style={on ? { borderColor: color, color } : { borderColor: 'rgba(27,35,64,0.15)' }}
          >
            {lvl.label}
          </span>
        );
      })}
    </div>
  );
}

function IngredientSection({ ing, index }) {
  const textRight = index % 2 === 0;
  const color = tone(ing.color);

  return (
    <section
      className={`flex h-screen items-end px-6 pb-16 md:items-center md:px-24 md:pb-0 ${
        textRight ? 'md:justify-end' : 'md:justify-start'
      }`}
    >
      <article
        className="w-full max-w-xl border-l-2 bg-linear-to-r from-paper/90 via-paper/60 to-transparent py-3 pl-6 md:pl-8"
        style={{ borderColor: color }}
      >
        <NotePyramid note={ing.note} color={color} />

        <h2 className="mt-5 text-5xl font-bold md:text-7xl" style={{ color }}>
          {ing.name}
        </h2>
        <p className="mt-1 text-lg italic text-ink/60">{ing.latin}</p>

        <p className="mt-5 font-sans text-sm font-light leading-relaxed text-ink/80 md:text-base">
          {ing.description}
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-ink/15 pt-5 font-sans text-sm md:grid-cols-3 md:gap-6">
          {ing.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs text-ink/50">{f.label}</dt>
              <dd className="mt-0.5 text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

export default function Overlay({ onNavigate }) {
  return (
    <div className="w-full text-ink">
      {/* Halaman 1: Hero */}
      <section className="relative flex h-screen flex-col justify-end px-6 pb-28 pt-24 md:justify-center md:pb-0 md:pl-32">
        <p className="mb-4 font-sans text-sm text-gold-deep">Eau de Parfum, 30 ml</p>
        <h1 className="bg-linear-to-r from-ink via-ink to-gold-deep bg-clip-text text-7xl font-black uppercase tracking-widest text-transparent md:text-9xl">
          Yisery
        </h1>
        <p className="mt-4 max-w-lg text-xl font-light italic text-ink/70 md:text-2xl">
          &ldquo;Elegansi yang tak lekang oleh waktu.&rdquo;
        </p>

        <div className="mt-10 flex flex-wrap gap-4 font-sans">
          <button
            onClick={() => onNavigate(1)}
            className="cursor-pointer rounded-full bg-ink px-8 py-3 text-sm text-paper transition hover:bg-gold-deep"
          >
            Kenali aromanya
          </button>
          <button
            onClick={() => onNavigate(INGREDIENTS.length + 1)}
            className="cursor-pointer rounded-full border border-ink/30 px-8 py-3 text-sm transition hover:border-gold-deep hover:text-gold-deep"
          >
            Pre-order
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-sans text-xs text-ink/50 md:flex">
          <span>Scroll untuk melihat isinya</span>
          <span className="h-8 w-px animate-pulse bg-gold-deep/60" />
        </div>
      </section>

      {INGREDIENTS.map((ing, i) => (
        <IngredientSection key={ing.id} ing={ing} index={i} />
      ))}

      {/* Halaman terakhir: CTA + footer */}
      <section className="flex h-screen flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-8 text-center md:pb-10">
          <h2 className="text-5xl font-bold tracking-wider text-ink md:text-7xl">OWN IT.</h2>
          <p className="mt-3 max-w-md font-sans text-sm font-light text-ink/70 md:text-base">
            Edisi terbatas. Satu botol, tiga lapis aroma, lima bahan dari berbagai penjuru dunia.
          </p>
          <button className="mt-6 cursor-pointer bg-linear-to-r from-gold-deep via-gold to-gold-deep px-10 py-4 text-lg uppercase tracking-widest text-paper shadow-lg shadow-gold-deep/30 transition-transform duration-300 hover:scale-105">
            Pre-order Exclusive
          </button>
        </div>
        <Footer onNavigate={onNavigate} />
      </section>
    </div>
  );
}
