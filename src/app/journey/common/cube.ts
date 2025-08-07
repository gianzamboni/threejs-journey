import { Mesh, BoxGeometry, MeshBasicMaterial, Color } from "three";

import { disposeMesh } from "#/app/utils/three-utils";

export class Cube extends Mesh {
  
  constructor() {
    super(
      new BoxGeometry(1, 1, 1, 1, 1, 1), 
      new MeshBasicMaterial({ color: 0xff0000 })
    );
  }

  updateSubdivisions(subdivisions: number) {
    this.geometry.dispose();
    this.geometry = new BoxGeometry(1, 1, 1, subdivisions, subdivisions, subdivisions);
  } 

  setColor(color: string) {
    (this.material as MeshBasicMaterial).color.set(new Color(color));
  }

  dispose() {
    disposeMesh(this);
  }
}