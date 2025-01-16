import Menu from "@/layout/menu";
import { InfoBox } from "./layout/info-box";
import RenderView from "./layout/render-view";
import { Exercise } from "./journey/types";

let menu: Menu;
let infoBox: InfoBox;
let renderView: RenderView;
let activeExercise: Exercise | undefined;


window.addEventListener('load', () => {
  menu = new Menu(document.body);
  infoBox = new InfoBox(document.body);
  renderView = new RenderView(document.body);

  menu.addEventListener('exercise-selected', (event: CustomEventInit) => {
    infoBox.updateContent(event.detail);
  
    if(activeExercise !== undefined) {
      activeExercise.dispose();
    } 
    window.history.pushState({exerciseId: event.detail.id}, '', `?exercise=${event.detail.id}`);
    activeExercise = new event.detail() as Exercise;
    renderView.run(activeExercise);
  });

  window.addEventListener('resize', () => {
    renderView.updateSize();
  });
  
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');

  if(exerciseId !== null) {
    menu.selectExercise(exerciseId);
  } else {
    menu.selectLastExercise();
  }

});
