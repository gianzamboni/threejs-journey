import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Exercise, Description, Selectable } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { LocalStorage } from "#/app/services/local-storage";
import { SHADER_DICTIONARY, SHADER_LIST } from "./shaders";
import testVertexShader from './shaders/vertex.vert'


const defaultShader = LocalStorage.getState<string>('patterns') ?? "Solid Color";

@Exercise('patterns')
@Description('<p>Some basic shader patterns.</p>')
export class Patterns extends OrbitControlledExercise {

  private geometry: PlaneGeometry;

  private material: ShaderMaterial;

  private mesh: Mesh;

  private selectedShader: keyof typeof SHADER_DICTIONARY;

  constructor(view: RenderView) {
    super(view);

    this.geometry = new PlaneGeometry(1, 1, 1, 1);
    
    this.selectedShader = LocalStorage.getState(this) ?? "Solid Color";

    this.material = new ShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: SHADER_DICTIONARY[this.selectedShader],
      side: DoubleSide,
      uniforms: {
        uTime: {
          value: 0
        }
      }
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.camera.position.set(0, 0, 1);
  }

  @Selectable('Shader', SHADER_LIST, defaultShader)
  changeShader(shader: keyof typeof SHADER_DICTIONARY) {
    this.material.fragmentShader = SHADER_DICTIONARY[shader];
    this.material.needsUpdate = true;
    this.selectedShader = shader;
    LocalStorage.saveState(this, this.selectedShader);
  }

  frame(timer: Timer): void {
    super.frame(timer);
    this.material.uniforms.uTime.value = timer.getElapsed();
  }

  async dispose() {
    super.dispose();
  }

}