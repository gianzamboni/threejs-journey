import * as THREE from 'three'
import { TEXTURE_LOADER } from '../../utils/loading-manager';

export class Particles {
  constructor(view, debugUI) {
    this.view = view;
    this.debugUI = debugUI;
    this.scene = new THREE.Scene();

    this.particleGeometry = new THREE.BufferGeometry();
    const count = 50000;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.particleTexture = TEXTURE_LOADER.load('/textures/particles/2.png');

    this.pointMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      //color: new THREE.Color(0xff88cc),
      alphaMap: this.particleTexture,
      //alphaTest: 0.001,
      //depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    this.particles = new THREE.Points(this.particleGeometry, this.pointMaterial);

    this.view.setOrbitControlSettings({
      zoomSpeed: 0.1,
      autoRotate: true,
      autoRotateSpeed: 0.03,
    })

    this.view.setCamera({
      near: 0.01,
    })

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