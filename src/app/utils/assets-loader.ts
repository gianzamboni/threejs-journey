import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RELOAD } from '#/app/constants/icons';
import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js';

export type LoadingData = {
  url: string;
  itemsLoaded: number;
  itemsTotal: number;
}

export class AssetLoader extends EventTarget{

  private static instance: AssetLoader | undefined;

  private loadingManager: THREE.LoadingManager;

  private textureLoader: THREE.TextureLoader;
  private rgbeLoader: RGBELoader;
  private fontLoader: FontLoader;

  public static getInstance() {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  private constructor() {
    super();
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onStart = this.onStart.bind(this);
    this.loadingManager.onProgress = this.onProgress.bind(this);
    this.loadingManager.onError = this.onError.bind(this);
    this.loadingManager.onLoad = this.onLoad.bind(this);

    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.rgbeLoader = new RGBELoader(this.loadingManager);
    this.fontLoader = new FontLoader(this.loadingManager);

  }

  onStart(url: string, itemsLoaded: number, itemsTotal: number) {
    this.dispatchEvent(new CustomEvent('loading-started', { detail: { url, itemsLoaded, itemsTotal } }));
  }

  onProgress(url: string, itemsLoaded: number, itemsTotal: number) {
    this.dispatchEvent(new CustomEvent('loading-progress', { detail: { url, itemsLoaded, itemsTotal } }));
  }

  onError(url: string) {
    const p = document.createElement('p');
    p.textContent = `Error loading "${url}"`;
    this.dispatchEvent(new CustomEvent('loading-error', { detail: { 
      message: p,
      actionIcon: RELOAD,
      action: () => {
        window.location.reload()
      }
    } }));
  }

  onLoad() {
    this.dispatchEvent(new CustomEvent('loading-complete'));
  }

  reset() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onStart = this.onStart.bind(this);
    this.loadingManager.onProgress = this.onProgress.bind(this);
    this.loadingManager.onError = this.onError.bind(this);
    this.loadingManager.onLoad = this.onLoad.bind(this);

    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.rgbeLoader = new RGBELoader(this.loadingManager);
    this.fontLoader = new FontLoader(this.loadingManager);
  }

  loadTexture(url: string) {
    return this.textureLoader.load(url);
  }

  loadEnvironment(url: string, onLoad: (_: THREE.Texture) => void) {
    return this.rgbeLoader.load(url, onLoad, undefined, () => this.onError(url));
  }

  loadFont(url: string, onLoad: (_: Font) => void) {
    this.fontLoader.load(url, onLoad, undefined, () => this.onError(url));
  }
}