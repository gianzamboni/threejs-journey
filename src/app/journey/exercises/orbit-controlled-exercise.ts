import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Timer } from 'three/addons/misc/Timer.js';

import { WithOrbitControllerDescription } from '#/app/decorators/exercise';
import AnimatedExercise from "#/app/journey/exercises/animated-exercise";
import RenderView from "#/app/layout/render-view";

@WithOrbitControllerDescription
export default class OrbitControlledExercise extends AnimatedExercise {
  
  protected controls: OrbitControls;

  protected view: RenderView;

  constructor(view: RenderView) {
    super();
    this.view = view;
    this.controls = new OrbitControls(this.camera, view.canvas);
    this.controls.enableDamping = true;
  }

  frame(_: Timer): void {
    this.controls.update();
  }

  enableAutoRotation() {
    this.controls.autoRotate = true;
  }
  
  async dispose() {
    this.controls.dispose();
    super.dispose();
  }
}