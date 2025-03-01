import RenderView from "#/app/layout/render-view";
import { AnimationLoop } from "#/app/utils/animation-loop";
import { Timer } from "three/examples/jsm/Addons.js";
import BaseExercise from "./base-exercise";
import { ExerciseMetadata } from "#/app/utils/exercise-metadata";

export default class AnimatedExercise extends BaseExercise {

  private animationLoop: AnimationLoop;

  constructor() {
    super();
    const metadata = ExerciseMetadata.get(this);
    metadata.isAnimated = true;
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