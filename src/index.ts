import Menu from "@/layout/menu";
import { InfoBox } from "./layout/info-box";
import RenderView from "./layout/render-view";
import BaseExercise from "./journey/base-exercise";

let menu: Menu;
let infoBox: InfoBox;
let renderView: RenderView;
let activeExercise: BaseExercise | undefined;

window.addEventListener('load', () => {
  menu = new Menu(document.body);
  infoBox = new InfoBox(document.body);
  renderView = new RenderView(document.body);

  menu.addEventListener('exercise-selected', (event: CustomEventInit) => {
    infoBox.updateContent(event.detail);
  
    if(activeExercise !== undefined) {
      activeExercise.dispose();
    } 
    
    activeExercise = new event.detail() as BaseExercise;
    renderView.setScene(activeExercise.scene);
  });

  window.addEventListener('resize', () => {
    renderView.updateSize();
  });
  
 
  menu.selectLastExercise();

});
