import { 
  BoxGeometry,
  MeshStandardMaterial,
  Mesh
} from 'three';

import { loadTextureMaps, TextureDict, TextureMaps } from '#/app/utils/textures';
import { QualityConfig } from './quality-config';

import { MeshObject } from '../../../types/scene-object';
/**
 * Walls object for the haunted house scene
 */
export class Walls extends MeshObject {
  protected geometry: BoxGeometry;
  protected material: MeshStandardMaterial;
  protected textures: TextureDict;
  public object: Mesh;

  private quality: QualityConfig;

  /**
   * Create new walls
   */
  constructor(quality: QualityConfig) {
    super();
    this.quality = quality;
    this.geometry = new BoxGeometry(4, 2.5, 4, this.quality.subdivisions, this.quality.subdivisions, this.quality.subdivisions);
    this.textures = loadTextureMaps('walls', 
      this.quality.textureQuality, 
      [TextureMaps.Color, TextureMaps.Normal, TextureMaps.Arm],
    );
    this.material = this.generateMaterial();
    
    this.object = new Mesh(this.geometry, this.material);
    this.object.position.y = 1.25;
    this.object.castShadow = this.quality.shadows;
    this.object.receiveShadow = this.quality.shadows;
  }

  /**
   * Generate the material for the walls
   */
  private generateMaterial(): MeshStandardMaterial {
    return new MeshStandardMaterial({
      map: this.textures[TextureMaps.Color],
      aoMap: this.textures[TextureMaps.Arm],
      roughnessMap: this.textures[TextureMaps.Arm],
      metalnessMap: this.textures[TextureMaps.Arm],
      normalMap: this.textures[TextureMaps.Normal],
    });
  }
} 