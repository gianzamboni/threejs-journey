import {HSAccordion, HSCollapse, HSOverlay, HSStaticMethods} from "preline";
import { createElement } from "./utils/html-utils";
import { CLOSE_ICON, HAMBURGER_ICON, MENU_BUTTON_CLASSES, SIDE_BAR_CLASSES, CLASS_TOKENS, SCROLLBAR_CLASSES, CHAPTER_BUTTON_CLASSES, DOWN_ARROW_ICON, UP_ARROW_ICON, YELLOW_STAR_ICON } from "./utils/html-constants";

import { journey } from "./journey";

export class Menu {
  constructor() {
    this.createButton();
    this.createSideBar();
  }

  createButton() {
    const button = createElement("button", {
      type: "button",
      class: MENU_BUTTON_CLASSES,
      'aria-haspopup': "dialog",
      'aria-expanded': "false",
      'aria-controls': "exercise-menu",
      'aria-label': "Open exercise menu",
      'data-hs-overlay': '#exercise-menu',
    });
    button.innerHTML = `${HAMBURGER_ICON} <span>Demos</span>`;
    document.body.appendChild(button);
  }

  createSideBar() {
    const sidebar = createElement("div", {
      id: "exercise-menu",
      class: SIDE_BAR_CLASSES,
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
    
    const header = this.createSideBarHeader(sidebarBody);
    sidebarBody.appendChild(header);

    const exerciseJourneyList = this.createJourneyList();
    sidebarBody.appendChild(exerciseJourneyList);

    sidebar.appendChild(sidebarBody);
  }

  createSideBarHeader(body) {
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
    closeButton.innerHTML = `${CLOSE_ICON}`;
    
    header.appendChild(title);
    header.appendChild(closeButton);
    return header;
  }

  createJourneyList() {
    const nav = createElement("nav", {
      class: `overflow-y-auto ${SCROLLBAR_CLASSES} h-full`
    });
    
    const accordionContainer = createElement("div", {
      class: "hs-accordion-group pb-0 px-2 w-full flex flex-col flex-wrap",
      'data-hs-accordion-always-open': "true"
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
      const achordionId = `${chapter.id}-accordion`;
      const collapsableId = `${achordionId}-collapse`;
      const chapterLi = createElement("li", {
        class: "hs-accordion",
        id: achordionId,
      });

      const chapterButton = this.createChapterButton(chapter, collapsableId);
      const chapterCollapsable = this.createChapterCollapsable(chapter, collapsableId, achordionId);
    
      chapterLi.appendChild(chapterButton);
      chapterLi.appendChild(chapterCollapsable);
      chaptersList.appendChild(chapterLi);
  }

  createChapterButton(chapter, collapsableId) {
    const chapterButton = createElement("button", {
      type: 'button',
      class: CHAPTER_BUTTON_CLASSES,
      'aria-expanded': "true",
      'aria-controls': collapsableId,
    });

    chapterButton.innerHTML = `${chapter.title}${DOWN_ARROW_ICON} ${UP_ARROW_ICON}`; 
    return chapterButton;
  }

  createChapterCollapsable(chapter, collapsableId, achordionId) {
    const collapsable = createElement("div", {
      id: collapsableId,
      class: "hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden",
      role: "region",
      'aria-labelledby': achordionId,
    });

    const exerciseList = createElement("ul", {
      class: "ps-6 space-y-1"
    });
    
    chapter.exercises.forEach((exercise) => this.createExercise(exerciseList, exercise));
    
    collapsable.appendChild(exerciseList);
    return collapsable;
  }

  createExercise(exerciseList, exercise) {
    const exerciseLi = createElement("li", {
      class: "flex items-center relative",
    });

    if(exercise.config.starred) {
      const starContainer = createElement("div", {});
      starContainer.innerHTML = `${YELLOW_STAR_ICON}`;
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
}