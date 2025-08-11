
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";

import { Cube } from "../common/cube";
import { RedCube } from "../common/red-cube";

@Exercise('cameras')
@Description("<p>Just a cube. This demo shows how you can control a camera with a mouse.</p>")
export class OrbitControlsTest extends OrbitControlledExercise {
  private cube: Cube;

  constructor(view: RenderView) {
    super(view);
    this.cube = new RedCube();
    this.scene.add(this.cube);

    this.camera.position.y = 1;
    this.enableAutoRotation();

  }
  
  async dispose() {
    await super.dispose();
    this.cube.dispose();
  }
}