import { journey } from './journey.js';

export class Menu {
  constructor(actionOnClick) {
    const offCanvasElement = document.getElementById('exercisesMenu');
    this.offCanvas = new bootstrap.Offcanvas(offCanvasElement);
    this.offCanvasBody = document.getElementById('offcanvas-body');
    journey.forEach((chapter) => {
      this.generateChapter(chapter);
    });
    this.actionOnClick = actionOnClick;
    this.activeItem = null;
  }

  generateChapter(chapter) {
    const h5 = document.createElement('h5');
    h5.innerHTML = chapter.title;
    this.offCanvasBody.appendChild(h5);
    if (chapter.exercises) {
      this.generateExerciseList(chapter.exercises);
    }
  }

  generateExerciseList(exercises) {
    const list = document.createElement('ol');
    this.offCanvasBody.appendChild(list);
    exercises.forEach((exercise) => {
      this.generateExersiceItem(exercise, list);
    });
  }

  generateExersiceItem(exercise, list) {
    const li = document.createElement('li');
    li.innerHTML = exercise.title;
    li.onclick = () => {
      this.activeItem?.classList.remove("active");
      this.actionOnClick(exercise);
      li.classList.add("active");
      this.activeItem = li;
      this.offCanvas.hide();
    }
    list.appendChild(li);
  }
}
