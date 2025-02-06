import { CenteredCube } from "./01-basics/01-centered-cube";
import { CubeGroup } from "./01-basics/02-cube-group";
import { RotatingCube } from "./01-basics/03-rotating-cube";
import { Exercise } from "./types";

export type Section = {
  id: string;
  exercises: Exercise[];
}

export const JOURNEY: Section[] = [{
  id: 'basics',

  exercises: [ 
    CenteredCube as any,
    CubeGroup,
    RotatingCube
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