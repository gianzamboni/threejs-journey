import SideBar from "@/components/sidebar";
import { GITHUB_ICON, HAMBURGER_ICON } from "@/constants/icons";
import { THEME } from "@/theme";
import { JOURNEY, Section, Exercise } from "@/journey";
import { pascalCaseToText } from "@/utils";
export default class Menu {
  constructor(parent: HTMLElement) {
    const sideBar = new SideBar(parent, {
      buttonTitle: `${HAMBURGER_ICON} Ejercicios`,
    });
    sideBar.toggleSidePanel();

    const header = this.createHeader();
    sideBar.addContent(header);

    const exerciseMenu = this.createExerciseMenu();
    sideBar.addContent(exerciseMenu);

    const footer = this.createFooter();
    sideBar.addContent(footer);

  }

  private createExerciseMenu() {
    const menu = document.createElement('nav');
    menu.className = `overflow-y-auto h-full flex-col flex-wrap ${THEME.scrollBar}`;
    console.log(JOURNEY);
    JOURNEY.forEach((section: Section) => {
      const header = document.createElement('h3');
      header.textContent = pascalCaseToText(section.id);
      header.className = 'font-semibold text-lg dark:text-white mb-2';
      menu.appendChild(header);

      const exercisesList = document.createElement('ul');
      exercisesList.className = 'ms-3';
      section.exercises.forEach((exercise: Exercise) => {
        const exerciseItem = document.createElement('li');
        exerciseItem.className = 'cursor-pointer';
        exerciseItem.textContent = pascalCaseToText(exercise.id);
        exercisesList.appendChild(exerciseItem);
      });

      menu.appendChild(exercisesList);
    });

    return menu;
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