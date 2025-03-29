import gsap from 'gsap';
import * as THREE from 'three';

import { Callable, Customizable } from '#/app/decorators/customizable';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { DEBUG_UI_MATERIAL_CONFIG, DEBUG_UI_GEOMETRY_CONFIG, DEBUG_UI_CUBE_CONFIG } from './debug-ui-configs';
import { disposeObjects } from '#/app/utils/three-utils';

@Exercise('debug-ui')
@Description(["<p><strong>A customizable Cube, this demo is thought to show a debug ui activated with double click.</strong></p>"])
export class DebugUITest extends OrbitControlledExercise {
  @Customizable(DEBUG_UI_CUBE_CONFIG)
  private cube: THREE.Mesh;

  @Customizable(DEBUG_UI_MATERIAL_CONFIG)
  private material: THREE.MeshBasicMaterial;

  @Customizable(DEBUG_UI_GEOMETRY_CONFIG)
  private geometry: THREE.BoxGeometry;

  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.cube);
  }

  @Callable('Awesome Cube', 'Spin')
  spin() {
      gsap.to(this.cube.rotation, { duration: 1, y: this.cube.rotation.y + Math.PI * 2 });
    }

  updateMaterialColor(newColor: string) {
    this.material.color.set(new THREE.Color(newColor));
  }

  updateSubdivisions(subdivisions: number) {
    this.geometry.dispose();
    this.geometry = new THREE.BoxGeometry(1, 1, 1, subdivisions, subdivisions, subdivisions);
    this.cube.geometry = this.geometry;
  }
  
  async dispose() {
    super.dispose();
    disposeObjects(this.material, this.geometry);
  }
}