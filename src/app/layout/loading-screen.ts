import { LoadingData } from "../utils/assets-loader";

export class LoadingScreen {

  private container: HTMLElement;
  private progress: HTMLElement;
  private label: HTMLElement;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'fixed top-0 left-0 right-0 bottom-0 flex justify-center flex-col items-center text-white text-2xl bg-black bg-opacity-50 hidden transition-all duration-300 w-full';
    parent.appendChild(this.container);

    const textRow = document.createElement('div');
    textRow.className = 'flex flex-row justify-between mb-1 w-1/2';
    this.container.appendChild(textRow);
    const loading = document.createElement('div');
    loading.innerHTML = 'Loading...';
    textRow.appendChild(loading);

    this.label = document.createElement('div');
    this.label.innerHTML = '0%';
    textRow.appendChild(this.label);


    const progressBar = document.createElement('div');
    progressBar.className = 'bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 w-1/2';
    this.container.appendChild(progressBar);

    this.progress = document.createElement('div');
    this.progress.className = 'bg-blue-600 h-2.5 rounded-full transition-all duration-300 w-1/2';

    progressBar.appendChild(this.progress);
  }

  async show(_: LoadingData) {
    this.container.classList.remove('hidden');
    this.container.style.opacity = '1';
    this.label.innerHTML = '0%';
    this.progress.style.width = '0%';
  }

  async update(data: LoadingData) {
    console.log(data);
    const progress = data.itemsLoaded * 100/ data.itemsTotal;
    this.label.innerHTML = `${progress}%`;
    this.progress.style.width = `${progress}%`;
  }

  async hide() {
    this.container.style.opacity = '0';
    this.container.classList.add('hidden');
  }
}