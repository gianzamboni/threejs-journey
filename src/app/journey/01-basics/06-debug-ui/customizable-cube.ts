import { gsap } from "gsap";
import { BoxGeometry, Color, MeshBasicMaterial } from "three";

import { Cube, CubeProps } from "../../common/cube";

export class CustomizableCube extends Cube {
  constructor(props: CubeProps) {
    super(props);
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

}