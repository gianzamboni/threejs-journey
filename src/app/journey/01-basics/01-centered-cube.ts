import { Mesh } from 'three';

import { Description, Exercise } from '#/app/decorators/exercise';
import BaseExercise from '#/app/journey/exercises/base-exercise';
import { createRedCube, disposeMesh } from '#/app/utils/three-utils';
import { CSS_CLASSES } from '#/theme';

@Exercise('first-three-js-project')
@Description("<p>Just a cube in the center of the scene.</p>",
  `<p class='${CSS_CLASSES.light_text}'>It is <strong class='${CSS_CLASSES.text}'>NOT</strong> interactive.</p>`)
export class CenteredCube extends BaseExercise {
  private cube: Mesh;
  
  constructor() {
    super();
    this.cube = createRedCube();
    this.scene.add(this.cube);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.cube);
  }
}