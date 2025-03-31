import * as THREE from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/utils/assets-loader";
import { disposeObjects } from "#/app/utils/three-utils";

type Lights = {
  ambient: THREE.AmbientLight;
  directional: THREE.DirectionalLight;
  spot: THREE.SpotLight;
  point: THREE.PointLight;
}

@Exercise('baked-shadow')
@Description(["<strong>Shadows are baked in this scene, are less realistic but faster to render.</strong>"])
export class BakedShadow extends OrbitControlledExercise {
  private lights: Lights;

  private material: THREE.MeshStandardMaterial;
  private sphere: THREE.Mesh;
  private plane: THREE.Mesh;

  private bakedShadowTexture: THREE.Texture;
  private bakedShadowMaterial: THREE.MeshBasicMaterial;
  private sphereShadow: THREE.Mesh;
  
  private loader: AssetLoader;

  constructor(view: RenderView) {
    super(view);
    
    this.loader = AssetLoader.getInstance();
    this.lights = this.createLights();

    this.material = new THREE.MeshStandardMaterial({ roughness: 0.7 });
    
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    );

    this.plane = this.createPlane();

    this.bakedShadowTexture = this.loader.loadTexture('/textures/shadows/simple-shadow.jpg');
    
    this.bakedShadowMaterial = new THREE.MeshBasicMaterial({
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
      ambient: new THREE.AmbientLight(0xffffff, 1),
      directional: new THREE.DirectionalLight(0xffffff, 1.5),
      spot: new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3),
      point: new THREE.PointLight(0xffffff, 2.7),
    }

    lights.directional.position.set(2, 2, -1);
    lights.spot.position.set(0, 2, 2);
    lights.point.position.set(-1, 1, 0);

    return lights;
  }

  private createPlane(): THREE.Mesh {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      this.material
    );
    
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;

    return plane;
  }

  private createBakedShadow(): THREE.Mesh {
    const bakedShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      this.bakedShadowMaterial
    );

    bakedShadow.rotation.x = -Math.PI * 0.5;
    bakedShadow.position.y = this.plane.position.y + 0.01;

    return bakedShadow;
  }
}
