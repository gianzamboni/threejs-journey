import { MeshBasicMaterial, NearestFilter, RepeatWrapping, SRGBColorSpace, Texture } from "three";

import { AssetLoader } from "#/app/services/assets-loader";

import { Cube } from "../../common/cube";

export class MinecraftCube extends Cube {

  private static loadMinecraftTexture(): Texture {
    const colorTexture = AssetLoader.getInstance()
    .loadTexture('/textures/minecraft/minecraft.png');
    colorTexture.colorSpace = SRGBColorSpace;
    colorTexture.wrapS = RepeatWrapping;
    colorTexture.wrapT = RepeatWrapping;
    colorTexture.generateMipmaps = false; 
    colorTexture.minFilter = NearestFilter;
    colorTexture.magFilter = NearestFilter;
    return colorTexture;
  }

  constructor() {
    const texture = MinecraftCube.loadMinecraftTexture();
    const material = new MeshBasicMaterial({ map: texture });
    super(material);
  }
}