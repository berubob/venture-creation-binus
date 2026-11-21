import { Component, Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { addMiniLiquid, buildVariant, makeLiquidMaterial, prepareBody, setReveal } from '../modelUtils';
import { DPR, SHADOW_RES } from '../perf';

const TARGET = 2.6; // sisi terpanjang model dinormalkan ke ukuran ini
const NONE = [];

const inBottle = (o) => {
  for (let n = o; n; n = n.parent) if (n.name === 'Bottle') return true;
  return false;
};

function Fitted({ url, body, liquid }) {
  const { scene } = useGLTF(url);
  const prep = useMemo(() => {
    const obj = scene.clone(true);
    const bodyMats = body.length ? prepareBody(obj, body) : [];
    obj.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      if (body.includes(o.name)) return;
      if (liquid && o.name === 'Bottle_Liquid') {
        o.material = makeLiquidMaterial(liquid);
        o.renderOrder = 1;
        return;
      }
      if (o.material) o.material = o.material.clone();
      if (bodyMats.length && o.name === 'Label_Text') {
        o.renderOrder = 3;
        o.material.transparent = true; // masuk pass transparan, supaya renderOrder berlaku terhadap badan
        o.material.depthWrite = false;
      }
    });
    // Travel size 3 ml: model tidak punya cairan, jadi dibuat otomatis
    if (liquid && !obj.getObjectByName('Bottle_Liquid')) addMiniLiquid(obj, liquid);

    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    return {
      obj,
      bodyMats,
      center: box.getCenter(new THREE.Vector3()),
      k: TARGET / Math.max(size.x, size.y, size.z, 1e-6),
    };
  }, [scene, body, liquid]);

  const target = useRef(0);
  const amount = useRef(0);
  useFrame((_, delta) => {
    if (!prep.bodyMats.length) return;
    amount.current = THREE.MathUtils.damp(amount.current, target.current, 6, delta);
    setReveal(prep.bodyMats, amount.current);
  });

  return (
    <group
      scale={prep.k}
      onPointerOver={(e) => {
        if (inBottle(e.object)) target.current = 1;
      }}
      onPointerOut={() => (target.current = 0)}
      onPointerDown={(e) => {
        if (e.nativeEvent.pointerType === 'touch') target.current = inBottle(e.object) ? 1 - target.current : 0;
      }}
    >
      <primitive object={prep.obj} position={[-prep.center.x, -prep.center.y, -prep.center.z]} />
    </group>
  );
}

// Semua bahan sebuah varian, melingkar. Memakai bentuk pertama tiap bahan (sama seperti di scroll story).
function IngredientShowcase({ url, items }) {
  const { scene } = useGLTF(url);
  const built = useMemo(
    () =>
      items.map((ing) => ({
        id: ing.id,
        size: ing.particles.size,
        parts: buildVariant(scene, ing.particles.variants[0], {
          flat: ing.particles.flat,
          glow: ing.particles.glow,
        }),
      })),
    [scene, items]
  );
  const radius = built.length > 6 ? 1.75 : 1.5;

  return (
    <group scale={0.75}>
      {built.map((b, i) => {
        const a = (i / built.length) * Math.PI * 2;
        return (
          <group
            key={b.id}
            position={[Math.cos(a) * radius, Math.sin(i * 1.7) * 0.25, Math.sin(a) * radius]}
            scale={0.55 + 0.8 * b.size}
          >
            {b.parts.map((p, j) => (
              <mesh key={j} geometry={p.geometry} material={p.material} castShadow />
            ))}
          </group>
        );
      })}
    </group>
  );
}

const Note = ({ children }) => (
  <Html center>
    <span className="whitespace-nowrap text-sm text-mute">{children}</span>
  </Html>
);

class ModelBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Note>Model tidak ditemukan: {this.props.url}</Note> : this.props.children;
  }
}

export default function ProductViewer({ url, body = NONE, liquid = null, items = null, light }) {
  return (
    <Canvas dpr={DPR} camera={{ position: [0, 0.6, 6.5], fov: 35 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-4, 3, -4]} intensity={light.rimIntensity} color={light.rim} />
      <Environment preset="studio" environmentIntensity={light.env} />
      {/* key = url + mode, jadi error boundary dan model ter-reset saat ganti varian */}
      <ModelBoundary key={`${url}:${items ? 'i' : 'b'}`} url={url}>
        <Suspense fallback={<Note>Memuat model…</Note>}>
          {items ? <IngredientShowcase url={url} items={items} /> : <Fitted url={url} body={body} liquid={liquid} />}
        </Suspense>
      </ModelBoundary>
      <ContactShadows position={[0, -1.5, 0]} opacity={light.shadowOpacity} scale={8} blur={2.4} far={4} resolution={SHADOW_RES} color={light.shadow} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.4}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}