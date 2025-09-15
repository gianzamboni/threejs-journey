import { Timer } from 'three/addons/misc/Timer.js';

import { RedCube } from "../../common/red-cube";

export class RotatingCube extends RedCube {
  constructor() {
    super();
  }

  frame(timer: Timer) {
    const elapsed = timer.getElapsed();
    this.position.y = Math.sin(elapsed);
    this.position.x = Math.cos(elapsed);
  }

}