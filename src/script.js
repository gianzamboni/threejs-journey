import { BasicView } from './app/basic-renderer.js';
import { Menu } from './app/gui.js';
import { DebugUI } from './exercises/01-basics/06-debug-ui.js';

const view = new BasicView();
const menu = new Menu(async (exercise) => {
  console.log(`Loading exercise: ${exercise.title}`);
  await view.run(exercise.class);
});

view.run(DebugUI);
