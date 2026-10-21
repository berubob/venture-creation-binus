import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ScrollControls,
  Scroll,
  ContactShadows,
  Sparkles,
  useScroll,
} from '@react-three/drei';
import PerfumeBottle from './components/PerfumeBottle';
import Overlay from './components/Overlay';
import Navbar from './components/Navbar';
import InkBackground from './components/InkBackground';
import { PAGES } from './data/ingredients';
import { setScrollEl, scrollToPage } from './scrollStore';

const goTo = (page) => scrollToPage(page, PAGES);

function ScrollBridge() {
  const scroll = useScroll();
  useEffect(() => {
    setScrollEl(scroll.el);
    return () => setScrollEl(null);
  }, [scroll.el]);
  return null;
}

export default function App() {
  return (
    <div className="relative h-screen w-screen bg-paper">
      <InkBackground />
      <Navbar onNavigate={goTo} />

      {/* Canvas transparan, di atas lukisan latar */}
      <div className="absolute inset-0 z-10">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <Environment preset="studio" />

          <ScrollControls pages={PAGES} damping={0.2}>
            <ScrollBridge />

            <PerfumeBottle />

            <Sparkles count={60} scale={[12, 8, 4]} size={3} speed={0.3} color="#c9962f" />

            <ContactShadows position={[0, -1.5, 0]} opacity={0.35} scale={10} blur={2.4} far={4} color="#3a2a14" />

            <Scroll html style={{ width: '100%' }}>
              <Overlay onNavigate={goTo} />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
    </div>
  );
}
