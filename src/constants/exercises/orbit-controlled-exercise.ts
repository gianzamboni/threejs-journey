import { OrbitControls } from "three/examples/jsm/Addons.js";
import AnimatedExercise from "./animated-exercise";
import RenderView from "@/layout/render-view";

export default class OrbitControlledExercise extends AnimatedExercise {

  public static isOrbitControlled = true;
  
  private controls: OrbitControls;

  constructor(view: RenderView) {
    super();
    this.controls = new OrbitControls(this.camera, view.canvas);
    this.controls.enableDamping = true;
  }

  frame() {
    this.controls.update();
  }

  async dispose() {
    this.controls.dispose();
    super.dispose();
  }
}