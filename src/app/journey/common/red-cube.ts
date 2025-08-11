import { MeshBasicMaterial } from "three";

import { disposeMesh } from "#/app/utils/three-utils";
import { Cube } from "./cube";

export type CubeProps = {
  wireframe: boolean;
}

export class RedCube extends Cube {

  constructor(props: CubeProps = {
    wireframe: false
  }) {
    const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: props.wireframe });
    super(material);
  }

  dispose() {
    disposeMesh(this);
  }
}