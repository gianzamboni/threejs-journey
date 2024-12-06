import * as THREE from 'three';
import { createCube } from "./utils/cube"
import { BasicSetup } from "./utils/BasicSetup"

const exercise = new BasicSetup({
  withCube: true,
});

exercise.render();