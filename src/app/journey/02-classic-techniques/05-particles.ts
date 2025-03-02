import * as THREE from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { DebugFPS } from '#/app/decorators/debug';
import { Exercise, OrbitControllerDescription } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/utils/assets-loader';

/**
 * Particles exercise
 */
@Exercise('particles')
@OrbitControllerDescription()
export class Particles extends OrbitControlledExercise {
  private particleGeometry: THREE.BufferGeometry;
  private particleTexture: THREE.Texture;
  private pointMaterial: THREE.PointsMaterial;
  private particles: THREE.Points;
  private count: number;

  /**
   * Create a new particles scene
   */
  constructor(view: RenderView) {
    super(view);
    this.count = 6250;

    this.scene = new THREE.Scene();
    this.particleGeometry = this.createParticleGeometry();
    this.particleTexture = this.createParticleTexture();
    this.pointMaterial = this.createPointMaterial();
    this.particles = this.createParticles();

    this.scene.add(this.particles);
    this.camera.position.set(0, 0, 5);
    this.camera.near = 0.01;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Setup particles geometry, material and mesh
   */
  private createParticleGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry; 
  }

  private createParticleTexture(): THREE.Texture {
    const assetLoader = AssetLoader.getInstance();
    return assetLoader.loadTexture('/textures/particles/4.png');
  }

  private createParticles(): THREE.Points {
    const particles = new THREE.Points(this.particleGeometry, this.pointMaterial);
    return particles;
  }

  private createPointMaterial(): THREE.PointsMaterial {
    return new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      color: new THREE.Color("#ffa8db"),
      alphaMap: this.particleTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
  }

  /**
   * Animation frame
   */
  @DebugFPS
  frame(timer: Timer): void {
    super.frame(timer);
    const elapsedTime = timer.getElapsed();
    
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const x = this.particleGeometry.attributes.position.array[i3];
      (this.particleGeometry.attributes.position.array as Float32Array)[i3 + 1] = Math.sin(elapsedTime * 0.01 + x * i);
    }
    this.particleGeometry.attributes.position.needsUpdate = true;
    this.particles.rotation.y = elapsedTime * 0.002;
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await super.dispose();
    this.particleGeometry.dispose();
    this.pointMaterial.dispose();
    this.particleTexture.dispose();
  }
} 