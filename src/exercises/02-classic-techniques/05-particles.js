import * as THREE from 'three'

export class Particles {
  constructor(view, debugUI) {
    this.view = view;
    this.debugUI = debugUI;
    this.scene = new THREE.Scene();

    this.particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    this.pointMaterial = new THREE.PointsMaterial({
      size: 0.02,
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