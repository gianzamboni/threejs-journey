import { WARNING } from "#/app/constants/icons";

export type ErrorData = {
  message: HTMLElement;
  actionIcon: string;
  action: () => void;
}
export class WarningBox {

  private warningBox: HTMLElement;
  private errorContainer: HTMLElement;
  private actionButton: HTMLButtonElement;

  constructor() {
    this.warningBox = document.createElement('div');
    this.warningBox.className = "mb-5 mr-5 bg-red-600 flex items-center justify-center text-white py-2 px-3 gap-2 rounded-lg max-sm:w-[90vw] hidden";

    const warningSymbol = document.createElement('span');
    warningSymbol.innerHTML = WARNING;

    this.errorContainer = document.createElement('span');

    this.warningBox.appendChild(warningSymbol);
    this.warningBox.appendChild(this.errorContainer);

    this.actionButton = document.createElement('button');
    this.actionButton.className = 'border-2 border-white rounded-lg px-2 aspect-square hover:bg-red-500';
    this.warningBox.appendChild(this.actionButton);

  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this.warningBox);
  }

  setMessage(error: ErrorData) {
    this.warningBox.classList.remove('hidden');
    this.warningBox.parentElement?.classList.add('w-full');
    this.errorContainer.appendChild(error.message);
    this.actionButton.innerHTML = error.actionIcon;
    this.actionButton.addEventListener('click', () => {
      this.warningBox.classList.add('hidden');
      error.action()
    });
  }
} 