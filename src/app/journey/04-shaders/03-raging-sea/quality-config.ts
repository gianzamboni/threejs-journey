import { Quality } from "#/app/layout/quality-selector";

export type QualityConfig = {
  segments: number;
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
    segments: 2048,
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