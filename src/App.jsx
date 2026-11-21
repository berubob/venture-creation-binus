import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls, Scroll, ContactShadows, useScroll, useProgress } from '@react-three/drei';
import PerfumeBottle from './components/PerfumeBottle';
import Overlay from './components/Overlay';
import Navbar from './components/Navbar';
import InkBackground from './components/InkBackground';
import Shop from './components/Shop';
import CartDrawer from './components/CartDrawer';
import { getVariant } from './data/variants';
import { closeShop, openShop, useStore } from './cartStore';
import { setScrollEl, scrollToPage } from './scrollStore';
import { DPR, LITE, SHADOW_RES } from './perf';

// Katalog adalah halaman terpisah (#/pesan). Selama katalog terbuka, halaman utama (Canvas 3D dan isinya)
// dilepas penuh, jadi hanya ada satu WebGL context. Kembali ke halaman utama = muat ulang halaman,
// seperti refresh. Isi keranjang dan pilihan parfum tetap aman karena disimpan di localStorage.
// Ubah ke false untuk hanya memasang ulang halaman utama tanpa reload.
const SHOP_HASH = '#/pesan';
const RELOAD_ON_RETURN = true;

function useShopPage() {
  const shopOpen = useStore((s) => s.shopOpen);
  const wasOpen = useRef(false);

  // Dibuka lewat URL langsung, misalnya refresh saat berada di katalog
  useEffect(() => {
    if (window.location.hash === SHOP_HASH) openShop();
  }, []);

  // Store -> URL. Saat katalog ditutup: bersihkan URL, lalu muat ulang halaman utama
  useEffect(() => {
    if (shopOpen && window.location.hash !== SHOP_HASH) {
      window.history.pushState(null, '', SHOP_HASH);
    }
    if (!shopOpen && wasOpen.current) {
      if (window.location.hash === SHOP_HASH) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      if (RELOAD_ON_RETURN) window.location.reload();
    }
    wasOpen.current = shopOpen;
  }, [shopOpen]);

  // Tombol back / forward browser
  useEffect(() => {
    const onPop = () => {
      if (window.location.hash === SHOP_HASH) openShop();
      else closeShop();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return shopOpen;
}

function ScrollBridge() {
  const scroll = useScroll();
  useEffect(() => {
    setScrollEl(scroll.el);
    return () => setScrollEl(null);
  }, [scroll.el]);
  return null;
}

// Muncul saat model sebuah varian sedang diunduh (misalnya baru pertama kali pindah ke Midbel)
function LoadingBadge() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-5 py-2 text-xs font-bold text-paper"
    >
      Memuat model {Math.round(progress)}%
    </div>
  );
}

// Halaman utama: latar, navbar, dan scroll story 3D
function Home({ variant }) {
  const { light } = variant;
  const goTo = (page) => scrollToPage(page, variant.pages);

  return (
    <>
      <InkBackground />
      <Navbar onNavigate={goTo} />

      <div className="absolute inset-0 z-10">
        <Canvas shadows={!LITE} dpr={DPR} camera={{ position: [0, 0, 7], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} castShadow={!LITE} />
          <directionalLight position={[-4, 3, -4]} intensity={light.rimIntensity} color={light.rim} />
          <directionalLight position={[4, 2, -4]} intensity={light.rimIntensity * 0.6} color={light.rim} />
          <Environment preset="studio" environmentIntensity={light.env} />

          <ScrollControls key={variant.id} pages={variant.pages} damping={0.2}>
            <ScrollBridge />

            <Suspense fallback={null}>
              <PerfumeBottle key={variant.id} variant={variant} />
            </Suspense>

            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={light.shadowOpacity}
              scale={10}
              blur={2.4}
              far={4}
              resolution={SHADOW_RES}
              color={light.shadow}
            />

            <Scroll html style={{ width: '100%' }}>
              <Overlay variant={variant} onNavigate={goTo} />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>

      <LoadingBadge />
    </>
  );
}

export default function App() {
  const shopOpen = useShopPage();
  const variant = getVariant(useStore((s) => s.variant));

  return (
    <div data-theme={variant.id} className="relative h-screen w-screen overflow-hidden bg-paper font-sans text-ink">
      {!shopOpen && <Home variant={variant} />}
      <Shop />
      <CartDrawer />
    </div>
  );
}