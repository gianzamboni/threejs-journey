import { AnimationLoop } from "@/utils/animation-loop";
import BaseExercise from "../../constants/exercises/base-exercise";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import AnimatedExercise from "@/constants/exercises/animated-exercise";
import OrbitControlledExercise from "@/constants/exercises/orbit-controlled-exercise";

export type ExerciseSettings = {
  id: string;
  description?: string;
  enableOrbitControls?: boolean;
}

export type CameraSettings = {
  initialPosition?: [number, number, number];
}

export type ViewSettings = {
  camera?: CameraSettings;
}

export type ExerciseClass = (new (...args: any) => BaseExercise) & { 
  id: string;
};

export type Exercise = BaseExercise  | AnimatedExercise | OrbitControlledExercise;

export type ExtraProperties = {
  animationLoop?: AnimationLoop;
  debugInfo?: DebugInfo;
  description: string[];
  orbitControls?: OrbitControls;
}

export type DebugInfo = {
  fpsMethod?: string;
}

export type Settings = {
  sceneMeshes?: string[];
  animationMethod?: string;
  debugInfo?: DebugInfo
}