export class AnimationLoop {
  constructor(tick, config) {
    this.animationStatus = "RUNNING";
    this.tick = tick;
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

  async dispose() {
    this.animationStatus = "STOPPING";
    await this.animationStopped();
  }
}

export class AnimationWithOrbitControls extends AnimationLoop {
  constructor(tick, controls, config) {
    super(tick, config);
    this.controls = controls;
  }

  animate() {
    this.controls.update();
    super.animate();
  }

  async dispose() {
    this.controls.dispose();
    await super.dispose();
  }
}