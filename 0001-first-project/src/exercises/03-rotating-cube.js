import * as THREE from 'three';
import { createCube } from "./utils/cube"
import { BasicSetup } from "./utils/BasicSetup"

const exercise = new BasicSetup({
  withCube: true,
});

exercise.animate((clock) => {
  const elapsedTime = clock.getElapsedTime();
  exercise.moveCube({
    x: Math.cos(elapsedTime),
    y: Math.sin(elapsedTime),
  })
});