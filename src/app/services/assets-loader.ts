import { 
  LoadingManager,
  TextureLoader,
  CubeTextureLoader,
  Scene,
  Texture,
  EquirectangularReflectionMapping,
  Group
} from 'three';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { RELOAD } from '#/app/constants/icons';

export type LoadingData = {
  url: string;
  itemsLoaded: number;
  itemsTotal: number;
}

export class AssetLoader extends EventTarget {

  private static instance: AssetLoader | undefined;

  private loadingManager: LoadingManager;

  private textureLoader: TextureLoader | undefined;
  private rgbeLoader: RGBELoader | undefined;
  private fontLoader: FontLoader | undefined;
  private cubeTextureLoader: CubeTextureLoader | undefined;
  private gltfLoader: GLTFLoader | undefined;
  private dracoLoader: DRACOLoader | undefined;

  public static getInstance() {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  private constructor() {
    super();
    this.loadingManager = new LoadingManager();
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
    this.dispatchEvent(new CustomEvent('loading-error', {
      detail: {
        message: p,
        actionIcon: RELOAD,
        action: () => {
          window.location.reload()
        }
      }
    }));
  }

  onLoad() {
    this.dispatchEvent(new CustomEvent('loading-complete'));
  }

  reset() {
    this.loadingManager = new LoadingManager();
    this.loadingManager.onStart = this.onStart.bind(this);
    this.loadingManager.onProgress = this.onProgress.bind(this);
    this.loadingManager.onError = this.onError.bind(this);
    this.loadingManager.onLoad = this.onLoad.bind(this);

    this.dracoLoader?.dispose();

    this.textureLoader = undefined;
    this.rgbeLoader = undefined;
    this.fontLoader = undefined;
    this.cubeTextureLoader = undefined;
    this.gltfLoader = undefined;
    this.dracoLoader = undefined;
  }

  loadTexture(url: string) {
    if (!this.textureLoader) {
      this.textureLoader = new TextureLoader(this.loadingManager);
    }
    return this.textureLoader.load(url);
  }

  loadEnvironment(url: string, scene: Scene, onLoad: (_: Texture) => void) {
    if (!this.rgbeLoader) {
      this.rgbeLoader = new RGBELoader(this.loadingManager);
    }
    return this.rgbeLoader.load(url, (envMap) => {
      envMap.mapping = EquirectangularReflectionMapping;
      scene.environment = envMap;
      onLoad(envMap);
    }, undefined, () => this.onError(url));
  }

  loadCubeTexture(folder: string, extension: string = 'png') {
    const urls = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(suffix => `${folder}/${suffix}.${extension}`);
    if (!this.cubeTextureLoader) {
      this.cubeTextureLoader = new CubeTextureLoader(this.loadingManager);
    }
    return this.cubeTextureLoader.load(urls);
  }

  loadFont(url: string, onLoad: (_: Font) => void) {
    if (!this.fontLoader) {
      this.fontLoader = new FontLoader(this.loadingManager);
    }
    return this.fontLoader.load(url, onLoad, undefined, () => this.onError(url));
  }

  loadGLTF(url: string, options: { 
    useDraco?: boolean,
    onLoad?: (_: GLTF) => void
  } = {}) {
    if (!this.gltfLoader) {
      this.gltfLoader = new GLTFLoader(this.loadingManager);
    }
    if (options.useDraco === true) {
      if (!this.dracoLoader) {
        this.dracoLoader = new DRACOLoader(this.loadingManager);
        this.dracoLoader.setDecoderPath('/draco/');
      }
      this.gltfLoader.setDRACOLoader(this.dracoLoader);
    }

    if(options.onLoad !== undefined) {
      return this.gltfLoader.load(url, options.onLoad);
    } else {
      return this.gltfLoader.loadAsync(url);
    }
  }

  loadModel(url: string, callback: (mesh: Group) => void, options: { useDraco?: boolean } = {}) {
    const useDraco = options.useDraco ?? false;
    this.loadGLTF(
      url, 
      { 
        useDraco,
        onLoad: (scene) => {
          callback(scene.scene);
        }
      }
    );
  }
}