import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { Exercise } from "#/app/decorators/exercise";
import * as THREE from "three";
import { AssetLoader, loadHelmet } from "#/app/utils/assets-loader";

@Exercise("environment-map")
export class EnvironmentMap extends OrbitControlledExercise {

  private torusKnot: THREE.Mesh;
  private helmet: THREE.Mesh[] | undefined;

  private environmentMap: THREE.CubeTexture;

  constructor(view: RenderView) {
    super(view);

    this.torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
      new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: 0xaaaaaa })
    );
    this.torusKnot.position.y = 4;
    this.torusKnot.position.x = -4;

    this.loadHelmetModel();

    this.environmentMap = this.loadEnvironmentMap();

    this.scene.add(this.torusKnot);

    this.controls.target.y = 3.5;
    this.camera.position.set(4, 5, 4);

    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;

  }

  loadHelmetModel() {
    loadHelmet(10, (meshes) => {
      this.helmet = meshes as THREE.Mesh[];
      this.scene.add(...this.helmet);
    });
  }

  loadEnvironmentMap() {
    const loader = AssetLoader.getInstance();
    return loader.loadCubeTexture("env-maps/alley");
  }
  
  async dispose() {
    await super.dispose();

    this.environmentMap.dispose();

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