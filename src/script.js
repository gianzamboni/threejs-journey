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
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
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
    on: true,
    params: {
      color: "#ffffff",
      intensity: 0.2,
    }
  },
  DirectionalLight: {
    on: true,
    params: {
      color: "#00fffc",
      intensity: 0.9,
    },
    position: { x: 1, y: 0, z: 0 }
  },
  HemisphereLight: {
    on: true,
    params: {
      color: "#ff0000",
      groundColor: "#0000ff",
      intensity: 0.9,
    }
  },
  PointLight: {
    on: true,
    params: {
      color: "#ff9000",
      intensity: 1.5,
      distance: 0.5,
      decay: 2,
    },
    position: { x: 1, y: -0.5, z: 1 },
  },
  RectAreaLight: {
    on: true,
    params: {
      color: "#4e00ff",
      intensity: 6,
      width: 1,
      height: 1,
    },
    position: { x: -1.5, y: 0, z: 1.5 },
    lookAt: { x: 0, y: 0, z: 0 }
  },
  SpotLight: {
    on: true,
    params: {
      color: "#78ff00",
      intensity: 4.5,
      distance: 0,
      angle: Math.PI * 0.1,
      penumbra: 0.25,
      decay: 1,
    },
    position: { x: 0, y: 2, z: 3 },
    targetPosition: { x: -0.75, y: 0, z: 0 }
  }
}

const minMax = {
  angle: { min: 0, max: Math.PI / 2, step: 0.01 },
  decay: { min: 0, max: 2, step: 0.01 },
  distance: { min: 0, max: 1, step: 0.001 },
  height: { min: 0, max: 1, step: 0.01 },
  intensity: { min: 0, max: 6, step: 0.01 },
  penumbra: { min: 0, max: 1, step: 0.01 },
  width: { min: 0, max: 1, step: 0.01 },
  x: { min: -5, max: 5, step: 0.01 },
  y: { min: -5, max: 5, step: 0.01 },
  z: { min: -5, max: 5, step: 0.01 },
}

const lightControls = {
  AmbientLight: [],
  DirectionalLight: [],
  HemisphereLight: [],
  PointLight: [],
  RectAreaLight: [],
  SpotLight: []
}

function createLight(type) {
  const params = Object.values(settings[type].params);
  const light = new THREE[type](...params);

  if (settings[type].position) {
    light.position.set(
      settings[type].position.x,
      settings[type].position.y,
      settings[type].position.z
    );
  }

  if (settings[type].lookAt) {
    const target = new THREE.Vector3(
      settings[type].lookAt.x,
      settings[type].lookAt.y,
      settings[type].lookAt.z
    );
    light.lookAt(target);
  }
  return light;
}

function createOnOffControl(lightFolder, light) {
  const type = light.type;
  lightFolder
    .add(settings[type], 'on')
    .name('On/Off')
    .onChange(() => {
      light.intensity = settings[type].on ? settings[type].params.intensity : 0;
      lightControls[type].forEach(
        control => settings[type].on ? control.enable() : control.disable()
      );
  });
}

function createColorControl(lightFolder, light, paramName) {
  const type = light.type;
  const control = lightFolder.addColor(settings[type].params, paramName)
    .name(paramName)
    .onChange(() => {
      light[paramName].set(settings[type].params[paramName]);
    });
  lightControls[type].push(control);
}

function createNumericControl(lightFolder, light, paramName) {
  const type = light.type;
  const control = lightFolder.add(settings[type].params, paramName)
    .min(minMax[paramName].min)
    .max(minMax[paramName].max)
    .step(minMax[paramName].step)
    .name(paramName)
    .onChange(() => {
      light[paramName] = settings[type].params[paramName];
    });
  lightControls[type].push(control);
}

function createPositionalControl(lightFolder, light, paramName, onChange) {
  const type = light.type;
  const positionFolder = lightFolder.addFolder(paramName);
  positionFolder.close();
  ["x", "y", "z"].forEach(axis => {
    const control = positionFolder
      .add(settings[type][paramName], axis)
      .min(minMax[axis].min)
      .max(minMax[axis].max)
      .step(minMax[axis].step)
      .name(axis)
      .onChange(() => {
        onChange(axis);
      });
    lightControls[type].push(control);
  });
}

function createLightParamsControls(lightFolder, light) {
  const type = light.type;
  const params = settings[type].params;
  Object.keys(params).forEach(param => {
    let control = null;
    if (typeof params[param] === "string") {
      createColorControl(lightFolder, light, param);
    } else {
      createNumericControl(lightFolder, light, param);
    }
  });
}

function createExtraControls(lightFolder, light) {
  const type = light.type;
  if (settings[type].position) {
    createPositionalControl(lightFolder, light, 'position', (axis) => {
      light.position[axis] = settings[type].position[axis];
    });
  }

  if (settings[type].lookAt) {
    createPositionalControl(lightFolder, light, 'lookAt', () => {
      const newTarget = new THREE.Vector3(
        settings[type].lookAt.x,
        settings[type].lookAt.y,
        settings[type].lookAt.z
      );
      light.lookAt(newTarget);
    });
  }

  if (settings[type].targetPosition) {
    createPositionalControl(lightFolder, light, 'targetPosition', (axis) => {
      light.target.position[axis] = settings[type].targetPosition[axis];
    });
  }
}

function createControls(light) {
  const type = light.type;
  const lightFolder = gui.addFolder(type);
  createOnOffControl(lightFolder, light);
  createLightParamsControls(lightFolder, light);
  createExtraControls(lightFolder, light);
} 

function addLight(type) {
  const light = createLight(type);
  scene.add(light);

  createControls(light);
  return light;
}

const ambientLight = addLight("AmbientLight");
const directionalLight = addLight("DirectionalLight");
const hemisphereLight = addLight("HemisphereLight");
const pointLight = addLight("PointLight");
const rectAreaLight = addLight("RectAreaLight");

const spotLight = addLight("SpotLight");
scene.add(spotLight.target);



const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
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
  spotLightHelper.update()
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()