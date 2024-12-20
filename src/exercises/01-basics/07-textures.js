import * as THREE from 'three'
import { AnimationLoop } from '../../utils/animation-loop';
import { textureLoader } from '../../utils/loading-manager';
export class TextureExercise {
    constructor(view){
        this.view = view;

        this.scene = new THREE.Scene();

        this.colorTexture = this.loadMinecrafTexture();

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ map: this.colorTexture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.animationLoop = new AnimationLoop(() => this.animationFrame());
        this.view.toggleOrbitControls(true);
        this.view.setCamera({
            position: { x: 2, y: 2, z: 2 },
            lookAt: { x: 0, y: 0, z: 0 }
        });
        this.view.render(this.scene);
    }

    loadMinecrafTexture() {
        const colorTexture = textureLoader.load('/textures/minecraft.png');
        colorTexture.colorSpace = THREE.SRGBColorSpace;
        colorTexture.wrapS = THREE.RepeatWrapping;
        colorTexture.wrapT = THREE.RepeatWrapping;
        colorTexture.generateMipmaps = false;
        colorTexture.minFilter = THREE.NearestFilter;
        colorTexture.magFilter = THREE.NearestFilter;
        return colorTexture;
    }

    animationFrame() {
        this.view.render(this.scene);
    }

    async dispose() {
        this.view.toggleOrbitControls(false);
        await this.animationLoop.dispose();
        this.scene.remove(this.mesh);
        this.colorTexture.dispose();
        this.material.dispose();
        this.geometry.dispose();
    }
}

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// console.log(geometry.attributes)
// const material = new THREE.MeshBasicMaterial({ map: colorTexture })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 1
// camera.position.y = 1
// camera.position.z = 1
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// /**
//  * Animate
//  */

// const tick = () =>
// {
//     // Update controls
//     controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()