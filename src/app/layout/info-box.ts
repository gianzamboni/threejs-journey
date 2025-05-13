import { Collapsable } from "#/app/components/collapsable";
import { Exercise } from "#/app/types/exercise";
import { getId, getDescriptions } from "#/app/utils/exercise-metadata";
import { pascalCaseToText } from "#/app/utils/text-utils";

export class InfoBox {

  private _container: HTMLElement;
  private collapsable: Collapsable;

  constructor() {
    this._container = document.createElement('div');
    this._container.id = 'info-box-container';

    this.collapsable = new Collapsable('info-box', 'Información', {
      className: 'mx-5 w-[90vw] sm:w-[16vw] md:min-w-[390px] ',
      button: {
        className: 'flex items-center justify-center font-bold text-2xl gap-1 py-2 rounded-lg mb-0',
        iconSize: 32,
        toggle: ['mb-5'],
      },
      collapsable: {
        className: `rounded-lg`,
      }
    });

    this.collapsable.addTo(this._container);
  }

  get container() {
    return this._container;
  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this._container);
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