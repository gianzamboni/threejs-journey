import { Timer } from 'three/addons/misc/Timer.js';

import { CustomizableQuality, DebugFPS } from '#/app/decorators/debug';
import { ActionButton, Description, Exercise, Starred } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from '#/app/layout/render-view';
import { ExtraConfig } from '#/app/types/exercise';
import { CSS_CLASSES } from '#/theme';
import BOX from './icons/cube.svg?raw';
import SPHERE from './icons/sphere.svg?raw';
import REMOVE from './icons/trash.svg?raw';
import { Lighting } from './lighting';
import { PhysicalWorld } from './physical-world';
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";

@Exercise('physics')
@Starred
@Description(
  "<p style='margin-bottom: 10px;'>Physics Demo. It shows some objects falling and colliding with each other.</p>",
  "<p>For the physics engine I used <a href='https://pmndrs.github.io/cannon-es/' target='_blank'>cannon-es</a></p>",
  `<p><strong>Buttons above:</strong> <span class='${CSS_CLASSES.light_text}'>Add spheres and boxes to the scene or remove all objects</span></p>`
)
@CustomizableQuality
export class Physics extends OrbitControlledExercise {
  private lighting: Lighting;

  private qualityConfig: QualityConfig;

  private physicalWorld: PhysicalWorld;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);
    
    this.qualityConfig = QUALITY_CONFIG[extraConfig.quality];
    view.enableShadows(this.qualityConfig.shadowMapType);

    this.physicalWorld = new PhysicalWorld({
      scene: this.scene,
      sphereSubdivisions: this.qualityConfig.sphereSubdivisions,
    });

    this.lighting = new Lighting();
    this.camera.position.set(-3, 3, 3);
    this.lighting.setup(this.scene);
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    const delta = timer.getDelta();
    this.physicalWorld.update(delta);
  }

  @ActionButton('Add Sphere', SPHERE)
  public addSphere() {
    this.physicalWorld.addSphere();
  }

  @ActionButton('Add Box', BOX)
  public addBox() {
    this.physicalWorld.addBox();
  }

  @ActionButton('Remove All', REMOVE)
  public clearScene() {
    this.physicalWorld.clearScene();
  }

  async dispose() {
    await super.dispose();
    this.physicalWorld.dispose();
    this.lighting.dispose();
  }
}
