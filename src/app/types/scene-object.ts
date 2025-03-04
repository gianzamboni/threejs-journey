import * as THREE from 'three';

import { TextureDict } from '../journey/02-classic-techniques/04-haunted-house/texture-maps';

/**
 * Base class for all scene objects
 */
export abstract class SceneObject {
  public abstract object: THREE.Object3D;
  public abstract dispose(): void;
} 

export abstract class MeshObject extends SceneObject {
  protected abstract geometry: THREE.BufferGeometry;
  protected abstract material: THREE.Material;
  protected abstract textures: TextureDict;

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
    for (const texture of Object.values(this.textures)) {
      texture.dispose();
    }
  }
}

export type SceneMeshObject = {
  textures?: TextureDict;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
}
