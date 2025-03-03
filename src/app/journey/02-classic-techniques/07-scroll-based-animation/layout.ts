import { CSS_CLASSES } from '#/theme';

export class ScrollBasedAnimationLayout {

  private layoutContainer: HTMLElement;

  constructor() {
    this.layoutContainer = document.createElement('div');
    this.layoutContainer.className = `absolute h-screen w-screen overflow-scroll ${CSS_CLASSES.exercise_index}`;
    
    // Create HTML sections
    ['My Portfolio', "My projects", "Contact me"].map((text, index) => {
      const section = document.createElement('section');
      section.className = 'flex items-center h-screen font-["Cabin"] text-red-400 lg:text-[#ffeded] text-uppercase font-size-[7vw] px-[10%]';


      if(index % 2 !== 0) {
        section.classList.add('justify-end');
      }

      const h2 = document.createElement('h2');
      h2.className = 'text-4xl font-bold';
      h2.textContent = text;


      section.appendChild(h2);
      this.layoutContainer.appendChild(section);
      return section;
    });

    document.body.appendChild(this.layoutContainer);
  }

  remove() {
    this.layoutContainer.remove();
  }

  get element() {
    return this.layoutContainer;
  }

  get length() {
    return this.layoutContainer.children.length;
  }
}