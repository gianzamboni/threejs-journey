import RenderView from '@/app/layout/render-view';
import { Timer } from 'three/addons/misc/Timer.js'
import { waitForCondition } from './sleep';

enum AnimationStatus {
  Stopped,
  Stopping,
  Running,
}

export class AnimationLoop {  
  private animationStatus: AnimationStatus;
  private tick: Function;
  private timer: Timer
  constructor(tick: Function) {
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


  private waitTillStopped(resolve: Function) {
    if(this.animationStatus === AnimationStatus.Stopped) {
      resolve();
    } else {
      setTimeout(() => this.waitTillStopped(resolve), 100);
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