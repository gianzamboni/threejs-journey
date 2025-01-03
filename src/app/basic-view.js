import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AnimationLoop } from '../utils/animation-loop';


export class BasicView {
  constructor() {
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    }
     
    this.canvas = document.querySelector('canvas.webgl');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.animationLoop = new AnimationLoop(() => this.animation())
    this.tick = null;

    this.camera = new THREE.PerspectiveCamera(75, this.size.width / this.size.height, 0.1, 100);

    this.runningExercise = null;

    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.enableDamping = true;

    this.updateSize();

  }

  updateSize(){
    const size = {
      height: window.innerHeight,
      width: window.innerWidth
    }
    this.renderer.setSize(size.width, size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.aspect = size.width / size.height;
    this.camera.updateProjectionMatrix();

    if(this.runningExercise) {
      this.renderer.render(this.runningExercise.scene, this.camera);
    }
  }

  show(scene) {
    scene.add(this.camera);
    this.renderer.render(scene, this.camera);
  }

  render(scene) {
    this.orbitControls.update();
    this.renderer.render(scene, this.camera);
  }
  
  enableShadows() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  async run(exercise) {
    if(this.runningExercise !== null) {
      this.runningExercise.dispose();
    }
    await this.stop();
    this.runningExercise = new exercise.class(this);
    this.runningExercise.init();
    this.toggleOrbitControls(exercise.config.enableOrbitControls);
    if(this.tick || exercise.config.enableOrbitControls) {
      this.animationLoop.start();
    }
  }

  animation() {
    this.orbitControls.update();
    if(this.tick) {
      this.tick();
    }
    this.renderer.render(this.runningExercise.scene, this.camera);
  }

  async stop() {
    if(this.tick || this.orbitControls.enablePan) {
      await this.animationLoop.stop();
    }
    this.renderer.shadowMap.enabled = false;
    this.tick = null;
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);
  }

  get isRunning() {
    return this.runningExercise !== null;
  }

  setCamera({ position, lookAt }) {
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;
    this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  }

  setTick(tick) {
    this.tick = tick;
  }

  toggleOrbitControls(activate = false) {
    if(activate) {
      this.orbitControls.enablePan = true;
      this.orbitControls.enableZoom = true;
      this.orbitControls.enableRotate = true;
    } else {
      this.orbitControls.enablePan = false;
      this.orbitControls.enableZoom = false;
      this.orbitControls.enableRotate = false;
    }
  }
}