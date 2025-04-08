import { Mesh } from "three";

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { createRedCube, disposeMesh } from "#/app/utils/three-utils";

@Exercise('cameras')
@Description("<strong>Just a cube. This demo shows how you can control a camera with a mouse.</strong>")
export class OrbitControlsTest extends OrbitControlledExercise {
  private cube: Mesh;

  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    this.cube = createRedCube();

    this.camera.position.y = 1;
    this.scene.add(this.cube);
  }
  
  async dispose() {
    await super.dispose();
    disposeMesh(this.cube);
  }
}