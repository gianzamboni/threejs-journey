  import { Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { Customizable } from "#/app/decorators/customizable";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { disposeMesh } from "#/app/utils/three-utils";
import seaFragmentShader from "./sea.frag";
import seaVertexShader from "./sea.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


@Exercise("raging-sea")
export class RagingSea extends OrbitControlledExercise {

  @Customizable([{
    propertyPath: "uniforms.uBigWavesElevation.value",
    settings: {
      min: 0,
      max: 1,
      step: 0.001,
      name: "Big Waves Elevation",
    }
  }])
  private material: ShaderMaterial;

  private water: Mesh;



  constructor(renderView: RenderView) {
    super(renderView);

    const geometry = new PlaneGeometry(2, 2, 2048, 2048);
    this.material = new ShaderMaterial({
      vertexShader: seaVertexShader,
      fragmentShader: seaFragmentShader,
      uniforms: {
        uBigWavesElevation: { value: 0.2 },
      }
    });

    this.water = new Mesh(geometry, this.material);
    this.water.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.water);
    this.camera.position.set(1, 1, 1);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.water);
  }
}