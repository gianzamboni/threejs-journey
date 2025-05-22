import { PlaneGeometry, Points, ShaderMaterial, Texture, Uniform } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import { DisplacementEngine } from "./displacement-engine";
import imgFragmentShader from "./shaders/img.frag";
import imgVertexShader from "./shaders/img.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('interactive-particles')
@Description(
  '<p>Interactive Particles experiment.</p>',
  '<p>Just pass your mouse over the canvas and see the magic.</p>'
)
export class InteractiveParticles extends OrbitControlledExercise {

  private displacementEngine: DisplacementEngine;
  private particles: Points;

  private picture: Texture;
  
  constructor(view: RenderView) {
    super(view);

    this.picture = AssetLoader.getInstance().loadTexture("imgs/picture-1.png")


    this.particles = this.createParticles();
    this.displacementEngine = new DisplacementEngine(this.particles, this.scene);

    this.scene.add(this.particles);

    this.camera.fov = 35;
    this.camera.position.set(0, 0, 18);
    this.camera.updateProjectionMatrix();
    view.setRender({
      clearColor: "#181818",
    })
  }

  @DebugFPS
  public frame(timer: Timer): void {
    super.frame(timer);
  }

  private createParticles() {
    const geometry = new PlaneGeometry(10, 10, 128, 128);
    const material = new ShaderMaterial({
      vertexShader: imgVertexShader,
      fragmentShader: imgFragmentShader,
      uniforms: {
        uResolution: new Uniform(this.view.resolution),
        uPictureTexture: new Uniform(this.picture),
      }
    });

    return new Points(geometry, material);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.particles);
    this.displacementEngine.dispose();
  }

}
