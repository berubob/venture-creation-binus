import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useGLTF } from '@react-three/drei';
import IngredientCloud from './IngredientCloud';
import { makeLiquidMaterial, prepareBody, setReveal } from '../modelUtils';
import { DEFAULT_VARIANT, getVariant } from '../data/variants';

// Varian bawaan diunduh lebih awal. Varian lain diunduh saat kursor di atas tombolnya di navbar.
useGLTF.preload(getVariant(DEFAULT_VARIANT).model);
useGLTF.preload(getVariant(DEFAULT_VARIANT).ingredientsModel);

const { lerp, damp, clamp } = THREE.MathUtils;
const smooth = (t) => t * t * (3 - 2 * t);

// Posisi botol di halaman pemesanan (halaman terakhir) pada mobile
const END = { y: 1.4, s: 0.45 };

// Posisi, tinggi, dan skala botol per halaman: hero, tiap bahan, lalu halaman pemesanan.
// Mobile: botol diam di posisi hero selama hero dan semua bahan. `line` (px dari atas layar) adalah
// garis imajiner di bawah botol: teks overlay dipotong di atas garis ini.
function makeTargets(n, hero) {
  const each = Array.from({ length: n });
  return {
    desktop: {
      x: [1.9, ...each.map((_, i) => (i % 2 === 0 ? -2.3 : 2.3)), 0],
      y: [0, ...each.map(() => 0), 1.0],
      s: [1, ...each.map(() => 1), 0.55],
    },
    mobile: {
      x: [0, ...each.map(() => 0), 0],
      y: [hero.y, ...each.map(() => hero.y), END.y],
      s: [hero.s, ...each.map(() => hero.s), END.s],
      line: [hero.line, ...each.map(() => hero.line), hero.endLine],
    },
  };
}

// Skala model untuk botol dan kotak (proporsi sama seperti di GLB)
const S = 2;

// Estimasi layout hero di mobile (px CSS): tinggi navbar, dan tinggi blok teks + padding bawah
const NAV_H = 76;
const HERO_TEXT_H = 400; // tinggi area teks di bawah garis. Naikkan jika teks bahan terpotong di atas

// Lebar fade (px) tepat di bawah garis, supaya teks memudar halus saat hilang
const LINE_FADE = 22;
// Jarak (px) garis ke dasar botol di halaman pemesanan
const END_GAP = 8;

// ---- Pengaturan tutup botol (satuan GLB, sebelum dikali S) ----
const CAP_LIFT = 0.34; // tinggi tutup terangkat saat ingredient aktif
const CAP_TILT = 0.2; // kemiringan (radian)
const CAP_TWIST = 1.1; // putaran seperti dibuka (radian)

// Sudut kotak terhadap sumbu Y (menyerong 45 derajat).
const BOX_YAW = Math.PI / 4;
const BOX_X = -2.4;

// GLB: node 'Bottle' (Bottle_Body, Bottle_Liquid, Bottle_Collar, Bottle_Cap > Bottle_Nozzle, Label_Text)
// dan node 'Carton' (Carton_Body, Carton_Top, Carton_Bottom). Pivot botol di dasar-tengah.
// Botol tetap hitam. Cairan berwarna sesuai varian (Yisery oranye, Midbel bening) dan baru terlihat saat botol disorot.
function buildBottle(scene, variant) {
  const root = scene.getObjectByName('Bottle').clone(true);
  const bodyMats = prepareBody(root, variant.bodyNodes);

  root.traverse((o) => {
    if (!o.isMesh || variant.bodyNodes.includes(o.name)) return;
    o.material = o.material.clone();
    o.material.flatShading = false;
    if (o.name === 'Label_Text') {
      o.renderOrder = 3; // digambar setelah badan botol
      o.material.transparent = true; // masuk pass transparan, supaya renderOrder berlaku terhadap badan
      o.material.depthWrite = false;
      if (o.material.map) o.material.map.anisotropy = 8;
    }
  });

  // Cairan: pivot di dasar sehingga scale.y hanya menurunkan permukaan atas
  const liquid = root.getObjectByName('Bottle_Liquid');
  liquid.material = makeLiquidMaterial(variant.liquid);
  liquid.renderOrder = 1; // digambar sebelum badan botol
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
    bodyMats,
    bottom: box3.min.y,
    top: box3.max.y + CAP_LIFT, // termasuk tutup saat terangkat
  };
}

function buildCarton(scene) {
  const root = scene.getObjectByName('Carton').clone(true);
  root.position.set(0, 0, 0); // di GLB kotak digeser ke samping botol; di sini posisinya diatur BOX_X
  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material.clone();
    m.flatShading = false;
    m.side = THREE.DoubleSide;
    // Tekstur tetap tajam saat dilihat menyerong
    if (m.map) m.map.anisotropy = 8;
    if (m.emissiveMap) m.emissiveMap.anisotropy = 8;
    o.material = m;
  });
  return root;
}

// Tinggi area teks hero (px), diukur dari DOM. HERO_TEXT_H hanya nilai awal sebelum terukur.
function useHeroTextHeight(enabled) {
  const [h, setH] = useState(HERO_TEXT_H);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let ro;
    let tries = 0;

    const measure = (el) => {
      const sec = el.offsetParent;
      if (!sec) return;
      // dari atas judul sampai dasar layar, ditambah lebar fade supaya judul tidak ikut memudar
      const next = Math.round(sec.clientHeight - el.offsetTop + LINE_FADE + 6);
      setH((cur) => (Math.abs(cur - next) > 1 ? next : cur));
    };

    const find = () => {
      const el = document.getElementById('hero-title');
      if (!el) {
        if (tries++ < 120) raf = requestAnimationFrame(find); // Overlay belum terpasang
        return;
      }
      measure(el);
      ro = new ResizeObserver(() => measure(el));
      const sec = el.offsetParent;
      if (sec) {
        ro.observe(sec);
        Array.from(sec.children).forEach((c) => ro.observe(c));
      }
    };
    find();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [enabled]);

  return h;
}

export default function PerfumeBottle({ variant }) {
  const { scene } = useGLTF(variant.model);
  const ingredients = variant.ingredients;
  const pages = variant.pages;

  const bottle = useMemo(() => buildBottle(scene, variant), [scene, variant]);
  const carton = useMemo(() => buildCarton(scene), [scene]);
  const sceneColors = useMemo(() => ingredients.map((ing) => new THREE.Color(ing.color)), [ingredients]);
  const tmp = useMemo(() => ({ mix: new THREE.Color(), light: new THREE.Color() }), []);
  const white = useMemo(() => new THREE.Color('#ffffff'), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef({ x: 0, y: 0, on: false });
  const reveal = useRef(0);

  const rigRef = useRef();
  const spinRef = useRef();
  const lightRef = useRef();
  const boxRef = useRef();
  const cloudRigRef = useRef();
  const weights = useRef(ingredients.map(() => 0));
  const capOpen = useRef(0);
  const clipY = useRef(null);

  const scroll = useScroll();
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const mobile = width < 768;
  const heroTextH = useHeroTextHeight(mobile);

  useEffect(() => {
    const dom = gl.domElement;
    const set = (e, on) => {
      const r = dom.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: -((e.clientY - r.top) / r.height) * 2 + 1,
        on: on && !e.target.closest?.('header, [role="dialog"]'),
      };
    };
    const move = (e) => e.pointerType !== 'touch' && set(e, true);
    const down = (e) => set(e, true);
    const leave = () => (pointer.current.on = false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [gl]);

  useEffect(() => {
    const fixed = scroll.fixed;
    return () => {
      if (!fixed) return;
      fixed.style.clipPath = '';
      fixed.style.maskImage = '';
      fixed.style.webkitMaskImage = '';
    };
  }, [scroll]);

  const viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  const { fit, cy } = useMemo(() => {
    const h = (bottle.top - bottle.bottom) * S;
    return {
      fit: Math.min(1, (viewH * 0.68) / h),
      cy: (bottle.top + bottle.bottom) / 2,
    };
  }, [bottle, viewH]);

  const mobileHero = useMemo(() => {
    const h = (bottle.top - bottle.bottom) * S; // tinggi botol + tutup terangkat, skala 1
    const unit = viewH / height; // satuan dunia per px layar
    const free = Math.max(140, height - NAV_H - heroTextH);
    const bottomPx = (y, s) => height / 2 - y / unit + (s * h) / (2 * unit); // dasar botol di layar
    return {
      s: clamp((free * 0.9 * unit) / h, 0.25, 0.7),
      y: (height / 2 - (NAV_H + free / 2)) * unit,
      line: NAV_H + free,
      endLine: bottomPx(END.y, END.s) + END_GAP,
    };
  }, [bottle, viewH, height, heroTextH]);

  const targets = useMemo(() => makeTargets(ingredients.length, mobileHero), [ingredients, mobileHero]);

  useFrame((state, dt) => {
    const delta = Math.min(dt, 0.05);
    const o = scroll.offset;
    const t = state.clock.elapsedTime;
    const { mix, light } = tmp;

    const seg = o * (pages - 1);
    const i = Math.min(Math.floor(seg), pages - 2);
    const k = smooth(seg - i);
    const T = mobile ? targets.mobile : targets.desktop;

    const rig = rigRef.current;
    const spin = spinRef.current;
    const bx = boxRef.current;
    const cloud = cloudRigRef.current;
    if (!rig || !spin || !bx || !cloud) return;

    const targetX = lerp(T.x[i], T.x[i + 1], k);
    const targetY = lerp(T.y[i], T.y[i + 1], k);
    const targetScale = lerp(T.s[i], T.s[i + 1], k) * (mobile ? 1 : fit);
    const yComp = mobile ? 0 : -0.15; 

    rig.position.x = damp(rig.position.x, targetX, 5, delta);
    rig.position.y = damp(rig.position.y, targetY + yComp + Math.sin(t * 0.8) * 0.035, 5, delta);
    rig.scale.setScalar(damp(rig.scale.x, targetScale, 5, delta));

    const fixed = scroll.fixed;
    if (fixed) {
      if (mobile) {
        const y = Math.round(lerp(T.line[i], T.line[i + 1], k));
        if (y !== clipY.current) {
          clipY.current = y;
          const mask = `linear-gradient(to bottom, transparent ${y}px, #000 ${y + LINE_FADE}px)`;
          fixed.style.clipPath = `inset(${y}px 0 0 0)`;
          fixed.style.maskImage = mask;
          fixed.style.webkitMaskImage = mask;
        }
      } else if (clipY.current !== null) {
        clipY.current = null;
        fixed.style.clipPath = '';
        fixed.style.maskImage = '';
        fixed.style.webkitMaskImage = '';
      }
    }

    cloud.position.x = rig.position.x;
    cloud.position.y = rig.position.y;
    cloud.scale.setScalar(rig.scale.x * (mobile ? 1.1 : 1));

    spin.rotation.y = damp(spin.rotation.y, o * Math.PI * 2 + state.pointer.x * 0.18, 4, delta);
    spin.rotation.x = damp(spin.rotation.x, -state.pointer.y * 0.08, 4, delta);

    const boxProgress = smooth(clamp(seg - (pages - 2), 0, 1));
    const boxScale = damp(bx.scale.x, boxProgress, 5, delta);
    bx.scale.setScalar(boxScale);
    bx.visible = boxScale > 0.005;
    bx.rotation.y = damp(bx.rotation.y, BOX_YAW + Math.sin(t * 0.35) * 0.035, 3, delta);

    let total = 0;
    mix.setRGB(0, 0, 0);
    ingredients.forEach((_, idx) => {
      const raw = clamp(1 - Math.abs(seg - (idx + 1)) / 0.82, 0, 1);
      weights.current[idx] = damp(weights.current[idx], smooth(raw), 7, delta);
      const c = sceneColors[idx];
      const w = weights.current[idx];
      mix.r += c.r * w;
      mix.g += c.g * w;
      mix.b += c.b * w;
      total += w;
    });

    const mixAmt = clamp(total, 0, 1);
    if (total > 1e-4) mix.multiplyScalar(1 / total);
    bottle.liquid.scale.y = damp(bottle.liquid.scale.y, 1 - 0.22 * mixAmt, 4, delta);
    bottle.liquid.rotation.z = Math.sin(t * 0.7) * 0.004;

    let hovered = false;
    if (pointer.current.on) {
      ray.setFromCamera(pointer.current, state.camera);
      hovered = ray.intersectObject(bottle.root, true).length > 0;
    }
    reveal.current = damp(reveal.current, hovered ? 1 : 0, 6, delta);
    setReveal(bottle.bodyMats, reveal.current);

    capOpen.current = damp(capOpen.current, smooth(mixAmt), 4, delta);
    const open = capOpen.current;
    bottle.cap.position.y = bottle.seatY + CAP_LIFT * open;
    bottle.cap.rotation.z = CAP_TILT * open;
    bottle.cap.rotation.y = CAP_TWIST * open;

    if (lightRef.current) {
      lightRef.current.color.copy(white).lerp(mix, mixAmt * 0.6);
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
      <group ref={cloudRigRef} rotation={[0, 0, 0.18]}>
        {ingredients.map((ing, idx) => (
          <IngredientCloud
            key={ing.id}
            index={idx}
            weights={weights}
            config={ing.particles}
            model={variant.ingredientsModel}
          />
        ))}
      </group>
    </>
  );
}