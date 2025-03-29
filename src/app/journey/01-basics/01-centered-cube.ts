import * as THREE from 'three';

import { Description, Exercise } from '#/app/decorators/exercise';
import BaseExercise from '#/app/journey/exercises/base-exercise';
import { createRedCube, disposeMesh } from '#/app/utils/three-utils';

@Exercise('first-three-js-project')
@Description(["<p><strong>Just a cube in the center of the scene</strong>.<br>It is <strong>NOT</strong> interactive.</p>"])
export class CenteredCube extends BaseExercise {
  private cube: THREE.Mesh;
  
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