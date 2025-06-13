import { BufferGeometry, DataTexture, Uniform, WebGLRenderer } from "three";

import { GPUComputationRenderer, Variable } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import gpgpuParticlesFragmentShader from "./shaders/gpgpu/particles.glsl";


export class GPGPUFlowFieldsEngine {

  private baseGeometry: BufferGeometry;
  private gpgpuSize: number;
  private renderer: GPUComputationRenderer;

  @Customizable([{
    withDelay: true,
    propertyPath: "material.uniforms.uFlowFieldInfluence.value",
    folderPath: "Flow Field",
    settings: {
      name: "Influence",
      min: 0,
      max: 1,
      step: 0.01,
    }
  }, {
    propertyPath: "material.uniforms.uFlowFieldFrequency.value",
    folderPath: "Flow Field",
    withDelay: true,
    settings: {
      name: "Frequency",
      min: 0,
      max: 1,
      step: 0.01,
    }
  }])
  private particleVariables: Variable;

  constructor(baseGeometry: BufferGeometry, renderer: WebGLRenderer) {
    this.baseGeometry = baseGeometry;
    this.gpgpuSize = Math.ceil(Math.sqrt(this.baseGeometry.attributes.position.count));
    this.renderer = new GPUComputationRenderer(this.gpgpuSize, this.gpgpuSize, renderer);

    const baseDataTexture = this.renderer.createTexture();
    this.particleVariables = this.renderer.addVariable("uParticles", gpgpuParticlesFragmentShader, baseDataTexture);
    this.configureVariable(baseDataTexture);

    this.renderer.init();
  } 

  get uvMap() {
    const uvArray = new Float32Array(this.baseGeometry.attributes.position.count * 2);

    for (let y = 0; y < this.gpgpuSize; y++) {
      for (let x = 0; x < this.gpgpuSize; x++) {
        const i = y * this.gpgpuSize + x;
        const i2 = i * 2;

        const uvX = (x + 0.5) / this.gpgpuSize;
        const uvY = (y + 0.5) / this.gpgpuSize;

        uvArray[i2 + 0] = uvX;
        uvArray[i2 + 1] = uvY;
      }
    }

    return uvArray;
  }

  get size() {
    return this.gpgpuSize;
  }

  get gpgpu() {
    return this.renderer;
  }

  get currentSnapshot(): DataTexture {
    return this.renderer.getCurrentRenderTarget(this.particleVariables).texture as DataTexture;
  }

  private configureVariable(baseDataTexture: DataTexture) {
    const particlesPosition = this.baseGeometry.attributes.position;
    const textureData = baseDataTexture.image.data as Float32Array;

    for (let i = 0; i < particlesPosition.count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      textureData[i4 + 0] = particlesPosition.array[i3 + 0];
      textureData[i4 + 1] = particlesPosition.array[i3 + 1];
      textureData[i4 + 2] = particlesPosition.array[i3 + 2];
      textureData[i4 + 3] = Math.random();
    }

    
    this.particleVariables.material.uniforms.uTime = new Uniform(0);
    this.particleVariables.material.uniforms.uBase = new Uniform(baseDataTexture);
    this.particleVariables.material.uniforms.uDeltaTime = new Uniform(0);
    this.particleVariables.material.uniforms.uFlowFieldInfluence = new Uniform(0.5);
    this.particleVariables.material.uniforms.uFlowFieldFrequency = new Uniform(0.5);
  }

  dispose() {
    this.baseGeometry.dispose();
  }

}