import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { buildVariant } from '../modelUtils';

export const INGREDIENT_MODEL = '/models/aura_ingredients_3d.glb';
useGLTF.preload(INGREDIENT_MODEL);

const ORBIT_MIN = 1.05;
const ORBIT_SPAN = 0.45;
const ORBIT_HEIGHT = 3.0; 

const rand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export default function IngredientCloud({ index, weights, config }) {
  const { scene } = useGLTF(INGREDIENT_MODEL);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshes = useRef([]); 
  const wasVisible = useRef(false);

  const variants = useMemo(
    () =>
      config.variants.map((names) =>
        buildVariant(scene, names, { flat: config.flat, glow: config.glow })
      ),
    [scene, config]
  );
  const V = variants.length;
  const counts = useMemo(
    () => variants.map((_, v) => Math.ceil((config.count - v) / V)),
    [variants, V, config.count]
  );

  const particles = useMemo(() => {
    const seed = index * 1000;
    return Array.from({ length: config.count }, (_, i) => ({
      angle: rand(seed + i * 3 + 1) * Math.PI * 2,
      radius: ORBIT_MIN + rand(seed + i * 5 + 2) * ORBIT_SPAN,
      height: (rand(seed + i * 7 + 3) - 0.5) * ORBIT_HEIGHT,
      speed: 0.15 + rand(seed + i * 11 + 4) * 0.35,
      phase: rand(seed + i * 13 + 5) * Math.PI * 2,
      size: 0.6 + rand(seed + i * 17 + 6) * 0.8,
    }));
  }, [config.count, index]);

  useFrame((state) => {
    const w = THREE.MathUtils.clamp(weights.current[index] ?? 0, 0, 1);
    const visible = w > 0.002;

    if (visible !== wasVisible.current) {
      wasVisible.current = visible;
      meshes.current.forEach((list) => list?.forEach((m) => m && (m.visible = visible)));
    }
    if (!visible) return;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const v = i % V;
      const instanceIndex = Math.floor(i / V);

      const radius = THREE.MathUtils.lerp(0.2, p.radius, w);
      const angle = p.angle + t * p.speed * config.dir * 0.45;

      dummy.position.set(
        Math.cos(angle) * radius,
        p.height * w + Math.sin(t * 0.55 + p.phase) * 0.08,
        Math.sin(angle) * radius
      );
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
          />
        ))
      )}
    </group>
  );
}