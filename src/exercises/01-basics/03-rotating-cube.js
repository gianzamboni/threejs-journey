import * as THREE from 'three';
import { CenteredCube } from './01-centered-cube';
import { AnimationLoop } from '../../utils/animation-loop';

export class RotatingCube extends CenteredCube {
  constructor(view) {
    super(view);
    this.view = view;
    this.clock = new THREE.Clock();
    this.animationLoop = new AnimationLoop(() => this.animation());
  }

  init() {
    this.view.show(this.scene);
    this.animationLoop.start();
  }

  animation() {
    const elapsedTime = this.clock.getElapsedTime();
    this.cube.position.y = Math.sin(elapsedTime);
    this.cube.position.x = Math.cos(elapsedTime);
    this.view.camera.lookAt(this.cube.position);
    this.view.render(this.scene);
  }

  async dispose() {
    await this.animationLoop.stop();
    super.dispose();
  }
}