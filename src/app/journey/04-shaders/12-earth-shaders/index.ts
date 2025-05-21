import { IcosahedronGeometry, Mesh, MeshBasicMaterial, ShaderMaterial, SphereGeometry, Spherical, SRGBColorSpace, Texture, Uniform, Vector3 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import { CustomizableMetadata } from "#/app/layout/debug-ui/controller-factory";
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

  private earthMaterial: ShaderMaterial;

  private earth: Mesh;
  private debugSun: Mesh;

  @Customizable([{
    propertyPath: "phi",
    folderPath: "Sun",
    settings: {
      min: 0,
      max: Math.PI,
      onChange: "updateSun"
    }
  }, {
    propertyPath: "theta",
    folderPath: "Sun",
    settings: {
      min: -Math.PI,
      max: Math.PI,
      onChange: "updateSun"
    }
  }])
  private sunSpherical: Spherical;

  private textures: {
    day: Texture;
    night: Texture;
    specularClouds: Texture;
  }
  
  constructor(view: RenderView) {
    super(view);  

    this.textures = this.loadTextures();
    this.sunSpherical = new Spherical(1, Math.PI * 0.5, 0.5);

    this.earthMaterial = this.createMaterial();
    const geometry = new SphereGeometry(2, 64, 64);
    this.earth = new Mesh(geometry, this.earthMaterial);

    this.debugSun = new Mesh(
      new IcosahedronGeometry(0.1, 2),
      new MeshBasicMaterial()
    );
    this.updateSun();

    this.camera.fov = 25;
    this.camera.position.set(12, 5, 4);
    this.camera.updateProjectionMatrix();
    
    this.scene.add(this.earth, this.debugSun);
  }

  @DebugFPS
  public frame(timer: Timer): void {
    super.frame(timer);
    this.earthMaterial.uniforms.uTime.value = timer.getElapsed();
    this.earth.rotation.y = timer.getElapsed() * 0.01;
  }

  private createMaterial() {
    return new ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayTexture: new Uniform(this.textures.day),
        uNightTexture: new Uniform(this.textures.night),
        uSpecularCloudsTexture: new Uniform(this.textures.specularClouds),
        uSunDirection: new Uniform(new Vector3(0,0,1)),
        uTime: new Uniform(0.0)
      } 
    });
  }

  private loadTextures() {
    const assetLoader = AssetLoader.getInstance();
    const textures = {
      day: assetLoader.loadTexture("textures/earth/day.jpg"),
      night: assetLoader.loadTexture("textures/earth/night.jpg"),
      specularClouds: assetLoader.loadTexture("textures/earth/specularClouds.jpg"),
    }

    textures.day.colorSpace = SRGBColorSpace;
    textures.night.colorSpace = SRGBColorSpace;
    
    textures.day.anisotropy = this.view.renderer.capabilities.getMaxAnisotropy();
    textures.night.anisotropy = this.view.renderer.capabilities.getMaxAnisotropy();
    
    return textures;
  }

  private updateSun(newValue?: number, customizableMetadata?: CustomizableMetadata) {
    if(customizableMetadata && newValue) {
      this.sunSpherical[customizableMetadata.property as ('phi' | 'theta')] = newValue;
    }

    const sunDirection = new Vector3();
    sunDirection.setFromSpherical(this.sunSpherical);
    this.debugSun.position.copy(sunDirection).multiplyScalar(5);
    this.earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.earth);
    disposeMesh(this.debugSun);
  }
}