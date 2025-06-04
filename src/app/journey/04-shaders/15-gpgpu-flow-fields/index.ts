import { BufferGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, Points, ShaderMaterial, SphereGeometry, Uniform } from "three";

import { GPUComputationRenderer, Variable } from 'three/addons/misc/GPUComputationRenderer.js'
import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { disposeMesh } from "#/app/utils/three-utils";
import gpgpuParticlesFragmentShader from "./shaders/gpgpu/particles.glsl";
import particlesFragmentShader from "./shaders/particles.frag";
import particlesVertexShader from "./shaders/particles.vert";

const BACKGROUND_COLOR = "#29191f";

@Exercise("gpgpu-flow-fields")
export class GPGPUFlowFields extends OrbitControlledExercise {

  @Customizable([{
    propertyPath: "clearColor",
    initialValue: BACKGROUND_COLOR,
    type: "color",
    settings: {
      name: "Background Color",
      onChange: "updateBackgroundColor",
    }
  }])
  private _view: RenderView;

  private geometry: SphereGeometry;
  private material: ShaderMaterial;
  private particles: Points;

  private gpgpuSize: number;
  private gpgpu: GPUComputationRenderer;
  private bufferGeometry: BufferGeometry;
  private uParticles: Variable;

  private debugPlane: Mesh;

  constructor(view: RenderView) { 
    super(view);

    this._view = view;
    
    this.geometry = new SphereGeometry(3);
    this.bufferGeometry = new BufferGeometry();
    
    this.bufferGeometry.setDrawRange(0, this.geometry.attributes.position.count);
    
    this.gpgpuSize = Math.ceil(Math.sqrt(this.geometry.attributes.position.count));
    this.gpgpu = new GPUComputationRenderer(this.gpgpuSize, this.gpgpuSize, this.view.renderer);
    const baseParticlesTexture = this.gpgpu.createTexture();

    this.material = new ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uSize: new Uniform(0.4),
        uResolution: new Uniform(this.view.resolution),
        uParticles: new Uniform(baseParticlesTexture),
      }
    })

    this.particles = new Points(this.bufferGeometry, this.material);
    this.scene.add(this.particles);

    const particlesPosition = this.geometry.attributes.position;
    const textureData = baseParticlesTexture.image.data as Float32Array;
    for (let i = 0; i < particlesPosition.count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      textureData[i4 + 0] = particlesPosition.array[i3 + 0];
      textureData[i4 + 1] = particlesPosition.array[i3 + 1];
      textureData[i4 + 2] = particlesPosition.array[i3 + 2];
      textureData[i4 + 3] = 0;
    }
    console.log(textureData);


    this.uParticles = this.gpgpu.addVariable("uParticles", gpgpuParticlesFragmentShader, baseParticlesTexture);
    this.gpgpu.setVariableDependencies(this.uParticles, [ this.uParticles ]);

    this.gpgpu.init();


    this.debugPlane = new Mesh(
      new PlaneGeometry(3, 3), 
      new MeshBasicMaterial({
        map: this.gpgpu.getCurrentRenderTarget(this.uParticles).texture,
      })
    );

    this.debugPlane.position.set(6, 0, 0);
    this.scene.add(this.debugPlane);

    this.camera.fov = 35;
    this.camera.position.set(4.5, 4, 20);
    this.camera.updateProjectionMatrix();

    this._view.setRender({
      clearColor: BACKGROUND_COLOR,
    })
  }

  @DebugFPS
  frame(timer: Timer): void {
    super.frame(timer);
    this.gpgpu.compute();
    this.material.uniforms.uParticles.value = this.gpgpu.getCurrentRenderTarget(this.uParticles).texture;
  }
  
  updateBackgroundColor(color: string) {
    this._view.setRender({
      clearColor: color,
    })
  }

  async dispose() {
    await super.dispose();
    this.geometry.dispose();
    this.material.dispose();
    disposeMesh(this.debugPlane);
  }

}