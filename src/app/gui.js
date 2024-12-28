import { journey } from './journey.js';

export class Menu {
  constructor(activeDefault, actionOnClick) {
    this.activeItem = activeDefault;

    const offCanvasElement = document.getElementById('exercisesMenu');
    this.offCanvas = new bootstrap.Offcanvas(offCanvasElement);
    this.offCanvasBody = document.getElementById('offcanvas-body');
    journey.forEach((chapter) => {
      this.generateChapter(chapter);
    });
    this.actionOnClick = actionOnClick;
  }

  generateChapter(chapter) {
    const h5 = document.createElement('h5');
    h5.innerHTML = chapter.title;
    this.offCanvasBody.appendChild(h5);
    if (chapter.exercises) {
      this.generateExerciseList(chapter);
    }
  }

  generateExerciseList(chapter) {
    const list = document.createElement('ol');
    this.offCanvasBody.appendChild(list);
    chapter.exercises.forEach((exercise) => {
      this.generateExersiceItem(exercise, list, chapter.id);
    });
  }

  generateExersiceItem(exercise, list, idPreffix) {
    const li = document.createElement('li');
    li.innerHTML = exercise.title;
    li.id = `${idPreffix}-${exercise.id}`;

    if(exercise.id === this.activeItem?.id) {
      li.classList.add("active");
    }

    li.onclick = () => {
      this.activeItem.menuLiItem.classList.remove("active");
      this.actionOnClick(exercise);
      li.classList.add("active");
      this.activeItem = exercise;
      this.offCanvas.hide();
    }
    list.appendChild(li);
    exercise.menuLiItem = li;
  }
}
