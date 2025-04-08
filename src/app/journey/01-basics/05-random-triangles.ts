import { Mesh, MeshBasicMaterial, BufferGeometry, BufferAttribute } from "three";

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { disposeMesh } from "#/app/utils/three-utils";

@Exercise('random-triangles')
@Description("<strong>A bunch of random generated triangles.</strong>")
export class RandomTriangles extends OrbitControlledExercise {
 
  private triangles: Mesh;

  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    
    const geometry = this.generateTriangleGeometry();
    const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    this.triangles = new Mesh(geometry, material);

    this.camera.position.y = 1;
    this.camera.position.z = 1;
    this.controls.autoRotateSpeed = 0.5;
    this.scene.add(this.triangles);
  }
  
  generateTriangleGeometry() {
    const geometry = new BufferGeometry();
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4;
    }

    const bufferAtrribute = new BufferAttribute(positionsArray, 3);
    geometry.setAttribute('position', bufferAtrribute)
    return geometry;
  }

  async dispose() {
    await super.dispose();
    disposeMesh(this.triangles);
  }
}