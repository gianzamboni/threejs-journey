import { Section } from "#/app/types/exercise";
import { Shaders } from "./01-introduction";
import { Patterns } from "./02-patterns";
import { RagingSea } from "./03-raging-sea";
import { AnimatedGalaxy } from "./04-animated-galaxy";
import { ModifiedMaterials } from "./05-modified-material";
import { CoffeeSmoke } from "./06-coffee-smoke";
import { Hologram } from "./07-hologram";
import Fireworks from "./08-fireworks";
import { LightsShaders } from "./09-lights-shaders";
import { RagingSeaV2 } from "./10-raging-sea-2";
import { HalftoneShading } from "./11-halftone-shading";

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
    Fireworks,
    LightsShaders,
    RagingSeaV2,
    HalftoneShading,
  ]
}
