import { Mesh, ShaderMaterial, SphereGeometry, SRGBColorSpace, Texture, Uniform } from "three";

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import earthFragmentShader from "./shaders/earth.frag";
import earthVertexShader from "./shaders/earth.vert";


@Exercise("earth")
@Description(
  "<p>Earth Shader.</p>",
  "<p>Textures downloaded from <a href='https://www.solarsystemscope.com/textures/' target='_blank'>Solar System Scope</a>.</p>"
)
export class EarthShaders extends OrbitControlledExercise {

  private earth: Mesh;

  private textures: {
    day: Texture;
    night: Texture;
    specularClouds: Texture;
  }
  
  constructor(view: RenderView) {
    super(view);  

    const geometry = new SphereGeometry(2, 64, 64);

    const assetLoader = AssetLoader.getInstance();
    this.textures = {
      day: assetLoader.loadTexture("textures/earth/day.jpg"),
      night: assetLoader.loadTexture("textures/earth/night.jpg"),
      specularClouds: assetLoader.loadTexture("textures/earth/specularClouds.jpg"),
    }

    this.textures.day.colorSpace = SRGBColorSpace;
    this.textures.night.colorSpace = SRGBColorSpace;

    const material = new ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayTexture: new Uniform(this.textures.day),
        uNightTexture: new Uniform(this.textures.night),
        uSpecularCloudsTexture: new Uniform(this.textures.specularClouds),
      }
    });

    this.earth = new Mesh(geometry, material);
    this.camera.fov = 25;
    this.camera.position.set(12, 5, 4);
    this.camera.updateProjectionMatrix();
    
    this.scene.add(this.earth);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.earth);
  }
}