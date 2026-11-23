import { NOTE_LEVELS } from '../data/variants';
import { SIZES } from '../data/products';
import { openShop, openNotes } from '../cartStore';
import Footer from './Footer';
import Price from './Price';

const tone = (c) => `color-mix(in srgb, ${c} 52%, var(--c-ink))`;

const BANDS = {
  top: '18,1 23.5,10.5 12.5,10.5',
  middle: '11.5,12.5 24.5,12.5 29.5,21.5 6.5,21.5',
  base: '5.5,23.5 30.5,23.5 35,31.5 1,31.5',
};

function NotePyramid({ note, color }) {
  const label = NOTE_LEVELS.find((l) => l.key === note)?.label;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 36 32" className="h-8 w-9" aria-hidden>
        {NOTE_LEVELS.map((l) => {
          const on = l.key === note;
          return (
            <polygon
              key={l.key}
              points={BANDS[l.key]}
              fill={on ? color : 'none'}
              stroke={on ? color : 'currentColor'}
              strokeOpacity={on ? 1 : 0.35}
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <span className="text-sm text-mute">{label} note</span>
    </div>
  );
}

function IngredientSection({ ing, index }) {
  const textRight = index % 2 === 0;
  const color = tone(ing.color);

  return (
    <section
      className={`flex h-screen items-end px-6 pb-6 md:items-center md:px-24 md:pb-0 ${
        textRight ? 'md:justify-end' : 'md:justify-start'
      }`}
    >
      <article className="w-full max-w-lg">
        <NotePyramid note={ing.note} color={color} />

        <h2 className="mt-3 font-display text-[clamp(2.5rem,8vw,6.5rem)] md:mt-5 font-medium leading-[0.95] tracking-tight" style={{ color }}>
          {ing.name}
        </h2>
        <p className="mt-2 font-display text-lg italic text-mute">{ing.latin}</p>

        <p className="mt-4 max-w-[46ch] text-sm leading-relaxed md:mt-6 md:text-base">{ing.description}</p>

        <dl className="mt-4 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1.5 text-sm md:mt-7 md:gap-y-2">
          {ing.facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-mute">{f.label}</dt>
              <dd className="font-bold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

export default function Overlay({ variant, onNavigate }) {
  return (
    <div className="w-full text-ink">
      {/* Halaman 1: Hero */}
      <section className="relative flex h-screen flex-col justify-end px-6 pb-8 pt-24 md:justify-center md:px-24 md:pb-0">
        <h1 className="font-display text-[clamp(4.5rem,13vw,11rem)] font-medium leading-[0.88] tracking-tight">
          {variant.name}
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-gold md:mt-5">{variant.tagline}</p>
        <p className="mt-4 max-w-sm leading-relaxed text-mute md:mt-6">{variant.desc}</p>

        <dl className="mt-5 flex gap-10 text-sm md:mt-8">
          {SIZES.map((s) => (
            <div key={s.id}>
              <dt className="text-mute">
                {s.label} {s.volume}
              </dt>
              <dd className="mt-0.5">
                <Price size={s} align="start" className="font-display text-2xl" />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-9">
          <button
            onClick={() => openShop()}
            className="cursor-pointer rounded-full bg-ink px-8 py-3.5 text-sm font-bold text-paper transition hover:bg-gold"
          >
            Pre-order
          </button>
          <button
            onClick={() => onNavigate(1)}
            className="cursor-pointer border-b border-ink pb-0.5 text-sm font-bold transition hover:border-gold hover:text-gold"
          >
            Kenali aromanya
          </button>
          <button
            onClick={openNotes}
            className="cursor-pointer border-b border-ink pb-0.5 text-sm font-bold transition hover:border-gold hover:text-gold"
          >
            Semua bahan ({variant.ingredients.length + (variant.supporting?.length ?? 0)})
          </button>
        </div>

        <p className="mt-4 max-w-xs text-xs leading-relaxed text-mute md:mt-8">
          <span className="pointer-coarse:hidden">Arahkan kursor ke botol untuk melihat cairan di dalamnya.</span>
          <span className="hidden pointer-coarse:inline">Ketuk botol untuk melihat cairan di dalamnya.</span>
        </p>
      </section>

      {variant.ingredients.map((ing, i) => (
        <IngredientSection key={ing.id} ing={ing} index={i} />
      ))}

      {/* Halaman terakhir: pemesanan + footer */}
      <section className="flex h-screen flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-8 text-center md:pb-10">
          <h2 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-none tracking-tight">
            Pilih ukuranmu
          </h2>
          <dl className="mt-6 flex gap-12 text-sm">
            {SIZES.map((s) => (
              <div key={s.id}>
                <dt className="text-mute">
                  {s.label} {s.volume}
                </dt>
                <dd className="mt-0.5">
                  <Price size={s} align="center" className="font-display text-2xl" />
                </dd>
              </div>
            ))}
          </dl>
          <button
            onClick={() => openShop()}
            className="mt-8 cursor-pointer rounded-full bg-ink px-10 py-4 text-sm font-bold text-paper transition hover:bg-gold"
          >
            Mulai pre-order
          </button>
          <p className="mt-3 text-xs text-mute">Pesanan dikirim lewat WhatsApp.</p>
        </div>
        <Footer variant={variant} onNavigate={onNavigate} />
      </section>
    </div>
  );
}