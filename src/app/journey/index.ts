import { Section } from "#/app/types/exercise";
import { getMetadata } from "#/app/utils/exercise-metadata";
import { BASICS } from "./01-basics";
import { CenteredCube } from "./01-basics/01-centered-cube";
import { CubeGroup } from "./01-basics/02-cube-group";
import { RotatingCube } from "./01-basics/03-rotating-cube";
import { OrbitControlsTest } from "./01-basics/04-orbit-controls";
import { RandomTriangles } from "./01-basics/05-random-triangles";
import { DebugUITest } from "./01-basics/06-debug-ui";
import { TextureTest } from "./01-basics/07-textures";
import { MaterialsTest } from "./01-basics/08-materials";
import { Text3D } from "./01-basics/09-text";
import { CLASSIC_TECHNIQUES } from "./02-classic-techniques";
import { ADVANCED_TECHNIQUES } from "./03-advanced-techniques";
import { SHADERS } from "./04-shaders";

function verifyUniqueExerciseIds(sections: Section[]) {
  const ids = new Set<string>();
  for(const section of sections) {
    for(const exercise of section.exercises) {
      const metadata = getMetadata(exercise);
      if(metadata.id === undefined) throw new Error('Exercise id is undefined');
      
      const id = metadata.id;
      if (ids.has(id)) throw new Error(`Duplicate exercise id: ${id}`);
      ids.add(id);
    }
  }
}

const SELECTED_EXERCISE: Section = {
  id: 'selected-demos',
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
};

export const JOURNEY: Section[] = [
 SELECTED_EXERCISE,
 BASICS,
 CLASSIC_TECHNIQUES,
 ADVANCED_TECHNIQUES, 
 SHADERS
];

verifyUniqueExerciseIds(JOURNEY);