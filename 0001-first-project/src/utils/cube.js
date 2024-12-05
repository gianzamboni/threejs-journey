import * as THREE from 'three';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);

const solidRedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

export function createCube(xPosition) {
  const boxMesh = new THREE.Mesh(boxGeometry, solidRedMaterial);
  boxMesh.position.x = xPosition;
  return boxMesh;
}