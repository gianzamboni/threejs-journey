import * as THREE from "three";

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader, loadHelmet } from "#/app/utils/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import { Timer } from "three/examples/jsm/Addons.js";
import { DebugFPS } from "#/app/decorators/debug";

@Exercise("real-time-enviroment-map")
@Description([
  "<p><strong>Real-time enviroment map.</strong></p>", 
])
export class RealTimeEnviromentMap extends OrbitControlledExercise {

  private torusKnot: THREE.Mesh;

  private helmet: THREE.Mesh[] | undefined;
  private holyDonut: THREE.Mesh;

  private envMap: THREE.Texture;

  public _scene: THREE.Scene;

  private cubeRenderTarget: THREE.WebGLCubeRenderTarget;
  private cubeCamera: THREE.CubeCamera;

  constructor(view: RenderView) {
    super(view);

    this._scene = this.scene;

    this.torusKnot = this.createTorusKnot();
    this.holyDonut = this.createHolyDonut();
    this.loadHelmetModel();

    this.envMap = this.loadBackgroundTexture();

    this.scene.add(this.torusKnot, this.holyDonut);

    this.controls.target.y = 3.5;
    this.camera.position.set(6, 6, 6);

    this.scene.backgroundBlurriness = 0;
    this.scene.backgroundIntensity = 1;

    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {	
      type: THREE.FloatType,
    });

    this.cubeCamera = new THREE.CubeCamera(0.1, 100, this.cubeRenderTarget);
    this.cubeCamera.layers.set(1);

    this.scene.environment = this.cubeRenderTarget.texture;
  }

  createTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
    const material = new THREE.MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 4;
    mesh.position.x = -4;
    return mesh;
  }

  createHolyDonut() {
    const geometry = new THREE.TorusGeometry(8, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 3.5;
    return mesh;
  }

  loadHelmetModel() {
    loadHelmet(10, (meshes) => {
      this.helmet = meshes as THREE.Mesh[];
      this.scene.add(...this.helmet);
    });
  }

  loadBackgroundTexture() {
    const loader = AssetLoader.getInstance();
    const map = loader.loadTexture('env-maps/blockade-skylab/kitchen.jpg');
    map.colorSpace = THREE.SRGBColorSpace;
    map.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.background = map;
    return map;
  }

  @DebugFPS
  frame(timer: Timer): void {
    super.frame(timer);
    this.holyDonut.rotation.x = Math.sin(timer.getElapsed());
    this.cubeCamera.update(this._view.renderer, this.scene);
  }

  async dispose() {
    await super.dispose();
    this.cubeRenderTarget.dispose();
    this.envMap.dispose();
    disposeMesh(this.torusKnot, this.holyDonut);
    if (this.helmet) {
      for (const mesh of this.helmet) {
        disposeMesh(mesh);
      }
    }
  }
}
