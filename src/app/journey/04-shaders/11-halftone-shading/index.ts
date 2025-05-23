import { Color, ShaderMaterial, Uniform } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import { CustomizableMetadata } from "#/app/layout/debug-ui/controller-factory";
import RenderView from "#/app/layout/render-view";
import { INITIAL_CLEAR_COLOR, HALFTONE_SHADING_CONTROLLER, INITIAL_LIGHT_REPETITIONS, INITIAL_COLOR, INITIAL_SHADOW_REPETITIONS, INITIAL_SHADOW_COLOR, INITIAL_LIGHT_COLOR } from "./controllers";
import halftoneFrag from "./shaders/halftone.frag";
import halftoneVert from "./shaders/halftone.vert";

import SuzanneScene from "../../common/suzanne-scene";
import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise("halftone-shading")
@Description("<p>Halftone Shading implemented from scratch</p>")
export class HalftoneShading extends OrbitControlledExercise {

  @Customizable(HALFTONE_SHADING_CONTROLLER)
  private material: ShaderMaterial;

  private suzanneScene: SuzanneScene;

  @Customizable([{
    type: "color",
    initialValue: INITIAL_CLEAR_COLOR,
    propertyPath: "clearColor",
    settings: {
      name: "Clear Color",
      onChange: 'updateClearColor'
    }
  }])
  private _view: RenderView;

  constructor(view: RenderView) {
    super(view);  

    this._view = view;

    this.material = this.createMaterial();
    this.suzanneScene = new SuzanneScene(this.material, this);
 
    this.camera.position.set(7, 7, 7);
    this._view.setRender({
      clearColor: "#26132f",
    })
  }

  public frame(timer: Timer) {
    super.frame(timer);
    this.suzanneScene.frame(timer);
  }

  async dispose() {
    super.dispose();
    this.suzanneScene.dispose();
    this.material.dispose();
  }

  public updateUniform(newValue: string, context: CustomizableMetadata) {
    this.material.uniforms[context.property].value.set(new Color(newValue));
  }

  public updateClearColor(newValue: string) {
    this._view.setRender({
      clearColor: newValue,
    })
  }

  private createMaterial() {
    return new ShaderMaterial({
      vertexShader: halftoneVert,
      fragmentShader: halftoneFrag,
      uniforms: {
        uColor: new Uniform(new Color(INITIAL_COLOR)),
        uResolution: new Uniform(this._view.resolution),
        uShadowRepetitions: new Uniform(INITIAL_SHADOW_REPETITIONS),
        uShadowColor: new Uniform(new Color(INITIAL_SHADOW_COLOR)),
        uLightColor: new Uniform(new Color(INITIAL_LIGHT_COLOR)),
        uLightRepetitions: new Uniform(INITIAL_LIGHT_REPETITIONS),
      },
    });
  }
} 