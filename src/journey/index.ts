import { CenteredCube } from "./01-basics/01-centered-cube";
import { ExerciseClass } from "./types";
import { CubeGroup } from "./01-basics/02-cube-group";
import { RotatingCube } from "./01-basics/03-rotating-cube";
import { OrbitControlsTest } from "./01-basics/04-orbit-controls";
//import { OrbitControlCube } from "./01-basics/04-orbit-controls";
//import { ExerciseClass } from "./types";


export type Section = {
  id: string;
  exercises: ExerciseClass[];
}

export const JOURNEY: Section[] = [{
  id: 'basics',

  exercises: [ 
    CenteredCube,
    CubeGroup,
    RotatingCube,
    OrbitControlsTest
  ]
}];

/* {
  id: 'transform-objects',
  generator: null,
}, {
  id: 'animations',
  generator: null,
}, {
  id: 'cameras',
  generator: null,
}, {
  id: 'geometries',
  generator: null,
}, {
  id: 'debug-ui',
  generator: null,
}, {
  id: 'textures',
  generator: null,
}, {
  id: 'materials',
  generator: null,
}, {
  id: '3d-text',
  generator: null,
} ],
}, {
id: 'classic-techniques',
exercises: [{
  id: 'lights',
  generator: null,
}, {
  id: 'shadows',
  generator: null,
}, {
  id: 'baked-shadows',
  generator: null,
}, {
  id: 'haunted-house',
  generator: null,
}, {
  id: 'particles',
  generator: null,
}, {
  id: 'galaxy-generator',
  generator: null,
}, {
  id: 'scroll-based-animation',
  generator: null,
}],
}*/