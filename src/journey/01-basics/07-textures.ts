import * as THREE from 'three';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import RenderView from '@/layout/render-view';
import { createRedCube } from '@/utils/default-shapes';

export class TextureTest extends OrbitControlledExercise {

  public static id = 'debug-ui';

  private cube: THREE.Mesh;

  constructor(view: RenderView) {
    super(view);
    this.cube = createRedCube();
    this.scene.add(this.cube);
  }

  async dispose() {
    super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}

/*

import * as THREE from 'three'
import { TEXTURE_LOADER } from '../../utils/loading-manager';
import { dispose } from '../../utils/dispose';
export class TextureExercise {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.colorTexture = this.loadMinecrafTexture();
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ map: this.colorTexture });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  init() {
    this.scene.add(this.mesh);
    this.view.setCamera({
      position: { x: 2, y: 2, z: 2 },
      lookAt: { x: 0, y: 0, z: 0 }
    });
    this.view.setOrbitControlSettings({
      autoRotate: true,
      autoRotateSpeed: 1,
    });
    this.view.show(this.scene);
  }

  loadMinecrafTexture() {
    const colorTexture = TEXTURE_LOADER.load('/textures/minecraft/minecraft.png');
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.generateMipmaps = false;
    colorTexture.minFilter = THREE.NearestFilter;
    colorTexture.magFilter = THREE.NearestFilter;
    return colorTexture;
  }

  async dispose() {
    this.scene.remove(this.mesh);
    dispose(this.mesh);
    this.colorTexture.dispose();
  }
}

*/