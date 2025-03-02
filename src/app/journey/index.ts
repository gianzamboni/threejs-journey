import { CenteredCube } from "#/app/journey/01-basics/01-centered-cube";
import { CubeGroup } from "#/app/journey/01-basics/02-cube-group";
import { RotatingCube } from "#/app/journey/01-basics/03-rotating-cube";
import { OrbitControlsTest } from "#/app/journey/01-basics/04-orbit-controls";
import { RandomTriangles } from "#/app/journey/01-basics/05-random-triangles";
import { DebugUITest } from "#/app/journey/01-basics/06-debug-ui";
import { TextureTest } from "#/app/journey/01-basics/07-textures";
import { MaterialsTest } from "#/app/journey/01-basics/08-materials";
import { Text3D } from "#/app/journey/01-basics/09-text";
import { LightsExercise } from "#/app/journey/02-classic-techniques/01-lights";
import { ExerciseClass } from "#/app/types/exercise";
import * as ExerciseMetadata from "#/app/utils/exercise-metadata";
import { Shadows } from "./02-classic-techniques/02-shadows";
import { BakedShadow } from "./02-classic-techniques/03-baked-shadow";
import { HauntedHouse } from "./02-classic-techniques/04-haunted-house";
function verifyUniqueExerciseIds(sections: Section[]) {
  const ids = new Set<string>();
  for(const section of sections) {
    for(const exercise of section.exercises) {
      const metadata = ExerciseMetadata.get(exercise);
      if(metadata.id === undefined) throw new Error('Exercise id is undefined');
      
      const id = metadata.id;
      if (ids.has(id)) throw new Error(`Duplicate exercise id: ${id}`);
      ids.add(id);
    }
  }
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
    RandomTriangles,
    DebugUITest,
    TextureTest,
    MaterialsTest,
    Text3D
  ]
}, {
  id: 'classic-techniques',
  exercises: [
    LightsExercise,
    Shadows,
    BakedShadow,
    HauntedHouse,
    // Particles,
    // GalaxyGenerator,
    // ScrollBasedAnimation
  ]
}];

verifyUniqueExerciseIds(JOURNEY);