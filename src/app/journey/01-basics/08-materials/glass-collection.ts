import { MeshPhysicalMaterial, PlaneGeometry, SphereGeometry, TorusGeometry } from "three";

import { disposeObjects } from "#/app/utils/three-utils";
import { QualityConfig } from "./quality-config";

import { CenteredRotatingMeshRow } from "../../common/centered-rotating-mesh-row";

export class GlassCollection extends CenteredRotatingMeshRow { 
  constructor(qualityConfig: QualityConfig) {
    const material = new MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.1,
      transmission: 1,
      ior: 1.5,
      thickness: 0.5,
      side: qualityConfig.materialSide,
    });
    
    const geometries = [
      new SphereGeometry(0.5, 64, 64),
      new PlaneGeometry(1, 1, 1, 1),
      new TorusGeometry(0.3, 0.2, 64, 128)
    ];

    super(geometries, material);
  }

  dispose() {
    disposeObjects(this.material, ...this.geometries);
  } 
}