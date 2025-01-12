import SideBar from "@/components/sidebar";
import { HAMBURGER_ICON } from "@/constants/icons";

export default class Menu {
  constructor(parent: HTMLElement) {
     const sideBar = new SideBar(parent, {
      buttonTitle: `${HAMBURGER_ICON} Ejercicios`,
     });
  }

  init() {
    console.log('Menu initialized');
  }
}