// import { BasicView } from './app/basic-view.js';
// import { Menu } from './app/gui.js';
// import { journey } from './app/journey.js';

// const lastChapterExercises = journey[journey.length - 1].exercises;
// const lastExercise = lastChapterExercises[lastChapterExercises.length - 1];

// const view = new BasicView();
// const menu = new Menu(lastExercise, async (exercise) => {
//   console.log(`Loading exercise: ${exercise.title}`);
//   await view.run(exercise);
// });

// view.run(lastExercise);

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const settings = {
  AmbientLight: {
    color: "#ffffff",
    intensity: 0.2,
    on: true
  },
  DirectionalLight: {
    color: "#00fffc",
    intensity: 0.9,
    on: true,
    position: { x: 1, y: 0, z: 0 }
  },
  HemisphereLight: {
    color: "#ff0000",
    groundColor: "#0000ff",
    intensity: 0.9,
    on: true,
  },
  PointLight: {
    color: "#ff9000",
    intensity: 1.5,
    on: true,
    position: { x: 1, y: -0.5, z: 1 },
    distance: 0.5,
    decay: 2
  },
  RectAreaLight: {
    on: true,
    color: "#4e00ff",
    intensity: 6,
    width: 1,
    height: 1,
    position: { x: -1.5, y: 0, z: 1.5 },
    lookAt: { x: 0, y: 0, z: 0 }
  }
}

function createAmbientLight() {
  return new THREE.AmbientLight(settings.AmbientLight.color, settings.AmbientLight.intensity);
}

function createDirectionalLight() {
  const directionalLight = new THREE.DirectionalLight(settings.DirectionalLight.color, settings.DirectionalLight.intensity);
  directionalLight.position.set(settings.DirectionalLight.position.x, settings.DirectionalLight.position.y, settings.DirectionalLight.position.z);
  return directionalLight;
}

function createHemisphereLight() {
  return new THREE.HemisphereLight(settings.HemisphereLight.skyColor, settings.HemisphereLight.groundColor, settings.HemisphereLight.intensity);
}

function createPointLight() {
  const pointLight = new THREE.PointLight(settings.PointLight.color, settings.PointLight.intensity, settings.PointLight.distance, settings.PointLight.decay);
  pointLight.position.set(settings.PointLight.position.x, settings.PointLight.position.y, settings.PointLight.position.z);
  return pointLight;
}

function createRectAreaLight() {
  const rectAreaLight = new THREE.RectAreaLight(settings.RectAreaLight.color, settings.RectAreaLight.intensity, settings.RectAreaLight.width, settings.RectAreaLight.height);
  rectAreaLight.position.set(settings.RectAreaLight.position.x, settings.RectAreaLight.position.y, settings.RectAreaLight.position.z);
  rectAreaLight.lookAt(new THREE.Vector3(settings.RectAreaLight.lookAt.x, settings.RectAreaLight.lookAt.y, settings.RectAreaLight.lookAt.z));
  return rectAreaLight;
}

function createOnOffControl(lightFolder, light, lightType) {
  lightFolder.add(settings[lightType], 'on').name('On/Off').onChange(() => {
    light.intensity = settings[lightType].on ? settings[lightType].intensity : 0;
    lightControls[lightType].forEach(control => settings[lightType].on ? control.enable() : control.disable());
  });
}

function createColorControl(lightFolder, light, lightType, propertyName) {
  lightFolder.addColor(settings[lightType], propertyName).name(propertyName).onChange(() => {
    light[propertyName].set(settings[lightType].color)
  });
}

function createIntensityControl(lightFolder, light, lightType) {
  lightFolder.add(settings[lightType], 'intensity').min(0).max(6).step(0.001).name('Intensity').onChange(() => {
    light.intensity = settings[lightType].intensity;
  });
}

function createXYZControl(lightFolder, light, lightType, propertyName, onChange) {
  const positionFolder = lightFolder.addFolder(propertyName);
  positionFolder.close();
  ["x", "y", "z"].forEach(axis => {
    positionFolder.add(settings[lightType][propertyName], axis).min(-5).max(5).step(0.01).name(axis.toUpperCase()).onChange(() => onChange(axis));
  })
}

function createPositionControl(lightFolder, light, lightType) {
  createXYZControl(lightFolder, light, lightType, 'position', (axis) => {
    light.position[axis] = settings[lightType].position[axis];
  });
}

function createLookAtControl(lightFolder, light, lightType) {
  createXYZControl(lightFolder, light, lightType, 'lookAt', () => {
    light.lookAt(new THREE.Vector3(settings[lightType].lookAt.x, settings[lightType].lookAt.y, settings[lightType].lookAt.z));
  });
};

function createDecayControl(lightFolder, light, lightType) {
  lightFolder.add(settings[lightType], 'decay').min(0).max(2).step(0.01).name('Decay').onChange(() => {
    light.decay = settings[lightType].decay;
  });
}

function createDistanceControl(lightFolder, light, lightType) {
  lightFolder.add(settings[lightType], 'distance').min(0).max(10).step(0.01).name('Distance').onChange(() => {
    light.distance = settings[lightType].distance;
  });
}


const ambientLight = createAmbientLight();
scene.add(ambientLight);

const directionalLight = createDirectionalLight();
scene.add(directionalLight);

const hemisphereLight = createHemisphereLight();
scene.add(hemisphereLight);

const pointLight = createPointLight();
scene.add(pointLight);

const rectAreaLight = createRectAreaLight();
scene.add(rectAreaLight);

const lights = [ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight];
const lightControls = {
  AmbientLight: [],
  DirectionalLight: [],
  HemisphereLight: [],
  PointLight: []
}

lights.forEach(light => {
  const lightType = light.type;
  const lightFolderName = light.type.split("L").join(" L");
  const lightFolder = gui.addFolder(lightFolderName);
  createOnOffControl(lightFolder, light, lightType);
  createColorControl(lightFolder, light, lightType, 'color');

  if (lightType === "HemisphereLight") {
    createColorControl(lightFolder, light, lightType, 'groundColor');
  }

  createIntensityControl(lightFolder, light, lightType);
  
  if (lightType === "PointLight") {
    createDistanceControl(lightFolder, light, lightType);
    createDecayControl(lightFolder, light, lightType);
  }

  if (lightType === "DirectionalLight" || lightType === "PointLight" || lightType === "RectAreaLight") {
    createPositionControl(lightFolder, light, lightType);
  }

  if (lightType === "RectAreaLight") {
    createLookAtControl(lightFolder, light, lightType);
  }

  if (lightType !== "AmbientLight") {
    lightFolder.close();
  }
})

console.log(hemisphereLight)
// let hemisphereLightControls = [];

// hemisphereLightFolder.add(hemisphereLightSettings, 'on').name('On/Off').onChange(() => {
//     if(hemisphereLightSettings.on === false) {
//         hemisphereLight.intensity = 0;
//         hemisphereLightControls.forEach(control => control.disable());
//     } else {
//         hemisphereLight.intensity = hemisphereLightSettings.intensity;
//         hemisphereLightControls.forEach(control => control.enable());
//     }
// });
// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()