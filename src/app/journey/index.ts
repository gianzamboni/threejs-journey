import { getMetadata } from "../decorators/exercise";
import { ExerciseClass } from "../types/exercise";
import { CenteredCube } from "./01-basics/01-centered-cube";
import { CubeGroup } from "./01-basics/02-cube-group";
import { RotatingCube } from "./01-basics/03-rotating-cube";
import { OrbitControlsTest } from "./01-basics/04-orbit-controls";
import { RandomTraingles } from "./01-basics/05-random-triangles";
import { DebugUITest } from "./01-basics/06-debug-ui";
import { TextureTest } from "./01-basics/07-textures";
import { MaterialsTest } from "./01-basics/08-materials";
import { Text3D } from "./01-basics/09-text";
import { LightsExercise } from "./02-classic-techniques/01-lights";

function verifyUniqueExerciseIds(sections: Section[]) {
  const ids = new Set<string>();
  sections.forEach(section => {
    section.exercises.forEach(exercise => {
      const meta = getMetadata(exercise);
      if (ids.has(meta.id)) {
        throw new Error(`Duplicate exercise id: ${meta.id}`);
      }
      ids.add(meta.id);
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
    RandomTraingles,
    DebugUITest,
    TextureTest,
    MaterialsTest,
    Text3D
  ]
}, {
  id: 'classic-techniques',
  exercises: [
    LightsExercise,
    // Shadows,
    // BakedShadows,
    // HauntedHouse,
    // Particles,
    // GalaxyGenerator,
    // ScrollBasedAnimation
  ]
}];

verifyUniqueExerciseIds(JOURNEY);