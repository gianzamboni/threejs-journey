import * as THREE from 'three';

/**
 * Utility class to trace the path of an object in 3D space
 */
export class PathTracer {
  private obj: THREE.Object3D;
  private material: THREE.LineBasicMaterial;
  private path: THREE.Vector3[];
  public mesh: THREE.Group;

  constructor(obj: THREE.Object3D, color: THREE.ColorRepresentation) {
    this.obj = obj;
    this.material = new THREE.LineBasicMaterial({ color });
    this.path = [obj.position.clone()];
    this.mesh = new THREE.Group();
  }

  /**
   * Add the path tracer to a scene
   */
  addTo(scene: THREE.Scene): void {
    scene.add(this.mesh);
  }

  /**
   * Update the path tracer with the current position of the object
   */
  update(): void {
    const lastPositionIndex = this.path.length - 1;
    this.path.push(this.obj.position.clone());
    const geometry = new THREE.BufferGeometry().setFromPoints([
      this.path[lastPositionIndex], 
      this.path[lastPositionIndex + 1]
    ]);
    const line = new THREE.Line(geometry, this.material);
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
      const line = child as THREE.Line;
      line.geometry.dispose();
      if (line.material instanceof THREE.Material) {
        line.material.dispose();
      } else if (Array.isArray(line.material)) {
        line.material.forEach(material => material.dispose());
      }
    });
  }
} 