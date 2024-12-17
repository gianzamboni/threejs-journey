import * as THREE from 'three'
import { BasicSetup } from './utils/BasicSetup.js'

const exercise = new BasicSetup({
    responsive: true,
    withControls: true,
});
/**
 * Object
 */
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
loadingManager.onStart = () =>
  {
      console.log('loading started')
  }
  loadingManager.onLoad = () =>
  {
      console.log('loading finished')
  }
  loadingManager.onProgress = () =>
  {
      console.log('loading progressing')
  }
  loadingManager.onError = () =>
  {
      console.log('loading error')
  }
  
const colorTexture = textureLoader.load('/textures/minecraft.png');
colorTexture.colorSpace = THREE.SRGBColorSpace;
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.rotation = Math.PI * 0.25;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
//colorTexture.minFilter = THREE.LinearMipMaLinearFilter;
colorTexture.magFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const geometry = new THREE.BoxGeometry(1, 1, 1)
//const geometry = new THREE.SphereGeometry(1, 32, 32)
//const geometry = new THREE.ConeGeometry(1, 1, 32)
//const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
console.log(geometry.attributes.uv);
const mesh = new THREE.Mesh(geometry, material)
exercise.add(mesh)