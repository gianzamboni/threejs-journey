import * as CANNON from 'cannon-es';
import { 
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  BoxGeometry,
  Color,
  PlaneGeometry
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { CustomizableQuality, DebugFPS } from '#/app/decorators/debug';
import { ActionButton, Description, Exercise, Starred } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from '#/app/layout/render-view';
import { ExtraConfig, Position3D } from '#/app/types/exercise';
import { getRandom3DPosition, getRandomValueFrom, randomBetween } from '#/app/utils/random-utils';
import { disposeObjects } from '#/app/utils/three-utils';
import { CSS_CLASSES } from '#/theme';
import { CollisionSound } from './collision-sound';
import colorPalette from './color-palette';
import BOX from './icons/cube.svg?raw';
import SPHERE from './icons/sphere.svg?raw';
import REMOVE from './icons/trash.svg?raw';
import { Lighting } from './lighting';
import { CollisionEvent, PhysicalObject } from './physical-object';
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";

import { EnvironmentMap } from '../../common/environment-map';

@Exercise('physics')
@Starred
@Description(
  "<p style='margin-bottom: 10px;'>Physics Demo. It shows some objects falling and colliding with each other.</p>",
  "<p>For the physics engine I used <a href='https://pmndrs.github.io/cannon-es/' target='_blank'>cannon-es</a></p>",
  `<p><strong>Buttons above:</strong> <span class='${CSS_CLASSES.light_text}'>Add spheres and boxes to the scene or remove all objects</span></p>`
)
@CustomizableQuality
export class Physics extends OrbitControlledExercise {
  private environmentMap: EnvironmentMap;

  private materials: Record<string, MeshStandardMaterial>;

  private sphereGeometry: SphereGeometry;
  private boxGeometry: BoxGeometry;

  private physicalObjects: PhysicalObject[];

  private floor: PhysicalObject;

  private lighting: Lighting;

  private physicsWorld: CANNON.World;

  private collisionSound: CollisionSound;
  private boundPlayHitSound: (event: CollisionEvent) => void;
  
  private qualityConfig: QualityConfig;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);
    
    this.qualityConfig = QUALITY_CONFIG[extraConfig.quality];
    view.enableShadows(this.qualityConfig.shadowMapType);

    this.environmentMap = new EnvironmentMap('env-maps/factory', { isCubeTexture: true });

    this.physicsWorld = this.setupPhysics();
    this.materials = {};

    const subdivisions = this.qualityConfig.sphereSubdivisions;
    this.sphereGeometry = new SphereGeometry(1, subdivisions, subdivisions);
    this.boxGeometry = new BoxGeometry(1, 1, 1);
    this.physicalObjects = [];

    this.floor = this.createFloor();

    this.lighting = new Lighting();

    this.camera.position.set(-3, 3, 3);

    this.lighting.setup(this.scene);
    this.collisionSound = new CollisionSound();
    this.boundPlayHitSound = this.playHitSound.bind(this);

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
    const radius = randomBetween(0.1, 0.5);
    const position = getRandom3DPosition();
    const sphere = this.createSphere(radius, position);
    this.physicalObjects.push(sphere);
  }

  @ActionButton('Add Box', BOX)
  public addBox() {
    const width = Math.random();
    const height = Math.random();
    const depth = Math.random();
    const position = getRandom3DPosition();

    const box = this.createBox(width, height, depth, position);
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

  private createBox(width: number, height: number, depth: number, position: Position3D) {
    const material = this.getMaterial();
    const mesh = new Mesh(this.boxGeometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(width, height, depth);
    mesh.position.set(position.x, position.y, position.z);

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
    return new PhysicalObject({ mesh, shape, position, world: this.physicsWorld, scene: this.scene, onCollide: this.boundPlayHitSound });
  }

  private createSphere(radius: number, position: Position3D) {
    const material = this.getMaterial();
    const mesh = new Mesh(this.sphereGeometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(radius, radius, radius);
    mesh.position.set(position.x, position.y, position.z);

    const shape = new CANNON.Sphere(radius);
    return new PhysicalObject({ mesh, shape, position, world: this.physicsWorld, scene: this.scene, onCollide: this.boundPlayHitSound });
  }

  private getMaterial() {
    const colorString = getRandomValueFrom(colorPalette);
    const color = new Color(colorString);
    if(!this.materials[colorString]) {
      this.materials[colorString] = new MeshStandardMaterial({ 
        color,
        metalness: 0.3,
        roughness: 0.4,
        envMap: this.environmentMap.asTexture,
        envMapIntensity: 0.5
      });
    }
    return this.materials[colorString];
  }

  private createFloor(): PhysicalObject {
    const geometry = new PlaneGeometry(10, 10);
    const material = new MeshStandardMaterial({ 
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: this.environmentMap.asTexture,
      envMapIntensity: 0.5
    });

    const mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = -Math.PI * 0.5;

    const shape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.1));
    const floor = new PhysicalObject({
      mesh,
      shape,
      position: { x: 0, y: 0, z: 0 },
      mass: 0,
      world: this.physicsWorld,
      scene: this.scene,
    });

    floor.physics.position.set(0, -0.1, 0);
    floor.physics.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

    return floor;
  }

  async dispose() {
    await super.dispose();
    this.physicalObjects.forEach((object, index) => {
      this.removeObject(object, index);
    });
    disposeObjects(this.environmentMap, ...Object.values(this.materials));
    this.floor.dispose();
  }
}