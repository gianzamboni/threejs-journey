import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { Exercise, Description, Selectable } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import coolUVFragmentShader from './shaders/cool-uv.frag'
import solidColorFragmentShader from './shaders/solid-color.frag'
import testVertexShader from './shaders/vertex.vert'
import warmUVFragmentShader from './shaders/warm-uv.frag'

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


const shaders: Record<string, string> = {
  "Solid Color": solidColorFragmentShader,
  "Cool UV Map": coolUVFragmentShader,
  "Warm UV Map": warmUVFragmentShader,
}

@Exercise('patterns')
@Description('<strong>Some shader patterns</strong>')
export class Patterns extends OrbitControlledExercise {

  private geometry: PlaneGeometry;
  private material: ShaderMaterial;
  private mesh: Mesh;

  constructor(view: RenderView) {
    super(view);

    this.geometry = new PlaneGeometry(1, 1, 32, 32);
    this.material = new ShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: warmUVFragmentShader,
      side: DoubleSide
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.camera.position.set(0.25, -0.25, 1);
  }

  @Selectable('Change shader', shaders, warmUVFragmentShader)
  changeShader(shader: string) {
    console.log(shader);
    this.material.fragmentShader = shader;
    this.material.needsUpdate = true;
  }

  async dispose() {
    super.dispose();
  }

}