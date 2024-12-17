import * as THREE from 'three'
import { BasicSetup } from './utils/BasicSetup.js'
import GUI from 'lil-gui';

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

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.45;
material.roughness = 0.65;

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
exercise.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(2, 3, 4);
exercise.add(pointLight);

const geometries = [
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.PlaneGeometry(1, 1),
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
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