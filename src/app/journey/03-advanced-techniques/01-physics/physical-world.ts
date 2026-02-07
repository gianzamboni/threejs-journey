import * as CANNON from 'cannon-es';
import { Scene } from 'three';

import { CollisionSound } from './collision-sound';
import { CollisionEvent, PhysicalObject } from './physical-object';
import { PhysicalObjectFactory } from './physical-object-factory';

type PhysicalWorldConfig = {
  scene: Scene;
  sphereSubdivisions: number;
}

export class PhysicalWorld {
  private world: CANNON.World;
  private physicalObjects: PhysicalObject[];
  private floor: PhysicalObject;
  private collisionSound: CollisionSound;
  private factory: PhysicalObjectFactory;

  constructor(config: PhysicalWorldConfig) {
    this.world = this.createWorld();
    this.collisionSound = new CollisionSound();

    this.factory = new PhysicalObjectFactory({
      world: this.world,
      scene: config.scene,
      sphereSubdivisions: config.sphereSubdivisions,
      onCollide: this.playHitSound.bind(this),
    });

    this.physicalObjects = [];
    this.floor = this.factory.createFloor();
  }

  public update(delta: number): void {
    this.world.step(1 / 60, delta, 3);

    for (let i = this.physicalObjects.length - 1; i >= 0; i--) {
      const object = this.physicalObjects[i];
      if (object.isBelowY(-20)) {
        this.removeObject(object, i);
      } else {
        object.sync();
      }
    }
  }

  public addSphere(): void {
    const sphere = this.factory.createSphere();
    this.physicalObjects.push(sphere);
  }

  public addBox(): void {
    const box = this.factory.createBox();
    this.physicalObjects.push(box);
  }

  public clearScene(): void {
    for (let i = this.physicalObjects.length - 1; i >= 0; i--) {
      this.removeObject(this.physicalObjects[i], i);
    }
  }

  public dispose(): void {
    this.clearScene();
    this.floor.dispose();
    this.factory.dispose();
  }

  private playHitSound(collision: CollisionEvent): void {
    const velocity = collision.contact.getImpactVelocityAlongNormal();
    if (velocity > 1.5) {
      this.collisionSound.play();
    }
  }

  private removeObject(object: PhysicalObject, index: number): void {
    object.dispose();
    this.physicalObjects.splice(index, 1);
  }

  private createWorld(): CANNON.World {
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    const material = new CANNON.Material('default');
    const contactMaterial = new CANNON.ContactMaterial(material, material, {
      friction: 0.1,
      restitution: 0.7,
    });

    world.defaultContactMaterial = contactMaterial;
    return world;
  }
}
