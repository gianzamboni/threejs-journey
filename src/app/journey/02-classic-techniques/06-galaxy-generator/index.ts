import { 
  BufferGeometry,
  PointsMaterial,
  Points,
  Texture,
  PerspectiveCamera,
  AdditiveBlending,
  Color,
  BufferAttribute
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/utils/assets-loader';
import { randomSign } from '#/app/utils/random-utils';
import { GALAXY_CONFIG } from './galaxy-configs';

type GalaxyParams = {
  count: number;
  size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  insideColor: string;
  outsideColor: string;
}

@Exercise('galaxy-generator')
@Description(["<strong>A galaxy generator that creates a galaxy based on the settings.</strong>", "You can configure the galaxy with the hidden ui."])
export class GalaxyGenerator extends OrbitControlledExercise {
  @Customizable(GALAXY_CONFIG)
  private galaxySettings: GalaxyParams = {
    count: 100000,
    size: 0.01,
    radius: 10,
    branches: 5,
    spin: 1,
    randomness: 2,
    randomnessPower: 5,
    insideColor: '#ff6030',
    outsideColor: '#0048bd'
  };

  private geometry: BufferGeometry | undefined = undefined;
  private material: PointsMaterial | undefined = undefined;
  private points: Points | undefined = undefined;

  private particleTexture: Texture;

  constructor(view: RenderView) {
    super(view);

    const assetLoader = AssetLoader.getInstance();
    this.particleTexture = assetLoader.loadTexture('/textures/particles/4.png');
    // Generate initial galaxy
    this.camera.position.set(3,2,3);
    (this.camera as PerspectiveCamera).near = 0.001;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.125;
    this.generateGalaxy();
  }

  public updateGalaxySettings<K extends keyof GalaxyParams>(newValue: GalaxyParams[K], { property }: { property: K }) {
    this.galaxySettings[property] = newValue;
    this.generateGalaxy();
  }

  @DebugFPS
  public frame(timer: Timer) {
    super.frame(timer);
  }

  /**
   * Generates the galaxy based on current settings
   */
  private generateGalaxy() {
    // Dispose of old geometry if it exists
    this.disposeGalaxy();

    this.geometry = this.generateGalaxyGeometry();
    this.material = this.generateGalaxyMaterial();
    this.points = new Points(this.geometry, this.material);
    this.scene.add(this.points);

  }

  private generateGalaxyMaterial() {
    return new PointsMaterial({
      size: this.galaxySettings.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexColors: true,
      alphaMap: this.particleTexture
    });
  }

  private generateGalaxyGeometry() {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(this.galaxySettings.count * 3);
    const colors = new Float32Array(this.galaxySettings.count * 3);
    
   
    const colorInside = new Color(this.galaxySettings.insideColor);
    const colorOutside = new Color(this.galaxySettings.outsideColor);

    for (let i = 0; i < this.galaxySettings.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * this.galaxySettings.radius;
      const spinAngle = radius * this.galaxySettings.spin;

      const branchAngle = (i % this.galaxySettings.branches) / this.galaxySettings.branches * Math.PI * 2;
      
     positions[i3] = Math.cos(branchAngle + spinAngle) * radius + this.randomDisplacement(radius);
     positions[i3 + 1] = this.randomDisplacement(radius);
     positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + this.randomDisplacement(radius);

     const mixedColor = colorInside.clone();
     mixedColor.lerp(colorOutside, radius / this.galaxySettings.radius);
    
     colors[i3] = mixedColor.r;
     colors[i3 + 1] = mixedColor.g;
     colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    return geometry;
  }

  private randomDisplacement(radius: number) {
    return Math.pow(Math.random(), this.galaxySettings.randomnessPower) * (randomSign() * this.galaxySettings.randomness * radius);
  }

  private disposeGalaxy() {
    if (this.points) {
      this.scene.remove(this.points);
      this.geometry?.dispose();
      this.material?.dispose();
    }
  }

  async dispose() {
    super.dispose();
    this.geometry?.dispose();
    this.material?.dispose();
    this.particleTexture.dispose();
  }
} 