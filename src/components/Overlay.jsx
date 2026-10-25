import { INGREDIENTS, NOTE_LEVELS } from '../data/ingredients';
import Footer from './Footer';

function NotePyramid({ note, accent }) {
  return (
    <div className="flex items-center gap-2 font-sans text-xs font-medium text-white/60">
      {NOTE_LEVELS.map((lvl) => {
        const on = lvl.key === note;
        return (
          <span
            key={lvl.key}
            className="rounded-full border px-3 py-1 transition"
            style={
              on
                ? { borderColor: accent, color: accent, boxShadow: `0 0 12px -2px ${accent}` }
                : { borderColor: 'rgba(255,255,255,0.25)' }
            }
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
      {/* Panel kaca gelap: teks tetap terbaca di atas kota yang ramai */}
      <article
        className="w-full max-w-xl rounded-sm border border-l-4 bg-void/80 p-6 backdrop-blur-md md:p-8"
        style={{
          borderColor: `${ing.accent}55`,
          borderLeftColor: ing.accent,
          boxShadow: `0 0 50px -16px ${ing.accent}, inset 0 0 30px -22px ${ing.accent}`,
        }}
      >
        <NotePyramid note={ing.note} accent={ing.accent} />

        <h2
          className="mt-5 text-5xl font-bold md:text-7xl"
          style={{ color: ing.accent, textShadow: `0 0 22px ${ing.accent}88` }}
        >
          {ing.name}
        </h2>
        <p className="mt-1 text-lg italic text-white/70">{ing.latin}</p>

        <p className="mt-5 font-sans text-sm font-normal leading-relaxed text-white/90 md:text-base">
          {ing.description}
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-white/20 pt-5 font-sans text-sm md:grid-cols-3 md:gap-6">
          {ing.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs text-white/60">{f.label}</dt>
              <dd className="mt-0.5 font-medium text-white">{f.value}</dd>
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
        {/* Peredam gelap di sisi teks supaya judul kontras dengan gedung di belakangnya */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-linear-to-r from-void/90 via-void/55 to-transparent md:w-3/5" />

        <div className="relative">
          <p className="mb-4 font-sans text-sm font-medium text-neon-cyan [text-shadow:0_0_12px_rgba(46,230,214,0.7)]">
            Eau de Parfum, 30 ml
          </p>
          <h1 className="bg-linear-to-r from-white via-neon-cyan to-neon-pink bg-clip-text text-7xl font-bold uppercase tracking-widest text-transparent drop-shadow-[0_0_24px_rgba(255,62,165,0.5)] md:text-9xl">
            Yisery
          </h1>
          <p className="mt-4 max-w-lg text-xl font-normal italic text-white md:text-2xl">
            &ldquo;Elegansi yang tak lekang oleh waktu.&rdquo;
          </p>

          <div className="mt-10 flex flex-wrap gap-4 font-sans">
            <button
              onClick={() => onNavigate(1)}
              className="cursor-pointer rounded-full bg-neon-cyan px-8 py-3 text-sm font-medium text-void shadow-[0_0_24px_-2px_rgba(46,230,214,0.7)] transition hover:bg-neon-pink hover:shadow-[0_0_24px_-2px_rgba(255,62,165,0.8)]"
            >
              Kenali aromanya
            </button>
            <button
              onClick={() => onNavigate(INGREDIENTS.length + 1)}
              className="cursor-pointer rounded-full border-2 border-neon-pink bg-void/50 px-8 py-3 text-sm font-medium text-neon-pink shadow-[0_0_18px_-4px_rgba(255,62,165,0.7)] backdrop-blur-sm transition hover:bg-neon-pink hover:text-void"
            >
              Pre-order
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-sans text-xs font-medium text-white/85 [text-shadow:0_0_10px_#050816] md:flex">
          <span>Scroll untuk melihat isinya</span>
          <span className="h-6 w-px animate-pulse bg-neon-cyan shadow-[0_0_8px_#2ee6d6]" />
        </div>
      </section>

      {/* Halaman 2..n: satu per bahan */}
      {INGREDIENTS.map((ing, i) => (
        <IngredientSection key={ing.id} ing={ing} index={i} />
      ))}

      {/* Halaman terakhir: CTA + footer */}
      <section className="flex h-screen flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-8 text-center md:pb-10">
          <div className="rounded-sm border border-neon-pink/50 bg-void/80 px-8 py-6 shadow-[0_0_60px_-16px_#ff3ea5] backdrop-blur-md">
            <h2 className="text-5xl font-bold tracking-wider text-white [text-shadow:0_0_24px_rgba(255,62,165,0.8)] md:text-7xl">
              OWN IT.
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm font-normal text-white/85 md:text-base">
              Edisi terbatas. Satu botol, tiga lapis aroma, lima bahan dari berbagai penjuru dunia.
            </p>
            <button className="mt-6 cursor-pointer bg-linear-to-r from-neon-pink via-neon-violet to-neon-cyan px-10 py-4 text-lg font-semibold uppercase tracking-widest text-void shadow-[0_0_30px_-4px_rgba(155,107,255,0.8)] transition-transform duration-300 hover:scale-105">
              Pre-order Exclusive
            </button>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </section>
    </div>
  );
}
