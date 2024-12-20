import * as THREE from 'three';
import { dispose } from './dispose';
export class RedCube {
  constructor() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  set position({ x = 0, y = 0, z = 0 }) {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }

  addTo(scene) {
    scene.add(this.mesh);
  }

  removeFrom(scene) {
    scene.remove(this.mesh);
    this.dispose();
  };

  get position() {
    return this.mesh.position;
  }

  dispose() {
    dispose(this.mesh);
  }
}