import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/1.png')

//  const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
 const particlesMaterial = new THREE.PointsMaterial({
    alphaMap: particleTexture,
    // sizeAttenuation: true,
    // alphaTest: 0.1,
    // depthTest: false,
    depthWrite: false,
     size: 0.1,
     vertexColors: true,
     transparent: true,
 })
 const count = 5000;
 const particlesGeometry = new THREE.BufferGeometry();
 let particlesArray = new Float32Array(count * 3);
let colorsArray = new Float32Array(count * 3);
 for (let i = 0; i < count * 3; i++) {
        particlesArray[i] = (Math.random() - 0.5) * 20
        colorsArray[i] = 1
     }

     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesArray, 3))
     particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3))

 const points = new THREE.Points(particlesGeometry, particlesMaterial)
 scene.add(points)


//  const count = 100;
//  const lineGeometry = new THREE.BufferGeometry();
//  let particlesArray = new Float32Array(count * 3);
 
//  for (let i = 0; i < count * 3; i+=3) {
//     particlesArray[i] = Math.sin(Math.PI * i / count / 10) * 10;
//     particlesArray[i + 1] = Math.cos(Math.PI * 2 * (i / count)) * 0.5;
//     particlesArray[i + 2] = 0;
    
//  }

//  lineGeometry.setAttribute('position', new THREE.BufferAttribute(particlesArray, 3))
//  const points1 = new THREE.Points(lineGeometry, particlesMaterial)
//  scene.add(points1)

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
camera.position.z = 3
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() * 2

    for (let i = 0; i < count; i++)
    {
        const i3 = i * 3
        const x  =  particlesGeometry.attributes.position.array[i3]
        const z  =  particlesGeometry.attributes.position.array[i3 + 2]
        // particlesGeometry.attributes.position.array[i3] = x + Math.sin(elapsedTime ) /20
        // particlesGeometry.attributes.position.array[i3 + 2] = z + Math.sin(elapsedTime   ) /20
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x ) / 2
        // particlesGeometry.attributes.position.array[i3 + 2] = Math.sin(elapsedTime )
        particlesGeometry.attributes.position.needsUpdate = true
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()