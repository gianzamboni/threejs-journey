import { 
  Group,
  PointLight,
  PointLightHelper
} from 'three';

import { randomBetween, randomSign } from '#/app/utils/random-utils';
import { PathTracer } from './path-tracer';
import { QualityConfig } from './quality-config';

import { SceneObject } from '../../../types/scene-object';

interface Ghost {
  light: PointLight;
  pacing: number;
  displacement: number;
  radius: number;
  multipliers: number[];
  wobblingX: {
    amplitude: number;
    speed: number;
  };
  wobblingZ: {
    amplitude: number;
    speed: number;
  };
  helper?: PointLightHelper;
  tracer?: PathTracer;
}

/**
 * Ghosts object for the haunted house scene
 */
export class Ghosts extends SceneObject {
  public object: Group;
  private ghosts: Ghost[];
  private minRadius: number;

  private quality: QualityConfig;

  /**
   * Create new ghosts
   */
  constructor(quality: QualityConfig) {
    super();
    this.quality = quality;
    this.object = new Group();
    this.ghosts = [];
    this.minRadius = 4;

    for(const color of ['#8800ff', '#ff0088', '#ff0000']) {
      const ghost = this.generateGhost(color);
      this.ghosts.push(ghost);
      this.object.add(ghost.light);
      if(ghost.helper) {
        this.object.add(ghost.helper);
      }
      if(ghost.tracer) {
        this.object.add(ghost.tracer.mesh);
      }
    }
  }

  /**
   * Generate a ghost with random properties
   */
  private generateGhost(color: string): Ghost {
    const ghost: Ghost = {
      light: new PointLight(color, 6),
      pacing: randomSign() * randomBetween(0.0001, 0.3),
      displacement: randomBetween(0, Math.PI * 2),
      radius: randomBetween(this.minRadius, 6),
      multipliers: [randomSign() * randomBetween(0, 3), randomSign() * randomBetween(0, 4)],
      wobblingX: {
        amplitude: 0,
        speed: 0
      },
      wobblingZ: {
        amplitude: 0,
        speed: 0
      }
    };

    this.generateGhostWobblingConstants(ghost);
    this.setupGhostShadows(ghost);
    //ghost.helper = new PointLightHelper(ghost.light, 0.2);
    //ghost.tracer = new PathTracer(ghost.light, color);
    return ghost;
  }

  /**
   * Setup shadow properties for a ghost
   */
  private setupGhostShadows(ghost: Ghost): void {
    ghost.light.castShadow = this.quality.shadows;
    if (this.quality.shadows) {
      ghost.light.shadow.mapSize.width = 1024;
      ghost.light.shadow.mapSize.height = 1024;
      ghost.light.shadow.camera.far = 10;
    }
  }

  /**
   * Generate wobbling constants for a ghost
   */
  private generateGhostWobblingConstants(ghost: Ghost): void {
    ['X', 'Z'].forEach(axis => {
      const key = `wobbling${axis}` as 'wobblingX' | 'wobblingZ';
      ghost[key] = {
        amplitude: randomBetween(0, ghost.radius - this.minRadius),
        speed: randomBetween(0, 10),
      };
    });
  }

  /**
   * Animate the ghosts
   */
  animate(elapsedTime: number): void {
    for(const ghost of this.ghosts) {
      const { displacement, light, multipliers, pacing, radius, wobblingX, wobblingZ } = ghost;
      const angle = elapsedTime * pacing;
      light.position.x = Math.cos(angle + displacement) * (radius + Math.cos(angle * wobblingX.speed) * wobblingX.amplitude);
      light.position.z = Math.sin(angle + displacement) * (radius + Math.sin(angle * wobblingZ.speed) * wobblingZ.amplitude);
      light.position.y = Math.sin(angle + displacement) * Math.sin(angle * multipliers[0]) * Math.sin(angle * multipliers[1]);
      ghost.tracer?.update();
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.object.clear();
    for(const ghost of this.ghosts) {
      ghost.light.dispose();
      ghost.helper?.dispose();
      ghost.tracer?.dispose();
    }
  }
} 