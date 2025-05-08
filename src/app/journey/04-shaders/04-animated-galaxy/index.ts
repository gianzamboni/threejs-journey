import { 
  BufferGeometry,
  Points,
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
import fragmentShader from './fragment.frag';
import vertexShader from './vertex.vert';

import { galaxyControllers } from '../../common/galaxy/controllers';
import { configureCamera, Galaxy, GALAXY_DEFAULT_SETTINGS, GalaxyParams, randomDisplacement } from '../../common/galaxy/galaxy';
import { disposeMesh } from '#/app/utils/three-utils';

@Exercise('animated-galaxy')
@Description(
  "<strong>A galaxy generator that creates a galaxy based on the settings.</strong>", 
  "You can configure the galaxy with the hidden ui."
)
export class AnimatedGalaxy extends OrbitControlledExercise {
  
  @Customizable(galaxyControllers(1, 100))
  private galaxySettings: GalaxyParams = {
    ...GALAXY_DEFAULT_SETTINGS,
    size: 32,
  };

  private galaxy: Galaxy<ShaderMaterial>;

  constructor(view: RenderView) {
    super(view);
    this.galaxy = this.generateGalaxy();
    this.scene.add(this.galaxy.points);

    configureCamera(this.camera);
  }

  public updateGalaxySettings<K extends keyof GalaxyParams>(newValue: GalaxyParams[K], { property }: { property: K }) {
    this.galaxySettings[property] = newValue;

    if (property === 'size') {
      this.galaxy.material.uniforms.uSize.value = (newValue as number) * this.view.pixelRatio;
    } else {
      this.disposeGalaxy();
      this.galaxy = this.generateGalaxy();
      this.scene.add(this.galaxy.points);
    }
  }

  @DebugFPS
  public frame(timer: Timer) {
    super.frame(timer);
    this.galaxy.material.uniforms.uTime.value = timer.getElapsed();
  }

  private generateGalaxy(): Galaxy<ShaderMaterial> {
    const geometry = this.generateGalaxyGeometry();
    const material = this.generateGalaxyMaterial();
    const points = new Points(geometry, material);

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
        uSize: { value: this.galaxySettings.size   * this.view.pixelRatio },
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

     randomnes[i3] = randomDisplacement(radius, this.galaxySettings.randomnessPower, this.galaxySettings.randomness);
     randomnes[i3 + 1] = randomDisplacement(radius, this.galaxySettings.randomnessPower, this.galaxySettings.randomness);
     randomnes[i3 + 2] = randomDisplacement(radius, this.galaxySettings.randomnessPower, this.galaxySettings.randomness);

     scales[i] = Math.random();
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new BufferAttribute(randomnes, 3));
    return geometry;
  }

  private disposeGalaxy() {
    this.scene.remove(this.galaxy.points);
    disposeMesh(this.galaxy);
  }

  async dispose() {
    super.dispose();
    this.disposeGalaxy();
  }
} 