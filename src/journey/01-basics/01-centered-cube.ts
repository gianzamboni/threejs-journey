import * as THREE from 'three';
import  BaseExercise from '@/journey/base-exercise';
import { Exercise } from '../decorators';
import { SceneObject } from '../decorators/scene-objects';
import { createRedCube } from '@/utils/default-shapes';

@Exercise({
  id: 'first-threejs-project',
})
export class CenteredCube extends BaseExercise {

  @SceneObject
  private cube: THREE.Mesh;
  
  constructor() {
    super();

    this.cube = createRedCube();
  }

  dispose() {
    super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}