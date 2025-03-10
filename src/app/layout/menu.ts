import { Collapsable } from "#/app/components/collapsable";
import SideBar from "#/app/components/sidebar";
import {HAMBURGER_ICON, LINKEDIN_ICON } from "#/app/constants/icons";
import { JOURNEY } from "#/app/journey";
import { ExerciseClass, Section } from "#/app/types/exercise";
import { getId } from "#/app/utils/exercise-metadata";
import { pascalCaseToText } from "#/app/utils/text-utils";
import { CSS_CLASSES } from "#/theme";
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
    menu.className = `overflow-y-auto h-full flex-col flex-wrap overflow-x-hidden ${CSS_CLASSES.scrollBar}`;
    sidebar.addContent(menu);
    for(const section of JOURNEY) {
      this.createSection(section, menu);
    }
    return menu;
  }

  private createExerciseItem(exercise: ExerciseClass) {
    const exerciseItem = document.createElement('li');
    const id = getId(exercise);
    exerciseItem.id = id;
    exerciseItem.textContent = pascalCaseToText(id);
    exerciseItem.className = 'cursor-pointer ml-2';
    exerciseItem.addEventListener('click', () => {
      const selectedClasses = [
        'border-b-[1px]',
        'border-black',
        'dark:border-white',
      ]
      if (this.selected) {
        this.selected.classList.remove(...selectedClasses);
      }

      this.selected = exerciseItem;
      this.selected.classList.add(...selectedClasses);
      if(this.sideBar.opened) {
        this.sideBar.toggleSidePanel();
      }
      this.dispatchEvent(new CustomEvent('exercise-selected', {
        detail: exercise,
      }));
    });
    return exerciseItem;
  }

  selectExercise(exerciseId: string) {
    const exercise = this.menuContent.querySelector(`#${exerciseId}`) as HTMLElement;
    if (exercise) {
      exercise.click();
    }
  }

  selectLastExercise() {
    const lastExercise =  this.menuContent.querySelectorAll('li');
    lastExercise[lastExercise.length - 1].click();
  }

  private createSection(section: Section, menu: HTMLElement) {
    const title = pascalCaseToText(section.id);

    const collapsable = new Collapsable(title);
    const exerciseList = document.createElement('ul');
    for(const exercise of section.exercises) {  
      const exerciseItem = this.createExerciseItem(exercise);
      exerciseList.appendChild(exerciseItem);
    }
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

    const portfolioLinkg = document.createElement('a');
    portfolioLinkg.className = 'flex items-center gap-x-1';
    portfolioLinkg.target = '_blank';
    portfolioLinkg.href = 'https://www.linkedin.com/in/gianfranco-zamboni/';
    portfolioLinkg.innerHTML = `${LINKEDIN_ICON}<span>Gianfranco Zamboni</span>`;

    footer.appendChild(portfolioLinkg);
    return footer;
  }
}