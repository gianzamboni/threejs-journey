import * as THREE from 'three';
import { createCube } from "./utils/cube"
import { BasicSetup } from "./utils/BasicSetup"

const exercise = new BasicSetup();
const mesh = createCube(0);
exercise.add(mesh);
exercise.camera.lookAt(mesh.position);
exercise.render();