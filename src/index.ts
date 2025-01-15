import Menu from "@/layout/menu";
import { InfoBox } from "./layout/info-box";

let menu: Menu;
let infoBox: InfoBox;

window.addEventListener('load', () => {
  menu = new Menu(document.body);
  infoBox = new InfoBox(document.body);
  
  menu.addEventListener('exercise-selected', (event: CustomEventInit) => {
    infoBox.updateContent(event.detail);
  });
  
});