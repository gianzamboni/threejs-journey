import * as THREE from 'three'
import { AnimationLoop } from '../../utils/animation-loop';
import { textureLoader } from '../../utils/loading-manager';
import { dispose } from '../../utils/dispose';
export class TextureExercise {
  constructor(view) {
    this.view = view;

    this.scene = new THREE.Scene();

    this.colorTexture = this.loadMinecrafTexture();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ map: this.colorTexture });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.animationLoop = new AnimationLoop(() => this.animationFrame());
    this.view.toggleOrbitControls(true);
    this.view.setCamera({
      position: { x: 2, y: 2, z: 2 },
      lookAt: { x: 0, y: 0, z: 0 }
    });
  }

  init() {
    this.animationLoop.start();
    this.view.show(this.scene);
  }

  loadMinecrafTexture() {
    const colorTexture = textureLoader.load('/textures/minecraft.png');
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.generateMipmaps = false;
    colorTexture.minFilter = THREE.NearestFilter;
    colorTexture.magFilter = THREE.NearestFilter;
    return colorTexture;
  }

  animationFrame() {
    this.view.render(this.scene);
  }

  async dispose() {
    await this.animationLoop.stop();
    this.scene.remove(this.mesh);
    dispose(this.mesh);
    this.colorTexture.dispose();
  }
}