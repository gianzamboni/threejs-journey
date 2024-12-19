import { BasicSetup } from './utils/BasicSetup';
import gsap from 'gsap';
import GUI from 'lil-gui';
import * as THREE from 'three';

const exercise = new BasicSetup({
  responsive: true,
  cameraPosition: { z: 6 },
  withControls: true
});

window.addEventListener('dblclick', () => {
  exercise.toggleFullscreen();
});

const gui = new GUI({
  width: 300,
  title: 'Debug UI',
  closeFolders: true
});
gui.close();
gui.hide();

window.addEventListener('keydown', (event) => {
  if (event.key == 'h')
    gui.show(gui._hidden)
})

const debugObject = {
  color: "#a778d8",
  spin: () => {
    gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 });
  },
  subdivisions: 2
};

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const cube = new THREE.Mesh(cubeGeometry, material);
exercise.add(cube);

const cubeTweaks = gui.addFolder("Awesome cube");
cubeTweaks.close();
cubeTweaks.add(cube.position, 'y')
  .min(-3)
  .max(3)
  .step(0.1)
  .name('elevation');

cubeTweaks.add(cube, 'visible');
cubeTweaks.add(cube.material, 'wireframe');
cubeTweaks.addColor(debugObject, 'color')
  .onChange(() => {
    material.color.set(debugObject.color);
  });
cubeTweaks.add(debugObject, 'spin');
cubeTweaks.add(debugObject, 'subdivisions')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    cube.geometry.dispose();
    cube.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivisions, debugObject.subdivisions, debugObject.subdivisions);
  });