import { Blending, NormalBlending } from "three";
import { AdditiveBlending } from "three";

import { Quality } from "#/app/layout/quality-selector";

export type QualityConfig = {
  initialColor: string;
  segments: number;
  blending: Blending;
  shader: {
    bigWaves: {
      frequencyX: number;
    }
    smallWaves: {
      elevation: number;
    }
  }
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    segments: 512,
    blending: NormalBlending,
    initialColor: "#2085bc",
    shader: {
      bigWaves: {
        frequencyX: 0.5
      },
      smallWaves: {
        elevation: 0.2,
      }
    }
  },
  [Quality.High]: {
    segments: 1536,
    blending: AdditiveBlending,
    initialColor: "#114e6e",
    shader: {
      bigWaves: {
        frequencyX: 0.15
      },
      smallWaves: {
        elevation: 0.15
      }
    }
  },
}; 