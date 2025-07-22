import { LoadingData } from "#/app/services/assets-loader";
import { sleep } from "#/app/utils/sleep";

export class LoadingScreen {

  private container: HTMLElement;
  private progress: HTMLElement;
  private label: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'loading-screen-container';
    this.container.className = 'fixed top-0 left-0 right-0 bottom-0 flex justify-center flex-col items-center text-white text-2xl bg-black/50  transition-[opacity] duration-300 w-full hidden z-[3]';

    const textRow = document.createElement('div');
    textRow.id = 'loading-screen-text-row';
    textRow.className = 'flex flex-row justify-between mb-1 w-1/2';
    this.container.appendChild(textRow);
    
    const loading = document.createElement('div');
    loading.id = 'loading-screen-loading-text';
    loading.innerHTML = 'Loading...';
    textRow.appendChild(loading);

    this.label = document.createElement('div');
    this.label.id = 'loading-screen-label-text';
    this.label.innerHTML = '0%';
    textRow.appendChild(this.label);

    const progressBar = document.createElement('div');
    progressBar.className = 'bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 w-1/2';
    this.container.appendChild(progressBar);

    this.progress = document.createElement('div');
    this.progress.id = 'loading-screen-progress-bar';
    this.progress.className = 'bg-blue-600 h-2.5 rounded-full transition-all duration-300 w-full origin-left';

    progressBar.appendChild(this.progress);
  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  async show() {
    this.container.classList.remove('hidden');
    this.container.style.opacity = '1';
    this.label.innerHTML = '0%';
    this.progress.style.transform = 'scaleX(0)';
  }

  async update(data: LoadingData) {
    const progress = Math.round(data.itemsLoaded / data.itemsTotal);
    console.log(progress);
    this.label.innerHTML = `${progress * 100}%`;
    this.progress.style.transform = `scaleX(${progress})`;
  }

  async hide() {
    this.container.addEventListener('transitionend', async () => {
      this.container.style.opacity = '0';
      await sleep(310);
      this.container.classList.add('hidden');
    }, { once: true });

  }
}