import { 
  ShadowMapType,
  BasicShadowMap,
  PCFSoftShadowMap
} from "three";

import { Quality } from "#/app/layout/quality-selector";

export type QualityConfig = {
  shadowMapType: ShadowMapType;
  sphereSubdivisions: number;
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    shadowMapType: BasicShadowMap,
    sphereSubdivisions: 16
  },
  [Quality.High]: {
    shadowMapType: PCFSoftShadowMap,
    sphereSubdivisions: 32
  }
} 