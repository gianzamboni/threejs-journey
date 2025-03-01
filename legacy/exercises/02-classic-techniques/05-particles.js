import * as THREE from 'three'

import { TEXTURE_LOADER } from '../../utils/loading-manager';

export class Particles {
  constructor(view, debugUI) {
    this.view = view;
    this.debugUI = debugUI;
    this.scene = new THREE.Scene();

    this.particleGeometry = new THREE.BufferGeometry();
    this.count = 6250;

    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.particleTexture = TEXTURE_LOADER.load('/textures/particles/4.png');

    this.pointMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      color: new THREE.Color("#ffa8db"),
      alphaMap: this.particleTexture,
      //alphaTest: 0.001,
      //depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    this.particles = new THREE.Points(this.particleGeometry, this.pointMaterial);

    this.view.setCamera({
      near: 0.01,
    })

  }

  animation(timer) {
    const elapsedTime = timer.getElapsed();
    for (let i = 0; i < this.count; i++){
      const i3 = i * 3;
      const x = this.particleGeometry.attributes.position.array[i3];
      this.particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime*0.01 + x * i) ;
    }
    this.particleGeometry.attributes.position.needsUpdate = true;
    this.particles.rotation.y = elapsedTime * 0.002;
  }

  init() {
    this.scene.add(this.particles);
    this.view.show(this.scene);
  }

  dispose() {
    this.scene.remove(this.particles);
    this.particleGeometry.dispose();
    this.pointMaterial.dispose();
    this.particleTexture.dispose();
  }
}