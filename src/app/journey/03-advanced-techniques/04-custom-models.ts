import { 
  Mesh,
  Group,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
  PCFSoftShadowMap
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";


@Exercise("Hamburger")
@Description("<p>A small hamburger model made by me on Blender.</p>")
export class CustomModelTest extends OrbitControlledExercise {

  private floor: Mesh;
  private ambientLight: AmbientLight;
  private directionalLight: DirectionalLight;

  private hamburger: Group | undefined;

  constructor(view: RenderView) {
    super(view);
    this.loadHamburger();

    this.floor = this.createFloor();
    this.ambientLight = this.createAmbientLight();
    this.directionalLight = this.createDirectionalLight();

    this.camera.position.set(-2, 1, 2);
    this.scene.add(this.directionalLight, this.ambientLight, this.floor);
    view.enableShadows(PCFSoftShadowMap);
  }

  private createFloor() {
    const floor = new Mesh(
      new PlaneGeometry(50, 50),
      new MeshStandardMaterial({
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
    const ambientLight = new AmbientLight(0xffffff, 2.4);
    return ambientLight;
  }


  private createDirectionalLight() {
    const directionalLight = new DirectionalLight(0xffffff, 1.8);
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
    AssetLoader.getInstance()
      .loadModel('/models/Hamburger/hamburger.glb', (group) => {
        this.hamburger = group;
        this.hamburger.traverse((mesh) => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        });
        this.scene.add(this.hamburger);
      }, { useDraco: true });
  }

  frame(timer: Timer): void {
    super.frame(timer);
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.floor);

    if (this.hamburger) {
      this.hamburger.children.forEach((child) => {
        disposeMesh(child as Mesh);
      });
    }
  }
}