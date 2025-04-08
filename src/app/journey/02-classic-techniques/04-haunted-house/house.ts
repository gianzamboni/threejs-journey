import { 
  Group,
  PointLight
} from 'three';

import { disposeObjects } from '#/app/utils/three-utils';
import { Door } from './door';
import { QualityConfig } from './quality-config';
import { Roof } from './roof';
import { Walls } from './walls';

import { SceneObject } from '../../../types/scene-object';


/**
 * House object for the haunted house scene
 */
export class House extends SceneObject {
  public object: Group;

  private children: SceneObject[];
  private doorLight: PointLight;

  /**
   * Create a new house
   */
  constructor(quality: QualityConfig) {
    super();
    this.children = [
      new Walls(quality),
      new Roof(quality),
      new Door(quality),
    ];

    this.object = new Group();
    this.object.add(
      ...this.children.map(object => object.object)
    );
    
    this.doorLight = new PointLight(0xff7d46, 5);
    this.doorLight.position.set(0, 2.2, 2.5);
    this.object.add(this.doorLight);
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.object.clear();
    disposeObjects(
      ...this.children,
      this.doorLight
    )
  }
} 