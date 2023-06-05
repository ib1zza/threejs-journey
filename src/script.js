import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterDefaultVertexShader from './shaders/water/vertex.glsl';
import waterDefaultFragmentShader from './shaders/water/fragment.glsl';
import waterCyberVertexShader from './shaders/cyberpunk_effect/vertex.glsl';
import waterCyberFragmentShader from './shaders/cyberpunk_effect/fragment.glsl';
import waterParticlesVertexShader from './shaders/coolWavesParticles/vertex.glsl';
import waterParticlesFragmentShader from './shaders/coolWavesParticles/fragment.glsl';

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry

const subdivisions = 512;
const waterGeometry = new THREE.PlaneGeometry(2, 2, subdivisions, subdivisions)

const debugObject = {};
debugObject.depthColor = "#186691";
debugObject.surfaceColor = '#9bd8ff';

const presets = {
    defaultWaves: {
        colors: ["#186691", "#9bd8ff"],
        material: new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
        
                uBigWavesElevation: { value: 0.2 },
                uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                uBigWavesSpeed: {value: 0.75},
        
                uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
                uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
                uColorOffset: { value: 0.08},
                uColorMultiplier: { value: 5 },

                uSmallWavesElevation: { value: 0.2 },
                uSmallWavesFrequency: { value: 3.0},
                uSmallWavesSpeed: {value: 0.2},
                uSmallWavesIterations: {value: 4.0},
            },
    
            transparent: true,
            vertexShader: waterDefaultVertexShader,
            fragmentShader: waterDefaultFragmentShader,
    })},
    cyberWaves: {
        colors: ["#111111", "#9bd8ff"],
        material: new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
        
                uBigWavesElevation: { value: 0.2 },
                uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                uBigWavesSpeed: {value: 0.75},
        
                uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
                uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
                uColorOffset: { value: 0.08},
                uColorMultiplier: { value: 5 },

                uSmallWavesElevation: { value: 0.2 },
                uSmallWavesFrequency: { value: 3.0},
                uSmallWavesSpeed: {value: 0.2},
                uSmallWavesIterations: {value: 4.0},
            },
    
            transparent: true,
            vertexShader: waterCyberVertexShader,
            fragmentShader: waterCyberFragmentShader,
    })},
    particles: {
        colors: ["#000000", "#ffffff"],
        material: new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
        
                uBigWavesElevation: { value: 0.05 },
                uBigWavesFrequency: { value: new THREE.Vector2(4.8, 4.8) },
                uBigWavesSpeed: {value: 0.75},
        
                uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
                uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
                uColorOffset: { value: 0.08},
                uColorMultiplier: { value: 5 },

                uSmallWavesElevation: { value: 0.2 },
                uSmallWavesFrequency: { value: 3.0},
                uSmallWavesSpeed: {value: 0.2},
                uSmallWavesIterations: {value: 4.0},
            },
    
            transparent: true,
            vertexShader: waterParticlesVertexShader,
            fragmentShader: waterParticlesFragmentShader,
    })},

}

debugObject.material = presets.cyberWaves.material;

// Material



// Mesh
const water = new THREE.Mesh(waterGeometry, debugObject.material)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

let gui = null;

function addGUI (water, selectedType = 'cyberWaves') {
     gui = new dat.GUI({ width: 340 })
     
    gui.addColor(debugObject, 'depthColor').setValue(presets[selectedType].colors[0])
    .onChange(() => water.material.uniforms.uDepthColor.value.set(debugObject.depthColor))
    .name('Depth Color');

    gui.addColor(debugObject, 'surfaceColor').setValue(presets[selectedType].colors[1])
    .onChange(() => water.material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor))
    .name('Surface Color');
    const forTest = Object.keys(presets).map(key => ({[key]: {...presets[key], type:key}}))
    .reduce((a, b) => Object.assign(a, b), {});

    console.log(forTest)

    gui.add(
        debugObject,
         'material',
         forTest
        )
    .onChange((obj) => {
        water.material = debugObject.material.material;
        water.material.uniforms.uDepthColor.value.set(debugObject.material.colors[0])
        water.material.uniforms.uSurfaceColor.value.set(debugObject.material.colors[1])
        rerenderGUI(water,obj.type)
    }).name('preset');

    gui.add(water.material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('Big Waves Elevation').updateDisplay()
    gui.add(water.material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('Big Waves Frequency X').updateDisplay()
    gui.add(water.material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('Big Waves Frequency Y').updateDisplay()
    gui.add(water.material.uniforms.uBigWavesSpeed, 'value').min(0).max(2).step(0.001).name('Big Waves Speed').updateDisplay()

    gui.add(water.material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('Color Offset').updateDisplay()
    gui.add(water.material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('Color Multiplier').updateDisplay()

    gui.add(water.material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('Small Waves Elevation').updateDisplay()
    gui.add(water.material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('Small Waves Frequency').updateDisplay()
    gui.add(water.material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('Small Waves Speed').updateDisplay()
    gui.add(water.material.uniforms.uSmallWavesIterations, 'value').min(0).max(5).step(1).name('Small Waves Iterations').updateDisplay()

}

function removeGUI () {
    gui.destroy();
}

function rerenderGUI(water, selectedType) {
    removeGUI()
    addGUI(water,selectedType);
}
addGUI(water);

   

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 100)
camera.position.set(1, 1, 1)
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    water.material.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()