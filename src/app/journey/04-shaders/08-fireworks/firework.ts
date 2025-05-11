import gsap from "gsap";
import { 
  Color, 
  ShaderMaterial, 
  BufferGeometry, 
  Spherical, 
  Texture, 
  Vector2, 
  Vector3, 
  Float32BufferAttribute, 
  AdditiveBlending, 
  Uniform, 
  Points,
  Scene
} from "three";

import fireworkFragmentShader from "./firework.frag";
import fireworkVertexShader from "./firework.vert";

type FireworkParams = {
  scene: Scene;
  count: number;
  position: Vector3;
  size: number;
  texture: Texture;
  spreadRadius: number;
  color: Color;
  resolution: Vector2;
  pixelRatio: number;
}

export class Firework {

  private geometry: BufferGeometry;
  private material: ShaderMaterial;
  private mesh: Points; 

  public static create(params: FireworkParams) {
    return new Firework(params);
  }

  private constructor(params: FireworkParams) {
    const { 
      count, 
      position, 
      size, 
      texture, 
      spreadRadius, 
      color, 
      resolution, 
      pixelRatio,
      scene
    } = params;

    const positionArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);
    const timeMultiplierArray = new Float32Array(count);

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
      
      timeMultiplierArray[i] = 1 + Math.random();

    }

    this.geometry = new BufferGeometry();
    this.geometry.setAttribute('position', new Float32BufferAttribute(positionArray, 3));
    this.geometry.setAttribute('aSize', new Float32BufferAttribute(sizeArray, 1));
    this.geometry.setAttribute('aTimeMultiplier', new Float32BufferAttribute(timeMultiplierArray, 1));

    const correctedResolution = new Vector2(resolution.x * pixelRatio, resolution.y * pixelRatio);
    this.material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexShader: fireworkVertexShader,
      fragmentShader: fireworkFragmentShader,
      uniforms: {
        uSize: new Uniform(size),
        uResolution: new Uniform(correctedResolution),
        uTexture: new Uniform(texture),
        uColor: new Uniform(color),
        uProgress: new Uniform(0),
      },
    });
    
    this.mesh = new Points(this.geometry, this.material);
    this.mesh.position.copy(position);
    scene.add(this.mesh);
    
    gsap.to(this.material.uniforms.uProgress, {
      value: 1,
      duration: 3,
      ease: "linear",
      onComplete: this.dispose.bind(this),
    });
  }

  addToScene(scene: Scene) {
    scene.add(this.mesh);
  }

  dispose() {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    (this.mesh.material as ShaderMaterial).dispose();
  }
}
