import * as THREE from 'three';

import { randomBetween } from '#/app/utils/number-utils';
import { QualityConfig } from './quality-config';
import { loadTextureMaps, TextureDict, TextureMaps } from './texture-maps';

import { SceneObject } from '../../../types/scene-object';
/**
 * Graves object for the haunted house scene
 */
export class Graves extends SceneObject {
  public object: THREE.Group;

  protected geometry: THREE.BoxGeometry;
  protected material: THREE.MeshStandardMaterial;
  protected textures: TextureDict;

  private quality: QualityConfig;

  /**
   * Create new graves
   */
  constructor(quality: QualityConfig) {
    super();
    this.quality = quality;
    this.geometry = new THREE.BoxGeometry(0.6, 0.8, 0.2, this.quality.subdivisions, this.quality.subdivisions, this.quality.subdivisions);
    this.textures = loadTextureMaps('graves', this.quality.textureQuality,
      [TextureMaps.Color, TextureMaps.Normal, TextureMaps.Arm, TextureMaps.Displacement]
    );
    this.material = this.generateMaterial();
    this.object = new THREE.Group();
    this.generateGraves();
  }

  /**
   * Generate graves with random positions and rotations
   */
  private generateGraves(): void {
    for (let i = 0; i < 30; i++) {
      const grave = new THREE.Mesh(this.geometry, this.material);
      this.setRandomPosition(grave);
      this.setRandomRotation(grave);

      grave.castShadow = this.quality.shadows;
      grave.receiveShadow = this.quality.shadows;

      this.object.add(grave);
    }    
  }

  /**
   * Set random rotation for a grave
   */
  private setRandomRotation(grave: THREE.Mesh): void {
    ['x', 'y', 'z'].forEach(axis => {
      const key = axis as 'x' | 'y' | 'z';
      grave.rotation[key] = randomBetween(-0.2, 0.2);
    });
  }

  /**
   * Set random position for a grave
   */
  private setRandomPosition(grave: THREE.Mesh): void {
    const angle = randomBetween(0, Math.PI * 2);
    const radius = randomBetween(3.5, 6);

    grave.position.x = Math.sin(angle) * radius;
    grave.position.z = Math.cos(angle) * radius;
    grave.position.y = randomBetween(0, 0.4);
  }

  /**
   * Generate the material for the graves
   */
  private generateMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      map: this.textures[TextureMaps.Color],
      aoMap: this.textures[TextureMaps.Arm],
      roughnessMap: this.textures[TextureMaps.Arm],
      metalnessMap: this.textures[TextureMaps.Arm],
      normalMap: this.textures[TextureMaps.Normal],
      displacementMap: this.textures[TextureMaps.Displacement],
      displacementScale: 0.025,
      displacementBias: -0.015,
    });
  }

  dispose(): void {
    this.object.clear();
    this.geometry.dispose();
    this.material.dispose();
    for (const texture of Object.values(this.textures)) {
      texture.dispose();
    }
  }
} 