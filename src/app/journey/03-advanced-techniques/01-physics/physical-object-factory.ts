import * as CANNON from 'cannon-es';
import {
  BoxGeometry,
  Color,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
  SphereGeometry,
} from 'three';

import { getRandom3DPosition, getRandomValueFrom, randomBetween } from '#/app/utils/random-utils';
import { disposeObjects } from '#/app/utils/three-utils';
import colorPalette from './color-palette';
import { CollisionEvent, PhysicalObject } from './physical-object';

import { EnvironmentMap } from '../../common/environment-map';

type PhysicalObjectFactoryConfig = {
  world: CANNON.World;
  scene: Scene;
  sphereSubdivisions: number;
  onCollide: (event: CollisionEvent) => void;
}

export class PhysicalObjectFactory {
  private world: CANNON.World;
  private scene: Scene;
  private onCollide: (event: CollisionEvent) => void;

  private environmentMap: EnvironmentMap;
  private materials: Record<string, MeshStandardMaterial>;
  private sphereGeometry: SphereGeometry;
  private boxGeometry: BoxGeometry;

  constructor(config: PhysicalObjectFactoryConfig) {
    this.world = config.world;
    this.scene = config.scene;
    this.onCollide = config.onCollide;

    this.environmentMap = new EnvironmentMap('env-maps/factory', { isCubeTexture: true });
    this.materials = {};

    const subdivisions = config.sphereSubdivisions;
    this.sphereGeometry = new SphereGeometry(1, subdivisions, subdivisions);
    this.boxGeometry = new BoxGeometry(1, 1, 1);
  }

  public createSphere(): PhysicalObject {
    const radius = randomBetween(0.1, 0.5);
    const position = getRandom3DPosition();

    const material = this.getMaterial();
    const mesh = new Mesh(this.sphereGeometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(radius, radius, radius);
    mesh.position.set(position.x, position.y, position.z);

    const shape = new CANNON.Sphere(radius);
    return new PhysicalObject({ mesh, shape, position, world: this.world, scene: this.scene, onCollide: this.onCollide });
  }

  public createBox(): PhysicalObject {
    const width = Math.random();
    const height = Math.random();
    const depth = Math.random();
    const position = getRandom3DPosition();

    const material = this.getMaterial();
    const mesh = new Mesh(this.boxGeometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(width, height, depth);
    mesh.position.set(position.x, position.y, position.z);

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
    return new PhysicalObject({ mesh, shape, position, world: this.world, scene: this.scene, onCollide: this.onCollide });
  }

  public createFloor(): PhysicalObject {
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
      world: this.world,
      scene: this.scene,
    });

    floor.physics.position.set(0, -0.1, 0);
    floor.physics.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

    return floor;
  }

  private getMaterial(): MeshStandardMaterial {
    const colorString = getRandomValueFrom(colorPalette);
    const color = new Color(colorString);
    if (!this.materials[colorString]) {
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

  public dispose(): void {
    disposeObjects(this.environmentMap, ...Object.values(this.materials));
  }
}
