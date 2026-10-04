import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, RoundedBox } from '@react-three/drei';
import IngredientCloud from './IngredientCloud';
import { INGREDIENTS, PAGES } from '../data/ingredients';

const { lerp, damp } = THREE.MathUtils;
const smooth = (t) => t * t * (3 - 2 * t);

const BASE_COLOR = new THREE.Color('#e0a93b');
const SCENE_COLORS = INGREDIENTS.map((ing) => new THREE.Color(ing.color));
const _color = new THREE.Color();

const TARGETS = {
  desktop: {
    x: [1.9, ...INGREDIENTS.map((_, i) => (i % 2 === 0 ? -2.3 : 2.3)), 0],
    y: [0, ...INGREDIENTS.map(() => 0), 1.0],
    s: [1, ...INGREDIENTS.map(() => 1), 0.55],
  },
  mobile: {
    x: [0, ...INGREDIENTS.map(() => 0), 0],
    y: [1.1, ...INGREDIENTS.map(() => 1.2), 1.4],
    s: [0.6, ...INGREDIENTS.map(() => 0.55), 0.45],
  },
};

export default function PerfumeBottle() {
  const rigRef = useRef(); 
  const spinRef = useRef(); 
  const liquidRef = useRef();
  const liquidMat = useRef();
  const lightRef = useRef();
  const weights = useRef(INGREDIENTS.map(() => 0)); 

  const scroll = useScroll();
  const width = useThree((s) => s.size.width);
  const mobile = width < 768;

  useFrame((state, delta) => {
    const o = scroll.offset;
    const t = state.clock.elapsedTime;

    const seg = o * (PAGES - 1);
    const i = Math.min(Math.floor(seg), PAGES - 2);
    const k = smooth(seg - i);
    const T = mobile ? TARGETS.mobile : TARGETS.desktop;

    const rig = rigRef.current;
    rig.position.x = damp(rig.position.x, lerp(T.x[i], T.x[i + 1], k), 4, delta);
    rig.position.y = damp(
      rig.position.y,
      lerp(T.y[i], T.y[i + 1], k) + Math.sin(t) * 0.12, 
      4,
      delta
    );
    rig.scale.setScalar(damp(rig.scale.x, lerp(T.s[i], T.s[i + 1], k), 4, delta));

    const spin = spinRef.current;
    spin.rotation.y = damp(
      spin.rotation.y,
      o * Math.PI * 2 + state.pointer.x * 0.4,
      4,
      delta
    );
    spin.rotation.x = damp(spin.rotation.x, -state.pointer.y * 0.15, 4, delta);

    let maxW = 0;
    INGREDIENTS.forEach((_, idx) => {
      const center = (idx + 1) / (PAGES - 1);
      const raw = Math.max(0, 1 - Math.abs(o - center) / (0.8 / (PAGES - 1)));
      weights.current[idx] = damp(weights.current[idx], smooth(raw), 6, delta);
      maxW = Math.max(maxW, weights.current[idx]);
    });

    _color.copy(BASE_COLOR);
    SCENE_COLORS.forEach((c, idx) => _color.lerp(c, weights.current[idx]));

    liquidMat.current.color.copy(_color);
    liquidMat.current.emissive.copy(_color);

    liquidRef.current.scale.y = 1 - maxW * 0.1 + Math.sin(t * 2) * 0.01;
    liquidRef.current.rotation.z = Math.sin(t * 1.3) * 0.015 * (1 + maxW * 3);

    lightRef.current.color.copy(_color);
    lightRef.current.intensity = 8 + maxW * 25;
  });

  return (
    <group ref={rigRef}>
      <pointLight ref={lightRef} position={[0, 0.5, 3.2]} distance={0} decay={2} />

      <group ref={spinRef}>
        <RoundedBox args={[1.9, 2.8, 1.1]} radius={0.14} smoothness={6} castShadow receiveShadow>
          <meshPhysicalMaterial
            transmission={1}
            ior={1.5}
            thickness={1.5}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color="#ffffff"
          />
        </RoundedBox>

        <group ref={liquidRef} position={[0, -0.1, 0]}>
          <RoundedBox args={[1.62, 2.3, 0.82]} radius={0.08} smoothness={4}>
            <meshPhysicalMaterial
              ref={liquidMat}
              roughness={0.15}
              clearcoat={0.6}
              emissiveIntensity={0.35}
            />
          </RoundedBox>
        </group>

        <mesh position={[0, 0, 0.56]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.56]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.25} />
        </mesh>

        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 48]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>

        <mesh position={[0, 2.05, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.8, 64]} />
          <meshStandardMaterial color="#b76e79" metalness={1} roughness={0.15} />
        </mesh>
      </group>

      {INGREDIENTS.map((ing, idx) => (
        <IngredientCloud key={ing.id} index={idx} weights={weights} config={ing.particles} />
      ))}
    </group>
  );
}