import { INGREDIENTS, NOTE_LEVELS, PAGES } from '../data/ingredients';
import Footer from './Footer';

const accent = (c) => `color-mix(in srgb, ${c} 70%, #1b2340)`;

const CARD =
  'bg-paper-card shadow-[0_18px_44px_-16px_rgba(27,35,64,0.55)] ring-1 ring-ink/20';

const PAGE_H = { height: `${100 / PAGES}%` };

function NotePyramid({ note }) {
  return (
    <div className="flex items-center gap-2 font-sans text-xs font-medium">
      {NOTE_LEVELS.map((lvl) => {
        const on = lvl.key === note;
        return (
          <span
            key={lvl.key}
            className={`rounded-full border-2 px-3 py-1 ${
              on ? 'border-ink bg-ink text-paper' : 'border-ink/40 text-ink-soft'
            }`}
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
  const color = accent(ing.color);

  return (
    <section
      style={PAGE_H}
      className={`flex items-end px-4 pb-4 pt-20 sm:px-8 lg:items-center lg:px-16 lg:pb-0 ${
        textRight ? 'lg:justify-end' : 'lg:justify-start'
      }`}
    >
      <article
        className={`w-full max-w-lg rounded-sm border-l-8 p-5 lg:p-8 ${CARD}`}
        style={{ borderColor: color }}
      >
        <NotePyramid note={ing.note} />

        <h2 className="mt-4 text-4xl font-black leading-none text-ink sm:text-5xl lg:text-6xl">
          {ing.name}
        </h2>
        <p className="mt-2 flex items-center gap-2 text-base font-medium italic text-ink-soft lg:text-lg">
          <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
          {ing.latin}
        </p>

        <p className="mt-4 font-sans text-sm leading-relaxed text-ink lg:mt-5 lg:text-base">
          {ing.description}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-3 border-t-2 border-ink/20 pt-4 font-sans text-sm lg:mt-6 lg:gap-6 lg:pt-5">
          {ing.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium text-ink-soft">{f.label}</dt>
              <dd className="mt-0.5 font-semibold text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

export default function Overlay({ onNavigate }) {
  return (
    <div className="relative z-20 w-full text-ink" style={{ height: `${PAGES * 100}%` }}>
      <section
        style={PAGE_H}
        className="relative flex flex-col justify-end px-4 pb-6 pt-20 sm:px-8 lg:justify-center lg:px-16 lg:pb-0"
      >
        <div className={`w-full max-w-xl rounded-sm p-6 lg:p-10 ${CARD}`}>
          <p className="mb-3 font-sans text-sm font-semibold text-gold-deep">Eau de Parfum, 30 ml</p>
          <h1 className="text-6xl font-black uppercase tracking-widest text-ink lg:text-8xl">Yisery</h1>
          <p className="mt-4 text-xl font-medium italic text-ink lg:text-2xl">
            &ldquo;Elegansi yang tak lekang oleh waktu.&rdquo;
          </p>

          <div className="mt-8 flex flex-wrap gap-3 font-sans">
            <button
              onClick={() => onNavigate(1)}
              className="cursor-pointer rounded-full bg-ink px-8 py-3 text-sm font-semibold text-paper transition hover:bg-gold-deep"
            >
              Kenali aromanya
            </button>
            <button
              onClick={() => onNavigate(INGREDIENTS.length + 1)}
              className="cursor-pointer rounded-full border-2 border-ink px-8 py-3 text-sm font-semibold text-ink transition hover:border-gold-deep hover:text-gold-deep"
            >
              Pre-order
            </button>
          </div>

          <p className="mt-6 hidden items-center gap-3 font-sans text-xs font-medium text-ink-soft lg:flex">
            <span aria-hidden className="h-6 w-px bg-gold-deep" />
            Scroll untuk melihat isinya
          </p>
        </div>
      </section>

      {INGREDIENTS.map((ing, i) => (
        <IngredientSection key={ing.id} ing={ing} index={i} />
      ))}

      <section style={PAGE_H} className="flex flex-col overflow-hidden pt-16">
        <div className="flex flex-1 flex-col items-center justify-end px-4 pb-4 text-center lg:pb-8">
          <div className={`rounded-sm px-6 py-5 lg:px-10 lg:py-6 ${CARD}`}>
            <h2 className="text-4xl font-black tracking-wider text-ink lg:text-6xl">OWN IT.</h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm text-ink lg:text-base">
              Edisi terbatas. Satu botol, tiga lapis aroma, lima bahan dari berbagai penjuru dunia.
            </p>
            <button className="mt-5 cursor-pointer bg-gold-deep px-8 py-3 text-base font-semibold uppercase tracking-widest text-white shadow-lg shadow-ink/25 transition hover:bg-ink lg:px-10 lg:py-4 lg:text-lg">
              Pre-order Exclusive
            </button>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </section>
    </div>
  );
}