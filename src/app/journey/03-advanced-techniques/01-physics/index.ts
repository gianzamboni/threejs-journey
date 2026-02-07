import * as CANNON from 'cannon-es';

import { Timer } from 'three/addons/misc/Timer.js';

import { CustomizableQuality, DebugFPS } from '#/app/decorators/debug';
import { ActionButton, Description, Exercise, Starred } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from '#/app/layout/render-view';
import { ExtraConfig } from '#/app/types/exercise';
import { CSS_CLASSES } from '#/theme';
import { CollisionSound } from './collision-sound';
import BOX from './icons/cube.svg?raw';
import SPHERE from './icons/sphere.svg?raw';
import REMOVE from './icons/trash.svg?raw';
import { Lighting } from './lighting';
import { CollisionEvent, PhysicalObject } from './physical-object';
import { PhysicalObjectFactory } from './physical-object-factory';
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";

@Exercise('physics')
@Starred
@Description(
  "<p style='margin-bottom: 10px;'>Physics Demo. It shows some objects falling and colliding with each other.</p>",
  "<p>For the physics engine I used <a href='https://pmndrs.github.io/cannon-es/' target='_blank'>cannon-es</a></p>",
  `<p><strong>Buttons above:</strong> <span class='${CSS_CLASSES.light_text}'>Add spheres and boxes to the scene or remove all objects</span></p>`
)
@CustomizableQuality
export class Physics extends OrbitControlledExercise {
  private physicalObjects: PhysicalObject[];

  private floor: PhysicalObject;

  private lighting: Lighting;

  private physicsWorld: CANNON.World;

  private collisionSound: CollisionSound;

  private qualityConfig: QualityConfig;

  private factory: PhysicalObjectFactory;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);
    
    this.qualityConfig = QUALITY_CONFIG[extraConfig.quality];
    view.enableShadows(this.qualityConfig.shadowMapType);

    this.physicsWorld = this.setupPhysics();
    this.collisionSound = new CollisionSound();

    this.factory = new PhysicalObjectFactory({
      world: this.physicsWorld,
      scene: this.scene,
      sphereSubdivisions: this.qualityConfig.sphereSubdivisions,
      onCollide: this.playHitSound.bind(this),
    });

    this.physicalObjects = [];
    this.floor = this.factory.createFloor();

    this.lighting = new Lighting();
    this.camera.position.set(-3, 3, 3);
    this.lighting.setup(this.scene);

  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    const delta = timer.getDelta();
    this.physicsWorld.step(1 / 60, delta, 3);

    for(let i = this.physicalObjects.length - 1; i >= 0; i--) {
      const object = this.physicalObjects[i];
      if(object.isBelowY(-20)) {
        this.removeObject(object, i);
      } else {
        object.sync();
      }
    }
  }

  public playHitSound(collision: CollisionEvent) {
    const velocity = collision.contact.getImpactVelocityAlongNormal();
    if (velocity > 1.5) {
      this.collisionSound.play();
    }
  }

  private setupPhysics() {
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

  @ActionButton('Add Sphere', SPHERE)
  public addSphere() {
    const sphere = this.factory.createSphere();
    this.physicalObjects.push(sphere);
  }

  @ActionButton('Add Box', BOX)
  public addBox() {
    const box = this.factory.createBox();
    this.physicalObjects.push(box);
  }

  @ActionButton('Remove All', REMOVE)
  public clearScene() {
    for(let i = this.physicalObjects.length - 1; i >= 0; i--) {
      this.removeObject(this.physicalObjects[i], i);
    }
  }

  public removeObject(object: PhysicalObject, index: number) {
    object.dispose();
    this.physicalObjects.splice(index, 1);
  }

  async dispose() {
    await super.dispose();
    this.physicalObjects.forEach((object, index) => {
      this.removeObject(object, index);
    });
    this.floor.dispose();
    this.factory.dispose();
  }
}
