import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";

import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";

@Exercise('post-processing')
export class PostProcessing extends OrbitControlledExercise {
  constructor(view: RenderView) {
    super(view);
  }
}