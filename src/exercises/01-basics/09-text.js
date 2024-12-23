import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { textureLoader } from '../../utils/loading-manager';
import { AnimationLoop } from '../../utils/animation-loop';

export class Text3D {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.animationLoop = new AnimationLoop(() => this.animate());

    this.matcapTexture = textureLoader.load('/textures/matcaps/8.png');
    this.matcapTexture.colorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.MeshMatcapMaterial({ matcap: this.matcapTexture });
    this.donuts = [];
    this.donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    this.textGeometry = null;
    this.textMesh = null;


  }

  init() {
    this.view.toggleOrbitControls(true);
    this.view.setCamera({
      position: { x: 1, y: 1, z: 3 },
      lookAt: { x: 0, y: 0, z: 0 }
    });

    this.generateText();
    this.generateDonuts();
    this.view.show(this.scene);
    this.animationLoop.start();
  }

  generateDonuts() {
    for(let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(this.donutGeometry, this.material);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      this.donuts.push(donut);
    }
    this.scene.add(...this.donuts);
  }

  generateText() {
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      this.textGeometry = new TextGeometry(
        'Hola Three.js',
        {
          font: font,
          size: 0.5,
          depth: 0.2,
          curveSegments: 8,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 10
        }
      );
      this.textGeometry.center();
      this.textMesh = new THREE.Mesh(this.textGeometry, this.material);
      this.scene.add(this.textMesh);
    });
  }

  animate() {
    this.donuts.forEach(donut => {
      donut.rotation.x += 0.01;
      donut.rotation.y += 0.01;
    });

    this.view.render(this.scene);
  }

  async dispose() {
    await this.animationLoop.stop();
    this.scene.remove(this.textMesh);
    this.donuts.forEach(donut => this.scene.remove(donut));
    this.textGeometry.dispose();
    this.donutGeometry.dispose();
    this.material.dispose();
    this.matcapTexture.dispose();
  }
}
