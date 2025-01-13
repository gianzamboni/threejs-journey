import { CenteredCube } from "./basics/centered-cube";

export type Exercise = {
  id: string;
  generator: Function;
}

export type Section = {
  id: string;
  exercises: Exercise[];
}


export const JOURNEY: Section[] = [{
  id: 'basics',
  exercises: [ {
    id: 'first-threejs-project',
    generator: CenteredCube,
  }],
}];