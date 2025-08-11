import { Timer } from 'three/addons/misc/Timer.js';

import { Cube } from "../../common/cube";

export class RotatingCube extends Cube {
  constructor() {
    super();
  }

  frame(timer: Timer) {
    const elapsed = timer.getElapsed();
    this.position.y = Math.sin(elapsed);
    this.position.x = Math.cos(elapsed);
  }

}