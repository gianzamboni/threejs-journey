import BaseExercise from "../exercises/base-exercise";
import AnimatedExercise from "@/app/journey/exercises/animated-exercise";
import OrbitControlledExercise from "@/app/journey/exercises/orbit-controlled-exercise";
import GUI from "lil-gui";

export type ExerciseClass = (new (...args: any) => BaseExercise) & { 
  id: string;
  isCustomizable?: boolean;
  buildGui?: (gui: GUI) => void;
};

export type Exercise = BaseExercise  | AnimatedExercise | OrbitControlledExercise;
