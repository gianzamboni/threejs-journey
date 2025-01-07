import * as THREE from 'three'
import GUI from 'lil-gui';
import { randomSign } from '../../utils/utils';

export class GalaxyGenerator {
  constructor(view, debugUI) {
    this.view = view;
    this.debugUI = debugUI;
    this.scene = new THREE.Scene();

    this.galaxySettings = {
      count: 100000,
      size: 0.002,
      radius: 10,
      branches: 5,
      spin: 1,
      randomnes: 2,
      randomnesPower: 5,
      insideColor: '#ff6030',
      outsideColor: '#0048bd',
    }

    this.gui = new GUI({
      title: 'Galaxy Generator',
      expanded: false,
      container: this.debugUI.lilGuiContainer,
    });

    this.geometry = null;
    this.material = null;
    this.points = null;
  }

  init() {
    this.gui.add(this.galaxySettings, 'count').min(100).max(1000000).step(100).name('Star Count');
    this.gui.add(this.galaxySettings, 'size').min(0.001).max(0.1).step(0.001).name('Star Size');
    this.gui.add(this.galaxySettings, 'radius').min(1).max(10).step(0.1).name('Galaxy Radius');
    this.gui.add(this.galaxySettings, 'branches').min(2).max(20).step(1).name('Branches');
    this.gui.add(this.galaxySettings, 'spin').min(-5).max(5).step(0.001).name('Spin');
    this.gui.add(this.galaxySettings, 'randomnes').min(0).max(2).step(0.001).name('Randomnes');
    this.gui.add(this.galaxySettings, 'randomnesPower').min(1).max(10).step(0.001).name('Randomnes Power');
    this.gui.addColor(this.galaxySettings, 'insideColor').name('Inside Color');
    this.gui.addColor(this.galaxySettings, 'outsideColor').name('Outside Color');

    this.gui.controllers.forEach(controller => controller.onChange(this.generateGalaxy.bind(this)));
    this.view.setOrbitControlSettings({
      autoRotate: true,
      autoRotateSpeed: 0.25,
    });

    this.view.setCamera({
      position: { x: 3, y: 2, z: 3 },
    })

    this.generateGalaxy();
    this.view.show(this.scene);
  }

  generateGalaxy() {
    if (this.points !== null) {
      this.disposeGalaxy();
    }

    this.geometry = this.generateGalaxyGeometry();

    this.material = new THREE.PointsMaterial({
      size: this.galaxySettings.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  generateGalaxyGeometry() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.galaxySettings.count * 3);
    const colors = new Float32Array(this.galaxySettings.count * 3);

    const colorInside = new THREE.Color(this.galaxySettings.insideColor);
    const colorOutside = new THREE.Color(this.galaxySettings.outsideColor);

    for (let i = 0; i < this.galaxySettings.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * this.galaxySettings.radius;
      const spinAngle = radius * this.galaxySettings.spin;

      const branchAngle = (i % this.galaxySettings.branches) / this.galaxySettings.branches * Math.PI * 2;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + this.randomDisplacement(radius);
      positions[i3 + 1] = this.randomDisplacement(radius);
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + this.randomDisplacement(radius);

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / this.galaxySettings.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] =  mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }

  randomDisplacement(radius) {
    return Math.pow(Math.random(), this.galaxySettings.randomnesPower) * randomSign() * this.galaxySettings.randomnes * radius;
  }

  disposeGalaxy() {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
  }

  dispose() {
    this.gui.destroy();
    this.disposeGalaxy();
  }
}