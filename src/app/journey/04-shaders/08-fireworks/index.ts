import { 
  Color, 
  MathUtils, 
  Texture, 
  Vector2, 
  Vector3 
} from "three";

import { Sky } from 'three/addons/objects/Sky.js';

import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { Firework } from "./firework";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

type SkyParameters = {
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
  elevation: number;
  azimuth: number;
  exposure: number;
}

@Exercise("Fireworks")
@Description("<p>¡Some fireworks! <strong>Click on the screen</strong> to make them explode!</p>")
export default class Fireworks extends OrbitControlledExercise {

  private resolution: Vector2;
  private pixelRatio: number;

  private textures: Texture[];
  private skyParameters: SkyParameters;

  private sun: Vector3;
  private sky: Sky;

  constructor(renderView: RenderView) {
    super(renderView);

    this.camera.fov = 25;
    this.camera.position.set(1.5, 0, 6);
    this.camera.updateProjectionMatrix();

    this.resolution = new Vector2(this.view.width, this.view.height);
    this.pixelRatio = this.view.pixelRatio;

    this.textures = this.loadTextures();

    this.view.canvas.addEventListener('click', this.createFirework.bind(this));
    this.view.addEventListener('resize', this.updateResolution.bind(this));

    this.skyParameters = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.95,
      elevation: -2.2,
      azimuth: 180,
      exposure: this.view.renderer.toneMappingExposure
    }

    this.sky = this.createSky();
    this.sun = this.createSun();
    this.updateSky();

    this.scene.add(this.sky);

    this.createFirework();
  }

  private createSky() {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    return sky;
  }

  private createSun() {
    const sun = new Vector3();
    return sun;
  }

  private updateSky() {
    const uniforms = this.sky.material.uniforms;

    uniforms.turbidity.value = this.skyParameters.turbidity;
    uniforms.rayleigh.value = this.skyParameters.rayleigh;
    uniforms.mieCoefficient.value = this.skyParameters.mieCoefficient;
    uniforms.mieDirectionalG.value = this.skyParameters.mieDirectionalG;
    const phi = MathUtils.degToRad(90 - this.skyParameters.elevation);
    const theta = MathUtils.degToRad(this.skyParameters.azimuth);
    this.sun.setFromSphericalCoords(1, phi, theta);

    uniforms.sunPosition.value.copy(this.sun);

    this.view.setRender({
      tone: {
        exposure: this.skyParameters.exposure
      }
    })

    this.view.update()
  }

  private createFirework() {
    Firework.create({
      scene: this.scene,
      count: Math.round(100 + Math.random() * 1000),
      position: new Vector3(
        (Math.random() - 0.5) * 2, 
        Math.random(), 
        (Math.random() - 0.5) * 2),
      size: 0.1 + Math.random(),
      texture: this.textures[Math.floor(Math.random() * this.textures.length)],
      spreadRadius: Math.random() * 2,
      color: (new Color()).setHSL(Math.random(), 1, 0.7),
      resolution: this.resolution, 
      pixelRatio: this.pixelRatio,
    });
  }

  private updateResolution() {
    this.resolution.set(this.view.width, this.view.height);
    this.pixelRatio = this.view.pixelRatio;
  }

  private loadTextures() {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
      const texture = AssetLoader.getInstance().loadTexture(`textures/particles/${number}.png`);
      texture.flipY = false;
      return texture;
    });
  }

  async dispose() {
    super.dispose();
    this.view.removeEventListener('resize', this.updateResolution.bind(this));
    this.view.removeEventListener('click', this.createFirework.bind(this));

    for (const texture of this.textures) {
      texture.dispose();
    }
  }
}