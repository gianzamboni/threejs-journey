import { Collapsable } from "@/app/components/collapsable";
import BaseExercise from "@/app/journey/exercises/base-exercise";
import { pascalCaseToText } from "@/app/utils/text-utils";

export class InfoBox {

  private container: HTMLElement;
  private collapsable: Collapsable;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');

    this.collapsable = new Collapsable('Información', {
      className: 'm-5 w-[90vw] sm:w-[16vw] min-w-[390px] ',
      button: {
        className: 'flex items-center justify-center font-bold text-2xl gap-1 py-2 px-16 rounded-lg mb-0',
        iconSize: 32,
        toggle: ['mb-0','mb-5'],
      },
      collapsable: {
        className: `rounded-lg`,
      }
    });

    this.collapsable.addTo(this.container);

    this.container.className = 'fixed bottom-0 left-0';
    parent.appendChild(this.container);
  }

  updateContent(exercise: BaseExercise) {
    this.collapsable.updateTitle(pascalCaseToText(exercise.id));
    const parser = new DOMParser();
    if(exercise.descriptions.length === 0) {
      this.collapsable.replaceContent([]);
      return;
    }
    
    const htmlSpans = exercise.descriptions.map((description) => {
      return parser.parseFromString(description, 'text/html').body as HTMLElement; 
    });
    const container = document.createElement('div');
    htmlSpans.forEach((span) => container.appendChild(span));
    container.className ='px-5 py-3';
    this.collapsable.replaceContent([container]);
  }
}