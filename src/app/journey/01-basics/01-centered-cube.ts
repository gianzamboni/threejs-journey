import * as THREE from 'three';

import { Exercise } from '#/app/decorators/exercise';
import BaseExercise from '#/app/journey/exercises/base-exercise';
import { createRedCube } from '#/app/utils/default-shapes';

@Exercise('first-three-js-project')
export class CenteredCube extends BaseExercise {
  private cube: THREE.Mesh;
  
  constructor() {
    super();
    this.cube = createRedCube();
    this.scene.add(this.cube);
  }

  async dispose() {
    super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}