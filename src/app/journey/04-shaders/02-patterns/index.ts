import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { Customizable } from "#/app/decorators/customizable";
import { Exercise, Description, Selectable } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { LocalStorage } from "#/app/services/local-storage";
import { SHADER_DICTIONARY, SHADER_LIST } from "./shaders";
import testVertexShader from './shaders/vertex.vert'

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

const defaultShader = LocalStorage.getState<string>('patterns') ?? SHADER_DICTIONARY["Solid Color"];

@Exercise('patterns')
@Description('<strong>Some shader patterns</strong>')
export class Patterns extends OrbitControlledExercise {

  private geometry: PlaneGeometry;

  @Customizable([{
    propertyPath: 'uniforms.aConstant.value',
    settings: {
      min: 0,
      max: 100,
      step: 0.1,
      name: 'Constant'
    }
  }])
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
        aConstant: {
          value: 1
        }
      }
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.camera.position.set(0, 0, 1);
  }

  @Selectable('Change shader', SHADER_LIST, defaultShader)
  changeShader(shader: keyof typeof SHADER_DICTIONARY) {
    this.material.fragmentShader = SHADER_DICTIONARY[shader];
    this.material.needsUpdate = true;
    this.selectedShader = shader;
    LocalStorage.saveState(this, this.selectedShader);
  }

  async dispose() {
    super.dispose();
  }

}