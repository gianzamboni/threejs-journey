import {HSAccordion, HSCollapse, HSOverlay, HSStaticMethods} from "preline";
import { createElement } from "./utils/html-utils";
import { CLASSES, ICONS, CLASS_TOKENS } from "./utils/html-constants";

import { journey } from "./journey";

export class Menu {
  constructor() {
    this.createButton();
    this.createSideBar();
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
      class: "pb-0 px-2 w-full flex flex-col flex-wrap",
      'data-hs-accordion-always-open': "true"
    }); 

    const chaptersList = createElement("ul", {
      class: "space-y-1 hs-accordion-group "
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
      class: CLASSES.chapterButton,
      'aria-expanded': "true",
      'aria-controls': collapsableId,
    });

    chapterButton.innerHTML = `${chapter.title}${ICONS.downArrow} ${ICONS.upArrow}`; 
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
}