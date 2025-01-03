export class Menu extends EventTarget {
  constructor(exercises) {
    super();
    this.items = {};
    const offCanvasElement = document.getElementById('exercisesMenu');
    this.offCanvasBody = offCanvasElement.querySelector('#offcanvas-body');
    this.offCanvas = new bootstrap.Offcanvas(offCanvasElement);
    exercises.forEach((chapter) => {
      this.generateChapter(chapter);
    });
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
    li.id = `${exercise.id}`;

    if(exercise.id === this.activeItem?.id) {
      li.classList.add("active");
    }

    li.onclick = () => {
      this.dispatchEvent(new CustomEvent('select', {
        detail: exercise
      }));
      this.offCanvas.hide();
    }
    list.appendChild(li);
    this.items[exercise.id] = {
      exerciseData: exercise,
      htmlItem: li,
    };
  }

  selectExercise(exerciseId) {
    this.items[exerciseId].htmlItem.classList.add("active");
  }

  deselectExercise(exerciseId) {
    console.log('deselectExercise', exerciseId);
    this.items[exerciseId].htmlItem.classList.remove("active");
  }
}
