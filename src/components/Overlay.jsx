// src/components/Overlay.jsx
import { INGREDIENTS, NOTE_LEVELS } from '../data/ingredients';
import Footer from './Footer';

function NotePyramid({ note, accent }) {
  return (
    <div className="flex items-center gap-2 font-sans text-xs text-white/40">
      {NOTE_LEVELS.map((lvl) => {
        const on = lvl.key === note;
        return (
          <span
            key={lvl.key}
            className="rounded-full border px-3 py-1 transition"
            style={on ? { borderColor: accent, color: accent } : { borderColor: 'rgba(255,255,255,0.12)' }}
          >
            {lvl.label}
          </span>
        );
      })}
    </div>
  );
}

function IngredientSection({ ing, index }) {
  // Bahan genap: teks di kanan (botol di kiri). Bahan ganjil: sebaliknya.
  const textRight = index % 2 === 0;

  return (
    <section
      className={`flex h-screen items-end px-6 pb-16 md:items-center md:px-24 md:pb-0 ${
        textRight ? 'md:justify-end' : 'md:justify-start'
      }`}
    >
      <article
        className="w-full max-w-xl border-l-2 bg-linear-to-r from-black/60 to-transparent py-2 pl-6 md:pl-8"
        style={{ borderColor: ing.accent }}
      >
        <NotePyramid note={ing.note} accent={ing.accent} />

        <h2 className="mt-5 text-5xl font-bold md:text-7xl" style={{ color: ing.accent }}>
          {ing.name}
        </h2>
        <p className="mt-1 text-lg italic text-white/55">{ing.latin}</p>

        <p className="mt-5 font-sans text-sm font-light leading-relaxed text-white/80 md:text-base">
          {ing.description}
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 font-sans text-sm md:grid-cols-3 md:gap-6">
          {ing.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs text-white/40">{f.label}</dt>
              <dd className="mt-0.5 text-white/90">{f.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

export default function Overlay({ onNavigate }) {
  return (
    <div className="w-full text-white/90">
      {/* Halaman 1: Hero */}
      <section className="relative flex h-screen flex-col justify-end px-6 pb-28 pt-24 md:justify-center md:pb-0 md:pl-32">
        <p className="mb-4 font-sans text-sm text-amber-200/80">Eau de Parfum, 50 ml</p>
        <h1 className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-7xl font-black uppercase tracking-widest text-transparent md:text-9xl">
          AURA
        </h1>
        <p className="mt-4 max-w-lg text-xl font-light italic text-white/70 md:text-2xl">
          &ldquo;Elegansi yang tak lekang oleh waktu.&rdquo;
        </p>

        <div className="mt-10 flex flex-wrap gap-4 font-sans">
          <button
            onClick={() => onNavigate(1)}
            className="cursor-pointer rounded-full bg-amber-200 px-8 py-3 text-sm text-black transition hover:bg-amber-100"
          >
            Kenali aromanya
          </button>
          <button
            onClick={() => onNavigate(INGREDIENTS.length + 1)}
            className="cursor-pointer rounded-full border border-white/30 px-8 py-3 text-sm transition hover:border-amber-200 hover:text-amber-200"
          >
            Pre-order
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-sans text-xs text-white/40 md:flex">
          <span>Scroll untuk melihat isinya</span>
          <span className="h-8 w-px animate-pulse bg-white/30" />
        </div>
      </section>

      {/* Halaman 2..n: satu per bahan */}
      {INGREDIENTS.map((ing, i) => (
        <IngredientSection key={ing.id} ing={ing} index={i} />
      ))}

      {/* Halaman terakhir: CTA + footer */}
      <section className="flex h-screen flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-8 text-center md:pb-10">
          <h2 className="text-5xl font-bold tracking-wider md:text-7xl">OWN IT.</h2>
          <p className="mt-3 max-w-md font-sans text-sm font-light text-white/60 md:text-base">
            Edisi terbatas. Satu botol, tiga lapis aroma dari tiga benua.
          </p>
          <button className="mt-6 cursor-pointer bg-linear-to-r from-amber-700 to-yellow-600 px-10 py-4 text-lg tracking-widest text-white uppercase transition-transform duration-300 hover:scale-105">
            Pre-order Exclusive
          </button>
        </div>
        <Footer onNavigate={onNavigate} />
      </section>
    </div>
  );
}