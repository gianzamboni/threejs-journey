import { Section } from "#/app/types/exercise";
import { Physics } from "./01-physics";
import ImportedModels from "./02-imported-models/02-imported-models.ts";
import Raycaster from "./03-raycaster.ts";
import { CustomModelTest } from "./04-custom-models";
export const ADVANCED_TECHNIQUES: Section = {
  id: 'advanced-techniques',
  exercises: [
    Physics,
    ImportedModels,
    Raycaster,
    CustomModelTest
  ]
}