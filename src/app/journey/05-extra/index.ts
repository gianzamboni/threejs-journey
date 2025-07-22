import { Section } from "#/app/types/exercise";
import { PostProcessing } from "./01-post-processing";

export const EXTRAS: Section = {
  id: 'extras',
  exercises: [
    PostProcessing,
  ].reverse()
}
