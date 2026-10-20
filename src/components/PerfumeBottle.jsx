import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useGLTF } from '@react-three/drei';
import IngredientCloud from './IngredientCloud';
import { INGREDIENTS, PAGES } from '../data/ingredients';

// Taruh file di: public/models/parfum_modern_artistic.glb  (GLB baru, nama file sama)
const PRODUCT_MODEL = '/models/parfum_modern_artistic.glb';
useGLTF.preload(PRODUCT_MODEL);

const { lerp, damp, clamp } = THREE.MathUtils;
const smooth = (t) => t * t * (3 - 2 * t);

const SCENE_COLORS = INGREDIENTS.map((ing) => new THREE.Color(ing.color));
const _mix = new THREE.Color();
const _final = new THREE.Color();

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

// Skala model untuk botol dan kotak (proporsi sama seperti di GLB)
const S = 2;

// ---- Pengaturan tutup botol (satuan GLB, sebelum dikali S) ----
const CAP_LIFT = 0.34; // tinggi tutup terangkat saat ingredient aktif
const CAP_TILT = 0.2; // kemiringan (radian)
const CAP_TWIST = 1.1; // putaran seperti dibuka (radian)

// Sudut kotak terhadap sumbu Y (menyerong 45 derajat). Sisi depan (VNS) menghadap kanan-depan,
// sisi kiri (QR) ikut terlihat. Ganti tanda minus untuk membalik arahnya.
const BOX_YAW = Math.PI / 4;
const BOX_X = -2.4;

// Lapisan di permukaan kotak (polygonOffset agar tidak z-fighting)
const LAYER = {
  Watercolor_Navy: 1, Watercolor_Slate: 2, Gold_Vein_1: 3, Gold_Vein_2: 4,
  Carton_Logo: 5, Carton_QR: 1,
};

function buildBottle(scene) {
  // GLB baru: node 'Bottle' berpusat di dasar-tengah botol. Tiap bagian sudah ada di posisi yang benar.
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
      o.renderOrder = 3; // digambar setelah kaca
      o.material.depthWrite = false;
      if (o.material.map) o.material.map.anisotropy = 8;
    }
    if (o.name === 'Dip_Tube') {
      o.material.transparent = false;
      o.material.opacity = 1;
    }
  });

  // Cairan: material sendiri (opaque supaya terlihat di balik kaca), pivot di dasar sehingga
  // scale.y hanya menurunkan permukaan atas
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

  // Tutup: pivot di dasar-tengah, posisi node = posisi tertutup
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
    top: box3.max.y + CAP_LIFT, // termasuk tutup saat terangkat
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
    // Tekstur (VNS, QR) tetap tajam saat dilihat menyerong
    if (m.map) m.map.anisotropy = 8;
    if (m.emissiveMap) m.emissiveMap.anisotropy = 8;
    o.material = m;
  });
  return root;
}

export default function PerfumeBottle() {
  const { scene } = useGLTF(PRODUCT_MODEL);
  const bottle = useMemo(() => buildBottle(scene), [scene]);
  const carton = useMemo(() => buildCarton(scene), [scene]);

  const rigRef = useRef();
  const spinRef = useRef();
  const lightRef = useRef();
  const boxRef = useRef();
  const cloudRigRef = useRef();
  const weights = useRef(INGREDIENTS.map(() => 0));
  const capOpen = useRef(0);

  const scroll = useScroll();
  const width = useThree((s) => s.size.width);
  const camera = useThree((s) => s.camera);
  const mobile = width < 768;

  // Tinggi area pandang pada jarak z = 0
  const viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  // fit: skala agar botol utuh (dengan tutup terangkat) muat di layar
  // cy: tinggi tengah botol, supaya pusat rig = pusat botol
  const { fit, cy } = useMemo(() => {
    const h = (bottle.top - bottle.bottom) * S;
    return {
      fit: Math.min(1, (viewH * 0.68) / h),
      cy: (bottle.top + bottle.bottom) / 2,
    };
  }, [bottle, viewH]);

  useFrame((state, delta) => {
    const o = scroll.offset;
    const t = state.clock.elapsedTime;

    const seg = o * (PAGES - 1);
    const i = Math.min(Math.floor(seg), PAGES - 2);
    const k = smooth(seg - i);
    const T = mobile ? TARGETS.mobile : TARGETS.desktop;

    const rig = rigRef.current;
    const spin = spinRef.current;
    const bx = boxRef.current;
    const cloud = cloudRigRef.current;
    if (!rig || !spin || !bx || !cloud) return;

    // 1. Posisi dan skala botol
    const targetX = lerp(T.x[i], T.x[i + 1], k);
    const targetY = lerp(T.y[i], T.y[i + 1], k);
    const targetScale = lerp(T.s[i], T.s[i + 1], k) * (mobile ? 1 : fit);
    const yComp = mobile ? 0 : -0.15; // sedikit turun dari navbar

    rig.position.x = damp(rig.position.x, targetX, 5, delta);
    rig.position.y = damp(rig.position.y, targetY + yComp + Math.sin(t * 0.8) * 0.035, 5, delta);
    rig.scale.setScalar(damp(rig.scale.x, targetScale, 5, delta));

    // 1b. Ingredient di sisi berlawanan dari botol, independen dari skala/rotasi botol
    cloud.position.x = damp(cloud.position.x, mobile ? 0 : -targetX * 0.58, 4, delta);
    cloud.position.y = damp(cloud.position.y, mobile ? -0.35 : 0, 4, delta);

    // 2. Rotasi mengikuti scroll dan pointer
    spin.rotation.y = damp(spin.rotation.y, o * Math.PI * 2 + state.pointer.x * 0.18, 4, delta);
    spin.rotation.x = damp(spin.rotation.x, -state.pointer.y * 0.08, 4, delta);

    // 3. Kotak muncul menjelang akhir (tumbuh dari dasarnya)
    const boxProgress = smooth(clamp(seg - (PAGES - 2), 0, 1));
    const boxScale = damp(bx.scale.x, boxProgress, 5, delta);
    bx.scale.setScalar(boxScale);
    bx.visible = boxScale > 0.005;
    bx.rotation.y = damp(bx.rotation.y, BOX_YAW + Math.sin(t * 0.35) * 0.035, 3, delta);

    // 4. Bobot ingredient: satu per satu menurut halaman
    let total = 0;
    _mix.setRGB(0, 0, 0);
    INGREDIENTS.forEach((_, idx) => {
      const raw = clamp(1 - Math.abs(seg - (idx + 1)) / 0.82, 0, 1);
      weights.current[idx] = damp(weights.current[idx], smooth(raw), 7, delta);
      const c = SCENE_COLORS[idx];
      const w = weights.current[idx];
      _mix.r += c.r * w;
      _mix.g += c.g * w;
      _mix.b += c.b * w;
      total += w;
    });

    // 5. Warna cairan: rata-rata berbobot, lalu dicampur ke warna dasar
    if (total > 1e-4) _mix.multiplyScalar(1 / total);
    else _mix.copy(bottle.baseColor);
    const mixAmt = clamp(total, 0, 1);
    _final.copy(bottle.baseColor).lerp(_mix, mixAmt);

    // 6. Cairan: dasar tetap, permukaan atas turun
    const liquidMat = bottle.liquid.material;
    liquidMat.color.copy(_final);
    liquidMat.emissive.copy(_final);
    bottle.liquid.scale.y = damp(bottle.liquid.scale.y, 1 - 0.22 * mixAmt, 4, delta);
    bottle.liquid.rotation.z = Math.sin(t * 0.7) * 0.004;

    // 6b. Tutup: duduk di collar saat hero dan halaman kotak, terangkat dan terputar saat ingredient aktif
    capOpen.current = damp(capOpen.current, smooth(mixAmt), 4, delta);
    const open = capOpen.current;
    bottle.cap.position.y = bottle.seatY + CAP_LIFT * open;
    bottle.cap.rotation.z = CAP_TILT * open;
    bottle.cap.rotation.y = CAP_TWIST * open;

    // 7. Cahaya mengikuti warna ingredient
    if (lightRef.current) {
      lightRef.current.color.copy(_final);
      lightRef.current.intensity = damp(lightRef.current.intensity, 5 + mixAmt * 7, 4, delta);
    }
  });

  return (
    <>
      {/* Produk dan kemasan punya gerakan sendiri */}
      <group ref={rigRef}>
        <pointLight ref={lightRef} position={[0, 0.5, 3.2]} distance={0} decay={2} />

        <group ref={spinRef}>
          <group scale={S} position={[0, -cy * S, 0]}>
            <primitive object={bottle.root} />
          </group>
        </group>

        {/* Kotak: dasarnya sejajar dengan dasar botol */}
        <group ref={boxRef} position={[BOX_X, -cy * S, -0.2]} scale={0}>
          <group scale={S}>
            <primitive object={carton} />
          </group>
        </group>
      </group>

      {/* Ingredient bergerak independen dari produk */}
      <group ref={cloudRigRef}>
        {INGREDIENTS.map((ing, idx) => (
          <IngredientCloud key={ing.id} index={idx} weights={weights} config={ing.particles} />
        ))}
      </group>
    </>
  );
}