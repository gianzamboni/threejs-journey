import * as THREE from 'three';

export default class BaseExercise extends EventTarget {
  
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  constructor() {
    super();
    [this.scene, this.camera] = this.createBasicScene();
  }

  private createBasicScene(): [THREE.Scene, THREE.PerspectiveCamera] {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0,0,3);
    camera.lookAt(0,0,0);
    scene.add(camera);

    return [scene, camera];
  }

  get id() {
    return Object.getPrototypeOf(this).constructor.id;
  }

  updateCamera(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  async dispose() {
    this.scene.children.forEach(child => {
      this.scene.remove(child);  
    });
  }; 
}