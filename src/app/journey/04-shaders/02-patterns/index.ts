import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { Exercise, Description } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import testFragmentShader from './shaders/frag.frag'
import testVertexShader from './shaders/vertex.vert'

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


// const shaders: Record<string, string> = {
//   "Solid Color": solidColorFragmentShader,
//   "Cool UV Map": coolUVFragmentShader,
//   "Warm UV Map": warmUVFragmentShader,
//   "Black & White X Gradient": blackAndWhiteXGradientFragmentShader,
//   "Black & White Y Gradient": blackAndWhiteYGradientFragmentShader,
// }

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
      fragmentShader: testFragmentShader,
      side: DoubleSide
    });

    console.log(this.geometry.attributes.uv)
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.camera.position.set(0, 0, 1);
  }

  //@Selectable('Change shader', shaders, warmUVFragmentShader)
  changeShader(shader: string) {
    this.material.fragmentShader = shader;
    this.material.needsUpdate = true;
  }

  async dispose() {
    super.dispose();
  }

}