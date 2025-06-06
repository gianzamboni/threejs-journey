import { 
  BufferGeometry,
  Material,
  Mesh
} from 'three';

import AnimatedExercise from "#/app/journey/exercises/animated-exercise";
import BaseExercise from "#/app/journey/exercises/base-exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";

import { ActionBar } from '../layout/action-bar';

export interface Action {
  type: string;
  label: string;
}


export interface ButtonAction extends Action {
  type: 'button';
  icon: string;
  customClasses?: string;
  onClick: () => void;
}

export interface SelectableAction extends Action {
  type: 'selectable';
  options: Record<string, string>;
  defaultValue: string;
  onChange: (evt: CustomEvent) => void;
}

export type Section = {
  id: string;
  exercises: ExerciseClass[];
}


export type ExtraConfig = {
  quality: Quality;
  layoutComponents: {
    actionBar: ActionBar;
  }
}

export type Exercise = BaseExercise | AnimatedExercise | OrbitControlledExercise;

export type Constructor<T> = new (...args: any[]) => T;
export type ExerciseClass = new (renderView: RenderView, extraConfig: ExtraConfig) => Exercise;

export type MeshObject = {
  geometry: BufferGeometry;
  material: Material;
  mesh: Mesh;
}

export type Position2D = {
  x: number;
  y: number;
}

export type Position3D = Position2D & {
  z: number;
}