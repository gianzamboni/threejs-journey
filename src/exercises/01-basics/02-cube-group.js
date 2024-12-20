import * as THREE from 'three';

export class CubeGroup {
  constructor(view) {
    this.scene = new THREE.Scene();
    this.groupData  = this.createCubeGroup();
    this.scene.add(this.groupData.group);

    this.axesHelper = new THREE.AxesHelper(2);
    this.scene.add(this.axesHelper);

    view.init(this.scene);

    console.log(this.groupData.cubes[0].position.length());
    console.log(this.groupData.cubes[0].position.distanceTo(view.camera.position));
    console.log(this.groupData.cubes[0].position.normalize());
  }

  createCubeGroup() {
    const group = new THREE.Group();
    group.scale.y = 2;
    group.rotation.y = 0.2;

    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const cubes = [-1.5, 0, 1.5].map((x) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = x;
      return mesh;
    });

    group.add(...cubes);

    return {
      group,
      cubes,
      material,
      geometry
    };
  }

  dispose() {
    this.scene.remove(this.groupData.group);
    this.groupData.geometry.dispose();
    this.groupData.material.dispose();
    this.axesHelper.dispose();
  }
}
