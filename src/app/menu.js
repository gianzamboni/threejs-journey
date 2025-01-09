export class Menu {
  constructor() {
    this.button = this.createMenuButton();
  }

  createMenuButton() {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.className = "py-2 px-4 my-5 mx-5 inline-flex items-center gap-x-1 text-base rounded-md bg-gray-100 text-black hover:bg-gray-300 focus:outline-none focus:bg-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 font-medium";
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
    </svg> Demos
    `
    button.addEventListener('click', () => {
      alert('Menu button clicked');
    });
    document.body.appendChild(button);
    return button;
  }
}