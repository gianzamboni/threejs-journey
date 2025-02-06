import * as THREE from 'three';

export function createRedCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}