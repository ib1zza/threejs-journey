import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Loaders

const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObj = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = envMap;
            child.material.envMapIntensity = debugObj.envMapIntensity;
            child.receiveShadow = true;
            child.castShadow = true;
        }
    })
}

const envMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
]);

envMap.encoding = THREE.sRGBEncoding;

scene.background = envMap;
scene.environment = envMap;
// console.log(envMap);

debugObj.envMapIntensity = 5;

gui.add(debugObj, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials);


/*
 * Models
 */

gltfLoader.load(
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    '/models/hamburger.glb',
    (gltf) =>
    {
        // gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -4, 0);
        gltf.scene.rotation.y = Math.PI / 2;
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('model rotation');

        updateAllMaterials();
    }
)

/*
 *  Lights
 */ 
 
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);
directionalLight.shadow.normalBias = 0.05;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;

scene.add(directionalLight);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Intensity');
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('X');
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('Y');
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('Z');

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmicToneMapping: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001).name('ToneMappingExposure');


/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()