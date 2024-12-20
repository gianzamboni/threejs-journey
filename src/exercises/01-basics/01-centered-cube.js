import * as THREE from 'three';
import { RedCube } from '../../utils/red-cube';

export class CenteredCube {
  constructor(view) {
    this.cube = new RedCube();
    this.scene = new THREE.Scene();
    this.cube.addTo(this.scene);
    view.init(this.scene);
  }

  init() {}

  dispose() {
    this.cube.removeFrom(this.scene);
  }
}