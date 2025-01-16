import * as THREE from 'three';
import BaseExercise from "../base-exercise";
import { Exercise } from "../decorators";

@Exercise({ id: 'animations' })
export class RotatingCube extends BaseExercise {

  private cube: THREE.Mesh;

  constructor() {
    super();
    this.cube = this.createCube();
  }

  private createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
    const cube = new THREE.Mesh(geometry, material);
    this._scene.add(cube);
    return cube;
  }

  

  dispose() {
    super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}