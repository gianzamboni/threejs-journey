import { CenteredCube } from './01-centered-cube';
import { AnimationLoop } from '../../utils/animation-loop';

export class OrbitControlsCube extends CenteredCube {
  constructor(view) {
    super(view);
    this.view = view;
    this.view.toggleOrbitControls(true);
    this.animationLoop = new AnimationLoop (() => this.animation());
  }

  animation() {
    this.view.render(this.scene);
  }

  async dispose() {
    await this.animationLoop.dispose();
    super.dispose();
  }
}