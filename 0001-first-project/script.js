import * as THREE from 'three';

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


const size = {
  width: 800,
  height: 600,
}

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3
scene.add(camera);

const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);