import RenderView from "#/app/layout/render-view";
import { Timer } from 'three/addons/misc/Timer.js';
import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";
import { Description, Exercise } from "#/app/decorators/exercise";
import * as THREE from 'three';
import { AssetLoader } from "#/app/utils/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";

@Exercise("Hamburger")
@Description(["<strong>A small hamburger model made by me on Blender.</strong>"])
export class CustomModelTest extends OrbitControlledExercise {

  private floor: THREE.Mesh;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  private hamburger: THREE.Mesh[] | undefined;

  constructor(view: RenderView) {
    super(view);
    this.loadHamburger();

    this.floor = this.createFloor();
    this.ambientLight = this.createAmbientLight();
    this.directionalLight = this.createDirectionalLight();

    this.camera.position.set(-2, 1, 2);
    this.scene.add(this.directionalLight, this.ambientLight, this.floor);
    view.enableShadows(THREE.PCFSoftShadowMap);
  }

  private createFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    return floor;
  }

  private createAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    return ambientLight;
  }


  private createDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = - 7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = - 7;
    directionalLight.position.set(5, 5, 5);
    return directionalLight;
  }

  private loadHamburger() {
    const loader = AssetLoader.getInstance();
    loader.loadModel('/models/Hamburger/hamburger.glb', (gltf) => {
      this.hamburger = gltf.scene.children as THREE.Mesh[];
      this.hamburger.forEach((mesh) => {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });
      this.scene.add(...this.hamburger);
    }, { useDraco: true });
  }

  frame(timer: Timer): void {
    super.frame(timer);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.floor);

    if (this.hamburger) {
      for (const mesh of this.hamburger) {
        disposeMesh(mesh);
      }
    }
  }
}