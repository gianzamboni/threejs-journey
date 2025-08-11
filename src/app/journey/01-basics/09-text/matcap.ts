import { MeshMatcapMaterial, SRGBColorSpace, Texture } from "three";

import { AssetLoader } from "#/app/services/assets-loader";


export class Matcap {
  private texture: Texture;
  public material: MeshMatcapMaterial;

  constructor() {
    const loader = AssetLoader.getInstance();
    this.texture = loader.loadTexture('textures/matcaps/8.png');
    this.texture.colorSpace = SRGBColorSpace;

    this.material = new MeshMatcapMaterial({
      matcap: this.texture,
    });
  }

  dispose() {
    this.texture.dispose();
    this.material.dispose();
  }
}