import { Section } from "#/app/types/exercise";
import { Shaders } from "./01-introduction";
import { Patterns } from "./02-patterns";
import { RagingSea } from "./03-raging-sea";

export const SHADERS: Section = {
  id: 'shaders',
  exercises: [
    Shaders,
    Patterns,
    RagingSea,
  ]
}
