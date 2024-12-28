import { BasicView } from './app/basic-view.js';
import { Menu } from './app/menu.js';
import { journey } from './app/journey.js';

function selectExercise() {
  const url = new URL(window.location.href);
  const exerciseId = url.pathname.slice(1);
  if(exerciseId === '') {
    const lastChapterExercises = journey[journey.length - 1].exercises;
    return lastChapterExercises[lastChapterExercises.length - 1];
  } else {
    return journey.map((chapter) => chapter.exercises)
      .flat()
      .find((exercise) => exercise.id === exerciseId);
  }
}

const initialExercise = selectExercise();

const view = new BasicView();
const menu = new Menu(initialExercise, async (exercise) => {
  console.log(`Loading exercise: ${exercise.title}`);
  history.pushState(exercise.id, "", exercise.id);
  await view.run(exercise);
});

view.run(initialExercise);

window.addEventListener('popstate', async (event) => {
  const exercise = selectExercise();
  console.log(`Loading exercise: ${exercise.title}`);
  await view.run(exercise);
});