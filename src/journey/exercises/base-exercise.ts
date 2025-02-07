import * as THREE from 'three';
export type BaseExerciseConfig = {
  initialInfo?: string;
  isAnimated?: boolean;
  isDebuggable?: boolean;
}

export default class BaseExercise extends EventTarget {
  
  public descriptions: string[] = [];
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  public readonly isDebuggable: boolean;
  public readonly isAnimated: boolean;

  constructor(config: BaseExerciseConfig = {}) {
    super();

    this.isAnimated = config.isAnimated || false;
    this.isDebuggable = config.isDebuggable || false;

    if(config.initialInfo) {
      this.descriptions.push(config.initialInfo);
    }

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

  toggleDebug() {
    throw new Error('Method not implemented.');
  }
}