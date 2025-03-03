import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";

import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";

@Exercise('physics')
export class Physics extends OrbitControlledExercise {

  constructor(view: RenderView) {
    super(view);
  }
  
  async dispose() {
    await super.dispose();

  }
}