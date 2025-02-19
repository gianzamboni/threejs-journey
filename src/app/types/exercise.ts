import DebugUI from "../layout/debug-ui";
import { Quality } from "../layout/quality-selector";
import RenderView from "../layout/render-view";

export type ExerciseClass = new (renderView: RenderView, quality: Quality, debugUI? : DebugUI) => any;
export type Exercise = InstanceType<ExerciseClass>;