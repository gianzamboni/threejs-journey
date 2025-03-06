import { Section } from "#/app/types/exercise";
import { CenteredCube } from "./01-centered-cube";
import { CubeGroup } from "./02-cube-group";
import { RotatingCube } from "./03-rotating-cube";
import { OrbitControlsTest } from "./04-orbit-controls";
import { DebugUITest } from "./06-debug-ui";
import { TextureTest } from "./07-textures";

export const BASICS: Section = {
  id: 'basics',
  exercises: [ 
    CenteredCube,
    CubeGroup,
    RotatingCube,
    OrbitControlsTest,
    DebugUITest,
    TextureTest,
  ]
};