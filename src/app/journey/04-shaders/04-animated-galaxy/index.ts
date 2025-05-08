import { 
  BufferGeometry,
  Points,
  PerspectiveCamera,
  AdditiveBlending,
  Color,
  BufferAttribute,
  ShaderMaterial
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { randomSign } from '#/app/utils/random-utils';
import fragmentShader from './fragment.frag';
import { GALAXY_CONFIG } from './galaxy-configs';
import vertexShader from './vertex.vert';

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

@Exercise('animated-galaxy')
@Description(
  "<strong>A galaxy generator that creates a galaxy based on the settings.</strong>", 
  "You can configure the galaxy with the hidden ui."
)
export class AnimatedGalaxy extends OrbitControlledExercise {
  @Customizable(GALAXY_CONFIG)
  private galaxySettings: GalaxyParams = {
    count: 100000,
    size: 0.01,
    radius: 10,
    branches: 5,
    spin: 1,
    randomness: 1,
    randomnessPower: 5,
    insideColor: '#ff6030',
    outsideColor: '#0048bd'
  };

  private galaxy: {
    geometry: BufferGeometry;
    material: ShaderMaterial;
    points: Points;
  };

  constructor(view: RenderView) {
    super(view);

    this.galaxy = this.generateGalaxy();

    this.camera.position.set(3,2,3);
    (this.camera as PerspectiveCamera).near = 0.001;
  }

  public updateGalaxySettings<K extends keyof GalaxyParams>(newValue: GalaxyParams[K], { property }: { property: K }) {
    this.galaxySettings[property] = newValue;
    this.disposeGalaxy();
    this.galaxy = this.generateGalaxy();
  }

  @DebugFPS
  public frame(timer: Timer) {
    super.frame(timer);
    this.galaxy.material.uniforms.uTime.value = timer.getElapsed();
  }

  private generateGalaxy() {
    const geometry = this.generateGalaxyGeometry();
    const material = this.generateGalaxyMaterial();
    const points = new Points(geometry, material);
    this.scene.add(points);

    return { geometry, material, points };
  }

  private generateGalaxyMaterial() {
    return new ShaderMaterial({
      depthWrite: false,
      blending: AdditiveBlending,
      vertexColors: true,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      uniforms: {
        uSize: { value: 75   * this.view.pixelRatio },
        uTime: { value: 0 },
      },
    });
  }

  private generateGalaxyGeometry() {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(this.galaxySettings.count * 3);
    const colors = new Float32Array(this.galaxySettings.count * 3);
    const scales = new Float32Array(this.galaxySettings.count);
    const randomnes = new Float32Array(this.galaxySettings.count * 3);

    const colorInside = new Color(this.galaxySettings.insideColor);
    const colorOutside = new Color(this.galaxySettings.outsideColor);

    for (let i = 0; i < this.galaxySettings.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * this.galaxySettings.radius;

      const branchAngle = (i % this.galaxySettings.branches) / this.galaxySettings.branches * Math.PI * 2;
      
     positions[i3] = Math.cos(branchAngle) * radius;
     positions[i3 + 1] = 0;
     positions[i3 + 2] = Math.sin(branchAngle) * radius;

     const mixedColor = colorInside.clone();
     mixedColor.lerp(colorOutside, radius / this.galaxySettings.radius);
    
     colors[i3] = mixedColor.r;
     colors[i3 + 1] = mixedColor.g;
     colors[i3 + 2] = mixedColor.b;

     randomnes[i3] = this.randomDisplacement(radius);
     randomnes[i3 + 1] = this.randomDisplacement(radius);
     randomnes[i3 + 2] = this.randomDisplacement(radius);

     scales[i] = Math.random();
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new BufferAttribute(randomnes, 3));
    return geometry;
  }

  private randomDisplacement(radius: number) {
    return Math.pow(Math.random(), this.galaxySettings.randomnessPower) * (randomSign() * this.galaxySettings.randomness * radius);
  }

  private disposeGalaxy() {
    this.scene.remove(this.galaxy.points);
    this.galaxy.geometry.dispose();
    this.galaxy.material.dispose();
  }

  async dispose() {
    super.dispose();
    this.disposeGalaxy();
  }
} 