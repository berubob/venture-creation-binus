import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { buildVariant } from '../modelUtils';
import { PARTICLE_SCALE } from '../perf';

const rand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// model = file GLB bahan milik varian aktif (lihat data/variants.js)
export default function IngredientCloud({ index, weights, config, model }) {
  const { scene } = useGLTF(model);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshes = useRef([]); // meshes.current[variant][part]

  // Tiap variant = satu model (mis. satu jeruk, satu polong vanila), digabung per material
  const variants = useMemo(
    () =>
      config.variants.map((names) =>
        buildVariant(scene, names, { flat: config.flat, glow: config.glow })
      ),
    [scene, config]
  );
  const V = variants.length;
  // Mobile: jumlah partikel dikurangi, tetapi minimal satu per bentuk
  const count = Math.max(V, Math.round(config.count * PARTICLE_SCALE));
  const counts = useMemo(
    () => variants.map((_, v) => Math.ceil((count - v) / V)),
    [variants, V, count]
  );

  const particles = useMemo(() => {
    const seed = index * 1000;
    return Array.from({ length: count }, (_, i) => ({
      // sudut dibagi rata lalu digeser sedikit, supaya tidak menggumpal di satu sisi botol
      angle: (i / count) * Math.PI * 2 + (rand(seed + i * 3 + 1) - 0.5) * 0.8,
      radius: 1.2 + rand(seed + i * 5 + 2) * 0.65,
      height: (rand(seed + i * 7 + 3) - 0.5) * 3.5,
      speed: 0.2 + rand(seed + i * 11 + 4) * 0.3,
      phase: rand(seed + i * 13 + 5) * Math.PI * 2,
      size: 0.6 + rand(seed + i * 17 + 6) * 0.8,
    }));
  }, [count, index]);

  useFrame((state) => {
    const w = THREE.MathUtils.clamp(weights.current[index] ?? 0, 0, 1);
    const visible = w > 0.002;

    meshes.current.forEach((list) => list?.forEach((m) => m && (m.visible = visible)));
    if (!visible) return;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const v = i % V;
      const instanceIndex = Math.floor(i / V);

      const radius = THREE.MathUtils.lerp(0.2, p.radius, w);
      const angle = p.angle + t * p.speed * config.dir * 0.7;

      dummy.position.set(
        Math.cos(angle) * radius,
        p.height * w + Math.sin(t * 0.55 + p.phase) * 0.08,
        Math.sin(angle) * radius * 0.85 // orbit sedikit lonjong, tidak terlalu mendekat ke kamera
      );
      // Rotasi dibatasi: menghadap arah orbit + goyang halus, tidak berputar liar
      dummy.rotation.set(
        Math.sin(t * 0.3 + p.phase) * 0.15,
        angle,
        Math.cos(t * 0.4 + p.phase) * 0.12
      );
      dummy.scale.setScalar(config.size * p.size * w);
      dummy.updateMatrix();

      meshes.current[v]?.forEach((m) => {
        if (m && instanceIndex < counts[v]) m.setMatrixAt(instanceIndex, dummy.matrix);
      });
    }

    meshes.current.forEach((list) => list?.forEach((m) => m && (m.instanceMatrix.needsUpdate = true)));
  });

  return (
    <group>
      {variants.map((parts, v) =>
        parts.map((part, j) => (
          <instancedMesh
            key={`${v}-${j}`}
            ref={(el) => {
              if (!meshes.current[v]) meshes.current[v] = [];
              meshes.current[v][j] = el;
            }}
            args={[part.geometry, part.material, counts[v]]}
            frustumCulled={false}
            visible={false}
            castShadow
          />
        ))
      )}
    </group>
  );
}