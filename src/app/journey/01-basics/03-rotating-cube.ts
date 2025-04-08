import { Mesh } from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from '#/app/decorators/exercise';
import AnimatedExercise from '#/app/journey/exercises/animated-exercise';
import { createRedCube, disposeMesh } from '#/app/utils/three-utils';
@Exercise('animations')
@Description(
  "<p><strong>A cube and a camera that rotate around.</strong></p>", 
  "<p>It is <strong>NOT</strong> interactive.</p>"
)
export class RotatingCube extends AnimatedExercise {
    
  private cube: Mesh;

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
    await super.dispose();
    disposeMesh(this.cube);
  }
}