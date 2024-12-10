import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BasicSetup } from './utils/BasicSetup.js';

const exercise = new BasicSetup({
  withCube: true,
});

const controls = new OrbitControls(exercise.camera, exercise.canvas)
controls.enableDamping = true;

exercise.animate(() => {
  controls.update();
});