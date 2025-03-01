import { Timer } from 'three/addons/misc/Timer.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";

import AnimatedExercise from "#/app/journey/exercises/animated-exercise";
import RenderView from "#/app/layout/render-view";

export default class OrbitControlledExercise extends AnimatedExercise {
  
  protected controls: OrbitControls;

  constructor(view: RenderView) {
    super();
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