import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { disposeMesh } from "#/app/utils/three-utils";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise("raging-sea")
export class RagingSea extends OrbitControlledExercise {

  private water: Mesh;

  constructor(renderView: RenderView) {
    super(renderView);

    const geometry = new PlaneGeometry(2, 2, 2048, 2048);
    const material = new MeshBasicMaterial({ color: 0xffffff   });
    this.water = new Mesh(geometry, material);
    this.water.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.water);
    this.camera.position.set(1, 1, 1);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.water);
  }
}