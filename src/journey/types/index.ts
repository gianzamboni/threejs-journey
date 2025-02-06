import BaseExercise from "../base-exercise";
import RenderView from "@/layout/render-view";

export type ExerciseSettings = {
  id: string;
  description?: string;
}

export type CameraSettings = {
  initialPosition?: [number, number, number];
}

export type ViewSettings = {
  camera?: CameraSettings;
}

export type ExerciseClass = Function & {
  id: string;
  description?: string[];
};

export type Exercise = BaseExercise & { 
  isAnimated?: boolean;
  isDebuggable?: boolean;
  startAnimation?: (view: RenderView) => void;
  toggleDebug?: () => void;
};
