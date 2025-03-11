import * as THREE from 'three';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Timer } from 'three/addons/misc/Timer.js';

import { Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from "#/app/utils/assets-loader";

@Exercise('text-3d')
export class Text3D extends OrbitControlledExercise {
  private loader: AssetLoader;

  private matcapTexture: THREE.Texture;
  private material: THREE.MeshMatcapMaterial;

  private donuts: {
    geometry: THREE.TorusGeometry;
    meshes: THREE.Mesh[];
  }

  private text: {
    geometry?: TextGeometry;
    mesh?: THREE.Mesh;
  };
  
  constructor(view: RenderView) {
    super(view);
    this.camera.position.set(3,0,6);
    this.camera.lookAt(0,0,0);

    this.loader = AssetLoader.getInstance();
    this.matcapTexture = this.loader.loadTexture('textures/matcaps/8.png');
    this.matcapTexture.colorSpace = THREE.SRGBColorSpace;

    this.material = new THREE.MeshMatcapMaterial({
      matcap: this.matcapTexture,
    });

    this.donuts = this.generateDonuts();
    this.scene.add(...this.donuts.meshes);
    this.text = {};
    this.generateText();
  }

  frame(timer: Timer): void {
    super.frame(timer);
    for(const donut of this.donuts.meshes) {
      donut.rotation.x += 0.005;
      donut.rotation.y += 0.005;
    }
  }

  generateDonuts() {
    const geometry = new THREE.TorusGeometry(0.3, 0.15, 32, 64);
    const donuts = []
    for(let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(geometry, this.material);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      donuts.push(donut);
    }
    return {
      geometry,
      meshes: donuts
    };
  }

  generateText() {
    this.loader.loadFont('fonts/helvetiker_regular.typeface.json', (font) => {
      this.text.geometry = new TextGeometry('Hello Three.js', {
        font: font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 10
      });
      this.text.geometry.center();
      this.text.mesh = new THREE.Mesh(this.text.geometry, this.material);
      this.scene.add(this.text.mesh);
    });
  }
  async dispose() {
    await super.dispose();
    this.material.dispose();
    this.matcapTexture.dispose();
    
    this.donuts.geometry.dispose();
    this.text.geometry?.dispose();
  }
}