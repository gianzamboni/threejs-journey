import { 
  Mesh,
  Group,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
  AnimationMixer,
  AnimationAction
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { ActionButton, Description, Exercise } from '#/app/decorators/exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/services/assets-loader';
import { disposeMesh, disposeObjects } from '#/app/utils/three-utils';
import DUCK from './icons/duck.svg?raw';
import FOX from './icons/fox.svg?raw';
import MASK from './icons/mask.svg?raw';

import OrbitControlledExercise from '../../exercises/orbit-controlled-exercise';

@Exercise('imported-models')
@Description(
  "<p><strong>Imported models I downloaded from Three.js Journey website.</strong></p>", 
  "<p>You can load a duck, a fox or a mask.</p>"
)
export default class ImportedModels extends OrbitControlledExercise {

  private floor: Mesh;
  private ambientLight: AmbientLight;
  private directionalLight: DirectionalLight;

  private importedModel: {
    models: Group;
    mixer?: AnimationMixer;
    currentAction?: AnimationAction;
  } | undefined;

  constructor(view: RenderView) {
    super(view);

    this.floor = this.createFloor();
    this.ambientLight = new AmbientLight(0xffffff, 2.4);
    this.directionalLight = this.createDirectionalLight();
    this.loadDuck();
    this.camera.position.set(3, 3, 3);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.floor, this.ambientLight, this.directionalLight);
  }

  frame(timer: Timer): void {
    super.frame(timer);
    const delta = timer.getDelta();
    if (this.importedModel) {
      this.importedModel.mixer?.update(delta);
    }
  }

  @ActionButton('Load Duck', DUCK)
  public loadDuck() {
    this.resetScene();
    AssetLoader.getInstance()
      .loadModel('models/Duck/glTF/Duck.gltf', (model) => {
        this.importedModel = {
          models: model
        }
        this.scene.add(model);
      });
  }

  @ActionButton('Load Mask', MASK)
  public loadMask() {
    this.resetScene();
    AssetLoader.getInstance()
      .loadModel('/models/FlightHelmet/glTF/FlightHelmet.gltf',
        (model) => {
          this.importedModel = {
            models: model
          }
          model.scale.set(3, 3, 3);
          this.scene.add(model);
        },
        { useDraco: true }
      );
  }

  @ActionButton('Load Fox', FOX)
  public loadFox() {
    this.resetScene();
    const loader = AssetLoader.getInstance();
    loader.loadGLTF('models/Fox/glTF/Fox.gltf', (model) => {
      this.importedModel = {
        models: model.scene,
        mixer: new AnimationMixer(model.scene)
      }
      this.importedModel.models.scale.set(0.025, 0.025, 0.025);
      this.importedModel.currentAction = this.importedModel.mixer?.clipAction(model.animations[1], this.importedModel.models);
      this.scene.add(this.importedModel.models);
      this.importedModel.currentAction?.play();
    }, { useDraco: true });
  }
  
  private resetScene() {
    if(this.importedModel) {
      this.importedModel.models.traverse((child) => {
        if(child instanceof Mesh) {
          disposeMesh(child);
        }
      });
      this.scene.remove(this.importedModel.models);
    }
  }

  private createFloor() {
    const floor = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
      })
    )

    floor.rotation.x = -Math.PI * 0.5;

    return floor;
  }

  private createDirectionalLight() {
    const light = new DirectionalLight(0xffffff, 1.8);
    return light;
  }

  async dispose() {
    await super.dispose();
    this.resetScene();
    disposeObjects(this.ambientLight, this.directionalLight);
    disposeMesh(this.floor);
  }
}