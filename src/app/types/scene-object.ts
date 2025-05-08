import { 
  Object3D,
  BufferGeometry,
  Material,
  Mesh
} from 'three';

import { TextureDict } from '#/app/utils/textures';

/**
 * Base class for all scene objects
 */
export abstract class SceneObject {
  public abstract object: Object3D;
  public abstract dispose(): void;
} 

export abstract class MeshObject extends SceneObject {
  protected abstract geometry: BufferGeometry;
  protected abstract material: Material;
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
  geometry: BufferGeometry;
  material: Material;
  mesh: Mesh;
}
