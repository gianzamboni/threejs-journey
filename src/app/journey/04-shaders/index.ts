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
import { EarthShaders } from "./12-earth-shaders";
import { InteractiveParticles } from "./13-interactive-particles";
import { ParticleMorphing } from "./14-particle-morphing";
import { GPGPUFlowFields } from "./15-gpgpu-flow-fields";
import { WobblySphere } from "./16-wobbly-sphere";

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
    EarthShaders,
    InteractiveParticles,
    ParticleMorphing,
    GPGPUFlowFields,
    WobblySphere,
  ]
}
