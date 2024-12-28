import { CenteredCube } from './01-centered-cube';
import { AnimationLoop } from '../../utils/animation-loop';

export class OrbitControlsCube extends CenteredCube {
  constructor(view) {
    super(view);
    this.view = view;
  }

  init() {
    super.init();
    this.view.toggleOrbitControls(true);
    this.view.show(this.scene);
  }
  
  async dispose() {
    super.dispose();
  }
}