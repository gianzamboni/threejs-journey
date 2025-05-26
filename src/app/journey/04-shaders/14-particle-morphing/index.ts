import { AdditiveBlending, Points, ShaderMaterial, SphereGeometry, Uniform } from "three";
import { BufferGeometry } from "three";

import { Customizable } from "#/app/decorators/customizable";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import particlesFragmentShader from "./shaders/particles.frag";
import particlesVertexShader from "./shaders/particles.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

const BACKGROUND_COLOR = "#160920";
@Exercise('particle-morphing')
export class ParticleMorphing extends OrbitControlledExercise {

  @Customizable([{
    propertyPath: "clearColor",
    initialValue: BACKGROUND_COLOR,
    type: "color",
    settings: {
      name: "Background Color",
      onChange: "updateBackgroundColor",
    }
  }])
  private _view: RenderView;

  private geometry: BufferGeometry;
  private material: ShaderMaterial;
  private points: Points;

  constructor(view: RenderView) {
    super(view);
    this._view = view;
    this.geometry = new SphereGeometry(3);
    this.geometry.setIndex(null);
    this.material = new ShaderMaterial({
      blending: AdditiveBlending,
      depthWrite: false,
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uSize: new Uniform(0.5),
        uResolution: new Uniform(this.view.resolution),
      }
    });

    this.points = new Points(this.geometry, this.material);
    this.scene.add(this.points);

    this.camera.fov = 35;
    this.camera.position.set(-4, 0, 18);
    this.camera.lookAt(0 ,0, 0);
    this.camera.updateProjectionMatrix();
    this._view.setRender({
      clearColor: BACKGROUND_COLOR,
    })
  }

  public updateBackgroundColor(color: string) {
    this._view.setRender({
      clearColor: color,
    })
  }

}