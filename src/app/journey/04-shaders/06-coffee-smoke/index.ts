import { DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, ShaderMaterial, Texture, Uniform } from "three";

import { Timer } from "three/addons/misc/Timer.js";

import { Description, Exercise, Starred } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import smokeFrag from "./smoke.frag";
import smokeVert from "./smoke.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise("coffee-smoke")
@Starred
@Description("<p>Creating a coffee smoke effect using shaders</p>")
export class CoffeeSmoke extends OrbitControlledExercise {
  
  private coffeeMug: Group | undefined;
  
  private smoke: {
    geometry: PlaneGeometry;
    material: ShaderMaterial;
    mesh: Mesh;
  }

  private perlinTexture: Texture;
  
  constructor(view: RenderView) {
    super(view);
    this.camera.position.set(4, 5, 6);
    this.controls.target.y = 3;

    this.loadCoffeeMug();
    this.perlinTexture = this.loadPerlinTexture();
    this.smoke = this.createSmoke();

    this.scene.add(this.smoke.mesh);
  }

  private loadPerlinTexture() {
    const texture = AssetLoader.getInstance().loadTexture("/textures/perlin.png");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    return texture;
  }

  private createSmoke() {
    const geometry = new PlaneGeometry(1, 1, 16, 64);
    geometry.translate(0, 0.5, 0);
    geometry.scale(1.5, 6, 1.5);

    const material = new ShaderMaterial({
      side: DoubleSide,
      vertexShader: smokeVert,
      fragmentShader: smokeFrag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uPerlinTexture: new Uniform(this.perlinTexture),
        uTime: new Uniform(0),
      },
    });

    const mesh = new Mesh(geometry, material);
    mesh.position.y = 1.83;

    return {
      geometry,
      material,
      mesh,
    }
  }
  
  public frame(timer: Timer) {
    super.frame(timer);
    this.smoke.material.uniforms.uTime.value = timer.getElapsed();
  }

  private loadCoffeeMug() {
    AssetLoader.getInstance().loadModel("/models/coffeeCup/bakedModel.glb", (gltf) => {
      this.coffeeMug = gltf;

      const coffeeMug = gltf.children[0] as Mesh;
      const material = coffeeMug.material as MeshBasicMaterial;
      material.map!.anisotropy = 8;
      this.scene.add(coffeeMug);
    });
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.smoke.mesh);

    this.coffeeMug?.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.dispose();
      }
    });
  }
}