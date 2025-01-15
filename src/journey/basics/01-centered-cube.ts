import * as THREE from 'three';
import  BaseExercise from '@/journey/base-exercise';
import { Exercise } from '../decorators';

@Exercise({
  id: 'first-threejs-project',
  description: "A centered cube. It doesn't do anything, but it's a start."
})
export class CenteredCube extends BaseExercise {

  private cube: THREE.Mesh;
  
  constructor() {
    super();

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this._scene.add(this.cube);
  }

  dispose() {
    super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}