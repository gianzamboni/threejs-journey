import * as THREE from 'three'
import { dispose } from '../../utils/dispose';

export class RandomTriangles {
  constructor(view) {
    this.scene = new THREE.Scene();
    this.view = view;
    this.geometry = this.generateTriangleGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  init() {
    this.scene.add(this.mesh);
    this.view.setOrbitControlSettings({
      autoRotate: true,
      autoRotateSpeed: 0.5,
    });
    this.view.show(this.scene);
  }
  
  async dispose() {
    this.scene.remove(this.mesh);
    dispose(this.mesh);
  }

  generateTriangleGeometry() {
    const geometry = new THREE.BufferGeometry();
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4;
    }

    const bufferAtrribute = new THREE.BufferAttribute(positionsArray, 3);
    geometry.setAttribute('position', bufferAtrribute)
    return geometry;
  }
}
