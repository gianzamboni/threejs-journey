import * as CANNON from 'cannon-es';
import { Mesh, MeshStandardMaterial, PlaneGeometry, Scene, Texture } from 'three';

import { PhysicalObject } from './physical-object';

type PhysicalFloorConfig = {
  world: CANNON.World;
  scene: Scene;
  envMap: Texture;
}

export class PhysicalFloor extends PhysicalObject {
  constructor(config: PhysicalFloorConfig) {
    const geometry = new PlaneGeometry(10, 10);
    const material = new MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: config.envMap,
      envMapIntensity: 0.5,
    });

    const mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = -Math.PI * 0.5;

    const shape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.1));

    super({
      mesh,
      shape,
      position: { x: 0, y: 0, z: 0 },
      mass: 0,
      world: config.world,
      scene: config.scene,
    });

    this.physics.position.set(0, -0.1, 0);
    this.physics.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  }
}
