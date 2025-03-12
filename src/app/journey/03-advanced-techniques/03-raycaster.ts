import * as THREE from 'three';

import { Exercise } from "#/app/decorators/exercise";
import RenderView from '#/app/layout/render-view';

import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';

@Exercise("Raycaster")
export default class Raycaster extends OrbitControlledExercise {
  
  private material: THREE.MeshBasicMaterial;
  private geometry: THREE.SphereGeometry;

  private objects: THREE.Mesh[];
  
  constructor(view: RenderView) {
    super(view);
    this.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
    this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.objects = [];

    for(let i = 0; i < 3; i++) {
      const object = new THREE.Mesh(this.geometry, this.material);
      object.position.x = -2 + i * 2;
      this.objects.push(object);
    }

    this.scene.add(...this.objects);
  }

  async dispose() {
    await super.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }  
}
