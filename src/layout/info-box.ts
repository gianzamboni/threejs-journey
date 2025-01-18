import { Collapsable } from "@/components/collapsable";
import { Exercise } from "@/journey/types";
import { pascalCaseToText } from "@/utils/text-utils";

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

    const element = document.createElement('p');
    element.className = 'p-5 text-wrap';
    element.innerHTML = `Esta es una caja de información`;
    this.collapsable.addContent(element);
    this.collapsable.addTo(this.container);

    this.container.className = 'fixed bottom-0 left-0';
    parent.appendChild(this.container);
  }

  updateContent(exercise: Exercise) {
    this.collapsable.updateTitle(pascalCaseToText(exercise.id));
    this.collapsable.replaceContent(exercise.info);
  }
}