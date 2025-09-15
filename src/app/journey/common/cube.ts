import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";

import { disposeMesh } from "#/app/utils/three-utils";

export type CubeProps = {
  wireframe: boolean;
}

export class Cube extends Mesh {

  constructor(material: MeshBasicMaterial) {
    const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
    super(geometry, material);
  }

  dispose() {
    disposeMesh(this);
  }
}