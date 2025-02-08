import { CenteredCube } from "./01-basics/01-centered-cube";
import { ExerciseClass } from "./types";
import { CubeGroup } from "./01-basics/02-cube-group";
import { RotatingCube } from "./01-basics/03-rotating-cube";
import { OrbitControlsTest } from "./01-basics/04-orbit-controls";
import { RandomTraingles } from "./01-basics/05-random-triangles";
//import { OrbitControlCube } from "./01-basics/04-orbit-controls";
//import { ExerciseClass } from "./types";

function verifyUniqueExerciseIds(sections: Section[]) {
  const ids = new Set<string>();
  sections.forEach(section => {
    section.exercises.forEach(exercise => {
      if (ids.has(exercise.id)) {
        throw new Error(`Duplicate exercise id: ${exercise.id}`);
      }
      ids.add(exercise.id);
    });
  });
}

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
    OrbitControlsTest,
    RandomTraingles
  ]
}];

verifyUniqueExerciseIds(JOURNEY);
/* {
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