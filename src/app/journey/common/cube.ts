import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";

import { disposeMesh } from "#/app/utils/three-utils";

export type CubeProps = {
  wireframe: boolean;
}

export class Cube extends Mesh {

  constructor(props: CubeProps = {
    wireframe: false
  }) {
    const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: props.wireframe });
    super(geometry, material);
  }

  dispose() {
    disposeMesh(this);
  }
}