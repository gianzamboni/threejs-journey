import { Scene, Texture } from "three";

import { AssetLoader } from "#/app/services/assets-loader";

type EnvironmentMapOptions = {
  asBackground: boolean;
  asEnvironment: boolean;
}

export class EnvironmentMap {

  private envMap: Texture | undefined;

  private isLoaded: boolean;
  constructor(url: string) {
    this.isLoaded = false;
    AssetLoader.getInstance().loadEnvironment(url, (envMap) => {
      this.envMap = envMap;
      this.isLoaded = true;
    });
  }

  async addTo(scene: Scene, options: EnvironmentMapOptions = {
    asBackground: true,
    asEnvironment: true
  }) {
    if (!this.isLoaded) {
      setTimeout(() => {
        this.addTo(scene, options);
      }, 50);
    } else {
      if (this.envMap) {
        if (options.asBackground) {
          scene.background = this.envMap;
        }

        if (options.asEnvironment) {
          scene.environment = this.envMap;
        }
      }
    }
  }

  dispose() {
    if (this.envMap) {
      this.envMap.dispose();
    }
  }
}