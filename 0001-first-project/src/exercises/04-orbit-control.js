import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BasicSetup } from './utils/BasicSetup.js';
/**
 * Base
 */

const exercise = new BasicSetup({
  withCube: true,
});

const cursor = {
  x: 0,
  y: 0
}

const controls = new OrbitControls(exercise.camera, exercise.canvas)
controls.enableDamping = true;

// Animate
const clock = new THREE.Clock()
const tick = () =>
{
    controls.update();
    exercise.render();
    window.requestAnimationFrame(tick)
}

tick();

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / exercise.size.width - 0.5;
  cursor.y = -(event.clientY / exercise.height - 0.5);
});