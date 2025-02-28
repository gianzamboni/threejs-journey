import { Collapsable } from "@/app/components/collapsable";
import { pascalCaseToText } from "@/app/utils/text-utils";
import { Exercise } from "../types/exercise";
import { ExerciseMetadata } from "../utils/exercise-metadata";

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

    parent.appendChild(this.container);
  }

  updateContent(exercise: Exercise) {
    const id = ExerciseMetadata.getId(exercise);
    const descriptions = ExerciseMetadata.getDescpritions(exercise);
    
    this.collapsable.updateTitle(pascalCaseToText(id));
    const parser = new DOMParser();
    const htmlSpans = descriptions.map((description: string) => {
      return parser.parseFromString(description, 'text/html').body as HTMLElement; 
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
}