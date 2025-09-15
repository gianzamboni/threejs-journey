import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial } from "three";

export class RandomTriangles extends Mesh {

  constructor() {
    const geometry = new BufferGeometry();
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4;
    }

    const bufferAtrribute = new BufferAttribute(positionsArray, 3);
    geometry.setAttribute('position', bufferAtrribute)

    const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    super(geometry, material);
  }

  dispose() {
    this.geometry.dispose();
    (this.material as MeshBasicMaterial).dispose();
  }
}