import { BasicView } from './app/basic-view.js';
import { Menu } from './app/menu.js';
import { journey } from './app/journey.js';

Array.prototype.last = function() { return this[this.length - 1] };

class App {
  constructor(journey) {
    this.activeExercise = journey.last().exercises.last();
    this.view = new BasicView();
    this.menu = new Menu(journey, this.activeExercise.id);
    this.menu.addEventListener('select', (event) => {
      this.execute(event.detail);
    });
    
    this.setupWidowsListeners();
  };

  execute(exercise) {
    history.pushState(exercise.id, "", exercise.id);
    this.menu.deselectExercise(this.activeExercise.id);
    this.activeExercise = exercise;
    this.menu.selectExercise(exercise.id);
    this.view.run(exercise);
  };

  run() {
    this.execute(this.activeExercise);
  };

  setupWidowsListeners() {
    window.addEventListener('popstate', (event) => {
      const exercise = journey.map((chapter) => chapter.exercises).flat().find((exercise) => exercise.id === event.state);
      this.execute(exercise);
    });
  }
}

const app = new App(journey);
app.run();