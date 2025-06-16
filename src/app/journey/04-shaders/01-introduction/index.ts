import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { MATERIAL_CONTROLLERS } from "./debug-ui";
import testFragmentShader from './fragment.frag'
import testVertexShader from './vertex.vert'



@Exercise('first-shader')
@Description('<p>A flag waving. My first shader</p>')
export class Shaders extends OrbitControlledExercise {

  private geometry: PlaneGeometry;
  
  @Customizable(MATERIAL_CONTROLLERS)
  private material: ShaderMaterial;
  private mesh: Mesh;



  constructor(view: RenderView) {
    super(view);

    this.geometry = new PlaneGeometry(1, 1, 32, 32);
    
    this.material = new ShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      transparent: true,
      uniforms: {
        uFrequency: { value: new Vector2(10, 5) },
        uTime: { value: 0 },
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