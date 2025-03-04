import * as THREE from 'three';

import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { RELOAD } from '#/app/constants/icons';

export type LoadingData = {
  url: string;
  itemsLoaded: number;
  itemsTotal: number;
}

export class AssetLoader extends EventTarget{

  private static instance: AssetLoader | undefined;

  private loadingManager: THREE.LoadingManager;

  private textureLoader: THREE.TextureLoader | undefined;
  private rgbeLoader: RGBELoader | undefined;
  private fontLoader: FontLoader | undefined;
  private cubeTextureLoader: THREE.CubeTextureLoader | undefined;
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

    this.textureLoader = undefined;
    this.rgbeLoader = undefined;
    this.fontLoader = undefined;
    this.cubeTextureLoader = undefined;
  }

  loadTexture(url: string) {
    if (!this.textureLoader) {
      this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    }
    return this.textureLoader.load(url);
  }

  loadEnvironment(url: string, onLoad: (_: THREE.Texture) => void) {
    if (!this.rgbeLoader) {
      this.rgbeLoader = new RGBELoader(this.loadingManager);
    }
    return this.rgbeLoader.load(url, onLoad, undefined, () => this.onError(url));
  }

  loadCubeTexture(urls:string[]) {
    if (!this.cubeTextureLoader) {
      this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);
    }
    return this.cubeTextureLoader.load(urls);
  }

  loadFont(url: string, onLoad: (_: Font) => void) {
    if (!this.fontLoader) {
      this.fontLoader = new FontLoader(this.loadingManager);
    }
    return this.fontLoader.load(url, onLoad, undefined, () => this.onError(url));
  }
}