import * as THREE from 'three';
import BaseExercise from "../base-exercise";
import { Exercise } from "../decorators";
import { SceneObject } from '../decorators/scene-objects';

@Exercise({ 
  id: 'object-transformation',
})
export class CubeGroup extends BaseExercise {

  @SceneObject
  private group: THREE.Group;

  @SceneObject
  private axesHelper: THREE.AxesHelper;
  
  private cubeGeometry: THREE.BoxGeometry;
  private cubeMaterial: THREE.MeshBasicMaterial;


  constructor() {
    super();
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    
    this.group = this.createCubeGroup();
    this.axesHelper = new THREE.AxesHelper(2);

  }

  private createCubeGroup() {
    const group = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
      cube.position.x = 1.5*i - 1.5;
      group.add(cube);
    }

    group.scale.y = 2;
    group.rotation.y = 0.2;

    return group;
  }

  dispose() {
    super.dispose();
    this.axesHelper.dispose();
    this.group.clear();
    this.cubeMaterial.dispose();
    this.cubeGeometry.dispose();
  }
}