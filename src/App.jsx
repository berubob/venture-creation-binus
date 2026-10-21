import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sparkles, Stats, Loader } from '@react-three/drei';
import PerfumeBottle from './components/PerfumeBottle';
import Overlay from './components/Overlay';
import Navbar from './components/Navbar';
import InkBackground from './components/InkBackground';
import { PAGES } from './data/ingredients';
import { setScrollEl, scrollToPage, bindPointer } from './scrollStore';

const goTo = (page) => scrollToPage(page, PAGES);

const SHOW_STATS = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('stats');

function onCreated({ gl }) {
  const canvas = gl.domElement;
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
}

export default function App() {
  useEffect(() => bindPointer(), []);

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-paper">
      <InkBackground />

      <Canvas
        style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ powerPreference: 'high-performance', stencil: false }}
        onCreated={onCreated}
      >
        {SHOW_STATS && <Stats />}

        <ambientLight intensity={0.6} />
        <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} />
        <Environment preset="studio" />

        <PerfumeBottle />
        <Sparkles count={40} scale={[12, 8, 4]} size={3} speed={0.3} color="#c9962f" />
      </Canvas>

      <Navbar onNavigate={goTo} />

      <main
        ref={setScrollEl}
        className="fixed inset-0 z-20 overflow-y-auto overscroll-none"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#8a5a14 transparent' }}
      >
        <Overlay onNavigate={goTo} />
      </main>

      <Loader
        containerStyles={{ background: '#efe7d8', zIndex: 100 }}
        innerStyles={{ background: 'rgba(27,35,64,0.15)', width: 240 }}
        barStyles={{ background: '#8a5a14', height: 3 }}
        dataStyles={{ color: '#1b2340', fontSize: 14, fontFamily: 'Jost, system-ui, sans-serif' }}
        dataInterpolation={(p) => `Memuat ${p.toFixed(0)}%`}
      />
    </div>
  );
}