import { Group, Mesh, Uniform, ShaderMaterial, SphereGeometry, TorusKnotGeometry, DoubleSide, AdditiveBlending, Color } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import hologramFrag from "./hologram.frag";
import hologramVert from "./hologram.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise("hologram")
@Description("<p>Creating a hologram effect using glsl shaders</p>")
export class Hologram extends OrbitControlledExercise {

  @Customizable([{
    type: "color",
    settings: {
      name: "Clear Color",
      onChange: 'updateClearColor'
    }
  }])
  private clearColor: string = "#1d1f2a";

  @Customizable([{
    type: "color",
    settings: {
      name: "Hologram Color",
      onChange: 'updateHologramColor'
    }
  }])
  private hologramColor: string = "#70c1ff";

  private material: ShaderMaterial;

  private suzanne: Group | undefined;
  private torus: Mesh;
  private sphere: Mesh;

  constructor(view: RenderView) {
    super(view);

    this.view.renderer.setClearColor(this.clearColor);

    this.material = this.createMaterial();

    this.torus = this.createTorus();
    this.torus.position.x = 3;

    this.sphere = this.createSphere();
    this.sphere.position.x = -3;

    this.scene.add(this.torus, this.sphere);
    this.loadSuzanne();

    this.camera.fov = 25;
    this.camera.position.set(7, 5, 6);
    this.camera.updateProjectionMatrix();
  }

  public frame(timer: Timer) {
    super.frame(timer);

   const elapsedTime = timer.getElapsed();
    this.material.uniforms.uTime.value = elapsedTime;

    if(this.suzanne) {
      this.suzanne.rotation.x = -elapsedTime * 0.1;
      this.suzanne.rotation.y = elapsedTime * 0.2;
    }

    this.torus.rotation.x = -elapsedTime * 0.1;
    this.torus.rotation.y = elapsedTime * 0.2;
    
    this.sphere.rotation.x = -elapsedTime * 0.1;
    this.sphere.rotation.y = elapsedTime * 0.2;

  }

  private createSphere() {
    return new Mesh(
      new SphereGeometry(),
      this.material
    );
  }

  private createTorus() {
    return new Mesh(
      new TorusKnotGeometry(0.6, 0.25, 128, 32),
      this.material
    );
  }

  private loadSuzanne() {
    AssetLoader.getInstance().loadModel("./models/suzanne.glb", (model) => {
      this.suzanne = model;
      this.suzanne.traverse((child) => {
        if(child instanceof Mesh) {
          (child as Mesh).material = this.material;
        }
      })
      this.scene.add(this.suzanne);
    });
  }

  private createMaterial() {
    return new ShaderMaterial({
      depthWrite: false,
      side: DoubleSide,
      blending: AdditiveBlending,
      vertexShader: hologramVert,
      fragmentShader: hologramFrag,
      transparent: true,
      uniforms: {
        uTime: new Uniform(0),
        uHologramColor: new Uniform(new Color(this.hologramColor)),
      },
    });
  }

  updateClearColor() {
    this.view.renderer.setClearColor(this.clearColor);
  }

  updateHologramColor() {
    this.material.uniforms.uHologramColor.value.set(this.hologramColor);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.torus);
    disposeMesh(this.sphere);
  }
}
