import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, Points, ShaderMaterial, Uniform } from "three";

import { GPUComputationRenderer, Variable } from 'three/addons/misc/GPUComputationRenderer.js'
import { GLTF, Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
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

  private geometry: BufferGeometry | undefined;
  private material: ShaderMaterial | undefined;
  private particles: Points | undefined;

  private gpgpuSize: number | undefined;
  private gpgpu: GPUComputationRenderer | undefined;
  private bufferGeometry: BufferGeometry | undefined;

  @Customizable([{
    withDelay: true,
    propertyPath: "material.uniforms.uFlowFieldInfluence.value",
    settings: {
      name: "Flow Field Influence",
      min: 0,
      max: 1,
      step: 0.01,
    }
  }])
  private particleVariables: Variable | undefined;

  private debugPlane: Mesh | undefined;

  constructor(view: RenderView) {
    super(view);

    this._view = view;

    AssetLoader.getInstance().loadGLTF('models/ship.glb', {
      onLoad: (gltf: GLTF) => {
        this.geometry = (gltf.scene.children[0] as Mesh).geometry;
        this.gpgpuSize = Math.ceil(Math.sqrt(this.geometry.attributes.position.count));
        this.gpgpu = new GPUComputationRenderer(this.gpgpuSize, this.gpgpuSize, this.view.renderer);
        const baseParticlesTexture = this.gpgpu.createTexture();

        this.material = new ShaderMaterial({
          vertexShader: particlesVertexShader,
          fragmentShader: particlesFragmentShader,
          uniforms: {
            uSize: new Uniform(0.07),
            uResolution: new Uniform(this.view.resolution),
            uParticles: new Uniform(baseParticlesTexture),
            uTime: new Uniform(0),
          }
        })


        const particlesUvArray = new Float32Array(this.geometry.attributes.position.count * 2);
        const particlesSizeArray = new Float32Array(this.geometry.attributes.position.count);

        for (let y = 0; y < this.gpgpuSize; y++) {
          for (let x = 0; x < this.gpgpuSize; x++) {
            const i = y * this.gpgpuSize + x;
            const i2 = i * 2;

            const uvX = (x + 0.5) / this.gpgpuSize;
            const uvY = (y + 0.5) / this.gpgpuSize;

            particlesUvArray[i2 + 0] = uvX;
            particlesUvArray[i2 + 1] = uvY;
            particlesSizeArray[i] = Math.random();
          }
        }

        this.bufferGeometry = new BufferGeometry();

        this.bufferGeometry.setDrawRange(0, this.geometry.attributes.position.count);
        this.bufferGeometry.setAttribute("aParticlesUv", new BufferAttribute(particlesUvArray, 2));
        this.bufferGeometry.setAttribute("aColor", this.geometry.attributes.color);
        this.bufferGeometry.setAttribute("aSize", new BufferAttribute(particlesSizeArray, 1));
      
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
          textureData[i4 + 3] = Math.random();
        }

        this.particleVariables = this.gpgpu.addVariable("uParticles", gpgpuParticlesFragmentShader, baseParticlesTexture);
        this.gpgpu.setVariableDependencies(this.particleVariables, [this.particleVariables]);

        this.particleVariables.material.uniforms.uTime = new Uniform(0);
        this.particleVariables.material.uniforms.uBase = new Uniform(baseParticlesTexture);
        this.particleVariables.material.uniforms.uDeltaTime = new Uniform(0);
        this.particleVariables.material.uniforms.uFlowFieldInfluence = new Uniform(0.5);

        this.gpgpu.init();

        this.debugPlane = new Mesh(
          new PlaneGeometry(3, 3),
          new MeshBasicMaterial({
            transparent: true,
            visible: false,
            map: this.gpgpu.getCurrentRenderTarget(this.particleVariables).texture,
          })
        );

        this.debugPlane.position.set(6, 0, 0);
        this.scene.add(this.debugPlane);

      },
      useDraco: true
    });

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
    if(this.gpgpu && this.material && this.particleVariables) {
      this.gpgpu.compute();
      this.material.uniforms.uParticles.value = this.gpgpu.getCurrentRenderTarget(this.particleVariables).texture;
      this.particleVariables.material.uniforms.uTime.value = timer.getElapsed();
      this.particleVariables.material.uniforms.uDeltaTime.value = timer.getDelta();

    }
  }

  updateBackgroundColor(color: string) {
    this._view.setRender({
      clearColor: color,
    })
  }
  async dispose() {
    await super.dispose();
    this.geometry?.dispose();
    this.material?.dispose();
    if(this.debugPlane) {
      disposeMesh(this.debugPlane);
    }
  }

}