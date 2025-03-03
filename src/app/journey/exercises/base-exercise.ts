import * as THREE from 'three';

export default class BaseExercise extends EventTarget {
  
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  constructor() {
    super();
    this.camera = this.createCamera(75);
    this.scene = this.createScene();
    this.setupSceneCamera();
  }

  protected createCamera(fov: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0,0,3);
    camera.lookAt(0,0,0);
    return camera;
  }

  private createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    return scene;
  }

  protected setupSceneCamera() {
    this.scene.add(this.camera);
  }

  get id() {
    return Object.getPrototypeOf(this).constructor.id;
  }

  updateCamera(aspect: number) {
    if(this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }
  }

  async dispose() {
    for(const child of this.scene.children) {
      this.scene.remove(child);  
    }
  }; 
}