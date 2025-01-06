import { CenteredCube } from './01-centered-cube';

export class OrbitControlsCube extends CenteredCube {
  constructor(view) {
    super(view);
    this.view = view;
  }

  init() {
    super.init();
    this.view.show(this.scene);
  }
  
  async dispose() {
    super.dispose();
  }    
}