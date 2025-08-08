import { BufferGeometry, MeshPhysicalMaterial, PlaneGeometry, SphereGeometry, TorusGeometry } from "three";

import { disposeObjects } from "#/app/utils/three-utils";
import { QualityConfig } from "./quality-config";

import { CenteredRotatingMeshRow } from "../../common/ThreeMeshRow";

export class GlassCollection extends CenteredRotatingMeshRow { 

  private static createMaterial(qualityConfig: QualityConfig) {
    return new MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.1,
      transmission: 1,
      ior: 1.5,
      thickness: 0.5,
      side: qualityConfig.materialSide,
    });
  }

  private static createGeometries() {
    return [
      new SphereGeometry(0.5, 64, 64),
      new PlaneGeometry(1, 1, 1, 1),
      new TorusGeometry(0.3, 0.2, 64, 128)
    ]
  }

  private material: MeshPhysicalMaterial;
  private geometries: BufferGeometry[];

  constructor(qualityConfig: QualityConfig) {
    const material = GlassCollection.createMaterial(qualityConfig);
    const geometries = GlassCollection.createGeometries();
    super(geometries, material);
    this.material = material;
    this.geometries = geometries;
  }

  dispose() {
    disposeObjects(this.material, ...this.geometries);
  } 

  
}