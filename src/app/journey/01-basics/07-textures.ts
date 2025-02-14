import * as THREE from 'three';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import RenderView from '@/app/layout/render-view';
import { AssetLoader } from '@/app/utils/assets-loader';

export class TextureTest extends OrbitControlledExercise {

  public static id = 'textures';

  private minecraftTexture: THREE.Texture;
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshBasicMaterial;
  private cube: THREE.Mesh;

  private loader: AssetLoader;
  
  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    this.loader = AssetLoader.getInstance();

    this.minecraftTexture = this.loadMinecrafTexture();
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ map: this.minecraftTexture });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.camera.position.set(2, 2, 2);
    this.scene.add(this.cube);
  }

  loadMinecrafTexture() {
    const colorTexture = this.loader.loadTexture('/textures/minecraft.png');
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.generateMipmaps = false;
    colorTexture.minFilter = THREE.NearestFilter;
    colorTexture.magFilter = THREE.NearestFilter;
    return colorTexture;
  }

  async dispose() {
    super.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.minecraftTexture.dispose();
  }
}