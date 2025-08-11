import { BoxGeometry, MeshBasicMaterial } from "three";

import { disposeObjects } from "#/app/utils/three-utils";

import { CenteredRotatingMeshRow } from "../../common/ThreeMeshRow";

export class CubeCollection extends CenteredRotatingMeshRow {

  private geometry: BoxGeometry;
  private material: MeshBasicMaterial;

  constructor() {
    const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    super([geometry, geometry, geometry], material);

    this.geometry = geometry;
    this.material = material;

    this.scale.y = 2;
    this.rotation.y = 0.2;
  }

  dispose() {
    this.clear();
    disposeObjects(this.material, this.geometry);
  }
}