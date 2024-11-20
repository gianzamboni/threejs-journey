import * as THREE from 'three';
import { TransformedCubeScene } from './exercises/0001.js';
const transformedCubeScene = new TransformedCubeScene();

const size = {
  width: 800,
  height: 600,
}

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
transformedCubeScene.camera(camera)


const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);

transformedCubeScene.render(renderer);

console.log(boxMesh.position.length())
console.log(boxMesh.position.distanceTo(camera.position))
console.log(boxMesh.position.normalize())