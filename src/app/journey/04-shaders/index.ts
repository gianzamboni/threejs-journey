import { Section } from "#/app/types/exercise";
import { Shaders } from "./01-introduction";
import { Patterns } from "./02-patterns";
import { RagingSea } from "./03-raging-sea";
import { AnimatedGalaxy } from "./04-animated-galaxy";
import { ModifiedMaterials } from "./05-modified-material";
import { CoffeeSmoke } from "./06-coffee-smoke";
import { Hologram } from "./07-hologram";

export const SHADERS: Section = {
  id: 'shaders',
  exercises: [
    Shaders,
    Patterns,
    RagingSea,
    AnimatedGalaxy,
    ModifiedMaterials,
    CoffeeSmoke,
    Hologram,
  ]
}
