import { Section } from "#/app/types/exercise";
import { Physics } from "./01-physics";
import ImportedModels from "./02-imported-models/02-imported-models.ts";

export const ADVANCED_TECHNIQUES: Section = {
  id: 'advanced-techniques',
  exercises: [
    Physics,
    ImportedModels
  ]
}