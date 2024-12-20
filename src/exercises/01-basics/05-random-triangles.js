import * as THREE from 'three'
import { AnimationLoop } from '../../utils/animation-loop';
import { dispose } from '../../utils/dispose';

export class RandomTriangles {
  constructor(view) {
    this.scene = new THREE.Scene();
    this.view = view;
    this.view.toggleOrbitControls(true);
    this.animationLoop = new AnimationLoop(() => this.animation())

    this.geometry = new THREE.BufferGeometry();

    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4;
    }

    const bufferAtrribute = new THREE.BufferAttribute(positionsArray, 3);
    this.geometry.setAttribute('position', bufferAtrribute);

    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.view.init(this.scene);    
  }

  init() {}
  
  animation() {
    this.view.render(this.scene);
  }

  async dispose() {
    await this.animationLoop.dispose();
    this.scene.remove(this.mesh);
    dispose(this.mesh);
  }
}
