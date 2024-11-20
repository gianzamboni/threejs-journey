import * as THREE from 'three';

function createCube(xPosition) {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const solidGreenMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const boxMesh = new THREE.Mesh(boxGeometry, solidGreenMaterial);
  boxMesh.position.x = xPosition;
  return boxMesh;
}

const scene = new THREE.Scene();
const group = new THREE.Group();
scene.add(group);

group.scale.y = 2
group.rotation.y = 0.2

const cube1 = createCube(-1.5);
const cube2 = createCube(0);
const cube3 = createCube(1.5);

group.add(cube1, cube2, cube3);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const size = {
  width: 800,
  height: 600,
}

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3
camera.lookAt(group.position)
scene.add(camera);

const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

console.log(boxMesh.position.length())
console.log(boxMesh.position.distanceTo(camera.position))
console.log(boxMesh.position.normalize())