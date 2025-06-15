import { BufferAttribute, BufferGeometry, Mesh, Points, ShaderMaterial, Uniform } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import { GPGPUFlowFieldsEngine } from "./particles-engine";
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

  @Customizable([{
    withDelay: true,
    propertyPath: "particleVariables.material.uniforms.uFlowFieldInfluence.value",
    folderPath: "Flow Field",
    settings: {
      name: "Influence",
      min: 0,
      max: 1, 
      step: 0.01,
    }
  }, {
    withDelay: true,
    propertyPath: "particleVariables.material.uniforms.uFlowFieldFrequency.value",
    folderPath: "Flow Field",
    settings: {
      name: "Frequency",
      min: 0,
      max: 1,
      step: 0.01,
    }
  }])
  private engine: GPGPUFlowFieldsEngine | undefined;

  private debugPlane: Mesh | undefined;

  constructor(view: RenderView) {
    super(view);

    this._view = view;

    this.loadShipModel();

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
    if (this.engine && this.material) {
      this.engine.update(timer);
      this.material.uniforms.uParticles.value = this.engine.currentSnapshot;
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
    this.engine?.dispose();
    if (this.debugPlane) {
      disposeMesh(this.debugPlane);
    }
  }

  private loadShipModel() {
    AssetLoader.getInstance().loadGLTF('models/ship.glb', {
      onLoad: (gltf) => {
        const geometry = (gltf.scene.children[0] as Mesh).geometry;
        this.engine = new GPGPUFlowFieldsEngine(geometry, this.view.renderer);
        this.material = this.createMaterial(this.engine);

        this.geometry = this.createGeometry(geometry, this.engine);
        this.particles = new Points(this.geometry, this.material);
        this.scene.add(this.particles);
      },
      useDraco: true
    });
  }
  
  private createMaterial(engine: GPGPUFlowFieldsEngine) {
    return new ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uSize: new Uniform(0.07),
        uResolution: new Uniform(this.view.resolution),
        uParticles: new Uniform(engine.currentSnapshot),
        uTime: new Uniform(0),
      }
    });
  }

  private createGeometry(baseGeometry: BufferGeometry, engine: GPGPUFlowFieldsEngine) {
    const particlesSizeArray = new Float32Array(baseGeometry.attributes.position.count);
    for (let i = 0; i < particlesSizeArray.length; i++) {
      particlesSizeArray[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setDrawRange(0, baseGeometry.attributes.position.count);
    geometry.setAttribute("aParticlesUv", new BufferAttribute(engine.uvMap, 2));
    geometry.setAttribute("aColor", baseGeometry.attributes.color);
    geometry.setAttribute("aSize", new BufferAttribute(particlesSizeArray, 1));

    return geometry;
  }
}