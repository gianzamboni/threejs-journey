import * as THREE from 'three';

import { AssetLoader } from '#/app/utils/assets-loader';
import { TextureDict } from '#/app/utils/textures';
import { TextureQuality } from '#/app/utils/textures';
import { TextureMaps } from '#/app/utils/textures';
/*
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