import * as CANNON from 'cannon-es';
import { Mesh, MeshStandardMaterial, Scene, SphereGeometry } from 'three';

import { getRandom3DPosition, randomBetween } from '#/app/utils/random-utils';
import { CollisionEvent, PhysicalObject } from './physical-object';

type PhysicalSphereConfig = {
  geometry: SphereGeometry;
  material: MeshStandardMaterial;
  world: CANNON.World;
  scene: Scene;
  onCollide: (event: CollisionEvent) => void;
}

export class PhysicalSphere extends PhysicalObject {
  constructor(config: PhysicalSphereConfig) {
    const radius = randomBetween(0.1, 0.5);
    const position = getRandom3DPosition();

    const mesh = new Mesh(config.geometry, config.material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(radius, radius, radius);
    mesh.position.set(position.x, position.y, position.z);

    const shape = new CANNON.Sphere(radius);

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
