import * as THREE from 'three';
import BaseExercise from "../base-exercise";
import { Exercise } from "../decorators";
import { Timer } from 'three/addons/misc/Timer.js';
import { SceneObject } from '../decorators/scene-objects';
import { Animation } from '../decorators/animation';
import { DebugFPS } from '../decorators/debug-info';

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
  @DebugFPS
  frame(timer: Timer) {
    const elapsed = timer.getElapsed() * 0.25;
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