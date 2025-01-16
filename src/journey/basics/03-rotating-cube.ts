import * as THREE from 'three';
import BaseExercise from "../base-exercise";
import { Animation, Exercise, SceneObject } from "../decorators";
import { Timer } from 'three/addons/misc/Timer.js';

@Exercise({ id: 'animations' })
export class RotatingCube extends BaseExercise {

  @SceneObject
  private cube: THREE.Mesh;

  constructor() {
    super();
    this.cube = this.createCube();
  }

  private createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  @Animation
  frame(timer: Timer) {
    const elapsed = timer.getElapsed();
    this.cube.rotation.y = Math.sin(elapsed);
    this.cube.rotation.x = Math.cos(elapsed);
    this.camera.lookAt(this.cube.position);
  }

  dispose() {
    super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}