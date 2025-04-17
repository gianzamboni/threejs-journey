import { BasicShadowMap, PCFSoftShadowMap, ShadowMapType } from "three";

import { Quality } from "#/app/layout/quality-selector";

export type QualityConfig = {
  shadowMap: {
    size: number;
    type: ShadowMapType;
  }
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    shadowMap: {
      size: 2048,
      type: BasicShadowMap
    }
  },
  [Quality.High]: {
    shadowMap: {
      size: 2048,
      type: PCFSoftShadowMap
    }
  }
}; 