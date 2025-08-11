import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from '#/app/decorators/exercise';
import AnimatedExercise from '#/app/journey/exercises/animated-exercise';
import { CSS_CLASSES } from '#/theme';
import { RotatingCube } from './rotating-cube';

@Exercise('animations')
@Description(
  "<p>A cube and a camera that rotate around.</p>", 
  `<p class='${CSS_CLASSES.light_text}'>It is <strong class='${CSS_CLASSES.text}'>NOT</strong> interactive.</p>`
)
export class RotatingCubeExercise extends AnimatedExercise {
    
  private cube: RotatingCube;

  constructor() {
    super();

    this.cube = new RotatingCube();
    this.scene.add(this.cube);
  }

  frame(timer: Timer) {
    this.cube.frame(timer);
    this.camera.lookAt(this.cube.position);
  }

  async dispose() {
    await super.dispose();
    this.cube.dispose();
  }
}