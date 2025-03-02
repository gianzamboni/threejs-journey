import * as THREE from 'three';

import { QualityConfig } from './quality-config';
import { MeshObject } from './scene-object';
import { loadTextureMaps, TextureDict, TextureMaps } from './texture-maps';

/**
 * Bushes object for the haunted house scene
 */
export class Bushes extends MeshObject {
  public object: THREE.Group;

  protected geometry: THREE.SphereGeometry;
  protected material: THREE.MeshStandardMaterial;
  protected textures: TextureDict;

  private quality: QualityConfig;
  /**
   * Create new bushes
   */
  constructor(quality: QualityConfig) {
    super();
    this.quality = quality;
    this.geometry = new THREE.SphereGeometry(1, this.quality.subdivisions, this.quality.subdivisions);
    this.textures = loadTextureMaps('bushes', this.quality.textureQuality,
      [TextureMaps.Color, TextureMaps.Normal, TextureMaps.Ao, TextureMaps.Displacement, TextureMaps.Roughness]
    );
    this.material = this.generateMaterial();
    this.object = new THREE.Group();
    this.generateBushes();
  }

  /**
   * Generate bushes with different sizes and positions
   */
  private generateBushes(): void {
    for (let i = 0; i < 4; i++) {
      const bush = new THREE.Mesh(this.geometry, this.material);
      bush.rotation.x = -0.75;
      bush.castShadow = false;
      bush.receiveShadow = this.quality.shadows;
      this.object.add(bush);
    }

    const bushes = this.object.children;
    bushes[0].scale.set(0.4, 0.4, 0.4);
    bushes[0].position.set(1, 0.2, 2.2);
    
    bushes[1].scale.set(0.15, 0.15, 0.15);
    bushes[1].position.set(1.6, 0.1, 2.1);
    
    bushes[2].scale.set(0.3, 0.3, 0.3);
    bushes[2].position.set(-0.8, 0.1, 2.2);
    
    bushes[3].scale.set(0.1, 0.1, 0.1);
    bushes[3].position.set(-1, 0.05, 2.55); 
  }

  /**
   * Generate the material for the bushes
   */
  private generateMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: "#dfdfdf",
      map: this.textures[TextureMaps.Color],
      aoMap: this.textures[TextureMaps.Ao],
      roughness: 2,
      roughnessMap: this.textures[TextureMaps.Roughness],
      normalMap: this.textures[TextureMaps.Normal],
      displacementMap: this.textures[TextureMaps.Displacement],
      displacementScale: 0.5,
      metalness: 0,
    });
  }
} 