import { Color, ShaderMaterial, Uniform } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import { CustomizableMetadata } from "#/app/layout/debug-ui/controller-factory";
import RenderView from "#/app/layout/render-view";
import halftoneFrag from "./shaders/halftone.frag";
import halftoneVert from "./shaders/halftone.vert";

import SuzanneScene from "../../common/suzanne-scene";
import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

const INITIAL_COLOR = "#ff794d";
const INITIAL_CLEAR_COLOR = "#26132f";
const INITIAL_SHADOW_REPETITIONS = 100;
const INITIAL_SHADOW_COLOR = "#8e19b8";
const INITIAL_LIGHT_COLOR = "#ff794d";
const INITIAL_LIGHT_REPETITIONS = 130;
@Exercise("halftone-shading")
@Description("<p>Halftone Shading implemented from scratch</p>")
export class HalftoneShading extends OrbitControlledExercise {

  @Customizable([{
    type: "color",
    folderPath: "Main Halftone",
    initialValue: INITIAL_COLOR,
    propertyPath: "uColor",
    settings: {
      name: "Color",
      onChange: 'updateUniform'
    }
  },{
    type: "color",
    initialValue: INITIAL_SHADOW_COLOR,
    folderPath: "Main Halftone",
    propertyPath: "uShadowColor",
    settings: {
      name: "Shadow Color",
      onChange: 'updateUniform'
    }
  }, {
    initialValue: INITIAL_SHADOW_REPETITIONS,
    folderPath: "Main Halftone",
    propertyPath: "uniforms.uShadowRepetitions.value",
    settings: {
      name: "Shadow Repetitions",
      min: 0,
      max: 300,
      step: 1,
    }
  }, {
    type: "color",
    folderPath: "Secondary Halftone",
    initialValue: INITIAL_LIGHT_COLOR,
    propertyPath: "uLightColor",
    settings: {
      name: "Color",
      onChange: 'updateUniform'
    }
  }, {
    initialValue: INITIAL_LIGHT_REPETITIONS,
    folderPath: "Secondary Halftone",
    propertyPath: "uniforms.uLightRepetitions.value",
    settings: {
      name: "Repetitions",
      min: 0,
      max: 300,
      step: 1,
    }
  }])
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
        uResolution: new Uniform(this._view.sizeAsVector2),
        uShadowRepetitions: new Uniform(INITIAL_SHADOW_REPETITIONS),
        uShadowColor: new Uniform(new Color(INITIAL_SHADOW_COLOR)),
        uLightColor: new Uniform(new Color(INITIAL_LIGHT_COLOR)),
        uLightRepetitions: new Uniform(INITIAL_LIGHT_REPETITIONS),
      },
    });
  }
} 