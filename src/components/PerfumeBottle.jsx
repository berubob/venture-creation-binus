import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import IngredientCloud from './IngredientCloud';
import { INGREDIENTS, PAGES } from '../data/ingredients';
import { getProgress, pointer } from '../scrollStore';

export const PRODUCT_MODEL = '/models/parfum_modern_artistic.glb';
useGLTF.preload(PRODUCT_MODEL);

const { lerp, damp, clamp } = THREE.MathUtils;
const smooth = (t) => t * t * (3 - 2 * t);

const SCENE_COLORS = INGREDIENTS.map((ing) => new THREE.Color(ing.color));
const _mix = new THREE.Color();
const _final = new THREE.Color();

const DESKTOP_MIN = 1024;

function makeTargets(side, viewW) {
  return {
    desktop: {
      x: [side * 0.83, ...INGREDIENTS.map((_, i) => (i % 2 === 0 ? -side : side)), 0.55],
      y: [0, ...INGREDIENTS.map(() => 0), 1.0],
      s: [1, ...INGREDIENTS.map(() => 1), 0.55],
    },
    mobile: {
      x: [0, ...INGREDIENTS.map(() => 0), viewW * 0.24],
      y: [1.1, ...INGREDIENTS.map(() => 1.2), 1.4],
      s: [0.6, ...INGREDIENTS.map(() => 0.55), 0.4],
    },
  };
}

const S = 2;

const CAP_LIFT = 0.34;
const CAP_TILT = 0.2;
const CAP_TWIST = 1.1;

const BOX_YAW = Math.PI / 4;
const BOX_X = -2.4;

const LAYER = {
  Watercolor_Navy: 1, Watercolor_Slate: 2, Gold_Vein_1: 3, Gold_Vein_2: 4,
  Carton_Logo: 5, Carton_QR: 1,
};

function buildBottle(scene) {
  const root = scene.getObjectByName('Bottle').clone(true);

  const glass = new THREE.MeshPhysicalMaterial({
    color: '#e4eef5',
    transparent: true,
    opacity: 0.2,
    roughness: 0.05,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const GLASS_NODES = ['Bottle_Glass', 'Bottle_Base_Heavy_Glass', 'Atomizer_Neck'];
  root.traverse((o) => {
    if (!o.isMesh) return;
    if (GLASS_NODES.includes(o.name)) {
      o.material = glass;
      o.renderOrder = 2;
      return;
    }
    o.material = o.material.clone();
    o.material.flatShading = false;
    if (o.name === 'Label_Text') {
      o.renderOrder = 3;
      o.material.depthWrite = false;
      if (o.material.map) o.material.map.anisotropy = 4;
    }
    if (o.name === 'Dip_Tube') {
      o.material.transparent = false;
      o.material.opacity = 1;
    }
  });

  const liquid = root.getObjectByName('Bottle_Liquid');
  const src = liquid.material;
  liquid.material = new THREE.MeshPhysicalMaterial({
    color: src.color.clone(),
    emissive: src.color.clone(),
    emissiveIntensity: 0.3,
    roughness: 0.12,
    clearcoat: 0.6,
  });
  liquid.castShadow = false;

  const cap = root.getObjectByName('Bottle_Cap');
  const seatY = cap.position.y;

  root.updateMatrixWorld(true);
  const box3 = new THREE.Box3().setFromObject(root);

  return {
    root,
    liquid,
    cap,
    seatY,
    baseColor: liquid.material.color.clone(),
    bottom: box3.min.y,
    top: box3.max.y + CAP_LIFT,
  };
}

function buildCarton(scene) {
  const root = scene.getObjectByName('Carton').clone(true);
  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material.clone();
    m.flatShading = false;
    const layer = LAYER[o.name];
    if (layer) {
      m.side = THREE.DoubleSide;
      m.polygonOffset = true;
      m.polygonOffsetFactor = -layer;
      m.polygonOffsetUnits = -layer;
    }
    if (m.map) m.map.anisotropy = 4;
    if (m.emissiveMap) m.emissiveMap.anisotropy = 4;
    o.material = m;
  });
  return root;
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(58,42,20,0.55)');
  grd.addColorStop(0.55, 'rgba(58,42,20,0.22)');
  grd.addColorStop(1, 'rgba(58,42,20,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function PerfumeBottle() {
  const { scene } = useGLTF(PRODUCT_MODEL);
  const bottle = useMemo(() => buildBottle(scene), [scene]);
  const carton = useMemo(() => buildCarton(scene), [scene]);
  const shadowTex = useMemo(makeShadowTexture, []);
  useEffect(() => () => shadowTex.dispose(), [shadowTex]);

  const rigRef = useRef();
  const spinRef = useRef();
  const lightRef = useRef();
  const boxRef = useRef();
  const weights = useRef(INGREDIENTS.map(() => 0));
  const capOpen = useRef(0);
  const smoothO = useRef(0);

  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const camera = useThree((s) => s.camera);
  const mobile = width < DESKTOP_MIN;

  const viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const viewW = viewH * (width / Math.max(1, height));

  const TARGETS = useMemo(() => makeTargets(Math.min(2.3, viewW * 0.26), viewW), [viewW]);

  const { fit, cy } = useMemo(() => {
    const h = (bottle.top - bottle.bottom) * S;
    return {
      fit: Math.min(1, (viewH * 0.68) / h),
      cy: (bottle.top + bottle.bottom) / 2,
    };
  }, [bottle, viewH]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    smoothO.current = damp(smoothO.current, getProgress(), 9, delta);
    const o = smoothO.current;

    const seg = o * (PAGES - 1);
    const i = Math.min(Math.floor(seg), PAGES - 2);
    const k = smooth(seg - i);
    const T = mobile ? TARGETS.mobile : TARGETS.desktop;

    const rig = rigRef.current;
    const spin = spinRef.current;
    const bx = boxRef.current;
    if (!rig || !spin || !bx) return;

    const targetX = lerp(T.x[i], T.x[i + 1], k);
    const targetY = lerp(T.y[i], T.y[i + 1], k);
    const targetScale = lerp(T.s[i], T.s[i + 1], k) * (mobile ? 1 : fit);
    const yComp = mobile ? 0 : -0.15;

    rig.position.x = damp(rig.position.x, targetX, 5, delta);
    rig.position.y = damp(rig.position.y, targetY + yComp + Math.sin(t * 0.8) * 0.035, 5, delta);
    rig.scale.setScalar(damp(rig.scale.x, targetScale, 5, delta));

    spin.rotation.y = damp(spin.rotation.y, o * Math.PI * 2 + pointer.x * 0.18, 4, delta);
    spin.rotation.x = damp(spin.rotation.x, -pointer.y * 0.08, 4, delta);

    const boxProgress = smooth(clamp(seg - (PAGES - 2), 0, 1));
    const boxScale = damp(bx.scale.x, boxProgress, 5, delta);
    bx.scale.setScalar(boxScale);
    bx.visible = boxScale > 0.005;
    bx.rotation.y = damp(bx.rotation.y, BOX_YAW + Math.sin(t * 0.35) * 0.035, 3, delta);

    let total = 0;
    _mix.setRGB(0, 0, 0);
    for (let idx = 0; idx < INGREDIENTS.length; idx++) {
      const raw = clamp(1 - Math.abs(seg - (idx + 1)) / 0.82, 0, 1);
      weights.current[idx] = damp(weights.current[idx], smooth(raw), 7, delta);
      const c = SCENE_COLORS[idx];
      const w = weights.current[idx];
      _mix.r += c.r * w;
      _mix.g += c.g * w;
      _mix.b += c.b * w;
      total += w;
    }

    if (total > 1e-4) _mix.multiplyScalar(1 / total);
    else _mix.copy(bottle.baseColor);
    const mixAmt = clamp(total, 0, 1);
    _final.copy(bottle.baseColor).lerp(_mix, mixAmt);

    const liquidMat = bottle.liquid.material;
    liquidMat.color.copy(_final);
    liquidMat.emissive.copy(_final);
    bottle.liquid.scale.y = damp(bottle.liquid.scale.y, 1 - 0.22 * mixAmt, 4, delta);
    bottle.liquid.rotation.z = Math.sin(t * 0.7) * 0.004;

    capOpen.current = damp(capOpen.current, smooth(mixAmt), 4, delta);
    const open = capOpen.current;
    bottle.cap.position.y = bottle.seatY + CAP_LIFT * open;
    bottle.cap.rotation.z = CAP_TILT * open;
    bottle.cap.rotation.y = CAP_TWIST * open;

    if (lightRef.current) {
      lightRef.current.color.copy(_final);
      lightRef.current.intensity = damp(lightRef.current.intensity, 5 + mixAmt * 7, 4, delta);
    }
  });

  return (
    <group ref={rigRef}>
      <pointLight ref={lightRef} position={[0, 0.5, 3.2]} distance={0} decay={2} />

      <mesh
        position={[0, (bottle.bottom - cy) * S - 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={0}
      >
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} toneMapped={false} />
      </mesh>

      <group ref={spinRef}>
        <group scale={S} position={[0, -cy * S, 0]}>
          <primitive object={bottle.root} />
        </group>
      </group>

      <group ref={boxRef} position={[BOX_X, -cy * S, -0.2]} scale={0}>
        <group scale={S}>
          <primitive object={carton} />
        </group>
      </group>

      <group>
        {INGREDIENTS.map((ing, idx) => (
          <IngredientCloud key={ing.id} index={idx} weights={weights} config={ing.particles} />
        ))}
      </group>
    </group>
  );
}