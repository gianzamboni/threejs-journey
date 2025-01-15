import SideBar from "@/components/sidebar";
import { GITHUB_ICON, HAMBURGER_ICON } from "@/constants/icons";
import { THEME } from "@/theme";
import { Exercise, JOURNEY, Section } from "@/journey";
import { pascalCaseToText } from "@/utils";
import { Collapsable } from "@/components/collapsable";
export default class Menu extends EventTarget {

  private selected: HTMLElement | null = null;
  private sideBar: SideBar;
  private menuContent: HTMLElement;

  constructor(parent: HTMLElement) {
    super();
    this.sideBar = new SideBar(parent, {
      buttonTitle: `${HAMBURGER_ICON} Demos`,
    });

    const header = this.createHeader();
    this.sideBar.addContent(header);

    this.menuContent = this.createExerciseMenu(this.sideBar);

    const footer = this.createFooter();
    this.sideBar.addContent(footer);
  }

  private createExerciseMenu(sidebar: SideBar) {
    const menu = document.createElement('nav');
    menu.className = `overflow-y-auto h-full flex-col flex-wrap overflow-x-hidden ${THEME.scrollBar}`;
    sidebar.addContent(menu);
    JOURNEY.forEach((section: Section) => {
      this.createSection(section, menu);
    });
    return menu;
  }

  private createExerciseItem(exercise: Exercise) {
    const exerciseItem = document.createElement('li');
    exerciseItem.textContent = pascalCaseToText(exercise.id);
    exerciseItem.className = 'cursor-pointer';
    exerciseItem.addEventListener('click', () => {
      if (this.selected) {
        this.selected.classList.remove('border-b-1', 'border-black');
      }

      this.selected = exerciseItem;
      this.selected.classList.add('border-b-[1px]', 'border-black');
      if(this.sideBar.opened) {
        this.sideBar.toggleSidePanel();
      }
      this.dispatchEvent(new CustomEvent('exercise-selected', {
        detail: exercise,
      }));
    });
    return exerciseItem;
  }

  selectLastExercise() {
    const lastExercise = this.getLastExercise();
    if (lastExercise) {
      lastExercise.click();
    }
  }
  
  private getLastExercise() {
    const exercises = this.menuContent.querySelectorAll('li');
    return exercises[exercises.length - 1];
  }

  private createSection(section: Section, menu: HTMLElement) {
    const title = pascalCaseToText(section.id);

    const collapsable = new Collapsable(title);
    const exerciseList = document.createElement('ul');

    section.exercises.forEach((exercise) => {
      const exerciseItem = this.createExerciseItem(exercise);
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
}