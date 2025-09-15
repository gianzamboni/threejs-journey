import { BufferGeometry, Group, Material, Mesh } from "three";

import { Timer } from "three/addons/misc/Timer.js";

export class CenteredRotatingMeshRow extends Group {
  
  protected geometries: BufferGeometry[];
  protected material: Material;
  
  constructor(geometries: BufferGeometry[], material: Material) {
    super();

    this.geometries = geometries;
    this.material = material;

    const meshes = geometries.map((geometry, index) => {
      const mesh = new Mesh(geometry, material);
      mesh.position.x = index * 1.5 - 1.5;
      return mesh;
    });
    this.add(...meshes);
  }

  frame(timer: Timer) {
    for(const mesh of this.children) {
      mesh.rotation.y = 0.01 * timer.getElapsed();
      mesh.rotation.x = -0.15 * timer.getElapsed();
    }
  }
}