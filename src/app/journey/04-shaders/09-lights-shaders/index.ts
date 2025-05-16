import { Color, Mesh, DoubleSide, MeshBasicMaterial, PlaneGeometry, ShaderMaterial, Uniform, IcosahedronGeometry } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { disposeMesh } from "#/app/utils/three-utils";
import lightFrag from "./shaders/light.frag";
import lightVert from "./shaders/light.vert";

import SuzanneScene from "../../common/suzanne-scene";
import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

type MaterialParameters = {
  color: string;
}

@Exercise("lights-shaders")
@Description("<p>Custom Lights Shaders implemented from scratch</p>")
export class LightsShaders extends OrbitControlledExercise {

  @Customizable([{
    type: "color",
    propertyPath: "color",
    settings: {
      name: "Color",
      onChange: 'updateColor'
    }
  }])
  private materialParameters: MaterialParameters = {
    color: "#ffffff",
  }
  private material: ShaderMaterial;
  private suzanneScene: SuzanneScene;

  private directionalLightHelper: Mesh;
  private pointLightHelper: Mesh;

  constructor(view: RenderView) {
    super(view);  

    this.material = this.createMaterial();
    this.suzanneScene = new SuzanneScene(this.material, this);

    this.directionalLightHelper = new Mesh(
      new PlaneGeometry(),
      new MeshBasicMaterial()
    );

    (this.directionalLightHelper.material as MeshBasicMaterial).color.setRGB(0.1, 0.1, 1);
    (this.directionalLightHelper.material as MeshBasicMaterial).side = DoubleSide;
    this.directionalLightHelper.position.set(0, 0, 3);

    this.pointLightHelper = new Mesh(
      new IcosahedronGeometry(0.1, 2),
      new MeshBasicMaterial()
    );

    (this.pointLightHelper.material as MeshBasicMaterial).color.setRGB(1, 0.1, 0.1);
    this.pointLightHelper.position.set(0, 2.5, 0);
    this.scene.add(this.pointLightHelper, this.directionalLightHelper);
  }

  public frame(timer: Timer) {
    super.frame(timer);
    this.suzanneScene.frame(timer);
  }

  async dispose() {
    super.dispose();
    this.suzanneScene.dispose();
    this.material.dispose();
    disposeMesh(this.directionalLightHelper, this.pointLightHelper);
  }

  public updateColor(newValue: string) {
    this.materialParameters.color = newValue;
    this.material.uniforms.uColor.value.set(new Color(this.materialParameters.color));
  }

  private createMaterial() {
    return new ShaderMaterial({
      vertexShader: lightVert,
      fragmentShader: lightFrag,
      uniforms: {
        uColor: new Uniform(new Color(this.materialParameters.color)),
      },
    });
  }
} 