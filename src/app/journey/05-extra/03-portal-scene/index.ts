import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('portal-scene')
export class PortalScene extends OrbitControlledExercise {

  private cube: Mesh;

  constructor(renderView: RenderView) {
    super(renderView);

    this.cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial()
    )

    this.camera.position.set(4, 2, 4);
    this.scene.add(this.cube);
  }

  async dispose() {
    await super.dispose();

    this.cube.geometry.dispose();
    (this.cube.material as MeshBasicMaterial).dispose();
  }
}

