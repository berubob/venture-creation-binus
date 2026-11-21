import { INSTAGRAM_URL } from '../data/products';

export default function Footer({ variant, onNavigate }) {
  return (
    <footer className="border-t border-line px-6 pb-4 pt-6 md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl font-medium tracking-[0.08em]">VNS</p>
          <p className="mt-1 text-sm text-mute">Jakarta, est. 2026</p>
          <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-mute md:block">{variant.footer}</p>
        </div>

        <div className="hidden md:block">
          <p className="text-sm font-bold">Aroma {variant.name}</p>
          <ul className="mt-2 columns-2 gap-6 space-y-1 text-sm text-mute">
            {variant.ingredients.map((ing, i) => (
              <li key={ing.id} className="break-inside-avoid">
                <button onClick={() => onNavigate(i + 1)} className="cursor-pointer hover:text-gold">
                  {ing.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="text-sm font-bold">Kontak</p>
          <ul className="mt-2 space-y-1 text-sm text-mute">
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Instagram @vns.scent
              </a>
            </li>
            <li>Pre-order lewat WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-7xl flex-col gap-1 border-t border-line pt-3 text-xs text-mute md:flex-row md:justify-between">
        <p>&copy; 2026 VNS Scent. Seluruh hak cipta dilindungi.</p>
        <p>Proyek Venture Creation, BINUS University</p>
      </div>
    </footer>
  );
}
