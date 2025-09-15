
import { Description, Exercise } from '#/app/decorators/exercise';
import BaseExercise from '#/app/journey/exercises/base-exercise';
import { CSS_CLASSES } from '#/theme';

import { Cube } from '../common/cube';
import { RedCube } from '../common/red-cube';

@Exercise('first-three-js-project')
@Description("<p>Just a cube in the center of the scene.</p>",
  `<p class='${CSS_CLASSES.light_text}'>It is <strong class='${CSS_CLASSES.text}'>NOT</strong> interactive.</p>`)
export class CenteredCube extends BaseExercise {
  private cube: Cube;
  
  constructor() {
    super();
    this.cube = new RedCube();
    this.scene.add(this.cube);
  }

  async dispose() {
    super.dispose();
    this.cube.dispose();
  }
}