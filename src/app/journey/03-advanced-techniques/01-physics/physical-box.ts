import * as CANNON from 'cannon-es';
import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from 'three';

import { getRandom3DPosition } from '#/app/utils/random-utils';
import { CollisionEvent, PhysicalObject } from './physical-object';

type PhysicalBoxConfig = {
  geometry: BoxGeometry;
  material: MeshStandardMaterial;
  world: CANNON.World;
  scene: Scene;
  onCollide: (event: CollisionEvent) => void;
}

export class PhysicalBox extends PhysicalObject {
  constructor(config: PhysicalBoxConfig) {
    const width = Math.random();
    const height = Math.random();
    const depth = Math.random();
    const position = getRandom3DPosition();

    const mesh = new Mesh(config.geometry, config.material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(width, height, depth);
    mesh.position.set(position.x, position.y, position.z);

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));

    super({
      mesh,
      shape,
      position,
      world: config.world,
      scene: config.scene,
      onCollide: config.onCollide,
    });
  }
}
