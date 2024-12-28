export class AnimationLoop {
  constructor(tick) {
    this.animationStatus = "STOPPED";
    this.tick = tick;
  }

  start() {
    this.animationStatus = "RUNNING";
    this.animate();
  }
  
  animate() {
    this.tick();
    if (this.animationStatus === "RUNNING") {
      window.requestAnimationFrame(() => this.animate());
    } else {
      this.animationStatus = "STOPPED";
    }
  }

  async animationStopped() {
    return new Promise((resolve) => {
      if (this.animationStatus === "STOPPED") {
        resolve();
      } else {
        setTimeout(() => this.animationStopped().then(resolve), 100);
      }
    });
  };

  async stop() {
    if (this.animationStatus === "STOPPED") {
      return;
    }
    this.animationStatus = "STOPPING";
    await this.animationStopped();
  }
}