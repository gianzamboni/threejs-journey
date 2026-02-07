import * as CANNON from 'cannon-es';
import {
  BoxGeometry,
  Color,
  MeshStandardMaterial,
  Scene,
  SphereGeometry,
} from 'three';

import { getRandomValueFrom } from '#/app/utils/random-utils';
import { disposeObjects } from '#/app/utils/three-utils';
import colorPalette from './color-palette';
import { PhysicalBox } from './physical-box';
import { PhysicalFloor } from './physical-floor';
import { CollisionEvent } from './physical-object';
import { PhysicalSphere } from './physical-sphere';

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

  public createSphere(): PhysicalSphere {
    return new PhysicalSphere({
      geometry: this.sphereGeometry,
      material: this.getMaterial(),
      world: this.world,
      scene: this.scene,
      onCollide: this.onCollide,
    });
  }

  public createBox(): PhysicalBox {
    return new PhysicalBox({
      geometry: this.boxGeometry,
      material: this.getMaterial(),
      world: this.world,
      scene: this.scene,
      onCollide: this.onCollide,
    });
  }

  public createFloor(): PhysicalFloor {
    return new PhysicalFloor({
      world: this.world,
      scene: this.scene,
      envMap: this.environmentMap.asTexture,
    });
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
