import * as THREE from 'three';
import { createCube } from "./utils/cube"
import { BasicSetup } from "./utils/BasicSetup"

const exercise = new BasicSetup({
  withCube: true,
});

// Animation
let clock = new THREE.Clock();
function tick() {
  //const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
 // cube.rotation.y += deltaTime;
  exercise.moveCube({
    x: Math.cos(elapsedTime),
    y: Math.sin(elapsedTime),
  })
  exercise.render();
  window.requestAnimationFrame(tick);
}

tick();