import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { DebugFPS } from '#/app/decorators/debug';
import { Exercise, OrbitControllerDescription } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { Position3D } from '#/app/types/exercise';
import { AssetLoader } from "#/app/utils/assets-loader";
import { PhysicsLayout } from "./layout";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

type PhysicalObject = {
  mesh: THREE.Mesh;
  physics: CANNON.Body;
}

@Exercise('physics')
@OrbitControllerDescription()
export class Physics extends OrbitControlledExercise {
  
  private layout: PhysicsLayout;

  private environmentMap: THREE.Texture;

  private material: THREE.MeshStandardMaterial;

  private sphereGeometry: THREE.SphereGeometry;
  private boxGeometry: THREE.BoxGeometry;

  private physicalObjects: PhysicalObject[];

  private floor: PhysicalObject;

  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  private physicsWorld: CANNON.World;

  private hitSound: HTMLAudioElement;

  constructor(view: RenderView) {
    super(view);
    view.enableShadows(THREE.PCFSoftShadowMap);

    this.layout = new PhysicsLayout();

    this.layout.sphereButton.addEventListener('click', this.addSphere.bind(this));
    this.layout.boxButton.addEventListener('click', this.addBox.bind(this));
    this.layout.removeButton.addEventListener('click', this.clearScene.bind(this));

    this.environmentMap = this.loadEnvironmentMap();

    this.physicsWorld = this.setupPhysics();
    
    this.material = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: this.environmentMap,
      envMapIntensity: 0.5
    });

    this.sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
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

    for (const object of this.physicalObjects) {
      object.mesh.position.copy(object.physics.position);
      object.mesh.quaternion.copy(object.physics.quaternion);
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

  public addSphere() {
    const radius = Math.random() * 0.5;
    const position = this.getRandomPosition();
    const sphere = this.createSphere(radius, position);
    this.physicalObjects.push(sphere);
  }

  public addBox() {
    const width = Math.random();
    const height = Math.random();
    const depth = Math.random();
    const position = this.getRandomPosition();

    const box = this.createBox(width, height, depth, position);
    this.physicalObjects.push(box);
  }

  private getRandomPosition() {
    return {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }
  }

  public clearScene() {
    for (const object of this.physicalObjects) {
      object.physics.removeEventListener('collide', this.playHitSound.bind(this));
      this.physicsWorld.removeBody(object.physics);
      this.scene.remove(object.mesh);
    }
    this.physicalObjects = [];
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
    return { mesh, physics: body };
  }

  private createBox(width: number, height: number, depth: number, position: Position3D) {
    const mesh = new THREE.Mesh(this.boxGeometry, this.material);
    mesh.scale.set(width, height, depth);

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
    return this.createPhysicalObject(mesh, shape, position);
  }


  private createSphere(radius: number, position: Position3D) {
    const mesh = new THREE.Mesh(this.sphereGeometry, this.material);
    mesh.scale.set(radius, radius, radius);

    const shape = new CANNON.Sphere(radius);
    return this.createPhysicalObject(mesh, shape, position);
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

    const shape = new CANNON.Plane();
    const body = new CANNON.Body();
    body.mass  = 0;
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
    this.layout.remove();
    this.environmentMap.dispose();
    this.floor.mesh.geometry.dispose();
    (this.floor.mesh.material as THREE.Material).dispose();

    for (const sphere of this.physicalObjects) {
      sphere.mesh.geometry.dispose();
      (sphere.mesh.material as THREE.Material).dispose();
    }
  }
}