import { Side, FrontSide, DoubleSide } from "three";

import { Quality } from "#/app/layout/quality-selector";


export type QualityConfig = {
  materialSide: Side;
 }

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
   [Quality.Low]: {
     materialSide: FrontSide,
   },
   [Quality.High]: {
     materialSide: DoubleSide,
   }
 }
 