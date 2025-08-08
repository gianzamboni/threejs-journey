import { Mesh, MeshPhysicalMaterial, PlaneGeometry, Scene, SphereGeometry, TorusGeometry } from "three";

import { Timer } from "three/examples/jsm/misc/Timer.js";

import { disposeMesh, disposeObjects } from "#/app/utils/three-utils";
import { QualityConfig } from "./quality-config";

export class GlassCollection { 
  private material: MeshPhysicalMaterial;

  private meshes: Mesh[];

  constructor(qualityConfig: QualityConfig) {
    this.material = this.createMaterial(qualityConfig);
    this.meshes = this.generateMeshes();
  }

  frame(timer: Timer) {
    for(const mesh of this.meshes) {
      mesh.rotation.y = 0.01 * timer.getElapsed();
      mesh.rotation.x = -0.15 * timer.getElapsed();
    }
  }

  addTo(scene: Scene) {
    scene.add(...this.meshes);
  }

  dispose() {
    disposeMesh(...this.meshes);
    disposeObjects(this.material);
  } 

  private createMaterial(qualityConfig: QualityConfig) {
    return new MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.1,
      transmission: 1,
      ior: 1.5,
      thickness: 0.5,
      side: qualityConfig.materialSide,
    });
  }


  private generateMeshes() {
    const geometries = [
      new SphereGeometry(0.5, 64, 64),
      new PlaneGeometry(1, 1, 1, 1),
      new TorusGeometry(0.3, 0.2, 64, 128),
    ]

    return geometries.map((geometry, index) => {
      const mesh = new Mesh(geometry, this.material);
      mesh.position.x = index * 1.5 - 1.5;
      return mesh;
    });
  }
}