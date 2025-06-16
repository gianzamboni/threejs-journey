import { AdditiveBlending, BufferAttribute, PlaneGeometry, Points, ShaderMaterial, Texture, Uniform } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise, Starred } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import { MouseDisplacementEngine } from "./displacement-engine";
import imgFragmentShader from "./shaders/img.frag";
import imgVertexShader from "./shaders/img.vert";

import AnimatedExercise from "../../exercises/animated-exercise";

@Exercise('interactive-particles')
@Starred
@Description(
  '<p>Interactive Particles experiment.</p>',
  '<p>Just pass your mouse over the canvas and see the magic.</p>'
)
export class InteractiveParticles extends AnimatedExercise {

  private view: RenderView;
  private displacementEngine: MouseDisplacementEngine;
  private material: ShaderMaterial;
  private particles: Points;

  private picture: Texture;
  
  constructor(view: RenderView) {
    super();
    this.view = view;
    this.picture = AssetLoader.getInstance().loadTexture("imgs/picture-1.png")

    const geometry = new PlaneGeometry(10, 10, 128, 128);
    this.displacementEngine = new MouseDisplacementEngine(geometry, this.scene);
    this.material = this.createMaterial(this.displacementEngine.texture);
    this.setupGeometry(geometry);

    this.particles = new Points(geometry, this.material);

    this.scene.add(this.particles);

    this.camera.fov = 35;
    this.camera.position.set(-4, 0, 18);
    this.camera.lookAt(0 ,0, 0);
    this.camera.updateProjectionMatrix();
    view.setRender({
      clearColor: "#181818",
    })
  }

  @DebugFPS
  public frame(timer: Timer): void {
    this.material.uniforms.uTime.value = timer.getElapsed();
    this.displacementEngine.update(this.camera);
  }

  private setupGeometry(geometry: PlaneGeometry) {
    const intensityArray = new Float32Array(geometry.attributes.position.count);
    const angleArray = new Float32Array(geometry.attributes.position.count);

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      intensityArray[i] = Math.random();
      angleArray[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute("aIntensity", new BufferAttribute(intensityArray, 1));
    geometry.setAttribute("aAngle", new BufferAttribute(angleArray, 1));
    geometry.setIndex(null);
    geometry.deleteAttribute("normal");
  }

  private createMaterial(displacementTexture: Texture) {
    const material = new ShaderMaterial({
      blending: AdditiveBlending,
      vertexShader: imgVertexShader,
      fragmentShader: imgFragmentShader,
      uniforms: {
        uResolution: new Uniform(this.view.resolution),
        uPictureTexture: new Uniform(this.picture),
        uDisplacementTexture: new Uniform(displacementTexture),
        uTime: new Uniform(0),
      }
    });

    return material;
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.particles);
    this.displacementEngine.dispose();
  }

}
