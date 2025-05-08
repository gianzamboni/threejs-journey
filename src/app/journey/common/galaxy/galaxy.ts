import { randomSign } from "#/app/utils/random-utils";
import { BufferGeometry, Points, Material, PerspectiveCamera } from "three";


export type GalaxyParams = {
  count: number;
  size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  insideColor: string;
  outsideColor: string;
}

export const GALAXY_DEFAULT_SETTINGS: GalaxyParams = {
  count: 100000,
  size: 0.01,
  radius: 10,
  branches: 5,
  spin: 1,
  randomness: 2,
  randomnessPower: 5,
  insideColor: '#ff6030',
  outsideColor: '#0048bd'
}


export interface Galaxy<T extends Material> {
  geometry: BufferGeometry;
  material: T;
  points: Points;
}

export function configureCamera(camera: PerspectiveCamera) {
  camera.position.set(3,2,3);
  camera.near = 0.001;
}

export function randomDisplacement(radius: number, randomnessPower: number, randomness: number) {
  return Math.pow(Math.random(), randomnessPower) * (randomSign() * randomness * radius);
}
