import * as THREE from 'three';
import RenderView from '@/app/layout/render-view';
import gsap from 'gsap';
import { Exercise } from '@/app/decorators/exercise';
import OrbitControlledExercise from '@/app/journey/exercises/orbit-controlled-exercise';
import { Customizable } from '@/app/decorators/customizable';

@Exercise('debug-ui')
export class DebugUITest extends OrbitControlledExercise {
  @Customizable([{
    propertyPath: 'position.y',
    folderPath: 'Awesome Cube',
    settings: {
      min: -3,
      max: 3,
      step: 0.01,
      name: 'Elevation',
    }
  },{
    propertyPath: 'visible', 
    folderPath: 'Awesome Cube'
  }
  ])
  private cube: THREE.Mesh;

  // @Customizable([{
  //   propertyPath: 'wireframe',
  //   folderPath: 'Awesome Cube',
  // }, {
  //   propertyPath: 'color',
  //   type: 'color',
  //   folderPath: 'Awesome Cube',
  //   settings: {
  //     onChange: (newColor: string) => { (this! as DebugUITest).updateMaterialColor(newColor) }
  //   }
  // }])
  private material: THREE.MeshBasicMaterial;

  // @Customizable([{
  //   propertyPath: 'subdivisions',
  //   initialValue: 1,
  //   folderPath: 'Awesome Cube',
  //   settings: {
  //     min: 1,
  //     max: 20,
  //     step: 1,
  //     onFinishChange: (value: number) => { (this! as DebugUITest).updateSubdivisions(value)},
  //   }
  // }])
  private geometry: THREE.BoxGeometry;

  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.cube);
  }

  //@Callable('Awesome Cube', 'Spin')
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
    this.material.dispose();
    this.geometry.dispose();
  }
}