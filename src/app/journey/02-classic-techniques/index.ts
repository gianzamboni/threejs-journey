import { Section } from "#/app/types/exercise";
import { LightsExercise } from "./01-lights";
import { Shadows } from "./02-shadows";
import { BakedShadow } from "./03-baked-shadow";
import { HauntedHouse } from "./04-haunted-house";
import { Particles } from "./05-particles";
import { GalaxyGenerator } from "./06-galaxy-generator";
import { ScrollBasedAnimation } from "./07-scroll-based-animation";

export const CLASSIC_TECHNIQUES: Section = {
  id: 'classic-techniques',
  exercises: [
    LightsExercise,
    Shadows,
    BakedShadow,
    HauntedHouse,
    Particles,
    GalaxyGenerator,
    ScrollBasedAnimation
  ].reverse()
};