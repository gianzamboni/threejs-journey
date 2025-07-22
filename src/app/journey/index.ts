import { Section } from "#/app/types/exercise";
import { getMetadata } from "#/app/utils/exercise-metadata";
import { BASICS } from "./01-basics";
import { CLASSIC_TECHNIQUES } from "./02-classic-techniques";
import { ADVANCED_TECHNIQUES } from "./03-advanced-techniques";
import { SHADERS } from "./04-shaders";
import { EXTRAS } from "./05-extra";

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


export const JOURNEY: Section[] = [
 BASICS,
 CLASSIC_TECHNIQUES,
 ADVANCED_TECHNIQUES, 
 SHADERS,
 EXTRAS,
].reverse();

verifyUniqueExerciseIds(JOURNEY);