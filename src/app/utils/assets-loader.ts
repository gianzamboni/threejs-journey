import * as THREE from 'three';

export class AssetLoader {

  private loadingManager: THREE.LoadingManager;
  private textureLoader: THREE.TextureLoader;

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onStart = this.onStart;
    this.loadingManager.onProgress = this.onProgress;
    this.loadingManager.onError = this.onError;
    this.loadingManager.onLoad = this.onLoad;

    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  onStart(url: string, itemsLoaded: number, itemsTotal: number) {
    console.log( `Started loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.` );
  }

  onProgress(url: string, itemsLoaded: number, itemsTotal: number) {
    console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
  }

  onError(url: string) {
    throw new Error(`Error loading file: ${url}`);
  }

  onLoad() {
    console.log('Loading complete!');
  }

  loadTexture(url: string) {
    return this.textureLoader.load(url);
  }
}