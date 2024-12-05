import * as THREE from 'three';
import { createCube } from "./utils/cube"
import { BasicSetup } from "./utils/BasicSetup"

const exercise = new BasicSetup();

// Object
const cube = createCube(0)
exercise.add(cube)

// Animation
let clock = new THREE.Clock();
function tick() {
  //const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
 // cube.rotation.y += deltaTime;
  cube.position.x = Math.cos(elapsedTime);
  cube.position.y = Math.sin(elapsedTime);
  exercise.camera.lookAt(cube.position);
  exercise.render();
  window.requestAnimationFrame(tick);
}

tick();