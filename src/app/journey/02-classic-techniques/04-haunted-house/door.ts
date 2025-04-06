import { 
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  SRGBColorSpace
} from 'three';

import { loadTextureMaps, TextureDict, TextureMaps } from '#/app/utils/textures';
import { QualityConfig } from './quality-config';

import { MeshObject } from '../../../types/scene-object';

/**
 * Door object for the haunted house scene
 */
export class Door extends MeshObject {
  protected geometry: PlaneGeometry;
  protected material: MeshStandardMaterial;
  protected textures: TextureDict;
  public object: Mesh;

  private quality: QualityConfig;

  /**
   * Create a new door
   */
  constructor(quality: QualityConfig  ) {
    super();
    this.quality = quality;
    this.geometry = new PlaneGeometry(2.2, 2.2, this.quality.subdivisions, this.quality.subdivisions);
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    
    this.object = new Mesh(this.geometry, this.material);
    this.object.position.y = 1;
    this.object.position.z = 2 + 0.038;
    this.object.receiveShadow = this.quality.shadows;
  }

  /**
   * Load textures for the door
   */
  private loadTextures(): TextureDict {
    const textureMaps = loadTextureMaps('haunted-house/door', '1k', 
      [TextureMaps.Alpha, TextureMaps.AmbientOcclusion, TextureMaps.Color, TextureMaps.Height, TextureMaps.Metalness, TextureMaps.Normal, TextureMaps.Roughness]
    );
    
    textureMaps[TextureMaps.Height]!.colorSpace = SRGBColorSpace;
    
    return textureMaps;
  }

  /**
   * Generate the material for the door
   */
  private generateMaterial(): MeshStandardMaterial {
    return new MeshStandardMaterial({
      color: "#b3b3b3",
      alphaMap: this.textures[TextureMaps.Alpha],
      aoMap: this.textures[TextureMaps.AmbientOcclusion],
      displacementBias: -0.04,
      displacementMap: this.textures[TextureMaps.Height],
      displacementScale: 0.1,
      map: this.textures[TextureMaps.Color],
      metalnessMap: this.textures[TextureMaps.Metalness],
      normalMap: this.textures[TextureMaps.Normal],
      roughnessMap: this.textures[TextureMaps.Roughness],
      transparent: true,  
    });
  }
} 