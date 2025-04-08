import { Section } from "#/app/types/exercise";
import { Physics } from "./01-physics";
import ImportedModels from "./02-imported-models/02-imported-models.ts";
import Raycaster from "./03-raycaster.ts";
import { CustomModelTest } from "./04-custom-models";
import { GroundedSkyboxTest } from "./05-grounded-skybox";
import { RealTimeEnviromentMap } from "./06-real-time-enviroment-map.ts";
import { RealisticRender } from "./07-realistic-render";
import { AnimationMixerTest } from "./08-animation-mixer/index.ts";

export const ADVANCED_TECHNIQUES: Section = {
  id: 'advanced-techniques',
  exercises: [
    Physics,
    ImportedModels,
    Raycaster,
    CustomModelTest,
    GroundedSkyboxTest,
    RealTimeEnviromentMap,
    RealisticRender,
    AnimationMixerTest
  ]
}