import * as THREE from 'three';
import  BaseExercise from '@/journey/exercises/base-exercise';
import { createRedCube } from '@/utils/default-shapes';

export class CenteredCube extends BaseExercise {

  public static id: string = 'first-threejs-project';

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