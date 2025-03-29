import * as THREE from 'three';

import { Description, Exercise } from '#/app/decorators/exercise';
import BaseExercise from '#/app/journey/exercises/base-exercise';
import { disposeObjects } from '#/app/utils/three-utils';

@Exercise('object-transformation')
@Description(["<strong>A group of y-scaled cubes in the center of the scene.</strong>", "It is <strong>NOT</strong> interactive"])
export class CubeGroup extends BaseExercise {  
  private group: THREE.Group;
  private axesHelper: THREE.AxesHelper;
  
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshBasicMaterial;


  constructor() {
    super();
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ 
      color: 0xff0000, 
      wireframe: true 
    });
    
    this.group = this.createCubeGroup();
    this.axesHelper = new THREE.AxesHelper(2);

    this.scene.add(this.group, this.axesHelper);
  }

  private createCubeGroup() {
    const group = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const cube = new THREE.Mesh(this.geometry, this.material);
      cube.position.x = 1.5*i - 1.5;
      group.add(cube);
    }

    group.scale.y = 2;
    group.rotation.y = 0.2;

    return group;
  }

  async dispose() {
    super.dispose();
    this.group.clear();
    disposeObjects(this.axesHelper, this.material, this.geometry);
  }
}