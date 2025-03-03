import * as THREE from 'three';

import { RedCube } from '../../utils/red-cube';

export class CenteredCube {
  constructor(view) {
    this.view = view;
    this.cube = new RedCube();
    this.scene = new THREE.Scene();
  }

  init() {
    this.cube.addTo(this.scene);
    this.view.show(this.scene);
  }

  dispose() {
    this.cube.removeFrom(this.scene);
  }
}