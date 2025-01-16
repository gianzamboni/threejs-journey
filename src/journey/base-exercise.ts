import * as THREE from 'three';
import { ViewSettings } from './types';



export default class BaseExercise {
  
  protected _scene: THREE.Scene;
  protected _camera: THREE.PerspectiveCamera;

  constructor() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this._camera.position.set(0,0,3);
    this._camera.lookAt(0,0,0);
  }

  get scene() {
    return this._scene;
  }

  get camera() {
    return this._camera;
  }
  
  updateCamera(aspect: number) {
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
  }

  dispose() {
    this._scene.children.forEach(child => {
      this._scene.remove(child);  
    });
  }; 
}