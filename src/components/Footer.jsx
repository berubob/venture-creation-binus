import { INGREDIENTS } from '../data/ingredients';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t-2 border-ink/20 bg-paper-card px-4 pb-3 pt-5 font-sans text-ink sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-1">
          <p className="font-serif text-xl font-black tracking-[0.3em] text-ink">VNS</p>
          <p className="mt-2 hidden max-w-xs text-sm leading-relaxed text-ink-soft lg:block">
            Eau de parfum dengan tiga lapis aroma: mandarin dan ceri hitam, orange blossom, serta vanila dan amber.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Aroma</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.id}>
                <button onClick={() => onNavigate(i + 1)} className="cursor-pointer hover:text-gold-deep">
                  {ing.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Kontak</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            <li>hello@aura-parfum.id</li>
            <li>Jakarta, Indonesia</li>
            <li>
              <a href="#" className="underline hover:text-gold-deep">Instagram</a>
              {' / '}
              <a href="#" className="underline hover:text-gold-deep">TikTok</a>
            </li>
          </ul>
        </div>

        <form className="hidden lg:block" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="aura-email" className="text-sm font-semibold text-ink">
            Kabar peluncuran
          </label>
          <div className="mt-2 flex">
            <input
              id="aura-email"
              type="email"
              placeholder="Email kamu"
              className="w-full rounded-l-full border-2 border-ink/60 bg-white px-4 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-gold-deep focus:outline-none"
            />
            <button className="cursor-pointer rounded-r-full bg-ink px-4 text-sm font-semibold text-paper hover:bg-gold-deep">
              Daftar
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-1 border-t border-ink/20 pt-3 text-xs text-ink-soft lg:flex-row lg:justify-between">
        <p>&copy; 2026 VNS Parfum. Seluruh hak cipta dilindungi.</p>
        <p>Proyek Venture Creation, BINUS University</p>
      </div>
    </footer>
  );
}