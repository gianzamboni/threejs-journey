import { CenteredCube } from '../exercises/01-basics/01-centered-cube.js';
import { CubeGroup } from '../exercises/01-basics/02-cube-group.js';
import { RotatingCube } from '../exercises/01-basics/03-rotating-cube.js';
import { OrbitControlsCube } from '../exercises/01-basics/04-orbit-control.js';
import { RandomTriangles } from '../exercises/01-basics/05-random-triangles.js';
import { DebugUI } from '../exercises/01-basics/06-debug-ui.js';
import { TextureExercise } from '../exercises/01-basics/07-textures.js';
import { MaterialExercise } from '../exercises/01-basics/08-materials.js';
import { Text3D } from '../exercises/01-basics/09-text.js';
import { LightsExercise } from '../exercises/02-classic-techniques/01-lights.js';
import { ShadowExercise } from '../exercises/02-classic-techniques/02-shadow.js';
import { BakedShadow } from '../exercises/02-classic-techniques/03-baked-shadow.js';
import { HauntedHouse } from '../exercises/02-classic-techniques/04-haunted-house.js';

const journey = [
  {
    id: '01-basics',
    title: "Basics",
    exercises: [
      {
        id: 'first-threejs-project',
        title: "First Three.js Project",
        class: CenteredCube,
      }, {
        id: 'transform-objects',
        title: "Transform objects",
        class: CubeGroup,
      }, {
        id: 'animations',
        title: "Animations",
        class: RotatingCube,
      }, {
        id: 'cameras',
        title: "Cameras",
        class: OrbitControlsCube,
      }, {
        id: 'geometries',
        title: "Geometries",
        class: RandomTriangles, 
      }, {
        id: 'debug-ui',
        title: "Debug UI",
        class: DebugUI,
      }, {
        id: 'textures',
        title: "Textures",
        class: TextureExercise,
      },
      {
        id: 'materials',
        title: "Materials",
        class: MaterialExercise
      }, {
        id: '3d-text',
        title: "3D Text",
        class: Text3D
      }
    ]
  },
  {
    title: "Classic Techniques",
    exercises: [
      {
        id: 'lights',
        title: "Lights",
        class: LightsExercise
      }, {
        id: 'shadows',
        title: "Dynamic Shadows",
        class: ShadowExercise
      }, {
        id: 'baked-shadows',
        title: "Baked Shadows",
        class: BakedShadow
      }, {
        id: 'haunted-house',
        title: "Haunted House",
        class: HauntedHouse
      }
    ]
  },
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