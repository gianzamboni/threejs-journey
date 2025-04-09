import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";

import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";

@Exercise('shaders')
export class Shaders extends OrbitControlledExercise {

  private geometry: PlaneGeometry;
  private material: MeshBasicMaterial;
  private mesh: Mesh;

  constructor(view: RenderView) {
    super(view);

    this.geometry = new PlaneGeometry(1, 1, 32, 32);
    this.material = new MeshBasicMaterial();

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.camera.position.set(0.25, -0.25, 1);
  }

  async dispose() {
    super.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }

}