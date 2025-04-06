import { 
  ShadowMapType,
  BasicShadowMap,
  PCFSoftShadowMap
} from "three";

import { Quality } from "#/app/layout/quality-selector"

export type QualityConfig = {
  shadowMapType: ShadowMapType;
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    shadowMapType: BasicShadowMap
  },
  [Quality.High]: {
    shadowMapType: PCFSoftShadowMap
  }
}