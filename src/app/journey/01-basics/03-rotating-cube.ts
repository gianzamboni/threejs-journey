import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js';
import { createRedCube } from '@/app/utils/default-shapes';
import AnimatedExercise from '@/app/journey/exercises/animated-exercise';

export class RotatingCube extends AnimatedExercise {

  public static id = 'animations';
  
  private cube: THREE.Mesh;

  constructor() {
    super();

    this.cube = createRedCube();
    this.scene.add(this.cube);
  }

  frame(timer: Timer) {
    const elapsed = timer.getElapsed();
    this.cube.position.y = Math.sin(elapsed);
    this.cube.position.x = Math.cos(elapsed);
    this.camera.lookAt(this.cube.position);
  }

  async dispose() {
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
    await super.dispose();
  }
}