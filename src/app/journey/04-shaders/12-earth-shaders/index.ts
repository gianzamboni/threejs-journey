import { BackSide, Color, IcosahedronGeometry, Mesh, MeshBasicMaterial, ShaderMaterial, SphereGeometry, Spherical, SRGBColorSpace, Texture, Uniform, Vector3 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import { CustomizableMetadata } from "#/app/layout/debug-ui/controller-factory";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import atmosphereFragmentShader from "./shaders/atmosphere.frag";
import atmosphereVertexShader from "./shaders/atmosphere.vert";
import earthFragmentShader from "./shaders/earth.frag";
import earthVertexShader from "./shaders/earth.vert";

@Exercise("earth")
@Description(
  "<p>Earth Shader.</p>",
  "<p>Textures downloaded from <a href='https://www.solarsystemscope.com/textures/' target='_blank'>Solar System Scope</a>.</p>"
)
export class EarthShaders extends OrbitControlledExercise {

  @Customizable([{
    propertyPath: "uAtmosphereColor",
    folderPath: "Atmosphere",
    initialValue: "#00aaff",
    type: "color",
    settings: {
      name: "Day Color",
      onChange: "updateUniform"
    }
  }, {
    propertyPath: "uAtmosphereTwilightColor",
    folderPath: "Atmosphere",
    initialValue: "#ff6600",
    type: "color",
    settings: {
      name: "Twilight Color",
      onChange: "updateUniform"
    }
  }])
  private earthMaterial: ShaderMaterial;

  private earth: Mesh;
  private atmosphere: Mesh;

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

  private atmosphereMaterial: ShaderMaterial;

  private textures: {
    day: Texture;
    night: Texture;
    specularClouds: Texture;
  }
  
  constructor(view: RenderView) {
    super(view);  

    this.textures = this.loadTextures();
    this.sunSpherical = new Spherical(1, Math.PI * 0.5, 0.5);

    const geometry = new SphereGeometry(2, 256, 256);

    this.earthMaterial = this.createEarthMaterial();
    this.earth = new Mesh(geometry, this.earthMaterial);

    this.atmosphereMaterial = this.createAtmosphereMaterial();
    this.atmosphere = new Mesh(geometry, this.atmosphereMaterial);
    this.atmosphere.scale.set(1.04, 1.04, 1.04);

    this.debugSun = new Mesh(
      new IcosahedronGeometry(0.1, 2),
      new MeshBasicMaterial()
    );
    this.updateSun();

    this.camera.fov = 25;
    this.camera.position.set(12, 5, 4);
    this.camera.updateProjectionMatrix();
    this.scene.add(this.earth, this.debugSun, this.atmosphere);
  }

  @DebugFPS
  public frame(timer: Timer): void {
    super.frame(timer);
    this.earthMaterial.uniforms.uTime.value = timer.getElapsed();
    this.earth.rotation.y = timer.getElapsed() * 0.01;
  }

  public updateUniform(newValue?: number, customizableMetadata?: CustomizableMetadata) {
    if(customizableMetadata && newValue) {
      const property = customizableMetadata.property as 'uAtmosphereColor' | 'uAtmosphereTwilightColor';
      this.earthMaterial.uniforms[property].value = new Color(newValue);
      this.atmosphereMaterial.uniforms[property].value = new Color(newValue);
    }
  }

  private createEarthMaterial() {
    return new ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayTexture: new Uniform(this.textures.day),
        uNightTexture: new Uniform(this.textures.night),
        uSpecularCloudsTexture: new Uniform(this.textures.specularClouds),
        uSunDirection: new Uniform(new Vector3(0,0,1)),
        uAtmosphereColor: new Uniform(new Color("#00aaff")),
        uAtmosphereTwilightColor: new Uniform(new Color("#ff6600")),
        uTime: new Uniform(0.0)
      } 
    });
  }

  private createAtmosphereMaterial() {
    return new ShaderMaterial({
      side: BackSide,
      transparent: true,
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uAtmosphereColor: new Uniform(new Color("#00aaff")),
        uAtmosphereTwilightColor: new Uniform(new Color("#ff6600")),
        uSunDirection: new Uniform(new Vector3(0,0,1)),
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
    this.atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.earth);
    disposeMesh(this.debugSun);
    disposeMesh(this.atmosphere);
  }
}