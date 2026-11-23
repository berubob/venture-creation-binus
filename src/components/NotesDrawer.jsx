import { useEffect, useMemo, useState } from 'react';
import { NOTE_LEVELS } from '../data/variants';
import { closeNotes, useStore } from '../cartStore';

const tone = (c) => `color-mix(in srgb, ${c} 70%, var(--c-ink))`;

function Dot({ color }) {
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-ink/15"
      style={{ background: color }}
    />
  );
}

// Bahan utama: punya halaman 3D. Klik = lompat ke halamannya.
function MainRow({ item, onGo }) {
  return (
    <li className="border-b border-line">
      <button
        onClick={() => onGo(item.page)}
        className="flex w-full cursor-pointer items-center gap-3 py-3 text-left hover:text-gold"
      >
        <Dot color={tone(item.color)} />
        <span className="flex-1">
          <span className="font-display text-xl">{item.name}</span>
          <span className="ml-2 text-xs italic text-mute">{item.latin}</span>
        </span>
        <span className="text-xs font-bold text-gold">Lihat 3D</span>
      </button>
    </li>
  );
}

// Bahan pendukung: teks saja, dibuka-tutup.
function SupportRow({ item, open, onToggle }) {
  return (
    <li className="border-b border-line">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 py-3 text-left hover:text-gold"
      >
        <Dot color={tone(item.color)} />
        <span className="flex-1 font-display text-xl">{item.name}</span>
        <span className="text-mute" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="pb-4 pl-[1.375rem] text-sm leading-relaxed">
          <p className="text-xs italic text-mute">{item.latin}</p>
          <p className="mt-1">{item.desc}</p>
          <p className="mt-1 text-mute">
            <span className="font-bold text-ink">Kesan</span> {item.kesan}
          </p>
        </div>
      )}
    </li>
  );
}

export default function NotesDrawer({ variant, onNavigate }) {
  const open = useStore((s) => s.notesOpen);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeNotes();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => setExpanded(null), [open, variant.id]);

  const groups = useMemo(() => {
    const main = variant.ingredients.map((ing, i) => ({ ...ing, page: i + 1 }));
    const all = [...main, ...(variant.supporting ?? [])];
    return NOTE_LEVELS.map((l) => ({ ...l, items: all.filter((x) => x.note === l.key) }));
  }, [variant]);

  if (!open) return null;

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const go = (page) => {
    closeNotes();
    onNavigate(page);
  };

  return (
    <div className="fixed inset-0 z-70" role="dialog" aria-modal="true" aria-label={`Semua bahan ${variant.name}`}>
      <div className="absolute inset-0 bg-black/45" onClick={closeNotes} />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper text-ink shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div>
            <h2 className="font-display text-3xl font-medium">Aroma {variant.name}</h2>
            <p className="mt-1 text-xs text-mute">
              {total} bahan dalam tiga lapis. Bahan utama punya model 3D, bahan pendukung tampil sebagai catatan.
            </p>
          </div>
          <button onClick={closeNotes} className="cursor-pointer text-sm text-mute hover:text-ink">
            Tutup
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {groups.map((g) => (
            <section key={g.key} className="mt-4">
              <h3 className="flex items-baseline justify-between text-sm uppercase tracking-[0.3em] text-gold">
                <span>{g.label} note</span>
                <span className="text-xs tracking-normal text-mute">{g.items.length} bahan</span>
              </h3>
              <ul className="mt-1 border-t border-line">
                {g.items.map((it) =>
                  it.page != null ? (
                    <MainRow key={it.id} item={it} onGo={go} />
                  ) : (
                    <SupportRow
                      key={it.id}
                      item={it}
                      open={expanded === it.id}
                      onToggle={() => setExpanded((cur) => (cur === it.id ? null : it.id))}
                    />
                  )
                )}
              </ul>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}