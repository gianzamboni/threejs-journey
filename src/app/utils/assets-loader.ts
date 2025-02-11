import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

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
  }

  onStart(url: string, itemsLoaded: number, itemsTotal: number) {
    this.dispatchEvent(new CustomEvent('loading-started', { detail: { url, itemsLoaded, itemsTotal } }));
  }

  onProgress(url: string, itemsLoaded: number, itemsTotal: number) {
    this.dispatchEvent(new CustomEvent('loading-progress', { detail: { url, itemsLoaded, itemsTotal } }));
  }

  onError(url: string) {
    throw new Error(`Error loading file: ${url}`);
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
  }

  loadTexture(url: string) {
    return this.textureLoader.load(url);
  }

  loadEnvironment(url: string, onLoad: (texture: THREE.Texture) => void) {
    return this.rgbeLoader.load(url, onLoad);
  }
}