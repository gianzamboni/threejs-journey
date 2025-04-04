import * as THREE from 'three';
import { AssetLoader } from './assets-loader';

export type EnumDictionary<KeyType extends string | symbol | number, Value> = { 
  [Key in KeyType]?: Value
}

/**
 * Maps texture types to their file name suffixes
 */
export enum TextureMaps {
  Alpha = 'alpha',
  AmbientOcclusion = 'ambientOcclusion',
  Ao = 'ao',
  Arm = 'arm',
  Color = 'diff',
  Displacement = 'disp',
  Height = 'height',
  Metalness = 'metalness',
  Normal = 'nor_gl',
  Roughness = 'roughness',
};

export type TextureDict = EnumDictionary<TextureMaps, THREE.Texture>;

export type TextureQuality = "1k" | "2k" | "4k";

export function loadTextureMaps(
  textureFolder: string,
  resolution: TextureQuality,
  mapTypes:  (TextureMaps | {
    type: TextureMaps,
    format?: string
  })[],
): TextureDict {

  const assetLoader = AssetLoader.getInstance();
  const textures: TextureDict = {};
  
  for (const mapType of mapTypes) { 
    const isObject = typeof mapType === 'object';
    const path = isObject ? `/textures/${textureFolder}/${resolution}/${mapType.type}.${mapType.format || 'jpg'}` : `/textures/${textureFolder}/${resolution}/${mapType}.jpg`;
    textures[isObject ? mapType.type : mapType] = assetLoader.loadTexture(path);
  }
  
  if (textures[TextureMaps.Color]) {
    textures[TextureMaps.Color].colorSpace = THREE.SRGBColorSpace;
  }
  
  return textures;
} 