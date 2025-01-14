import { Collapsable } from "@/components/collapsable";

export class InfoBox {

  private container: HTMLElement;
  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');

    const collapsable = new Collapsable('Información', {
      className: 'm-5',
      button: {
        className: 'flex items-center justify-center font-bold text-2xl gap-1 py-2 px-16 rounded-lg mb-0',
        iconSize: 32,
        toggle: ['mb-0','mb-5'],
      },
      collapsable: {
        className: `rounded-lg`,
      }
    });

    const element = document.createElement('div');
    element.className = 'p-5';
    element.innerHTML = `Esta es una caja de información`;
    collapsable.addContent(element);
    collapsable.addTo(this.container);

    this.container.className = 'fixed bottom-0 left-0';
    parent.appendChild(this.container);
  }
}