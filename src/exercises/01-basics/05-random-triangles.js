import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BasicSetup } from './utils/BasicSetup.js';


const exercise = new BasicSetup({
  responsive: true,
  cameraPosition: { z: 6 },
  withControls: true,
});

const geometry = new THREE.BufferGeometry();

const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

const bufferAtrribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', bufferAtrribute);

const redWireFrameMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geometry, redWireFrameMaterial);
exercise.add(mesh);

window.addEventListener('dblclick', () => {
  exercise.toggleFullscreen();
});