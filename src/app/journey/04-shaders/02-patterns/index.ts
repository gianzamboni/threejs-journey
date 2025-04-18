import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { Exercise, Description } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import testFragmentShader from './shaders/solid-color.frag'
import testVertexShader from './shaders/vertex.vert'

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

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

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.camera.position.set(0.25, -0.25, 1);
  }

  async dispose() {
    super.dispose();
  }

}