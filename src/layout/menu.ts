import SideBar from "@/components/sidebar";
import { GITHUB_ICON, HAMBURGER_ICON } from "@/constants/icons";
import { THEME } from "@/theme";
import { JOURNEY, Section } from "@/journey";
import { pascalCaseToText } from "@/utils";
import { Collapsable } from "@/components/collapsable";
export default class Menu {
  constructor(parent: HTMLElement) {
    const sideBar = new SideBar(parent, {
      buttonTitle: `${HAMBURGER_ICON} Ejercicios`,
    });

    const header = this.createHeader();
    sideBar.addContent(header);

    this.createExerciseMenu(sideBar);

    const footer = this.createFooter();
    sideBar.addContent(footer);

  }

  private createExerciseMenu(sidebar: SideBar) {
    const menu = document.createElement('nav');
    menu.className = `overflow-y-auto h-full flex-col flex-wrap overflow-x-hidden ${THEME.scrollBar}`;
    sidebar.addContent(menu);
    JOURNEY.forEach((section: Section) => {
      this.createSection(section, menu);
    });
  }

  private createSection(section: Section, menu: HTMLElement) {
    const title = pascalCaseToText(section.id);
    const collapsable = new Collapsable(title);
    const exerciseList = document.createElement('ul');

    section.exercises.forEach((exercise) => {
      const exerciseItem = document.createElement('li');
      exerciseItem.textContent = pascalCaseToText(exercise.id);
      exerciseList.appendChild(exerciseItem);
    });
    collapsable.addContent(exerciseList);
    collapsable.addTo(menu);
    collapsable.toggle();
  }

  private createHeader() {
    const header = document.createElement('header');
    header.className = 'flex justify-between items-center gap-x-2 mb-3';

    const title = document.createElement('h2');
    title.className = 'font-semibold text-xl dark:text-white';
    title.textContent = 'Three.js Journey';

    header.appendChild(title);

    return header;
  }

  private createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'flex justify-center items-center p-4';

    const githubLink = document.createElement('a');
    githubLink.className = 'flex items-center gap-x-2';
    githubLink.href = 'https://github.com/gianzamboni';
    githubLink.innerHTML = `${GITHUB_ICON} Gianfranco Zamboni`;

    footer.appendChild(githubLink);
    return footer;
  }

  init() {
    console.log('Menu initialized');
  }
}