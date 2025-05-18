import { ACESFilmicToneMapping, Color, Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Exercise } from "#/app/decorators/exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { disposeMesh } from "#/app/utils/three-utils";
import { RAGING_SEA_CONTROLS_V2, RAGING_SEA_COLORS_CONTROLS_V2 } from "./controls";
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";
import seaFragmentShader from "./shaders/sea.frag";
import seaVertexShader from "./shaders/sea.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise("sea-v2")
export class RagingSeaV2 extends OrbitControlledExercise {
  @Customizable(RAGING_SEA_COLORS_CONTROLS_V2)
  private colors = "#114e6e";

  @Customizable(RAGING_SEA_CONTROLS_V2)
  private material: ShaderMaterial;

  private water: Mesh;
  private quality: QualityConfig;

  constructor(view: RenderView, quality: Quality) {
    super(view);
    this.quality = QUALITY_CONFIG[quality];

    const geometry = new PlaneGeometry(50, 50, this.quality.segments, this.quality.segments);
    geometry.deleteAttribute("normal");

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
        uSmallWavesElevation: { value: this.quality.shader.smallWaves.elevation },
        uSmallWavesFrequency: { value: 0.5 },
        uSmallWavesSpeed: { value: 0.312 },
        uSmallIterations: { value: 4 },
        uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      }
    });

    this.water = new Mesh(geometry, this.material);
    this.water.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.water);
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
}