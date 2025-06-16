import { 
  BufferGeometry,
  PointsMaterial,
  Points,
  Texture,
  AdditiveBlending,
  Color,
  BufferAttribute
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise, Starred } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/services/assets-loader';
import { disposeMesh } from '#/app/utils/three-utils';

import { galaxyControllers } from '../common/galaxy/controllers';
import { GALAXY_DEFAULT_SETTINGS, Galaxy, GalaxyParams, configureCamera, randomDisplacement } from '../common/galaxy/galaxy';


@Exercise('galaxy-generator')
@Starred
@Description(
  "<p>A galaxy generator that creates a new galaxy every time you load the page.</p>", 
)
export class GalaxyGenerator extends OrbitControlledExercise {

  @Customizable(galaxyControllers(0.001, 1))
  private galaxySettings: GalaxyParams = GALAXY_DEFAULT_SETTINGS;

  private particleTexture: Texture;
  private galaxy: Galaxy<PointsMaterial>;


  constructor(view: RenderView) {
    super(view);

    const assetLoader = AssetLoader.getInstance();
    this.particleTexture = assetLoader.loadTexture('/textures/particles/4.png');

    this.galaxy = this.generateGalaxy();
    this.scene.add(this.galaxy.points);

    configureCamera(this.camera);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.015625;
  }

  public updateGalaxySettings<K extends keyof GalaxyParams>(newValue: GalaxyParams[K], { property }: { property: K }) {
    this.galaxySettings[property] = newValue;
    this.disposeGalaxy();
    this.galaxy = this.generateGalaxy();
    this.scene.add(this.galaxy.points);
  }

  @DebugFPS
  public frame(timer: Timer) {
    super.frame(timer);
  }

  private generateGalaxy(): Galaxy<PointsMaterial> {
    const geometry = this.generateGalaxyGeometry();
    const material = this.generateGalaxyMaterial();
    const points = new Points(geometry, material);

    return { geometry, material, points };
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
      
     positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomDisplacement(radius, this.galaxySettings.randomnessPower, this.galaxySettings.randomness);
     positions[i3 + 1] = randomDisplacement(radius, this.galaxySettings.randomnessPower, this.galaxySettings.randomness);
     positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomDisplacement(radius, this.galaxySettings.randomnessPower, this.galaxySettings.randomness);

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

  private disposeGalaxy() {
    this.scene.remove(this.galaxy.points);
    disposeMesh(this.galaxy);
  }

  async dispose() {
    super.dispose();
    this.disposeGalaxy();
    this.particleTexture.dispose();
  }
} 