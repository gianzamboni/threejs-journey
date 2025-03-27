import * as THREE from "three";

import { Customizable } from "#/app/decorators/customizable";
import { Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader, loadHelmet } from "#/app/utils/assets-loader";
import { ENV_CONTROLLERS } from "./debug-ui.config";

@Exercise("environment-map")
export class EnvironmentMap extends OrbitControlledExercise {

  private torusKnot: THREE.Mesh;

  private helmet: THREE.Mesh[] | undefined;


  private environmentMap: THREE.Texture | undefined;

  @Customizable(ENV_CONTROLLERS)
  public _scene : THREE.Scene;
  
  constructor(view: RenderView) {
    super(view);
    
    this._scene = this.scene;

    this.torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
      new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: 0xaaaaaa })
    );
    this.torusKnot.position.y = 4;
    this.torusKnot.position.x = -4;

    this.loadHelmetModel();

    this.loadEnvironmentMap();

    this.scene.add(this.torusKnot);

    this.controls.target.y = 3.5;
    this.camera.position.set(6, 6, 6);

    this.scene.environmentIntensity = 1;
    this.scene.backgroundBlurriness = 0;
    this.scene.backgroundIntensity = 1;
  }

  loadHelmetModel() {
    loadHelmet(10, (meshes) => {
      this.helmet = meshes as THREE.Mesh[];
      this.scene.add(...this.helmet);
    });
  }

  loadEnvironmentMap() {
    const loader = AssetLoader.getInstance();
    loader.loadEnvironment("env-maps/field/2k.hdr", this.scene, (envMap) => {
      console.log(envMap);
    });
  }


  async dispose() {
    await super.dispose();

    if (this.environmentMap) {
      this.environmentMap.dispose();
    }

    this.torusKnot.geometry.dispose();
    (this.torusKnot.material as THREE.Material).dispose();

    if (this.helmet) {
      this.helmet.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
    }
  }
}