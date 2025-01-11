import {HSAccordion, HSCollapse, HSOverlay, HSStaticMethods} from "preline";
import { createElement } from "./utils/html-utils";
import { CLASSES, ICONS, CLASS_TOKENS } from "./utils/html-constants";

import { journey } from "./journey";

export class Menu {
  constructor(stateManager) {
    this.createButton();
    this.createSideBar();

    this.activeSection = null;
    this.activeExercise = null;
    this.activeCollapsable = null;

    stateManager.addEventListener('exercise-changed', (event) => {
      this.setActiveExercise(event.detail.old, event.detail.new);
    });
  }

  createButton() {
    const button = createElement("button", {
      type: "button",
      class: CLASSES.menuButton,
      'aria-haspopup': "dialog",
      'aria-expanded': "false",
      'aria-controls': "exercise-menu",
      'aria-label': "Open exercise menu",
      'data-hs-overlay': '#exercise-menu',
    });
    button.innerHTML = `${ICONS.hamburguer} <span>Demos</span>`;
    document.body.appendChild(button);
  }

  createSideBar() {
    const sidebar = createElement("div", {
      id: "exercise-menu",
      class: CLASSES.sideBar,
      role: "dialog",
      tabindex: "-1",
      'aria-label': "Exercise menu sidebar",
    });
    this.fillSideBar(sidebar);
    document.body.appendChild(sidebar);
  }

  fillSideBar(sidebar) {
    const sidebarBody = createElement("div", {
      class: "relative flex flex-col h-full max-h-full"
    });
    
    const header = this.createSideBarHeader();
    const exerciseJourneyList = this.createJourneyList();
    const footer = this.createFooter();

    sidebarBody.appendChild(header);
    sidebarBody.appendChild(exerciseJourneyList);
    sidebarBody.appendChild(footer);
    sidebar.appendChild(sidebarBody);
  }

  createFooter() {
    const footer = createElement("footer", {
      class: "flex justify-center items-center p-4"
    });

    const githubLink = createElement("a", {
      class: "flex items-center gap-x-2",
      href: "https://github.com/gianzamboni"
    });

    githubLink.innerHTML = `${ICONS.github} Gianfranco Zamboni`;
    
    footer.appendChild(githubLink);
    return footer;
  }

  createSideBarHeader() {
    const header = createElement("header", {
      class: "p-4 flex justify-between items-center gap-x-2"
    });

    const title = createElement("h2", {
      class: "font-semibold text-xl dark:text-white"
    });
    title.textContent = "Three.js Journey";

    const closeButton = createElement("button", {
      type: 'button',
      class: `flex items-center justify-center size-6 rounded-full ${CLASS_TOKENS.hover} ${CLASS_TOKENS.text}`,
      'data-hs-overlay':"#exercise-menu",
    });
    closeButton.innerHTML = `${ICONS.close}`;
    
    header.appendChild(title);
    header.appendChild(closeButton);
    return header;
  }

  createJourneyList() {
    const nav = createElement("nav", {
      class: `overflow-y-auto ${CLASSES.scrollbar} h-full`
    });
    
    const accordionContainer = createElement("div", {
      class: "pb-0 px-2 w-full flex flex-col flex-wrap"
    }); 

    const chaptersList = createElement("ul", {
      class: "space-y-1"
    });

    journey.forEach((chapter) => this.createChapter(chaptersList, chapter));

    accordionContainer.appendChild(chaptersList);
    nav.appendChild(accordionContainer);
    return nav;
  }

  createChapter(chaptersList, chapter) {
      const sectionId = this.sectionItemId(chapter.id);
      const collapsableId = `${sectionId}-collapse`;
      const chapterLi = createElement("li", {
        id: sectionId,
      });

      const chapterButton = this.createChapterButton(chapter, collapsableId);
      const chapterCollapsable = this.createChapterCollapsable(chapter, collapsableId, sectionId);
      chapterLi.appendChild(chapterButton);
      chapterLi.appendChild(chapterCollapsable);
      HSCollapse.show(`#{collapsableId}`);
      chaptersList.appendChild(chapterLi);
  }

  createChapterButton(chapter, collapsableId) {
    console.log(collapsableId);
    const chapterButton = createElement("button", {
      type: 'button',
      class: `${CLASSES.chapterButton}`,
      'aria-expanded': "true",
      'aria-controls': collapsableId,
      'data-hs-collapse': `#${collapsableId}`,
    });

    chapterButton.innerHTML = `${chapter.title}${ICONS.downArrow}`; 
    return chapterButton;
  }

  createChapterCollapsable(chapter, collapsableId, achordionId) {
    const collapsable = createElement("div", {
      id: collapsableId,
      class: "hs-collapse w-full overflow-hidden transition-[height] duration-300",
      role: "region",
      'aria-labelledby': achordionId,
    });

    const exerciseList = createElement("ul", {
      class: "ps-6 space-y-1"
    });
    
    chapter.exercises.forEach((exercise) => this.createExercise(exerciseList, exercise, chapter.id));
    
    collapsable.appendChild(exerciseList);
    return collapsable;
  }

  createExercise(exerciseList, exercise, chapterId) {
    const exerciseLi = createElement("li", {
      id: this.exerciseItemId(chapterId, exercise.id),
      class: "flex items-center relative",
    });

    if(exercise.config.starred) {
      const starContainer = createElement("div", {});
      starContainer.innerHTML = `${ICONS.yellowStar}`;
      starContainer.style.position="absolute";
      starContainer.style['left']="-1.5rem";
      starContainer.style['top']="0";
      exerciseLi.appendChild(starContainer);
    }
   
    const exerciseTitle = createElement("span", {});
    exerciseTitle.textContent = exercise.title;
    exerciseLi.appendChild(exerciseTitle);

    exerciseList.appendChild(exerciseLi);
  }

  setActiveExercise(newExerciseData) {
    if(this.activeSection) {
      this.activeSection.classList.remove('active');
    }
  }

  toggleSection(section, exercise, status) {
    this.sectionItemId = this.sectionItemId(section);
    this.exerciseItemId = this.exerciseItemId(section, exercise);

    const sectionElement = document.getElementById(this.sectionItemId);
    const collapsableElement = sectionElement.querySelector(`#${this.sectionItemId}-collapse`);
    const exerciseElement = collapsableElement.querySelector(`#${this.exerciseItemId}`);

    sectionElement.classList[status == 'active' ? 'add' : 'remove']('active');
    collapsableElement.style.display = status == 'active' ? "block" : "none";
    exerciseElement.classList[status == 'active' ? 'add' : 'remove']('border-b', 'border-black');
  }

  exerciseItemId(section, exercise) {
    return `${section}-${exercise}`;
  }

  sectionItemId(section) {
    return `${section}`;
  }
}