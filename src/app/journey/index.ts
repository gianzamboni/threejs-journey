import { Section } from "#/app/types/exercise";
import { RandomTriangles } from "./01-basics/05-random-triangles";
import { MaterialsTest } from "./01-basics/08-materials";
import { Text3D } from "./01-basics/09-text";
import { CLASSIC_TECHNIQUES } from "./02-classic-techniques";
import { ADVANCED_TECHNIQUES } from "./03-advanced-techniques";
import { BASICS } from "./01-basics";

import { getMetadata } from "../utils/exercise-metadata";

import { isInDevMode } from "../utils";
import { CubeGroup } from "./01-basics/02-cube-group";
import { OrbitControlsTest } from "./01-basics/04-orbit-controls";
import { TextureTest } from "./01-basics/07-textures";

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

export const JOURNEY: Section[] = isInDevMode() ? 
[
 BASICS,
 CLASSIC_TECHNIQUES,
 ADVANCED_TECHNIQUES, 
] : [ 
  {
    id: "three.js-journey",
    exercises: [
      CubeGroup,
      OrbitControlsTest,
      RandomTriangles,
      TextureTest,
      MaterialsTest,
      Text3D,
    ]
  },
  CLASSIC_TECHNIQUES,
  ADVANCED_TECHNIQUES, 
];

verifyUniqueExerciseIds(JOURNEY);