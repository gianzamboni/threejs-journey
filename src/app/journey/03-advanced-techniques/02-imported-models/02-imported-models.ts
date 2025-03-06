import * as THREE from 'three';

import { Timer } from 'three/examples/jsm/Addons.js';

import { Exercise } from '#/app/decorators/exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/utils/assets-loader';

import OrbitControlledExercise from '../../exercises/orbit-controlled-exercise';



@Exercise('imported-models')
export default class ImportedModels extends OrbitControlledExercise {

  private floor: THREE.Mesh;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  private importedModel: {
    models: THREE.Object3D[];
    mixer: THREE.AnimationMixer;
    currentAction?: THREE.AnimationAction;
  } | undefined;

  constructor(view: RenderView) {
    super(view);

    this.floor = this.createFloor();
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    this.directionalLight = this.createDirectionalLight();
    this.loadModel();
    this.camera.position.set(3, 3, 3);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.floor, this.ambientLight, this.directionalLight);
  }

  frame(timer: Timer): void {
    const delta = timer.getDelta();
    if (this.importedModel) {
      this.importedModel.mixer.update(delta);
    }
  }
  private loadModel() {
    const loader = AssetLoader.getInstance();
    loader.loadModel('models/Fox/glTF/Fox.gltf', (model) => {
      const objects = model.scene.children.map(child => {
        child.scale.set(0.025, 0.025, 0.025);
        return child;
      });
      this.importedModel = {
        models: objects,
        mixer: new THREE.AnimationMixer(model.scene)
      }
      console.log(this.importedModel);
      this.importedModel.currentAction = this.importedModel.mixer.clipAction(model.animations[1]);

      this.scene.add(...this.importedModel.models);
      this.importedModel.currentAction.play();
    }, { useDraco: true });
  }

  private createFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
      })
    )

    floor.rotation.x = -Math.PI * 0.5;

    return floor;
  }

  private createDirectionalLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.8);
    return light;
  }

  async dispose() {
    await super.dispose();
    this.ambientLight.dispose();
    this.floor.geometry.dispose();
    (this.floor.material as THREE.Material).dispose();
  }
}