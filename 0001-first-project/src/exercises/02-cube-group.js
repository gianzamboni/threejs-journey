import * as THREE from 'three';
import { createCube } from './utils/cube';
import { BasicSetup } from './utils/BasicSetup';

const exercise = new BasicSetup();

// Objects
const group = new THREE.Group();
exercise.add(group);

group.scale.y = 2
group.rotation.y = 0.2

const cubes = [-1.5, 0, 1.5].map(createCube);
group.add(...cubes);

const axesHelper = new THREE.AxesHelper(2);
exercise.add(axesHelper);

exercise.render();

console.log(cubes[0].position.length())
console.log(cubes[0].position.distanceTo(exercise.camera.position))
console.log(cubes[0].position.normalize())