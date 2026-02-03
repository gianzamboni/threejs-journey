import { 
  DirectionalLightHelper,
  PointLightHelper,
  SpotLightHelper
} from 'three';

import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

import { Lights } from '#/app/utils/light-controllers-utils';
import { QualityConfig } from './quality-config';

export type Helpers = {
  directional: DirectionalLightHelper,
  point: PointLightHelper,
  rectArea: RectAreaLightHelper,
  spot: SpotLightHelper
}

export type HelperStatusDict = Record<keyof Helpers, boolean>;
export type LightTypeHelper = keyof Helpers;

export class HelperFactory {
  static createHelpers(lights: Lights, quality: QualityConfig): [Helpers, HelperStatusDict] {
    const helpers = {
      directional: new DirectionalLightHelper(lights.directional, 0.2),
      point: new PointLightHelper(lights.point, 0.2),
      rectArea: new RectAreaLightHelper(lights.rectArea),
      spot: new SpotLightHelper(lights.spot)
    };

    const status = this.createInitialStatus(quality);
    helpers.point.visible = quality.pointLightEnabled;
    status.point = quality.pointLightEnabled;
    
    return [helpers, status];
  }

  private static createInitialStatus(quality: QualityConfig): HelperStatusDict {
    return {
      directional: true,
      point: quality.pointLightEnabled,
      rectArea: true,
      spot: true
    };
  }
}
