import * as THREE from "three";

import { Quality } from "#/app/layout/quality-selector";
import { TextureQuality } from "./texture-maps";
export type QualityConfig = {
  shadowMapType: THREE.ShadowMapType;
  shadows: boolean;
  textureQuality: TextureQuality;
  subdivisions: number;
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    shadowMapType: THREE.BasicShadowMap,
    shadows: false,
    textureQuality: "1k",
      subdivisions: 8,
  },
  [Quality.High]: {
    shadowMapType: THREE.PCFSoftShadowMap,
    shadows: true,
    textureQuality: "4k",
    subdivisions: 64,
  },
};
