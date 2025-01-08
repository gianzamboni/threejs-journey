import { CenteredCube } from '../exercises/01-basics/01-centered-cube.js';
import { CubeGroup } from '../exercises/01-basics/02-cube-group.js';
import { RotatingCube } from '../exercises/01-basics/03-rotating-cube.js';
import { OrbitControlsCube } from '../exercises/01-basics/04-orbit-control.js';
import { RandomTriangles } from '../exercises/01-basics/05-random-triangles.js';
import { DebugUIExercise } from '../exercises/01-basics/06-debug-ui.js';
import { TextureExercise } from '../exercises/01-basics/07-textures.js';
import { MaterialExercise } from '../exercises/01-basics/08-materials.js';
import { Text3D } from '../exercises/01-basics/09-text.js';
import { LightsExercise } from '../exercises/02-classic-techniques/01-lights.js';
import { ShadowExercise } from '../exercises/02-classic-techniques/02-shadow.js';
import { BakedShadow } from '../exercises/02-classic-techniques/03-baked-shadow.js';
import { HauntedHouse } from '../exercises/02-classic-techniques/04-haunted-house.js';
import { Particles } from '../exercises/02-classic-techniques/05-particles.js';
import { GalaxyGenerator } from '../exercises/02-classic-techniques/06-galaxy-generator.js';
import { ScrollBasedAnimation } from '../exercises/02-classic-techniques/07-scroll-based-animation.js';

const journey = [
  {
    id: 'basics',
    title: "Basics",
    exercises: [
      {
        id: 'first-threejs-project',
        title: "First Three.js Project",
        class: CenteredCube,
        config: {}
      }, {
        id: 'transform-objects',
        title: "Transform objects",
        class: CubeGroup,
        config: {}
      }, {
        id: 'animations',
        title: "Animations",
        class: RotatingCube,
        config: {
          debugable: true
        }
      }, {
        id: 'cameras',
        title: "Cameras",
        class: OrbitControlsCube,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: 'geometries',
        title: "Geometries",
        class: RandomTriangles,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: 'debug-ui',
        title: "Debug UI",
        class: DebugUIExercise,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: 'textures',
        title: "Textures",
        class: TextureExercise,
        config: {
          enableOrbitControls: true,
        }
      },
      {
        id: 'materials',
        title: "Materials",
        class: MaterialExercise,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: '3d-text',
        title: "3D Text",
        class: Text3D,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }
    ]
  },
  {
    title: "Classic Techniques",
    exercises: [
      {
        id: 'lights',
        title: "Lights",
        class: LightsExercise,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: 'shadows',
        title: "Dynamic Shadows",
        class: ShadowExercise,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: 'baked-shadows',
        title: "Baked Shadows",
        class: BakedShadow,
        config: {
          enableOrbitControls: true,
        }
      }, {
        id: 'haunted-house',
        title: "Haunted House",
        class: HauntedHouse,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: 'particles',
        title: "Particles",
        class: Particles,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: 'galaxy-generator',
        title: "Galaxy Generator",
        class: GalaxyGenerator,
        config: {
          enableOrbitControls: true,
          debugable: true
        }
      }, {
        id: "scroll-based-animation",
        title: "Scroll Based Animation",
        class: ScrollBasedAnimation,
        config: {
          debugable: true,
        }
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