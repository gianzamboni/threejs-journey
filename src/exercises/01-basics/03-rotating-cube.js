import * as THREE from 'three';
import { CenteredCube } from './01-centered-cube';

export class RotatingCube extends CenteredCube {
  constructor(view) {
    super(view);
    this.view = view;
    this.clock = new THREE.Clock();
  }

  init() {
    super.init();
    this.view.setTick(() => this.animation());
    this.view.show(this.scene);
  }

  animation() {
    const elapsedTime = this.clock.getElapsedTime();
    this.cube.position.y = Math.sin(elapsedTime);
    this.cube.position.x = Math.cos(elapsedTime);
    this.view.camera.lookAt(this.cube.position);
  }

  async dispose() {
    super.dispose();
  }
}