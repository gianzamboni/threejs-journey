import RenderView from "@/layout/render-view";
import { AnimationLoop } from "@/utils/animation-loop";
import { Timer } from "three/examples/jsm/Addons.js";
import BaseExercise from "./base-exercise";

export default class AnimatedExercise extends BaseExercise {

  private animationLoop: AnimationLoop;

  public isAnimated: boolean = true;
  constructor() {
    super();

    this.animationLoop = this.createAnimationLoop();
  }

  private createAnimationLoop(): AnimationLoop {
    return new AnimationLoop(this.frame.bind(this));
  }

  frame(_: Timer) {
    throw new Error('Method not implemented.');
  }

  startAnimation(renderer: RenderView) {
    this.animationLoop.init(renderer);      
  };

  async dispose(): Promise<void> {
    if(this.animationLoop) {
      await this.animationLoop.stop();
    } 
    super.dispose();
  }
}