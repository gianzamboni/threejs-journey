// import { BasicView } from './app/basic-view.js';
// import { Menu } from './app/menu.js';
// import { HelpBox } from './app/help-box.js';
// import { journey } from './app/journey.js';
// import { DebugUI } from './app/debug-ui.js';
// import { DebugableExercise } from './utils/debugable-exercise.js';
// import { ThemeManager } from './app/theme-manager.js';

// Array.prototype.last = function() { return this[this.length - 1] };

// class App {
//   constructor(journey) {
//     this.activeExercise = journey.last().exercises.last();
//     this.exerciseInstance = null;
//     this.helpBox = new HelpBox();
//     this.view = new BasicView();
//     this.debugUI = new DebugUI();
//     this.menu = new Menu(journey, this.activeExercise.id);
//     this.menu.addEventListener('select', (event) => {
//       this.execute(event.detail);
//     });
//     this.themeManager = new ThemeManager();
//     this.activeEvents = {
//       scroll: false,
//       mouseMove: false
//     }
//   };

//   async execute(exercise) {
//     await this.stopCurrentExercise();
//     history.pushState(exercise.id, "", `?demoId=${exercise.id}`);
//     document.title = `${exercise.title} - Three.js Journey`;
//     this.menu.deselectExercise(this.activeExercise.id);
//     this.activeExercise = exercise;
//     if(exercise.config.debugable) {
//       this.exerciseInstance = new DebugableExercise(exercise.class, this.debugUI, this.view);
//     } else {
//       this.exerciseInstance = new exercise.class(this.view);
//     }

//     this.menu.selectExercise(exercise.id);
//     this.view.run(exercise, this.exerciseInstance);
//     this.helpBox.show(exercise);

//     if(process.env.NODE_ENV === 'development') {
//       this.toggleDebugUI();
//     }
//     this.themeManager.setTheme(exercise.config.theme);
//     this.activeExercise.config.events?.forEach((event) => {
//       this.activeEvents[event] = true;
//     });
//   };

//   init(exerciseId) {
//     const exercise = exerciseId ? this.findExercise(exerciseId) : this.activeExercise;
//     this.execute(exercise);
//   };

//   findExercise(id) {
//     return journey.map((chapter) => chapter.exercises).flat().find((exercise) => exercise.id === id);
//   }

//   updateViewSize() {
//     this.view.updateSize();
//   }

//   toggleDebugUI() {
//     if(this.activeExercise.config.debugable) {
//       this.exerciseInstance.toggleDebugUI();
//     }
//   }

//   async stopCurrentExercise() {
//     await this.view.stop();
//     this.activeExercise.config.events?.forEach((event) => {
//       this.activeEvents[event] = false;
//     });

//     if(this.exerciseInstance) {
//       await this.exerciseInstance.dispose();
//     }
//   }

//   scroll(value) {
//     if(this.activeEvents.scroll) {
//       this.exerciseInstance.scroll(value);
//     }
//   }

//   mouseMove(x, y) {
//     if(this.activeEvents.mouseMove) {
//       this.exerciseInstance.mouseMove(x, y);
//     }
//   }
// }

// let app = null;
// window.addEventListener('load', () => {
//   const url = new URL(window.location.href);
//   const searchParams = new URLSearchParams(url.search);
//   const exerciseId = searchParams.get("demoId");
//   app = new App(journey);
//   app.init(exerciseId);

  
//   window.addEventListener('popstate', (event) => {
//     const exercise = app.findExercise(event.state);
//     app.execute(exercise);
//   })

//   window.addEventListener('resize', (event) => {
//     app.updateViewSize();
//   })

//   window.addEventListener('dblclick', (event) => {
//     app.toggleDebugUI();
//   })

//   window.addEventListener('scroll', () => {
//     app.scroll(window.scrollY);
//   })

//   window.addEventListener('mousemove', (event) => {
//     app.mouseMove(event.clientX, event.clientY);
//   });
// });

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#252525")
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
