import { ACESFilmicToneMapping, Color, MathUtils, Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';
import { Sky } from 'three/addons/objects/Sky.js';

import { Customizable } from "#/app/decorators/customizable";
import { CustomizableQuality, DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise, Starred } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { ExtraConfig } from "#/app/types/exercise";
import { disposeMesh } from "#/app/utils/three-utils";
import { RAGING_SEA_CONTROLS_V2, RAGING_SEA_COLORS_CONTROLS_V2 } from "./controls";
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";
import seaFragmentShader from "./shaders/sea.frag";
import seaVertexShader from "./shaders/sea.vert";

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
@Exercise("sea-v2")
@Starred
@Description("<p>A full 3D sea using Perlin noise and custom light shaders.</p>")
@CustomizableQuality
export class RagingSeaV2 extends OrbitControlledExercise {
  @Customizable(RAGING_SEA_COLORS_CONTROLS_V2)
  private colors = "#114e6e";

  @Customizable(RAGING_SEA_CONTROLS_V2)
  private material: ShaderMaterial;

  private water: Mesh;
  private quality: QualityConfig;

  private skyParameters: SkyParameters;

  private sun: Vector3;
  private sky: Sky;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);
    this.quality = QUALITY_CONFIG[extraConfig.quality];

    const geometry = new PlaneGeometry(50, 50, this.quality.segments, this.quality.segments);
    geometry.deleteAttribute("normal");

    this.colors = this.quality.initialColor;

    this.material = new ShaderMaterial({
      vertexShader: seaVertexShader,
      fragmentShader: seaFragmentShader,
      transparent: true,
      blending: this.quality.blending,
      uniforms: {
        uBigWavesElevation: { value: 0.5 },
        uBigWavesFrequency: { value: new Vector2(this.quality.shader.bigWaves.frequencyX, 0.25) },
        uBigWavesSpeed: { value: 0.535 },
        uTime: { value: 0 },
        uSurfaceColor: { value: new Color(this.colors) },
        uLightColor: { value: new Color("#6e5511")},
        uSmallWavesElevation: { value: this.quality.shader.smallWaves.elevation },
        uSmallWavesFrequency: { value: 0.5 },
        uSmallWavesSpeed: { value: 0.312 },
        uSmallIterations: { value: 4 },
        uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      }
    });

    this.water = new Mesh(geometry, this.material);
    this.water.rotation.x = -Math.PI * 0.5;

    this.skyParameters = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.95,
      elevation: -1.0,
      azimuth: 180,
      exposure: this.view.renderer.toneMappingExposure
    }
    
    this.sky = this.createSky();
    this.sun = this.createSun();
    this.updateSky();

    this.scene.add(this.water, this.sky);
    this.camera.position.set(0.17, 0.75, 3.61);
    this.camera.quaternion.set(-0.05, 0.02, 0.0, 0.99);
    view.setRender({
      tone: {
        mapping: ACESFilmicToneMapping,
      }
    })
  }

  updateSeaColor(newColor: string) {
    this.colors = newColor;
    this.material.uniforms.uSurfaceColor.value.set(this.colors);
  }


  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    this.material.uniforms.uTime.value = timer.getElapsed();
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.water);
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
}