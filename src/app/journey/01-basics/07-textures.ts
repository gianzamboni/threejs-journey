import { Mesh, MeshBasicMaterial, BoxGeometry, Texture, NearestFilter, RepeatWrapping, SRGBColorSpace } from 'three';

import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/utils/assets-loader';
import { disposeObjects } from '#/app/utils/three-utils';
@Exercise('textures')
@Description(["<strong>A cube with a Minecraft texture.</strong>"])
export class TextureTest extends OrbitControlledExercise {
  private minecraftTexture: Texture;
  private geometry: BoxGeometry;
  private material: MeshBasicMaterial;
  private cube: Mesh;

  private loader: AssetLoader;
  
  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    this.loader = AssetLoader.getInstance();

    this.minecraftTexture = this.loadMinecrafTexture();
    this.geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
    this.material = new MeshBasicMaterial({ map: this.minecraftTexture });
    this.cube = new Mesh(this.geometry, this.material);
    this.camera.position.set(2, 2, 2);
    this.scene.add(this.cube);
  }

  loadMinecrafTexture() {
    const colorTexture = this.loader.loadTexture('/textures/minecraft/minecraft.png');
    colorTexture.colorSpace = SRGBColorSpace;
    colorTexture.wrapS = RepeatWrapping;
    colorTexture.wrapT = RepeatWrapping;
    colorTexture.generateMipmaps = false;
    colorTexture.minFilter = NearestFilter;
    colorTexture.magFilter = NearestFilter;
    return colorTexture;
  }

  async dispose() {
    super.dispose();
    disposeObjects(this.geometry, this.material, this.minecraftTexture);
  }
}