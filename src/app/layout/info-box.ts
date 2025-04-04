import { Collapsable } from "#/app/components/collapsable";
import { Exercise } from "#/app/types/exercise";
import { pascalCaseToText } from "#/app/utils/text-utils";

import { getId } from "../utils/exercise-metadata";
import { getDescriptions } from "../utils/exercise-metadata";

export class InfoBox {

  private container: HTMLElement;
  private collapsable: Collapsable;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.setAttribute('id', 'info-box-container');

    this.collapsable = new Collapsable('Información', {
      className: 'mx-5 w-[90vw] sm:w-[16vw] min-w-[390px] ',
      button: {
        className: 'flex items-center justify-center font-bold text-2xl gap-1 py-2 rounded-lg mb-0',
        iconSize: 32,
        toggle: ['mb-0','mb-5'],
      },
      collapsable: {
        className: `rounded-lg`,
      }
    });

    this.collapsable.addTo(this.container);

    parent.appendChild(this.container);
  }

  updateContent(exercise: Exercise) {
    const id = getId(exercise);
    const descriptions = getDescriptions(exercise);
    
    this.collapsable.updateTitle(pascalCaseToText(id));
    const parser = new DOMParser();
    const htmlSpans = descriptions.flatMap((description: string) => {
      return Array.from(parser.parseFromString(description, 'text/html').body.children); 
    });
    if(htmlSpans.length === 0) {
      this.collapsable.replaceContent([]);
    } else {
      const container = document.createElement('div');
      for(const span of htmlSpans) {
        container.appendChild(span);
      }
      container.className ='px-5 py-3';

      this.collapsable.replaceContent([container]);
    }
  }

  close() {
    this.collapsable.close();
  }
}