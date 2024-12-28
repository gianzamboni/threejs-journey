import { BasicView } from './app/basic-view.js';
import { Menu } from './app/gui.js';
import { journey } from './app/journey.js';

const lastChapterExercises = journey[journey.length - 1].exercises;
const lastExercise = lastChapterExercises[lastChapterExercises.length - 1];

const view = new BasicView();
const menu = new Menu(lastExercise, async (exercise) => {
  console.log(`Loading exercise: ${exercise.title}`);
  await view.run(exercise);
});

view.run(lastExercise);
