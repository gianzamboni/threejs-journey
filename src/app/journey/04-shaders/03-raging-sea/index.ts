import { Color, Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { ControllerConfig, Customizable } from "#/app/decorators/customizable";
import { Exercise } from "#/app/decorators/exercise";
import { disposeMesh } from "#/app/utils/three-utils";
import seaFragmentShader from "./shaders/sea.frag";
import seaVertexShader from "./shaders/sea.vert";

import AnimatedExercise from "../../exercises/animated-exercise";


const RAGING_SEA_CONTROLS: ControllerConfig[] = [{
  propertyPath: "uniforms.uBigWavesElevation.value",
  folderPath: "Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Elevation",
  }
}, {
  propertyPath: "uniforms.uBigWavesFrequency.value.x",
  folderPath: "Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Frequency X",
  }
}, {
  propertyPath: "uniforms.uBigWavesFrequency.value.y",
  folderPath: "Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Frequency Y",
  }
}, {
  propertyPath: "uniforms.uBigWavesSpeed.value",
  folderPath: "Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Speed",
  }
}, {
  propertyPath: "uniforms.uColorOffset.value",
  folderPath: "Colors",
  settings: {
    min: 0,
    max: 1,
    step: 0.001,
    name: "Offset",
  }
}, {
  propertyPath: "uniforms.uColorMultiplier.value",
  folderPath: "Colors",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Multiplier",
  } 
}, {
  propertyPath: "uniforms.uSmallWavesElevation.value",
  folderPath: "Small Waves",
  settings: {
    min: 0,
    max: 1,
    step: 0.001,
    name: "Elevation",
  }
}, {
  propertyPath: "uniforms.uSmallWavesFrequency.value",
  folderPath: "Small Waves",
  settings: {
    min: 0,
    max: 30,
    step: 0.001,
    name: "Frequency",
  }
}, {
  propertyPath: "uniforms.uSmallWavesSpeed.value",
  folderPath: "Small Waves",
  settings: {
    min: 0,
    max: 4,
    step: 0.001,
    name: "Speed",
  }
}, {
  propertyPath: "uniforms.uSmallIterations.value",  
  folderPath: "Small Waves",
  settings: {
    min: 0,
    max: 5,
    step: 1,
    name: "Iterations",
  }
}]

const RAGING_SEA_COLORS_CONTROLS: ControllerConfig[] = [{
  propertyPath: "depth",
  folderPath: "Colors",
  type: "color",
  settings: {
    onChange: "onDepthColorChange",
    name: "Depth",
  }
}, {
  propertyPath: "surface",
  folderPath: "Colors",
  type: "color",
  settings: {
    onChange: "onSurfaceColorChange",
    name: "Surface",
  }
}]

@Exercise("sea")
export class RagingSea extends AnimatedExercise {

  @Customizable(RAGING_SEA_COLORS_CONTROLS)
  private colors = {
    depth: "#2b9cda",
    surface: "#9bd8ff",
  }
  @Customizable(RAGING_SEA_CONTROLS)
  private material: ShaderMaterial;

  private water: Mesh;



  constructor() {
    super();

    const geometry = new PlaneGeometry(50, 50, 2048, 2048);
    this.material = new ShaderMaterial({
      vertexShader: seaVertexShader,
      fragmentShader: seaFragmentShader,
      uniforms: {
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new Vector2(0.15, 0.25) },
        uBigWavesSpeed: { value: 0.535 },
        uTime: { value: 0 },
        uDepthColor: { value: new Color(this.colors.depth) },
        uSurfaceColor: { value: new Color(this.colors.surface) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 1.887 },
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 0.5 },
        uSmallWavesSpeed: { value: 0.312 },
        uSmallIterations: { value: 4 },
      }
    });

    this.water = new Mesh(geometry, this.material);
    this.water.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.water);
    this.camera.position.set(1, 2.5, 0);
    this.camera.lookAt(new Vector3(0, 1.5, 0));
  }


  onDepthColorChange(newColor: string) {
    this.colors.depth = newColor;
    this.material.uniforms.uDepthColor.value.set(this.colors.depth);
  }

  onSurfaceColorChange(newColor: string) {
    this.colors.surface = newColor;
    this.material.uniforms.uSurfaceColor.value.set(this.colors.surface);
  }

  frame(timer: Timer) {
    this.material.uniforms.uTime.value = timer.getElapsed();
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.water);
  }
}