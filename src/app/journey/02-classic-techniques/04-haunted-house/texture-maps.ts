import * as THREE from 'three';

import { AssetLoader } from '#/app/utils/assets-loader';

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
/**
 * Loads texture maps for a given file prefix and map types
 * @param assetLoader The asset loader instance
 * @param filePrefix The prefix for the texture files
 * @param mapTypes The types of maps to load
 * @returns An object containing the loaded textures
 */
export function loadTextureMaps(
  textureFolder: string,
  resolution: TextureQuality,
  mapTypes:  TextureMaps[],
  isRootPath: boolean = false
): TextureDict {

  const assetLoader = AssetLoader.getInstance();
  const textures: TextureDict = {};
  
  for (const mapType of mapTypes) { 
    const path = `${isRootPath ? textureFolder : `/textures/haunted-house/${textureFolder}`}/${resolution}/${mapType}.jpg`;
    textures[mapType] = assetLoader.loadTexture(path);
  }
  
  if (textures[TextureMaps.Color]) {
    textures[TextureMaps.Color].colorSpace = THREE.SRGBColorSpace;
  }
  
  return textures;
} 