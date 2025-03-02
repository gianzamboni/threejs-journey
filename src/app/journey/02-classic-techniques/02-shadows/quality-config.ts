import * as THREE from "three";

import { Quality } from "#/app/layout/quality-selector"

export type QualityConfig = {
  shadowMapSize: number;
  shadowMapType: THREE.ShadowMapType;
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    shadowMapSize: 2048,
    shadowMapType: THREE.BasicShadowMap
  },
  [Quality.High]: {
    shadowMapSize: 2048,
    shadowMapType: THREE.PCFSoftShadowMap
  }
}