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
    this.specialRenderer = false;
    this.animationLoop = new AnimationLoop(this.animation.bind(this));
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

  async run(exerciseData, exerciseInstence) {
    this.runningExercise = exerciseInstence;
    this.runningExercise.init();
    this.toggleOrbitControls(exerciseData.config.enableOrbitControls);
    if(this.tick || exerciseData.config.enableOrbitControls) {
      this.animationLoop.start();
    }
    return this.runningExercise;
  }

  animation(timer) {
    this.orbitControls.update();
    if(this.tick) {
      this.tick(timer);
    }
    this.renderer.render(this.runningExercise.scene, this.camera);
  }

  async stop() {
    if(this.tick || this.orbitControls.enablePan) {
      await this.animationLoop.stop();
    }
    this.resetOrbitControls();
    this.renderer.shadowMap.enabled = false;
    this.tick = null;
    this.resetCamera();
    if(this.specialRenderer) {
      this.changeRenderer({});
    }
  }

  get isRunning() {
    return this.runningExercise !== null;
  }

  setCamera(config) {
    if(config.position) {
      this.camera.position.x = config.position.x;
      this.camera.position.y = config.position.y;
      this.camera.position.z = config.position.z;
    }

    if(config.lookAt) {
      this.camera.lookAt(config.lookAt.x, config.lookAt.y, config.lookAt.z);
    }

    if(config.near) {
      this.camera.near = config.near;
      this.camera.updateProjectionMatrix();
    }
  }

  resetCamera() {
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);
    this.camera.near = 0.1;
    this.camera.updateProjectionMatrix();
  }

  setTick(tick) {
    this.tick = tick;
  }

  setOrbitControlSettings(settings) {
    Object.keys(settings).forEach((key) => {
      this.orbitControls[key] = settings[key];
    });
  }

  resetOrbitControls() {
    this.orbitControls.reset();
    this.orbitControls.autoRotate = false;
    this.orbitControls.autoRotateSpeed = 2.0;
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

  changeRenderer(config) {
    this.renderer.dispose();
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true, 
      ...config 
    });
    this.specialRenderer = true;
  }
  
  get trianglesCount() {
    return this.renderer.info.render.triangles;
  }

  get linesCount() {
    return this.renderer.info.render.lines;
  }
}