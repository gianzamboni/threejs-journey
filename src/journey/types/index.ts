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

export type Exercise = BaseExercise & { 
  id: string; 
  info?: string[];
  isAnimated?: boolean;
  startAnimation?: (view: RenderView) => void;
};
