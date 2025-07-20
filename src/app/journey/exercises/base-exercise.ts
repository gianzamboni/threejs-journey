import { Scene, PerspectiveCamera } from 'three';

export default class BaseExercise extends EventTarget {
  
  public scene: Scene;
  public camera: PerspectiveCamera;

  constructor() {
    super();
    this.camera = this.createCamera(75);
    this.scene = this.createScene();
    this.setupSceneCamera();
  }

  protected createCamera(fov: number): PerspectiveCamera {
    const camera = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0,0,3);
    camera.lookAt(0,0,0);
    return camera;
  }

  private createScene(): Scene {
    const scene = new Scene();
    return scene;
  }

  protected setupSceneCamera() {
    this.scene.add(this.camera);
  }

  get id() {
    return Object.getPrototypeOf(this).constructor.id;
  }

  updateCamera(aspect: number) {
    if(this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }
  }

  dispose() {
    this.scene.clear();
  }; 
}