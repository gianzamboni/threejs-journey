import { AxesHelper } from 'three';

import { Description, Exercise } from '#/app/decorators/exercise';
import BaseExercise from '#/app/journey/exercises/base-exercise';
import { disposeObjects } from '#/app/utils/three-utils';
import { CSS_CLASSES } from '#/theme';
import { CubeCollection } from './cube-group';

@Exercise('object-transformation')
@Description(
  "<p>A group of y-scaled cubes in the center of the scene.</p>",
  `<p class='${CSS_CLASSES.light_text}'>It is <strong class='${CSS_CLASSES.text}'>NOT</strong> interactive.</p>`
)
export class CubeGroup extends BaseExercise {  
  
  private axesHelper: AxesHelper;
  private cubeCollection: CubeCollection;

  constructor() {
    super();
    this.cubeCollection = new CubeCollection();
    this.axesHelper = new AxesHelper(2);
    this.scene.add(this.cubeCollection, this.axesHelper);
  }

  async dispose() {
    super.dispose();
    disposeObjects(this.axesHelper, this.cubeCollection);
  }
}