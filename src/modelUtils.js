import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function prepGeometry(source, flat) {
  let g = source.clone();
  const keepNormal = !flat && !!g.attributes.normal;
  Object.keys(g.attributes).forEach((k) => {
    if (k !== 'position' && !(k === 'normal' && keepNormal)) g.deleteAttribute(k);
  });
  if (flat) g = g.toNonIndexed();
  if (!keepNormal) g.computeVertexNormals();
  return g;
}

export function findMesh(scene, name) {
  const m = scene.getObjectByName(name);
  return m && m.isMesh ? m : null;
}

export function makeLiquidMaterial(cfg) {
  const color = new THREE.Color(cfg.color);
  if (cfg.clear) {
    return new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity: 0.3,
      roughness: 0.02,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 1.6,
      depthWrite: false,
    });
  }
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: cfg.emissive ?? 0.35,
    roughness: 0.15,
    clearcoat: 0.6,
  });
}

export function prepareBody(root, names) {
  const mats = [];
  root.traverse((o) => {
    if (!o.isMesh || !names.includes(o.name)) return;
    o.material = o.material.clone();
    o.material.transparent = true;
    o.material.depthWrite = true;
    o.renderOrder = 2;
    mats.push(o.material);
  });
  return mats;
}

export function setReveal(mats, r) {
  const opacity = THREE.MathUtils.lerp(1, 0.1, r);
  mats.forEach((m) => {
    m.opacity = opacity;
  });
}

export function preloadVariant(variant) {
  useGLTF.preload(variant.model);
  useGLTF.preload(variant.ingredientsModel);
}

export function buildVariant(scene, names, { flat = false, glow } = {}) {
  scene.updateMatrixWorld(true);
  const byMat = new Map();
  names.forEach((name) => {
    const src = findMesh(scene, name);
    if (!src) {
      console.warn(`[buildVariant] node tidak ditemukan atau bukan mesh: ${name}`);
      return;
    }
    const g = prepGeometry(src.geometry, flat);
    g.applyMatrix4(src.matrixWorld);
    if (!byMat.has(src.material)) byMat.set(src.material, []);
    byMat.get(src.material).push(g);
  });

  const box = new THREE.Box3();
  byMat.forEach((list) =>
    list.forEach((g) => {
      g.computeBoundingBox();
      box.union(g.boundingBox);
    })
  );
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const k = 1 / Math.max(size.x, size.y, size.z, 1e-6);

  const parts = [];
  byMat.forEach((list, mat) => {
    const mixed = list.some((g) => g.index) && !list.every((g) => g.index);
    const merged = mergeGeometries(mixed ? list.map((g) => (g.index ? g.toNonIndexed() : g)) : list, false);
    if (!merged) return;
    merged.translate(-center.x, -center.y, -center.z);
    merged.scale(k, k, k);
    const material = mat.clone();
    material.flatShading = false;
    if (glow && material.emissive) {
      material.emissive = new THREE.Color(glow);
      material.emissiveIntensity = 0.35;
    }
    parts.push({ geometry: merged, material });
  });
  return parts;
}

export function bakeGroup(scene, names, override) {
  scene.updateMatrixWorld(true);
  const group = new THREE.Group();
  const meshes = {};
  names.forEach((name) => {
    const src = findMesh(scene, name);
    if (!src) return;
    const flat = src.geometry.attributes.position.count <= 24;
    const geo = prepGeometry(src.geometry, flat);
    geo.applyMatrix4(src.matrixWorld);
    const mesh = new THREE.Mesh(geo, override(name, src.material));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    meshes[name] = mesh;
  });
  return { group, meshes };
}
