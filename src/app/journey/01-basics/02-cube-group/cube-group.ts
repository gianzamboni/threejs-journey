import { BoxGeometry, MeshBasicMaterial } from "three";

import { disposeObjects } from "#/app/utils/three-utils";

import { CenteredRotatingMeshRow } from "../../common/centered-rotating-mesh-row";


export class CubeCollection extends CenteredRotatingMeshRow {

  constructor() {
    const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    super([geometry, geometry, geometry], material);

    this.scale.y = 2;
    this.rotation.y = 0.2;
  }

  dispose() {
    disposeObjects(this.material, this.geometries[0]);
  }
}