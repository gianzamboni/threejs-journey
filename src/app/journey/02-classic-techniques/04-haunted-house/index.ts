import * as THREE from 'three';

import { Timer } from 'three/addons/misc/Timer.js';
import { Sky } from 'three/addons/objects/Sky.js';

import { DebugFPS } from '#/app/decorators/debug';
import { Exercise, OrbitControllerDescription } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import { Quality } from '#/app/layout/quality-selector';
import RenderView from '#/app/layout/render-view';
import { Bushes } from './bushes';
import { Floor } from './floor';
import { Ghosts } from './ghosts';
import { Graves } from './graves';
import { House } from './house';
import { QUALITY_CONFIG, QualityConfig } from './quality-config';
import { SceneObject } from './scene-object';

/**
 * Haunted House exercise
 */
@Exercise('haunted-house')
@OrbitControllerDescription()
export class HauntedHouse extends OrbitControlledExercise {
  private lights: {
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    sky: Sky;
  };

  private ghosts: Ghosts;
  private fog: THREE.FogExp2;
  private children: SceneObject[];

  private quality: QualityConfig;
  /**
   * Create a new haunted house
   */
  constructor(view: RenderView, quality: Quality) {
    super(view);
    this.quality = QUALITY_CONFIG[quality];

    this.scene = new THREE.Scene();
    this.lights = this.createLights();
    this.ghosts = new Ghosts(this.quality);
    this.fog = new THREE.FogExp2("#04343f", 0.1);
      
    this.children = [
      new Floor(this.quality),
      new House(this.quality),
      new Bushes(this.quality),
      new Graves(this.quality),
      this.ghosts,
    ];

    this.camera.position.set(5, 2, 7);
    this.camera.lookAt(0, 0, 0);
    
    this.scene.fog = this.fog; 

    this.scene.add(
      ...Object.values(this.lights),
      ...this.children.map(child => child.object),
    )
    view.enableShadows(this.quality.shadowMapType);
  }

  /**
   * Create lights for the scene
   */
  private createLights(): { ambient: THREE.AmbientLight; directional: THREE.DirectionalLight; sky: Sky } {
    const lights = {
      ambient: new THREE.AmbientLight(0x86cdff, 0.275),
      directional: this.createDirectionLight(),
      sky: this.createSkyLight(),
    };
    return lights;
  }

  /**
   * Create a sky light
   */
  private createSkyLight(): Sky {
    const sky = new Sky();
    sky.material.uniforms['turbidity'].value = 10;
    sky.material.uniforms['rayleigh'].value = 3;
    sky.material.uniforms['mieCoefficient'].value = 0.1;
    sky.material.uniforms['mieDirectionalG'].value = 0.95;
    sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

    sky.scale.set(100, 100, 100);
    return sky;
  }

  /**
   * Create a directional light
   */
  private createDirectionLight(): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(0x86cdff, 1);
    light.position.set(3, 2, -8);
    light.castShadow = this.quality.shadows;
    if (this.quality.shadows) {
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.camera.top = 8;
      light.shadow.camera.right = 8;
      light.shadow.camera.bottom = -8;
      light.shadow.camera.left = -8;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 20;
      light.shadow.camera.updateProjectionMatrix();
    }
    return light;
  }

  /**
   * Animation frame
   */
  @DebugFPS
  frame(timer: Timer): void {
    super.frame(timer);
    const elapsedTime = timer.getElapsed();
    this.ghosts.animate(elapsedTime);
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await super.dispose();
    this.lights.ambient.dispose();
    this.lights.directional.dispose();
    this.lights.sky.material.dispose();
    this.lights.sky.geometry.dispose();
    for (const child of this.children) {
      child.dispose();
    }
  }
} 