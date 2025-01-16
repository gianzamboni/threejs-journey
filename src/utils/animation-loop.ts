import RenderView from '@/layout/render-view';
import { Timer } from 'three/addons/misc/Timer.js'

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

  private async untilStopped() {
    return new Promise((resolve) => {
      if(this.animationStatus === AnimationStatus.Stopped) {
        resolve(true);
      } else {
        setTimeout(() => this.untilStopped(), 100);
      }
    });
  }

  async stop() {
    this.animationStatus = AnimationStatus.Stopping;
    await this.untilStopped();
    this.timer.reset();
  }

  dispose() {
    this.timer.dispose(); 
  }
}