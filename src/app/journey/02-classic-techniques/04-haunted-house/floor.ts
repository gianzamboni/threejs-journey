import * as THREE from 'three';

import { AssetLoader } from '#/app/utils/assets-loader';
import { QualityConfig } from './quality-config';
import { loadTextureMaps } from './texture-maps';

import { MeshObject } from '../../../types/scene-object';
import { TextureDict, TextureMaps } from '#/app/utils/textures';

/**
 * Floor object for the haunted house scene
 */
export class Floor extends MeshObject {

  protected geometry: THREE.PlaneGeometry;
  protected material: THREE.MeshStandardMaterial;
  protected textures: TextureDict;
  public object: THREE.Mesh;

  private quality: QualityConfig;

  /**
   * Create a new floor
   */
  constructor(quality: QualityConfig) {
    super();
    this.quality = quality;
    this.geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
  
    this.object = new THREE.Mesh(this.geometry, this.material);
    this.object.rotation.x = -Math.PI * 0.5;
    this.object.receiveShadow = this.quality.shadows;
  }

  /**
   * Generate the material for the floor
   */
  private generateMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      transparent: true,
      alphaMap: this.textures[TextureMaps.Alpha],
      map: this.textures[TextureMaps.Color],
      aoMap: this.textures[TextureMaps.Arm],
      roughnessMap: this.textures[TextureMaps.Arm],
      metalnessMap: this.textures[TextureMaps.Arm],
      normalMap: this.textures[TextureMaps.Normal],
      displacementMap: this.textures[TextureMaps.Displacement],
      displacementScale: 0.1,
    });
  }

  /**
   * Load textures for the floor
   */
  private loadTextures(): TextureDict {
    const textures = loadTextureMaps('floor', this.quality.textureQuality, 
      [TextureMaps.Color, TextureMaps.Normal, TextureMaps.Displacement, TextureMaps.Arm]
    );
    
    for(const texture of Object.values(textures)) {
      texture.repeat.set(4, 4);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }

    const assetLoader = AssetLoader.getInstance();
    textures[TextureMaps.Alpha] = assetLoader.loadTexture('/textures/haunted-house/floor/alpha.jpg');

    return textures;
  }
} 