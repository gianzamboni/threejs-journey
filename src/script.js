import { BasicView } from './app/basic-renderer.js';
import { Menu } from './app/gui.js';
import { CenteredCube } from './exercises/01-basics/01-centered-cube.js';
import { CubeGroup } from './exercises/01-basics/02-cube-group.js';
import { RotatingCube } from './exercises/01-basics/03-rotating-cube.js';
import { OrbitControlsCube } from './exercises/01-basics/04-orbit-control.js';
import { RandomTriangles } from './exercises/01-basics/05-random-triangles.js';
import { DebugUI } from './exercises/01-basics/06-debug-ui.js';
import { TextureExercise } from './exercises/01-basics/07-textures.js';
import { MaterialExercise } from './exercises/01-basics/08-materials.js';

const view = new BasicView();
const menu = new Menu(async (exercise) => {
  console.log(`Loading exercise: ${exercise.title}`);
  await view.run(exercise.class);
});

view.run(TextureExercise);