import { BufferGeometry, Group, Material, Mesh, Scene } from "three";

import { Timer } from "three/examples/jsm/misc/Timer.js";

export class CenteredRotatingMeshRow extends Group {
  
  constructor(geometries: BufferGeometry[], material: Material) {
    super();
    const meshes = geometries.map((geometry, index) => {
      const mesh = new Mesh(geometry, material);
      mesh.position.x = index * 1.5 - 1.5;
      return mesh;
    });
    this.add(...meshes);
  }

  addTo(scene: Scene) {
    scene.add(this);
  }

  frame(timer: Timer) {
    for(const mesh of this.children) {
      mesh.rotation.y = 0.01 * timer.getElapsed();
      mesh.rotation.x = -0.15 * timer.getElapsed();
    }
  }
}