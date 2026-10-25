import { INGREDIENTS, NOTE_LEVELS } from '../data/ingredients';
import Footer from './Footer';

// Setiap bahan mendapat satu warna neon, bergantian cyan / pink / violet
const NEON = ['#2ee6d6', '#ff3ea5', '#9b6bff'];
const tone = (i) => NEON[i % NEON.length];

// Bayangan gelap tipis di belakang huruf untuk teks yang tidak berada di dalam kartu
const HALO = '[text-shadow:0_0_14px_rgba(5,8,22,0.95),0_0_30px_rgba(5,8,22,0.8)]';

function NotePyramid({ note, color }) {
  return (
    <div className="flex items-center gap-2 font-sans text-xs font-medium text-fg/60">
      {NOTE_LEVELS.map((lvl) => {
        const on = lvl.key === note;
        return (
          <span
            key={lvl.key}
            className="rounded-full border px-3 py-1 transition"
            style={
              on
                ? { borderColor: color, color, borderWidth: 1.5, boxShadow: `0 0 12px -2px ${color}` }
                : { borderColor: 'rgba(230,234,255,0.25)' }
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
  const textRight = index % 2 === 0;
  const color = tone(index);

  return (
    <section
      className={`flex h-screen items-end px-6 pb-16 md:items-center md:px-24 md:pb-0 ${
        textRight ? 'md:justify-end' : 'md:justify-start'
      }`}
    >
      {/* Panel kaca gelap: menjaga teks terbaca di atas latar neon */}
      <article
        className="w-full max-w-xl rounded-sm border border-l-4 bg-void/75 p-6 backdrop-blur-md md:p-8"
        style={{
          borderColor: color,
          boxShadow: `0 0 50px -16px ${color}, inset 0 0 30px -20px ${color}`,
        }}
      >
        <NotePyramid note={ing.note} color={color} />

        <h2
          className="mt-5 text-5xl font-bold md:text-7xl"
          style={{ color, textShadow: `0 0 22px ${color}99` }}
        >
          {ing.name}
        </h2>
        <p className="mt-1 text-lg font-medium italic text-fg/80">{ing.latin}</p>

        <p className="mt-5 font-sans text-sm font-normal leading-relaxed text-fg md:text-base">
          {ing.description}
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-fg/20 pt-5 font-sans text-sm md:grid-cols-3 md:gap-6">
          {ing.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium text-dim">{f.label}</dt>
              <dd className="mt-0.5 font-medium text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

export default function Overlay({ onNavigate }) {
  return (
    <div className="w-full text-fg">
      {/* Halaman 1: Hero */}
      <section className="relative flex h-screen flex-col justify-end px-6 pb-28 pt-24 md:justify-center md:pb-0 md:pl-32">
        <p className={`mb-4 font-sans text-sm font-medium text-neon-cyan ${HALO}`}>Eau de Parfum, 30 ml</p>
        <h1 className="bg-linear-to-r from-neon-cyan via-fg to-neon-pink bg-clip-text text-7xl font-bold uppercase tracking-widest text-transparent drop-shadow-[0_0_22px_rgba(255,62,165,0.55)] md:text-9xl">
          Yisery
        </h1>
        <p className={`mt-4 max-w-lg text-xl font-normal italic text-fg md:text-2xl ${HALO}`}>
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

        <div className={`absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-sans text-xs font-medium text-fg/80 md:flex ${HALO}`}>
          <span>Scroll untuk melihat isinya</span>
          <span className="h-8 w-px animate-pulse bg-neon-cyan shadow-[0_0_8px_#2ee6d6]" />
        </div>
      </section>

      {INGREDIENTS.map((ing, i) => (
        <IngredientSection key={ing.id} ing={ing} index={i} />
      ))}

      {/* Halaman terakhir: CTA + footer */}
      <section className="flex h-screen flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-8 text-center md:pb-10">
          <div className="rounded-sm border border-neon-pink/50 bg-void/75 px-8 py-6 shadow-[0_0_60px_-16px_#ff3ea5] backdrop-blur-md">
            <h2 className="text-5xl font-bold tracking-wider text-fg [text-shadow:0_0_24px_rgba(255,62,165,0.8)] md:text-7xl">
              OWN IT.
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm font-normal text-fg/85 md:text-base">
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
