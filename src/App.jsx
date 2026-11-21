import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls, Scroll, ContactShadows, useScroll, useProgress } from '@react-three/drei';
import PerfumeBottle from './components/PerfumeBottle';
import Overlay from './components/Overlay';
import Navbar from './components/Navbar';
import InkBackground from './components/InkBackground';
import Shop from './components/Shop';
import CartDrawer from './components/CartDrawer';
import { getVariant } from './data/variants';
import { useStore } from './cartStore';
import { setScrollEl, scrollToPage } from './scrollStore';

function ScrollBridge() {
  const scroll = useScroll();
  useEffect(() => {
    setScrollEl(scroll.el);
    return () => setScrollEl(null);
  }, [scroll.el]);
  return null;
}

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

export default function App() {
  const shopOpen = useStore((s) => s.shopOpen);
  const variant = getVariant(useStore((s) => s.variant));
  const { light } = variant;
  const goTo = (page) => scrollToPage(page, variant.pages);

  return (
    <div data-theme={variant.id} className="relative h-screen w-screen overflow-hidden bg-paper font-sans text-ink">
      <InkBackground />
      <Navbar onNavigate={goTo} />

      {/* Canvas transparan, di atas latar */}
      <div className="absolute inset-0 z-10">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 7], fov: 45 }}
          frameloop={shopOpen ? 'never' : 'always'}
        >
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} castShadow />
          {/* Cahaya dari belakang supaya siluet botol hitam tetap terbaca, terutama di latar gelap */}
          <directionalLight position={[-4, 3, -4]} intensity={light.rimIntensity} color={light.rim} />
          <directionalLight position={[4, 2, -4]} intensity={light.rimIntensity * 0.6} color={light.rim} />
          <Environment preset="studio" environmentIntensity={light.env} />

          {/* key = varian: pindah parfum memuat ulang seluruh cerita dari halaman pertama */}
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
              color={light.shadow}
            />

            <Scroll html style={{ width: '100%' }}>
              <Overlay variant={variant} onNavigate={goTo} />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>

      <LoadingBadge />
      <Shop />
      <CartDrawer />
    </div>
  );
}
