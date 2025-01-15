import * as THREE from 'three';

export default class BaseExercise {
  
  protected _scene: THREE.Scene;

  constructor() {
    this._scene = new THREE.Scene();
  }
  
  get scene() {
    return this._scene;
  }
  
  dispose() {
    this._scene.children.forEach(child => {
      this._scene.remove(child);  
    });
  }; 
}