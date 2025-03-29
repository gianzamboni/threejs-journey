import * as THREE from 'three';

export function createRedCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

export function disposeMesh(mesh: { geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[] }) {
  mesh.geometry.dispose();
  if (Array.isArray(mesh.material)) {
    for(const material of mesh.material) {
      material.dispose();
    }
  } else {
    mesh.material.dispose();
  }
}

export function disposeObjects(...args: { dispose: () => void }[] ) {
  for(const object of args) {
    object.dispose();
  }
}