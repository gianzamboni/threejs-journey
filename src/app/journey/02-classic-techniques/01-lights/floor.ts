import { Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

import { disposeObjects } from "#/app/utils/three-utils";

export class Floor extends Mesh {
    constructor(material: MeshStandardMaterial) {
      super(new PlaneGeometry(5, 5, 1, 1), material);
      this.rotation.x = -Math.PI * 0.5;
      this.position.y = -0.65;
    }

    dispose() {
      disposeObjects(this.geometry);
    }
}