import * as THREE from "three";

import { Quality } from "#/app/layout/quality-selector";

export type QualityConfig = {
  shadowMapType: THREE.ShadowMapType;
  sphereSubdivisions: number;
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    shadowMapType: THREE.BasicShadowMap,
    sphereSubdivisions: 16
  },
  [Quality.High]: {
    shadowMapType: THREE.PCFSoftShadowMap,
    sphereSubdivisions: 32
  }
} 