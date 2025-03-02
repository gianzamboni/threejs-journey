import * as THREE from "three";

import { Quality } from "#/app/layout/quality-selector"

export type QualityConfig = {
  shadowMapType: THREE.ShadowMapType;
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    shadowMapType: THREE.BasicShadowMap
  },
  [Quality.High]: {
    shadowMapType: THREE.PCFSoftShadowMap
  }
}