import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const rand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};


export default function IngredientCloud({ index, weights, config }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const seed = index * 1000;
    return Array.from({ length: config.count }, (_, i) => ({
      angle: rand(seed + i * 3 + 1) * Math.PI * 2,
      radius: 1.7 + rand(seed + i * 5 + 2) * 1.0,
      height: (rand(seed + i * 7 + 3) - 0.5) * 3.4,
      speed: 0.15 + rand(seed + i * 11 + 4) * 0.35,
      phase: rand(seed + i * 13 + 5) * Math.PI * 2,
      size: 0.6 + rand(seed + i * 17 + 6) * 0.8,
    }));
  }, [config.count, index]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const w = weights.current[index];
    mesh.visible = w > 0.002;
    if (!mesh.visible) return;

    const t = state.clock.elapsedTime;
    const [sx, sy, sz] = config.stretch;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const r = THREE.MathUtils.lerp(0.2, p.radius, w);
      const a = p.angle + t * p.speed * config.dir;

      dummy.position.set(
        Math.cos(a) * r,
        p.height * w + Math.sin(t * 0.8 + p.phase) * 0.15,
        Math.sin(a) * r
      );
      dummy.rotation.set(t * p.speed + p.phase, t * p.speed * 1.3, p.phase);

      const s = config.size * p.size * w;
      dummy.scale.set(s * sx, s * sy, s * sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, config.count]}
      frustumCulled={false}
      castShadow
    >
      {config.shape === 'dodeca' ? (
        <dodecahedronGeometry args={[1, 0]} />
      ) : (
        <sphereGeometry args={[1, 20, 20]} />
      )}
      <meshStandardMaterial
        color={config.color}
        emissive={config.emissive}
        emissiveIntensity={config.emissiveIntensity}
        roughness={config.roughness}
        metalness={config.metalness}
      />
    </instancedMesh>
  );
}