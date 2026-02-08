import * as CANNON from 'cannon-es';
import { Color, Mesh, MeshStandardMaterial, Scene } from "three";

import { Position3D } from '#/app/types/exercise';

export type CollisionEvent = { contact: CANNON.ContactEquation };

export type PhysicalObjectConfig = {
  mesh: Mesh;
  shape: CANNON.Shape;
  position: Position3D;
  mass?: number;
  world: CANNON.World;
  scene: Scene;
  onCollide?: (event: CollisionEvent) => void;
}

export class PhysicalObject {
  private _mesh: Mesh;
  private _physics: CANNON.Body;
  private _color: Color;
  private _world: CANNON.World;
  private _scene: Scene;
  private _onCollide?: (event: CollisionEvent) => void;

  constructor(config: PhysicalObjectConfig) {
    const { mesh, shape, position, mass = 1, world, scene, onCollide } = config;

    this._mesh = mesh;
    this._color = (mesh.material as MeshStandardMaterial).color;
    this._world = world;
    this._scene = scene;

    const body = new CANNON.Body({ mass, shape });
    body.position.set(position.x, position.y, position.z);

    if (onCollide) {
      this._onCollide = onCollide;
      body.addEventListener('collide', this._onCollide);
    }

    this._physics = body;

    this._world.addBody(this._physics);
    this._scene.add(this._mesh);
  }

  public get mesh(): Mesh {
    return this._mesh;
  }

  public get physics(): CANNON.Body {
    return this._physics;
  }

  public get color(): Color {
    return this._color;
  }

  public sync(): void {
    this._mesh.position.copy(this._physics.position);
    this._mesh.quaternion.copy(this._physics.quaternion);
  }

  public isBelowY(threshold: number): boolean {
    return this._mesh.position.y < threshold;
  }

  public dispose(): void {
    if (this._onCollide) {
      this._physics.removeEventListener('collide', this._onCollide);
    }
    this._world.removeBody(this._physics);
    this._scene.remove(this._mesh);
  }
}
