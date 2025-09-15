import { BoxGeometry, MeshStandardMaterial, SphereGeometry, TorusGeometry } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { disposeObjects } from "#/app/utils/three-utils";
import { QualityConfig } from "./quality-config";

import { CenteredRotatingMeshRow } from "../../common/centered-rotating-mesh-row";


export class SolidCollection extends CenteredRotatingMeshRow {

    constructor(material: MeshStandardMaterial, qualityConfig: QualityConfig) {
      const geometries = [
        new SphereGeometry(0.5, qualityConfig.sphereSegments, qualityConfig.sphereSegments),
        new BoxGeometry(0.75, 0.75, 0.75, 1, 1, 1),
        new TorusGeometry(0.3, 0.2, qualityConfig.torus.radialSegments, qualityConfig.torus.tubularSegments)
      ];
  
      super(geometries, material);
    }

    frame(timer: Timer) {
      for(const mesh of this.children) {
        mesh.rotation.y = 0.1 * timer.getElapsed();
        mesh.rotation.x = 0.15 * timer.getElapsed();
      }
    }

    dispose() {
      disposeObjects(...this.geometries);
    }
}