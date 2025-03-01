import * as THREE from "three";
import { Quality } from "@/app/layout/quality-selector";


export type QualityConfig = {
  materialSide: THREE.Side;
 }

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
   [Quality.Low]: {
     materialSide: THREE.FrontSide,
   },
   [Quality.High]: {
     materialSide: THREE.DoubleSide,
   }
 }
 