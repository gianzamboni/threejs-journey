import * as THREE from 'three';

import { randomBetween } from '#/app/utils/random-utils';
import { QualityConfig } from './quality-config';
import { loadTextureMaps, TextureDict, TextureMaps } from '#/app/utils/textures';

import { MeshObject } from '../../../types/scene-object';

/**
 * Roof object for the haunted house scene
 */
export class Roof extends MeshObject {
  protected geometry: THREE.BufferGeometry;
  protected material: THREE.MeshStandardMaterial;
  protected textures: TextureDict;
  public object: THREE.Mesh;

  private static radius: number = 3.25;
  private static height: number = 1.5;

  private quality: QualityConfig;

  /**
   * Create a new roof
   */
  constructor(quality: QualityConfig) {
    super();
    this.quality = quality;
    this.geometry = this.generatePyramid();
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    
    this.object = new THREE.Mesh(this.geometry, this.material);
    this.object.position.y = 2.5;
    this.object.rotation.y = Math.PI * 0.25;
  }

  /**
   * Generate a pyramid geometry for the roof
   */
  private generatePyramid(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(54);
    const uvCoords = new Float32Array(36);

    const [topPoint, basePoints] = this.generateVertices();
    this.generateSideFaces(vertices, uvCoords, topPoint, basePoints);
    this.generateBaseFaces(vertices, uvCoords, basePoints);

    const vbufferAttribute = new THREE.BufferAttribute(vertices, 3);
    const uvBufferAttribute = new THREE.BufferAttribute(uvCoords, 2);
    geometry.setAttribute('position', vbufferAttribute);
    geometry.setAttribute('uv', uvBufferAttribute);
    geometry.computeVertexNormals();
    return geometry;
  }

  /**
   * Generate vertices for the pyramid
   */
  private generateVertices(): [number[], number[][]] {
    const topPoint = [0, Roof.height, 0];
    const basePoints: number[][] = [];
    
    for (let i = 0; i < 4; i++) {
      const angle = Math.PI * i * 0.5;
      basePoints.push([
        Math.cos(angle) * Roof.radius, 
        0, 
        Math.sin(angle) * Roof.radius
      ]);
    }
    
    return [topPoint, basePoints];
  }
  
  /**
   * Generate side faces for the pyramid
   */
  private generateSideFaces(
    vertices: Float32Array, 
    uvCoords: Float32Array, 
    topPoint: number[], 
    basePoints: number[][]
  ): void {
    for (let i = 0; i < 4; i++) {
      const index_v = i * 9; 
      vertices.set(basePoints[i], index_v);
      vertices.set(topPoint, index_v + 3);
      vertices.set(basePoints[(i + 1) % 4], index_v + 6);
      
      const xDisplacement = randomBetween(0, 0.5);
      const yDisplacement = randomBetween(0, 0.5);
      
      uvCoords.set([
        0 + xDisplacement, 
        0 + yDisplacement, 
        0.25 + xDisplacement, 
        0.5 + yDisplacement, 
        0.5 + xDisplacement, 
        0 + yDisplacement
      ], i * 6);
    }
  }

  /**
   * Generate base faces for the pyramid
   */
  private generateBaseFaces(
    vertices: Float32Array, 
    uvCoords: Float32Array, 
    basePoints: number[][]
  ): void {
    for (let i = 0; i < 2; i++) {
      const index_v = 36 + i * 9;
      vertices.set(basePoints[i * 2], index_v);
      vertices.set(basePoints[i * 2 + 1], index_v + 3);
      vertices.set(basePoints[(i * 2 + 3) % 4], index_v + 6);
      
      uvCoords.set([0, 0, 0.25, 0.5, 0.5, 0], 24 + i * 6);
    }
  }

  /**
   * Load textures for the roof
   */
  private loadTextures(): TextureDict {
    const textures = loadTextureMaps('haunted-house/roof', this.quality.textureQuality, 
      [TextureMaps.Color, TextureMaps.Normal, TextureMaps.Arm]
    );

    for(const texture of Object.values(textures)) {
      texture.repeat.set(3, 1);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }
    
    return textures;
  }

  /**
   * Generate the material for the roof
   */
  private generateMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      map: this.textures[TextureMaps.Color],
      aoMap: this.textures[TextureMaps.Arm],
      roughnessMap: this.textures[TextureMaps.Arm],
      metalnessMap: this.textures[TextureMaps.Arm],
      normalMap: this.textures[TextureMaps.Normal],
    });
  }
} 