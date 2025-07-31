import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, Scene, ShaderMaterial } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import RenderView from "#/app/layout/render-view";
import fragmentShader from './shaders/fireflies.frag';
import vertexShader from './shaders/fireflies.vert';
export class Fireflies {

  private geometry: BufferGeometry;
  public material: ShaderMaterial;

  private points: Points;

  private renderView: RenderView;

  constructor(renderView: RenderView) {
    this.geometry = new BufferGeometry();

    const firefliesCount = 30
    const positionArray = new Float32Array(firefliesCount * 3)
    const scaleArray = new Float32Array(firefliesCount)

    for (let i = 0; i < firefliesCount; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
      positionArray[i * 3 + 1] = Math.random() * 1.5;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

      scaleArray[i] = Math.random();
    }

    this.geometry.setAttribute('position', new BufferAttribute(positionArray, 3));
    this.geometry.setAttribute('aScale', new BufferAttribute(scaleArray, 1))

    this.renderView = renderView;
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPixelRatio: { value: renderView.pixelRatio },
        uSize: { value: 100  },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    this.points = new Points(this.geometry, this.material);

    this.renderView.addEventListener('resize', () => {
      this.material.uniforms.uPixelRatio.value = this.renderView.pixelRatio;
    });
  }

  frame(time: Timer) {
    this.material.uniforms.uTime.value = time.getElapsed();
  }

  public addToScene(scene: Scene) {
    scene.add(this.points);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}