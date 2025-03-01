import { Timer } from 'three/addons/misc/Timer.js'

import RenderView from '#/app/layout/render-view';
import { waitForCondition } from '#/app/utils/sleep';

enum AnimationStatus {
  Stopped,
  Stopping,
  Running,
}

type TickFunction = (timer: Timer) => void;

export class AnimationLoop {  
  private animationStatus: AnimationStatus;
  private tick: TickFunction;
  private timer: Timer
  constructor(tick: TickFunction) {
    this.animationStatus = AnimationStatus.Stopped;
    this.timer = new Timer();
    this.tick = tick;
  }

  init(view: RenderView) {
    this.animationStatus = AnimationStatus.Running;
    this.animate(view);
  }

  animate(view: RenderView) {
    this.timer.update();
    this.tick(this.timer);
    view.update();
    if(this.animationStatus === AnimationStatus.Running) {
      window.requestAnimationFrame(() => this.animate(view));
    } else if(this.animationStatus === AnimationStatus.Stopping) {
      this.animationStatus = AnimationStatus.Stopped;
    }
  }

  private async untilStopped() {
    return await waitForCondition(
      () => this.animationStatus === AnimationStatus.Stopped
    );
  }

  async stop() {
    this.animationStatus = AnimationStatus.Stopping;
    await this.untilStopped();
    this.timer.dispose();
  }
}