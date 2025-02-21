import AnimatedExercise from "../journey/exercises/animated-exercise";
import BaseExercise from "../journey/exercises/base-exercise";
import OrbitControlledExercise from "../journey/exercises/orbit-controlled-exercise";
import { Quality } from "../layout/quality-selector";
import RenderView from "../layout/render-view";


export type ExerciseClass = new (renderView: RenderView, quality: Quality) => any;
export type Exercise = BaseExercise | AnimatedExercise | OrbitControlledExercise;

