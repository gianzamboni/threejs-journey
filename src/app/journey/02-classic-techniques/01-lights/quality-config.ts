import { Quality } from "@/app/layout/quality-selector";

export type QualityConfig = {
  sphereSegments: number;
  torus: {
    radialSegments: number;
    tubularSegments: number;
  };
  pointLightEnabled: boolean;
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    sphereSegments: 8,
    torus: {
      radialSegments: 8,
      tubularSegments: 16,
    },
    pointLightEnabled: false,
  },
  [Quality.High]: {
    sphereSegments: 64,
    torus: {
      radialSegments: 64,
      tubularSegments: 128,
    },
    pointLightEnabled: true,
  }
}
