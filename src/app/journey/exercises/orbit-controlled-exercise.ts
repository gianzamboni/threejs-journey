import { OrbitControls } from "three/examples/jsm/Addons.js";
import AnimatedExercise from "./animated-exercise";
import RenderView from "@/app/layout/render-view";
import { Timer } from 'three/addons/misc/Timer.js';
import { Description } from "@/app/decorators/exercise";

@Description([
  '<strong>Rotate:</strong> Click/Tap & drag',
  '<strong>Zoom:</strong> Scroll or pinch',
  '<strong>Pan:</strong> Two-finger Tap/Right click & drag'
])
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