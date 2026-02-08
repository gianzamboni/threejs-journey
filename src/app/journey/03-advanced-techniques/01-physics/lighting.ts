import { AmbientLight, DirectionalLight, Scene } from 'three';

export class Lighting {
  private ambientLight: AmbientLight;
  private directionalLight: DirectionalLight;

  constructor() {
    this.ambientLight = new AmbientLight(0xffffff, 2.1);
    this.directionalLight = this.createDirectionalLight();
  }

  private createDirectionalLight(): DirectionalLight {
    const light = new DirectionalLight(0xffffff, 0.6);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.far = 15;
    light.shadow.camera.left = -7;
    light.shadow.camera.top = 7;
    light.shadow.camera.right = 7;
    light.shadow.camera.bottom = -7;
    light.position.set(5, 5, 5);
    return light;
  }

  public setup(scene: Scene): void {
    scene.add(this.ambientLight, this.directionalLight);
  }

  public dispose(): void {
    if (this.directionalLight.shadow.map) {
      this.directionalLight.shadow.map.dispose();
    }

    this.directionalLight.dispose();
    this.ambientLight.dispose();
  }
}
