import { Color, Mesh, PlaneGeometry, RawShaderMaterial, Vector2 } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { MATERIAL_CONTROLLERS } from "./debug-ui";
import testFragmentShader from './fragment.frag'
import testVertexShader from './vertex.vert'

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


@Exercise('shaders')
export class Shaders extends OrbitControlledExercise {

  private geometry: PlaneGeometry;

  @Customizable(MATERIAL_CONTROLLERS)
  private material: RawShaderMaterial;
  private mesh: Mesh;

  constructor(view: RenderView) {
    super(view);

    this.geometry = new PlaneGeometry(1, 1, 32, 32);

    //const count = this.geometry.attributes.position.count;
    // const randoms = new Float32Array(count);

    // for (let i = 0; i < count; i++) {
    //   randoms[i] = Math.random();
    // }

    // this.geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));

    this.material = new RawShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      transparent: true,
      uniforms: {
        uFrequency: { value: new Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new Color('orange') }
      }
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.scale.y = 2/3;
    this.scene.add(this.mesh);

    this.camera.position.set(0.25, -0.25, 1);
  }

  frame(timer: Timer): void {
    super.frame(timer);
    this.material.uniforms.uTime.value = timer.getElapsed();
  }

  async dispose() {
    super.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }

}