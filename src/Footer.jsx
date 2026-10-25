import { INGREDIENTS } from '../data/ingredients';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-neon-cyan/30 bg-void/85 px-6 pb-4 pt-6 font-sans backdrop-blur-md md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl font-bold tracking-[0.3em] text-white [text-shadow:0_0_14px_#2ee6d6]">VNS</p>
          <p className="mt-2 hidden max-w-xs text-sm leading-relaxed text-white/75 md:block">
            Eau de parfum dengan tiga lapis aroma: mandarin dan ceri hitam, orange blossom, serta vanila dan amber.
          </p>
        </div>

        <div>
          <p className="text-sm text-neon-cyan">Aroma</p>
          <ul className="mt-2 space-y-1 text-sm text-white/75">
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.id}>
                <button onClick={() => onNavigate(i + 1)} className="cursor-pointer hover:text-neon-pink">
                  {ing.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm text-neon-cyan">Kontak</p>
          <ul className="mt-2 space-y-1 text-sm text-white/75">
            <li>hello@aura-parfum.id</li>
            <li>Jakarta, Indonesia</li>
            <li>
              <a href="#" className="hover:text-neon-pink">Instagram</a>
              {' / '}
              <a href="#" className="hover:text-neon-pink">TikTok</a>
            </li>
          </ul>
        </div>

        <form
          className="hidden md:block"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="aura-email" className="text-sm text-neon-cyan">
            Kabar peluncuran
          </label>
          <div className="mt-2 flex">
            <input
              id="aura-email"
              type="email"
              placeholder="Email kamu"
              className="w-full rounded-l-full border border-neon-cyan/40 bg-deep/60 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-neon-cyan focus:outline-none"
            />
            <button className="cursor-pointer rounded-r-full bg-neon-cyan px-4 text-sm font-medium text-void hover:bg-neon-pink">
              Daftar
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-5 flex max-w-7xl flex-col gap-1 border-t border-white/10 pt-3 text-xs text-dim md:flex-row md:justify-between">
        <p>&copy; 2026 VNS Parfum. Seluruh hak cipta dilindungi.</p>
        <p>Proyek Venture Creation, BINUS University</p>
      </div>
    </footer>
  );
}