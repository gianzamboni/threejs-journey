import BaseExercise from "../exercises/base-exercise";
import AnimatedExercise from "@/app/journey/exercises/animated-exercise";
import OrbitControlledExercise from "@/app/journey/exercises/orbit-controlled-exercise";
import DebugUI from "@/app/layout/debug-ui";
import { Quality } from "@/app/layout/quality-selector";
import RenderView from "@/app/layout/render-view";

export type Exercise = BaseExercise  | AnimatedExercise | OrbitControlledExercise;

export interface ExerciseClass {
  new(view: RenderView, quality: Quality, debugUi?: DebugUI) : BaseExercise;
  id: string;
}

