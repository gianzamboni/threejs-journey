import * as THREE from 'three'

export class Particles {
  constructor(view, debugUI) {
    this.view = view;
    this.debugUI = debugUI;
    this.scene = new THREE.Scene();

    this.particleGeometry = new THREE.BufferGeometry();
    const count = 5000;

    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.pointMaterial = new THREE.PointsMaterial({
      size: 0.01,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(this.particleGeometry, this.pointMaterial);
    
  }

  init() {
    this.scene.add(this.particles);
    this.view.show(this.scene);
  }

  dispose() {
    this.scene.remove(this.particles);
    this.particleGeometry.dispose();
    this.pointMaterial.dispose();
  }
}