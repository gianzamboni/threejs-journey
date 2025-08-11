import { gsap } from "gsap";
import { Mesh, BoxGeometry, MeshBasicMaterial, Color } from "three";

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

  updateSubdivisions(subdivisions: number) {
    this.geometry.dispose();
    this.geometry = new BoxGeometry(1, 1, 1, subdivisions, subdivisions, subdivisions);
  } 

  setColor(color: string) {
    (this.material as MeshBasicMaterial).color.set(new Color(color));
  }

  spin() {
    gsap.to(this.rotation, { duration: 1, y: this.rotation.y + Math.PI * 2 });
  }

  dispose() {
    disposeMesh(this);
  }
}