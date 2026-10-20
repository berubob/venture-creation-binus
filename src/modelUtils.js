import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// File GLB dari Blender/generator ini hanya membawa POSITION (tanpa normal),
// jadi normal dihitung ulang di sini. flat = true -> sisi tegas (kristal, kotak).
export function prepGeometry(source, flat) {
  let g = source.clone();
  Object.keys(g.attributes).forEach((k) => {
    if (k !== 'position') g.deleteAttribute(k);
  });
  if (flat) g = g.toNonIndexed();
  g.computeVertexNormals();
  return g;
}

export function findMesh(scene, name) {
  const m = scene.getObjectByName(name);
  return m && m.isMesh ? m : null;
}

// Gabungkan beberapa node menjadi satu geometri per material, dipusatkan
// di (0,0,0) dan diskalakan agar sisi terpanjangnya = 1. Siap untuk InstancedMesh.
export function buildVariant(scene, names, { flat = false, glow } = {}) {
  scene.updateMatrixWorld(true);
  const byMat = new Map();
  names.forEach((name) => {
    const src = findMesh(scene, name);
    if (!src) return;
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
    const merged = mergeGeometries(list, false);
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

// Salin node-node bernama menjadi Group baru (geometri sudah di koordinat dunia).
// override(name, materialAsli, flat) -> material pengganti.
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