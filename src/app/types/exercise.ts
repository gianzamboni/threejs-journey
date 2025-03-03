import AnimatedExercise from "#/app/journey/exercises/animated-exercise";
import BaseExercise from "#/app/journey/exercises/base-exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";

export type Exercise = BaseExercise | AnimatedExercise | OrbitControlledExercise;
export type ExerciseClass = new (renderView: RenderView, quality: Quality) => Exercise;

