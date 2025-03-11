import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { DebugFPS } from '#/app/decorators/debug';
import { ActionButton, Description, Exercise } from "#/app/decorators/exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { Position3D } from '#/app/types/exercise';
import { AssetLoader } from "#/app/utils/assets-loader";
import { getRandom3DPosition, getRandomValueFrom, randomBetween } from '#/app/utils/random-utils';
import BOX from './icons/cube.svg?raw';
import SPHERE from './icons/sphere.svg?raw';
import REMOVE from './icons/trash.svg?raw';
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


type PhysicalObject = {
  mesh: THREE.Mesh;
  physics: CANNON.Body;
  color?: string;
}

@Exercise('physics')
@Description(["<strong>Buttons above</strong>: Add spheres and boxes to the scene or remove all objects"])
export class Physics extends OrbitControlledExercise {
  
  private static readonly palette = [
    "#ff6a10",
    "#00a1f4",
    "#50ea00",
    "#a249da",
    "#60ff67",
    "#e887ff",
    "#3bffa2",
    "#ff5c74",
    "#00ad8c",
    "#d43a4b",
    "#02b1b5",
    "#cb4266",
    "#f6ffad",
    "#996197",
    "#ffcd64",
    "#c0e3ff",
    "#a96148",
    "#ff89b6",
    "#6c7957",
    "#996952"
  ];

  private environmentMap: THREE.Texture;

  private materials: Record<string, THREE.MeshStandardMaterial>;

  private sphereGeometry: THREE.SphereGeometry;
  private boxGeometry: THREE.BoxGeometry;

  private physicalObjects: PhysicalObject[];

  private floor: PhysicalObject;

  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  private physicsWorld: CANNON.World;

  private hitSound: HTMLAudioElement;
  
  private qualityConfig: QualityConfig;

  constructor(view: RenderView, quality: Quality) {
    super(view);
    
    this.qualityConfig = QUALITY_CONFIG[quality];
    view.enableShadows(this.qualityConfig.shadowMapType);

    this.environmentMap = this.loadEnvironmentMap();

    this.physicsWorld = this.setupPhysics();
    this.materials = {};

    const subdivisions = this.qualityConfig.sphereSubdivisions;
    this.sphereGeometry = new THREE.SphereGeometry(1, subdivisions, subdivisions);
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.physicalObjects = [];

    this.floor = this.createFloor();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
    this.directionalLight = this.createDirectionalLight();

    this.camera.position.set(-3, 3, 3);

    this.physicsWorld.addBody(this.floor.physics);
    this.scene.add(this.floor.mesh, this.ambientLight, this.directionalLight);

    this.hitSound = new Audio('sounds/hit.mp3');
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    const delta = timer.getDelta();
    this.physicsWorld.step(1 / 60, delta, 3);

    for(let i = this.physicalObjects.length - 1; i >= 0; i--) {
      const object = this.physicalObjects[i];
      if(object.mesh.position.y < -20) {
        this.removeObject(object, i);
      } else {
        object.mesh.position.copy(object.physics.position);
        object.mesh.quaternion.copy(object.physics.quaternion);
      }
    }
  }

  public playHitSound(collision: { contact: CANNON.ContactEquation}) {
    const velocity = collision.contact.getImpactVelocityAlongNormal();
    if (velocity > 1.5) {
      this.hitSound.volume = Math.random();
      this.hitSound.currentTime = 0;
      this.hitSound.play();
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
    object.physics.removeEventListener('collide', this.playHitSound.bind(this));
    this.physicsWorld.removeBody(object.physics);
    this.scene.remove(object.mesh);
    this.physicalObjects.splice(index, 1);
  }


  private createPhysicalObject(mesh: THREE.Mesh, shape: CANNON.Shape, position: Position3D) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(position);
    this.scene.add(mesh);

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
    });

    body.addEventListener('collide', this.playHitSound.bind(this));
    body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
    this.physicsWorld.addBody(body);

    const color = (mesh.material as THREE.MeshStandardMaterial).color.getHexString();
    return { mesh, physics: body, color };
  }

  private createBox(width: number, height: number, depth: number, position: Position3D) {
    const material = this.getMaterial();
    const mesh = new THREE.Mesh(this.boxGeometry, material);
    mesh.scale.set(width, height, depth);

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
    return this.createPhysicalObject(mesh, shape, position);
  }

  private createSphere(radius: number, position: Position3D) {
    const material = this.getMaterial();
    const mesh = new THREE.Mesh(this.sphereGeometry, material);
    mesh.scale.set(radius, radius, radius);

    const shape = new CANNON.Sphere(radius);
    return this.createPhysicalObject(mesh, shape, position);
  }

  private getMaterial() {
    const colorString = getRandomValueFrom(Physics.palette);
    const color = new THREE.Color(colorString);
    if(!this.materials[colorString]) {
      this.materials[colorString] = new THREE.MeshStandardMaterial({ 
        color,
        metalness: 0.3,
        roughness: 0.4,
        envMap: this.environmentMap,
        envMapIntensity: 0.5
      });
    }
    return this.materials[colorString];
  }

  private createFloor() {
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshStandardMaterial({ 
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: this.environmentMap,
      envMapIntensity: 0.5
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = -Math.PI * 0.5;

    const shape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.1));
    const body = new CANNON.Body();
    body.mass  = 0;
    body.position.set(0, -0.1, 0);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
    body.addShape(shape);    
    return { mesh, physics: body };
  }

  private createDirectionalLight() {
    const light = new THREE.DirectionalLight(0xffffff, 0.6);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.far = 15;
    light.shadow.camera.left = - 7;
    light.shadow.camera.top = 7;
    light.shadow.camera.right = 7;
    light.shadow.camera.bottom = - 7;
    light.position.set(5, 5, 5);
    return light;
  }

  private loadEnvironmentMap() {
    const assetLoader = AssetLoader.getInstance();
    const textureFolder = 'textures/environmentMap/0';
    const urls = ['px', 'nx', 'py', 'ny', 'pz', 'nz']
      .map(suffix => `${textureFolder}/${suffix}.png`);
    return assetLoader.loadCubeTexture(urls);
  }

  async dispose() {
    await super.dispose();
    this.environmentMap.dispose();
    this.floor.mesh.geometry.dispose();
    (this.floor.mesh.material as THREE.Material).dispose();

    for (const sphere of this.physicalObjects) {
      sphere.mesh.geometry.dispose();
      (sphere.mesh.material as THREE.Material).dispose();
    }

    for (const material of Object.values(this.materials)) {
      material.dispose();
    }
  }
}