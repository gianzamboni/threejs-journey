import { PlaneGeometry, Points, ShaderMaterial, Uniform } from "three";

import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { disposeMesh } from "#/app/utils/three-utils";
import imgFragmentShader from "./shaders/img.frag";
import imgVertexShader from "./shaders/img.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('interactive-particles')
@Description('<p>Interactive Particles experiment. Just pass your mouse over the canvas and see the magic.</p>')
export class InteractiveParticles extends OrbitControlledExercise {

  private particles: Points;

  constructor(view: RenderView) {
    super(view);

    this.particles = this.createParticles();
    this.scene.add(this.particles);

    this.camera.fov = 35;
    this.camera.position.set(0, 0, 18);
    this.camera.updateProjectionMatrix();
    view.setRender({
      clearColor: "#181818",
    })
  }

  private createParticles() {
    const geometry = new PlaneGeometry(10, 10, 32, 32);
    const material = new ShaderMaterial({
      vertexShader: imgVertexShader,
      fragmentShader: imgFragmentShader,
      uniforms: {
        uResolution: new Uniform(this.view.resolution),
      }
    });

    return new Points(geometry, material);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.particles);
  }

}
