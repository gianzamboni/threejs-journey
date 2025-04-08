import { 
  Object3D,
  LineBasicMaterial,
  Vector3,
  Group,
  ColorRepresentation,
  Scene,
  BufferGeometry,
  Line
} from 'three';

import { disposeMesh } from '#/app/utils/three-utils';

/**
 * Utility class to trace the path of an object in 3D space
 */
export class PathTracer {
  private obj: Object3D;
  private material: LineBasicMaterial;
  private path: Vector3[];
  public mesh: Group;

  constructor(obj: Object3D, color: ColorRepresentation) {
    this.obj = obj;
    this.material = new LineBasicMaterial({ color });
    this.path = [obj.position.clone()];
    this.mesh = new Group();
  }

  /**
   * Add the path tracer to a scene
   */
  addTo(scene: Scene): void {
    scene.add(this.mesh);
  }

  /**
   * Update the path tracer with the current position of the object
   */
  update(): void {
    const lastPositionIndex = this.path.length - 1;
    this.path.push(this.obj.position.clone());
    const geometry = new BufferGeometry().setFromPoints([
      this.path[lastPositionIndex], 
      this.path[lastPositionIndex + 1]
    ]);
    const line = new Line(geometry, this.material);
    this.mesh.add(line);
    
    // Limit the number of line segments to prevent performance issues
    if (this.mesh.children.length > 5000) {
      this.mesh.remove(this.mesh.children[0]);
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.mesh.children.forEach((child) => {
      const line = child as Line;
      disposeMesh(line);
    });
  }
} 