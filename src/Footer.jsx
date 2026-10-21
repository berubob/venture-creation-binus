import { INGREDIENTS } from '../data/ingredients';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-ink/10 bg-paper/90 px-6 pb-4 pt-6 font-sans backdrop-blur-md md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-xl font-black tracking-[0.3em] text-ink">VNS</p>
          <p className="mt-2 hidden max-w-xs text-sm leading-relaxed text-ink/80 md:block">
            Eau de parfum dengan tiga lapis aroma: mandarin dan ceri hitam, orange blossom, serta vanila dan amber.
          </p>
        </div>

        <div>
          <p className="text-sm text-ink">Aroma</p>
          <ul className="mt-2 space-y-1 text-sm text-ink/80">
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
          <p className="text-sm text-ink">Kontak</p>
          <ul className="mt-2 space-y-1 text-sm text-ink/80">
            <li>hello@aura-parfum.id</li>
            <li>Jakarta, Indonesia</li>
            <li>
              <a href="#" className="hover:text-gold-deep">Instagram</a>
              {' / '}
              <a href="#" className="hover:text-gold-deep">TikTok</a>
            </li>
          </ul>
        </div>

        <form className="hidden md:block" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="aura-email" className="text-sm text-ink">
            Kabar peluncuran
          </label>
          <div className="mt-2 flex">
            <input
              id="aura-email"
              type="email"
              placeholder="Email kamu"
              className="w-full rounded-l-full border border-ink/40 bg-paper/40 px-4 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-gold-deep focus:outline-none"
            />
            <button className="cursor-pointer rounded-r-full bg-ink px-4 text-sm text-paper hover:bg-gold-deep">
              Daftar
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-5 flex max-w-7xl flex-col gap-1 border-t border-ink/10 pt-3 text-xs text-ink/70 md:flex-row md:justify-between">
        <p>&copy; 2026 VNS Parfum. Seluruh hak cipta dilindungi.</p>
        <p>Proyek Venture Creation, BINUS University</p>
      </div>
    </footer>
  );
}
