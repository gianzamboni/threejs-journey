import { Scene, Texture } from "three";

import { AssetLoader } from "#/app/services/assets-loader";

type EnvironmentMapOptions = {
  asBackground?: boolean;
  asEnvironment?: boolean;
  callback?: (texture: Texture) => void;
}

type EnvironmentMapLoadSettings = {
  isCubeTexture: boolean;
  extension?: string;
};

export class EnvironmentMap extends EventTarget {

  private texture: Texture | undefined;

  constructor(url: string, settings: EnvironmentMapLoadSettings = { isCubeTexture: false }) {
    super();
    const loader = AssetLoader.getInstance();
    if (settings.isCubeTexture) {
      this.onLoad(loader.loadCubeTexture(url, settings.extension));
    } else {
      loader.loadEnvironment(url, this.onLoad.bind(this));
    }
  }
 
  addTo(scene: Scene, options: EnvironmentMapOptions = {
    asBackground: true,
    asEnvironment: true
  }) {
    if (this.texture !== undefined) {
      this.executeAddTo(scene, options);
    } else {
      this.addEventListener('loaded', () => {
        this.executeAddTo(scene, options);
      }, { once: true });
    }
  }

  private executeAddTo(scene: Scene, options: EnvironmentMapOptions) {
    if (this.texture === undefined) {
      throw new Error('Environment map not loaded');
    }
    scene.background = this.texture;
    scene.environment = this.texture;

    options.callback?.(this.texture!);
  } 

  get asTexture(): Texture {
    if (this.texture === undefined) {
      throw new Error('Environment map not loaded');
    }
    return this.texture;
  }

  dispose() {
    if (this.texture) {
      this.texture.dispose();
    }
  }

  private onLoad(envMap: Texture) {
    this.texture = envMap;
    this.dispatchEvent(new Event('loaded'));
  }
}