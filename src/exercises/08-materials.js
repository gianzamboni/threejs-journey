import * as THREE from 'three'
import { BasicSetup } from './utils/BasicSetup.js'
import GUI from 'lil-gui';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const exercise = new BasicSetup({
    responsive: true,
    withControls: true
});

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

//const material = new THREE.MeshBasicMaterial();
//material.color = new THREE.Color(0xff0000);
//material.map = doorColorTexture;
//material.wireframe = true;
//material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

//const material = new THREE.MeshMatcapMaterial();
//material.matcap = matcapTexture;

//const material = new THREE.MeshDepthMaterial();

//const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

//const material = new THREE.MeshToonMaterial();
//material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial();
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.displacementMap = doorHeightTexture;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

// material.normalScale.set(0.5, 0.5);
// material.aoMapIntensity = 1;
// material.metalness = 0.7;
// material.roughness = 0.2;
// material.displacementScale = 0.1; 

const material = new THREE.MeshPhysicalMaterial();
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.displacementMap = doorHeightTexture;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

//material.normalScale.set(0.5, 0.5);
//material.aoMapIntensity = 1;
material.metalness = 0;
material.roughness = 0;
//material.displacementScale = 0.1; 
//material.clearcoat = 1;
//material.clearcoatRoughness = 0;
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1,1,1);
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [ 100, 100 ];
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

//const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//exercise.add(ambientLight);

//const pointLight = new THREE.PointLight(0xffffff, 30);
//pointLight.position.set(2, 3, 4);
//exercise.add(pointLight);

const geometries = [
    new THREE.SphereGeometry(0.5, 64, 64),
    new THREE.PlaneGeometry(1, 1, 100, 100),
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
];

const meshes = geometries.map((geometry, index) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (index - 1) * 1.5;
    return mesh;
});

exercise.add(...meshes);

exercise.animate((clock) => {
    const elapsedTime = clock.getElapsedTime();
    meshes.forEach((mesh) => {
        mesh.rotation.x = -0.1 * elapsedTime;
        mesh.rotation.y = 0.15 * elapsedTime;
    });
});

const gui = new GUI();
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.0001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001);
// gui.addColor(material, 'sheenColor');
// gui.add(material, 'iridescence').min(0).max(1).step(0.0001);
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);

gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(1).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    exercise.scene.background = environmentMap;
    exercise.scene.environment = environmentMap;
});
