import { Collapsable } from "#/app/components/collapsable";
import SideBar from "#/app/components/sidebar";
import {HAMBURGER_ICON, PORTFOLIO_ICON, STAR } from "#/app/constants/icons";
import { JOURNEY } from "#/app/journey";
import { ExerciseClass, Section } from "#/app/types/exercise";
import { getId, getStarred } from "#/app/utils/exercise-metadata";
import { pascalCaseToText } from "#/app/utils/text-utils";
import { CSS_CLASSES } from "#/theme";
export default class Menu extends EventTarget {

  private selected: HTMLElement | null = null;
  private sideBar: SideBar;
  private menuContent: HTMLElement;

  private firstSection: Collapsable | null = null;

  constructor() {
    super();
    this.sideBar = new SideBar({
      buttonTitle: `${HAMBURGER_ICON} Demos`,
    });

    const header = this.createHeader();
    this.sideBar.addContent(header);

    this.menuContent = this.createExerciseMenu(this.sideBar);

    const footer = this.createFooter();
    this.sideBar.addContent(footer);
  }

  public addTo(parent: HTMLElement) {
    this.sideBar.addTo(parent);
    if (this.firstSection) {
      this.firstSection.open();
    }
  }

  private createExerciseMenu(sidebar: SideBar) {
    const menu = document.createElement('nav');
    menu.id = 'exercise-menu';
    menu.className = `overflow-y-auto h-full flex-col flex-wrap overflow-x-hidden ${CSS_CLASSES.scrollBar}`;
    sidebar.addContent(menu);
    for(const [index, section] of JOURNEY.entries()) {
      const collapsable = this.createSection(section, menu);
      if (index === 0) {
        this.firstSection = collapsable;
      }
    }
    return menu;
  }

  private createExerciseItem(exercise: ExerciseClass) {
    const exerciseItem = document.createElement('li');
    const id = getId(exercise);
    const isStarred = getStarred(exercise);
    exerciseItem.id = id; 
    
    if (isStarred) {
      exerciseItem.innerHTML = `<p class="flex items-center gap-x-2 font-bold ml-[-5px]">${STAR}<span class="text-md">${pascalCaseToText(id)}</span></p>`;
    } else {
      exerciseItem.innerHTML = `<p class="pl-6 text-gray-800 dark:text-gray-300">${pascalCaseToText(id)}</p>`;
    }
    exerciseItem.className = 'exercise-item cursor-pointer ml-2';
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

  selectFirstExercise() {
    const firstExercise =  this.menuContent.querySelectorAll('li');
    firstExercise[0].click();
  }

  private createSection(section: Section, menu: HTMLElement) {
    const title = pascalCaseToText(section.id);

    const collapsable = new Collapsable(section.id, title);
    const exerciseList = document.createElement('ul');
    for(const exercise of section.exercises) {  
      const exerciseItem = this.createExerciseItem(exercise);
      exerciseList.appendChild(exerciseItem);
    }
    collapsable.addContent(exerciseList);
    collapsable.addTo(menu);
    return collapsable;
  }

  private createHeader() {
    const header = document.createElement('header');
    header.id = 'exercise-menu-header';
    header.className = 'flex justify-between items-center gap-x-2 mb-3';

    const title = document.createElement('h2');
    title.className = 'font-semibold text-xl dark:text-white';
    title.textContent = 'Three.js Journey';

    header.appendChild(title);

    return header;
  }

  private createFooter() {
    const footer = document.createElement('footer');
    footer.id = 'exercise-menu-footer';
    footer.className = 'flex justify-center items-center p-4';

    const portfolioLinkg = document.createElement('a');
    portfolioLinkg.className = 'flex items-center gap-x-1 text-blue-800 dark:text-blue-400 pointer';
    portfolioLinkg.target = '_blank';
    portfolioLinkg.href = 'https://portfolio.gianfrancozamboni.com.ar';
    portfolioLinkg.innerHTML = `${PORTFOLIO_ICON}<span>Gianfranco Zamboni</span>`;

    footer.appendChild(portfolioLinkg);
    return footer;
  }
}