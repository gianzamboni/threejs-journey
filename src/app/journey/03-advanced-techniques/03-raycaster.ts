import * as THREE from 'three';

import { Timer } from 'three/examples/jsm/Addons.js';

import { Exercise } from "#/app/decorators/exercise";
import RenderView from '#/app/layout/render-view';

import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';

@Exercise("Raycaster")
export default class Raycaster extends OrbitControlledExercise {
  
  private geometry: THREE.SphereGeometry;

  private objects: THREE.Mesh[];

  private raycaster: THREE.Raycaster; 
  
  constructor(view: RenderView) {
    super(view);;
    this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.objects = [];

    for(let i = 0; i < 3; i++) {
      const object = new THREE.Mesh(
        this.geometry, 
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      );
      object.position.x = -2 + i * 2;
      this.objects.push(object);
    }

    this.scene.add(...this.objects);

    this.raycaster = new THREE.Raycaster();
  }

  frame(timer: Timer): void {
    super.frame(timer);

    const elapsedTime = timer.getElapsed();
    this.objects[0].position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    this.objects[1].position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    this.objects[2].position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    const rayCasterOrigin = new THREE.Vector3(-3, 0, 0);
    const rayCasterDirection = new THREE.Vector3(1, 0, 0);
    rayCasterDirection.normalize();

    this.raycaster.set(rayCasterOrigin, rayCasterDirection);
    const intersects = this.raycaster.intersectObjects(this.objects);

    for(const object of this.objects) {
      if(intersects.some(intersect => intersect.object === object)) {
        (object.material as THREE.MeshBasicMaterial).color.set(0x00ff00);
      } else {
        (object.material as THREE.MeshBasicMaterial).color.set(0xff0000);
      }
    }
  }

  async dispose() {
    await super.dispose();
    this.geometry.dispose();
    
    for(const object of this.objects) {
      (object.material as THREE.MeshBasicMaterial).dispose();
    }
  }  
}
