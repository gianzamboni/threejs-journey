import { 
  Scene,
  BufferGeometry,
  Texture,
  PointsMaterial,
  Points,
  BufferAttribute,
  Color,
  AdditiveBlending
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/services/assets-loader';
import { disposeObjects } from '#/app/utils/three-utils';

/**
 * Particles exercise
 */
@Exercise('particles')
@Description("<strong>Random generated particles that move in sine wave like movement.</strong>")
export class Particles extends OrbitControlledExercise {
  private particleGeometry: BufferGeometry;
  private particleTexture: Texture;
  private pointMaterial: PointsMaterial;
  private particles: Points;
  private count: number;

  /**
   * Create a new particles scene
   */
  constructor(view: RenderView) {
    super(view);
    this.count = 6250;

    this.scene = new Scene();
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
  private createParticleGeometry(): BufferGeometry {
    const geometry = new BufferGeometry();

    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));

    return geometry; 
  }

  private createParticleTexture(): Texture {
    const assetLoader = AssetLoader.getInstance();
    return assetLoader.loadTexture('/textures/particles/4.png');
  }

  private createParticles(): Points {
    const particles = new Points(this.particleGeometry, this.pointMaterial);
    return particles;
  }

  private createPointMaterial(): PointsMaterial {
    return new PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      color: new Color("#ffa8db"),
      alphaMap: this.particleTexture,
      depthWrite: false,
      blending: AdditiveBlending,
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
  async dispose() {
    await super.dispose();
    disposeObjects(
      this.particleGeometry,
      this.pointMaterial,
      this.particleTexture
    );
  }
} 