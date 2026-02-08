import { 
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  RectAreaLight,
  SpotLight
} from 'three';

import { Lights } from '#/app/utils/light-controllers-utils';
import { QualityConfig } from './quality-config';

export class LightFactory {
  static createLights(quality: QualityConfig): Lights {
    const lights = {
      ambient: new AmbientLight(0xffffff, 0.2),
      directional: new DirectionalLight(0x00fffc, 0.9),
      hemisphere: new HemisphereLight(0xff0000, 0x0000ff, 0.9),
      point: new PointLight(0xff9000, 1.5, 0, 2),
      rectArea: new RectAreaLight(0x4e00ff, 6, 1, 1),
      spot: new SpotLight(0x78ff00, 4.5, 5, Math.PI * 0.1, 0.25, 1)
    };

    this.configureLightPositions(lights);
    lights.point.visible = quality.pointLightEnabled;
    
    return lights;
  }

  private static configureLightPositions(lights: Lights) {
    lights.directional.position.set(1, 0, 0);
    lights.point.position.set(1, -0.5, 1);
    lights.rectArea.position.set(-1.5, 0, 1.5);
    lights.spot.position.set(0, 2, 3);

    lights.rectArea.lookAt(0, 0, 0);
    lights.spot.target.position.set(-0.75, 0, 0);
  }
}
