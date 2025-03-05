import * as THREE from 'three';

import AnimatedExercise from "#/app/journey/exercises/animated-exercise";
import BaseExercise from "#/app/journey/exercises/base-exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";

export type Section = {
  id: string;
  exercises: ExerciseClass[];
}

export type Exercise = BaseExercise | AnimatedExercise | OrbitControlledExercise;

export type Constructor<T> = new (...args: any[]) => T;
export type ExerciseClass = new (renderView: RenderView, quality: Quality) => Exercise;

export type MeshObject = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
}

export type Position2D = {
  x: number;
  y: number;
}

export type Position3D = Position2D & {
  z: number;
}