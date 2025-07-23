import { Section } from "#/app/types/exercise";
import { PostProcessing } from "./01-post-processing";
import { MixingHtml } from "./02-mixing-html";

export const EXTRAS: Section = {
  id: 'extras',
  exercises: [
    PostProcessing,
    MixingHtml
  ].reverse()
}
