import { 
  AmbientLight,
  DirectionalLight,
  SpotLight,
  PointLight,
  MeshStandardMaterial,
  Mesh,
  Texture,
  MeshBasicMaterial,
  SphereGeometry,
  PlaneGeometry
} from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeObjects } from "#/app/utils/three-utils";

type Lights = {
  ambient: AmbientLight;
  directional: DirectionalLight;
  spot: SpotLight;
  point: PointLight;
}

@Exercise('baked-shadow')
@Description("<p>Shadows are baked in this scene, are less realistic but faster to render.</p>")
export class BakedShadow extends OrbitControlledExercise {
  private lights: Lights;

  private material: MeshStandardMaterial;
  private sphere: Mesh;
  private plane: Mesh;

  private bakedShadowTexture: Texture;
  private bakedShadowMaterial: MeshBasicMaterial;
  private sphereShadow: Mesh;
  
  private loader: AssetLoader;

  constructor(view: RenderView) {
    super(view);
    
    this.loader = AssetLoader.getInstance();
    this.lights = this.createLights();

    this.material = new MeshStandardMaterial({ roughness: 0.7 });
    
    this.sphere = new Mesh(
      new SphereGeometry(0.5, 32, 32),
      this.material
    );

    this.plane = this.createPlane();

    this.bakedShadowTexture = this.loader.loadTexture('/textures/shadows/simple-shadow.jpg');
    
    this.bakedShadowMaterial = new MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: this.bakedShadowTexture,
    });

    this.sphereShadow = this.createBakedShadow();

    this.camera.position.set(3, 1, 3);
    this.scene.add(
      ...Object.values(this.lights),
      this.sphere,
      this.plane,
      this.sphereShadow
    )
  }

  frame(timer: Timer): void {
    super.frame(timer);
    
    const elapsedTime = timer.getElapsed();
    this.sphere.position.x = Math.cos(elapsedTime) * 1.5;
    this.sphere.position.z = Math.sin(elapsedTime) * 1.5;
    this.sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    this.sphereShadow.position.x = this.sphere.position.x;
    this.sphereShadow.position.z = this.sphere.position.z;
    this.bakedShadowMaterial.opacity = (1 - this.sphere.position.y) * 0.5;
  }

  async dispose() {
    super.dispose();
    disposeObjects(
      this.sphere.geometry, 
      this.plane.geometry, 
      this.sphereShadow.geometry,
      ...Object.values(this.lights),
      this.material,
      this.bakedShadowMaterial,
      this.bakedShadowTexture
    );
  }

  private createLights(): Lights {
    const lights = {
      ambient: new AmbientLight(0xffffff, 1),
      directional: new DirectionalLight(0xffffff, 1.5),
      spot: new SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3),
      point: new PointLight(0xffffff, 2.7),
    }

    lights.directional.position.set(2, 2, -1);
    lights.spot.position.set(0, 2, 2);
    lights.point.position.set(-1, 1, 0);

    return lights;
  }

  private createPlane(): Mesh {
    const plane = new Mesh(
      new PlaneGeometry(5, 5),
      this.material
    );
    
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;

    return plane;
  }

  private createBakedShadow(): Mesh {
    const bakedShadow = new Mesh(
      new PlaneGeometry(1.5, 1.5),
      this.bakedShadowMaterial
    );

    bakedShadow.rotation.x = -Math.PI * 0.5;
    bakedShadow.position.y = this.plane.position.y + 0.01;

    return bakedShadow;
  }
}
