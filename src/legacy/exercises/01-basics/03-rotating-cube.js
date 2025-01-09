import * as THREE from 'three';
import { CenteredCube } from './01-centered-cube';
import { label } from '../../utils/utils';

export class RotatingCube extends CenteredCube {
  constructor(view) {
    super(view);
    this.view = view;
  }

  init() {
    super.init();
    this.view.show(this.scene);
  }

  animation(timer) {
    const elapsedTime = timer.getElapsed();
    this.cube.position.y = Math.sin(elapsedTime);
    this.cube.position.x = Math.cos(elapsedTime);
    this.view.camera.lookAt(this.cube.position);
  }

  async dispose() {
    super.dispose();
  }
}