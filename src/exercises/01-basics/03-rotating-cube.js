import * as THREE from 'three';
import { CenteredCube } from './01-centered-cube';
import { label } from '../../utils/utils';

export class RotatingCube extends CenteredCube {
  constructor(view) {
    super(view);
    this.view = view;
    this.debugUI = null;
  }

  init() {
    super.init();
    this.view.setTick(this.animation.bind(this));
    this.view.show(this.scene);
  }

  animation(timer) {
    const elapsedTime = timer.getElapsed();
    this.cube.position.y = Math.sin(elapsedTime);
    this.cube.position.x = Math.cos(elapsedTime);
    this.view.camera.lookAt(this.cube.position);
    if(this.sendDebugData) {
      this.debugUI.update('FPS', 1/timer.getDelta()); 
    }
  }

  startDebug(debugUI) {
    if(!this.debugUI) {
      this.debugUI = debugUI;
      debugUI.register('FPS', {
        updateType: "mean",
      })
    }
    this.sendDebugData = true;
  }

  stopDebug() {
    this.sendDebugData = false;
  }

  async dispose() {
    this.clock.stop();
    super.dispose();
  }
}