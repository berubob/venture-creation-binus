import { INGREDIENTS } from '../data/ingredients';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-white/10 bg-black/50 px-6 pb-4 pt-6 font-sans backdrop-blur-md md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-xl font-black tracking-[0.3em] text-amber-200">AURA</p>
          <p className="mt-2 hidden max-w-xs text-sm leading-relaxed text-white/50 md:block">
            Eau de parfum dengan tiga lapis aroma: bergamot, jasmine, dan amber.
          </p>
        </div>

        <div>
          <p className="text-sm text-white/90">Aroma</p>
          <ul className="mt-2 space-y-1 text-sm text-white/50">
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.id}>
                <button onClick={() => onNavigate(i + 1)} className="cursor-pointer hover:text-white">
                  {ing.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm text-white/90">Kontak</p>
          <ul className="mt-2 space-y-1 text-sm text-white/50">
            <li>hello@aura-parfum.id</li>
            <li>Jakarta, Indonesia</li>
            <li>
              <a href="#" className="hover:text-white">Instagram</a>
              {' / '}
              <a href="#" className="hover:text-white">TikTok</a>
            </li>
          </ul>
        </div>

        <form
          className="hidden md:block"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="aura-email" className="text-sm text-white/90">
            Kabar peluncuran
          </label>
          <div className="mt-2 flex">
            <input
              id="aura-email"
              type="email"
              placeholder="Email kamu"
              className="w-full rounded-l-full border border-white/20 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-amber-200 focus:outline-none"
            />
            <button className="cursor-pointer rounded-r-full bg-amber-200 px-4 text-sm text-black hover:bg-amber-100">
              Daftar
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-5 flex max-w-7xl flex-col gap-1 border-t border-white/10 pt-3 text-xs text-white/40 md:flex-row md:justify-between">
        <p>&copy; 2026 AURA Parfum. Seluruh hak cipta dilindungi.</p>
        <p>Proyek Venture Creation, BINUS University</p>
      </div>
    </footer>
  );
}