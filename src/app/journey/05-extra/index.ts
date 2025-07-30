import { Section } from "#/app/types/exercise";
import { PostProcessing } from "./01-post-processing";
import { MixingHtml } from "./02-mixing-html";
import { PortalScene } from "./03-portal-scene";

export const EXTRAS: Section = {
  id: 'extras',
  exercises: [
    PostProcessing,
    MixingHtml,
    PortalScene
  ].reverse()
}
