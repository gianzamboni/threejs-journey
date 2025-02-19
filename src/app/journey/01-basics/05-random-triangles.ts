import * as THREE from "three";
import RenderView from "@/app/layout/render-view";
import { Exercise } from "@/app/decorators/exercise";
import OrbitControlledExercise from "@/app/types/exercises/orbit-controlled-exercise";

@Exercise({
  id: 'geometries'
})
export class RandomTraingles extends OrbitControlledExercise {

  public static id = 'geometries';
 
  private triangles: THREE.Mesh;

  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    
    const geometry = this.generateTriangleGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    this.triangles = new THREE.Mesh(geometry, material);

    this.camera.position.y = 1;
    this.camera.position.z = 1;
    this.controls.autoRotateSpeed = 0.5;
    this.scene.add(this.triangles);
  }
  
  generateTriangleGeometry() {
    const geometry = new THREE.BufferGeometry();
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4;
    }

    const bufferAtrribute = new THREE.BufferAttribute(positionsArray, 3);
    geometry.setAttribute('position', bufferAtrribute)
    return geometry;
  }

  async dispose() {
    await super.dispose();
    this.triangles.geometry.dispose();
    (this.triangles.material as THREE.Material).dispose();
  }
}