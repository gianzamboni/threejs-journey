import { Mesh } from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from '#/app/decorators/exercise';
import AnimatedExercise from '#/app/journey/exercises/animated-exercise';
import { createRedCube, disposeMesh } from '#/app/utils/three-utils';
import { CSS_CLASSES } from '#/theme';
@Exercise('animations')
@Description(
  "<p>A cube and a camera that rotate around.</p>", 
  `<p class='${CSS_CLASSES.light_text}'>It is <strong class='${CSS_CLASSES.text}'>NOT</strong> interactive.</p>`
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