import { Uniform, ShaderMaterial, DoubleSide, AdditiveBlending, Color } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import hologramFrag from "./hologram.frag";
import hologramVert from "./hologram.vert";

import SuzanneScene from "../../common/suzanne-scene";
import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise("hologram")
@Description("<p>Creating a hologram effect using glsl shaders</p>")
export class Hologram extends OrbitControlledExercise {

  @Customizable([{
    type: "color",
    settings: {
      name: "Clear Color",
      onChange: 'updateClearColor'
    }
  }])
  private clearColor: string = "#1d1f2a";

  @Customizable([{
    type: "color",
    settings: {
      name: "Hologram Color",
      onChange: 'updateHologramColor'
    }
  }])
  private hologramColor: string = "#70c1ff";

  private material: ShaderMaterial;

  private suzanneScene: SuzanneScene;
  
  constructor(view: RenderView) {
    super(view);
    
    this.material = this.createMaterial();
    this.view.renderer.setClearColor(this.clearColor);

    this.suzanneScene = new SuzanneScene(this.material, this);
  }

  public frame(timer: Timer) {
    super.frame(timer);
    const elapsedTime = timer.getElapsed();
    this.material.uniforms.uTime.value = elapsedTime;
    this.suzanneScene.frame(timer);
  }

  private createMaterial() {
    return new ShaderMaterial({
      depthWrite: false,
      side: DoubleSide,
      blending: AdditiveBlending,
      vertexShader: hologramVert,
      fragmentShader: hologramFrag,
      transparent: true,
      uniforms: {
        uTime: new Uniform(0),
        uHologramColor: new Uniform(new Color(this.hologramColor)),
      },
    });
  }

  updateClearColor() {
    this.view.renderer.setClearColor(this.clearColor);
  }

  updateHologramColor() {
    this.material.uniforms.uHologramColor.value.set(this.hologramColor);
  }

  async dispose() {
    super.dispose();
    this.suzanneScene.dispose();
  }
}
