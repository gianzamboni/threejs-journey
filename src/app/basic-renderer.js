import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { addOrbitControlHelp } from '../utils/orbit-control-help';

const DEFAULT_SIZE = {
  width: 800,
  height: 600
}


export class BasicView {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    this.camera = new THREE.PerspectiveCamera(75, DEFAULT_SIZE.width / DEFAULT_SIZE.height, 0.1, 100);
    this.camera.position.z = 3;

    this.activeExercise = null;

    this.helpBox = document.getElementById('help-box-content');

    this.orbitControls = null;

    this.setSize();

    window.addEventListener('resize', () => {
      this.setSize();
      this.renderer.render(this.activeExercise.scene, this.camera);
    });

  }

  setCamera({ position, lookAt}) {
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;
    this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  }
  setSize(){
    const size = {
      height: window.innerHeight,
      width: window.innerWidth
    }
    this.renderer.setSize(size.width, size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.aspect = size.width / size.height;
    this.camera.updateProjectionMatrix();
  }

  init(scene) {
    scene.add(this.camera);
    this.renderer.render(scene, this.camera);
  }

  render(scene) {
    this.controls?.update();
    this.renderer.render(scene, this.camera);
  }
  
  resetCamera() {
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);
  }

  async run(exercise) {
    this.toggleOrbitControls(false);
    if(this.activeExercise) {
      await this.activeExercise.dispose();
    }
    this.resetCamera();
    this.renderer.dispose();
    this.activeExercise = new exercise(this);
    this.activeExercise.init();
    this.createHelpBox();
    console.log(this.renderer.info);

  }

  createHelpBox() {
    this.helpBox.innerHTML = "";

    if(!this.orbitControls && !this.activeExercise.helpMessage) {
      this.helpBox.style.display = 'none';
      return;
    }

    const list = document.createElement('ul');
    this.helpBox.appendChild(list);

    if(this.orbitControls) {
      addOrbitControlHelp(list);
    }


    if(this.activeExercise.helpMessage) {
      const items = this.activeExercise.helpMessage();
      items.forEach(item => {
        list.appendChild(item);
      });
    }
     
    this.helpBox.style.display = 'block';
  }

  toggleOrbitControls(activate = true) {
    if(activate) {
      this.orbitControls = new OrbitControls(this.camera, this.canvas);
      this.orbitControls.enableDamping = true;
    } else {
      this.orbitControls?.dispose();
      this.orbitControls = null;
    }
  }
}