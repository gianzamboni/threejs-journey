import gsap from "gsap";
import { 
  AdditiveBlending,
  BufferGeometry, 
  Color, 
  Float32BufferAttribute, 
  Points, 
  ShaderMaterial, 
  Spherical, 
  Texture, 
  Uniform, 
  Vector2, 
  Vector3 
} from "three";

import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import fireworkFragmentShader from "./firework.frag";
import fireworkVertexShader from "./firework.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

type FireworkParams = {
  count: number;
  position: Vector3;
  size: number;
  texture: Texture;
  spreadRadius: number;
  color: Color;
}

@Exercise("Fireworks")
export default class Fireworks extends OrbitControlledExercise {

  private resolution: Vector2;
  private pixelRatio: number;

  private textures: Texture[];

  constructor(renderView: RenderView) {
    super(renderView);

    this.camera.fov = 25;
    this.camera.position.set(1.5, 0, 6);
    this.camera.updateProjectionMatrix();

    this.resolution = new Vector2(this.view.width, this.view.height);
    this.pixelRatio = this.view.pixelRatio;

    this.textures = this.loadTextures();

    this.createFireworks({
      count: 100,
      position: new Vector3(0, 0, 0),
      size: 0.5,
      texture: this.textures[7],
      spreadRadius: 1,
      color: new Color("#8affff"),
    });

    this.view.addEventListener('resize', () => {
      this.resolution.set(this.view.width, this.view.height);
      this.pixelRatio = this.view.pixelRatio;
    });
  }

  createFireworks(params: FireworkParams) {
    const { count, position, size, texture, spreadRadius, color } = params;

    const positionArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const spherical = new Spherical(
        spreadRadius * (0.75 + Math.random() * 0.25), 
        Math.random() * Math.PI, 
        Math.random() * Math.PI * 2
      );
      const position = new Vector3().setFromSpherical(spherical);

      positionArray[i3] = position.x;
      positionArray[i3 + 1] = position.y;
      positionArray[i3 + 2] = position.z;
      sizeArray[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positionArray, 3));
    geometry.setAttribute('aSize', new Float32BufferAttribute(sizeArray, 1));

    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexShader: fireworkVertexShader,
      fragmentShader: fireworkFragmentShader,
      uniforms: {
        uSize: new Uniform(size),
        uResolution: new Uniform(this.resolution.multiplyScalar(this.pixelRatio)),
        uPixelRatio: new Uniform(this.pixelRatio),
        uTexture: new Uniform(texture),
        uColor: new Uniform(color),
        uProgress: new Uniform(0),
      },
    });

    gsap.to(material.uniforms.uProgress, {
      value: 1,
      duration: 3,
      ease: "linear",
    });

    const fireworks = new Points(geometry, material);
    fireworks.position.copy(position);
    this.scene.add(fireworks);
  }

  private loadTextures() {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
      const texture = AssetLoader.getInstance().loadTexture(`textures/particles/${number}.png`);
      texture.flipY = false;
      return texture;
    });
  }

  async dispose() {
    super.dispose();
  }
}