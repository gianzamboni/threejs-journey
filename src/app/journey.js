import { Texture } from 'three';
import { CenteredCube } from '../exercises/01-basics/01-centered-cube.js';
import { CubeGroup } from '../exercises/01-basics/02-cube-group.js';
import { RotatingCube } from '../exercises/01-basics/03-rotating-cube.js';
import { OrbitControlsCube } from '../exercises/01-basics/04-orbit-control.js';
import { RandomTriangles } from '../exercises/01-basics/05-random-triangles.js';
import { DebugUI } from '../exercises/01-basics/06-debug-ui.js';
import { TextureExercise } from '../exercises/01-basics/07-textures.js';
import { MaterialExercise } from '../exercises/01-basics/08-materials.js';

const journey = [
  {
    title: "01 - Basics",
    exercises: [
      {
        title: "First Three.js Project",
        class: CenteredCube,
      }, {
        title: "Transform objetcs",
        class: CubeGroup,
      }, {
        title: "Animations",
        class: RotatingCube,
      }, {
        title: "Cameras",
        class: OrbitControlsCube,
      }, {
        title: "Geometries",
        class: RandomTriangles, 
      }, {
        title: "Debug UI",
        class: DebugUI,
      }, {
        title: "Textures",
        class: TextureExercise,
      },
      {
        title: "Materials",
        class: MaterialExercise
      }
    ]
  },
  // {
  //   title: "02 - Classic Techniques",
  // },
  // {
  //   title: "03 - Advanced Techniques",
  // },
  // {
  //   title: "04 - Shaders",
  // }, {
  //   title: "05 - Extras",
  // }, {
  //   title: "06 - Portal Scene",
  // }, {
  //   title: "07 - React Three Fiber",
  // }
]

export { journey };