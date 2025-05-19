import { Color, ShaderMaterial, Uniform } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import halftoneFrag from "./shaders/halftone.frag";
import halftoneVert from "./shaders/halftone.vert";

import SuzanneScene from "../../common/suzanne-scene";
import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

const INITIAL_COLOR = "#ff794d";
const INITIAL_CLEAR_COLOR = "#26132f";
const INITIAL_SHADING_COLOR = "#000000";

@Exercise("halftone-shading")
@Description("<p>Halftone Shading implemented from scratch</p>")
export class HalftoneShading extends OrbitControlledExercise {

  @Customizable([{
    type: "color",
    initialValue: INITIAL_COLOR,
    propertyPath: "uniforms.uColor",
    settings: {
      name: "Color",
      onChange: 'updateColor'
    }
  }, {
    type: "color",
    initialValue: INITIAL_SHADING_COLOR,
    propertyPath: "uniforms.uShadeColor",
    settings: {
      name: "Shade Color",
      onChange: 'updateShadeColor'
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

  public updateColor(newValue: string) {
    this.material.uniforms.uColor.value.set(new Color(newValue));
  }

  public updateShadeColor(newValue: string) {
    this.material.uniforms.uShadeColor.value.set(new Color(newValue));
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
        uColor: new Uniform(new Color("#ff794d")),
        uClearColor: new Uniform(new Color("#26132f")),
      },
    });
  }
} 