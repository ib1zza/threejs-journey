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

const loader = new THREE.TextureLoader()
const cubeLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeLoader.load([
    "/textures/env/space.jpeg",
    "/textures/env/space.jpeg",
    "/textures/env/space.jpeg",
    "/textures/env/space.jpeg",
    "/textures/env/space.jpeg",
    "/textures/env/space.jpeg",
])

 
/**
 * Galaxy
 */
const parameters = {}
parameters.count = 100000
parameters.size = 0.017
parameters.radius = 3.45
parameters.branches = 4
parameters.spin = 1.75
parameters.randomness = 0.14
parameters.randomnessPower = 1.8
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#4036ce'

parameters.starsCount = 10000
 
parameters.starsSize = 0.01
parameters.starsRadius = 20

parameters.galaxyRotationSpeed = 1;
parameters.cameraRotationSpeed = -1;

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++)
    {
        // Position
        const i3 = i * 3

        const radius = Math.random() * parameters.radius

        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * (parameters.radius - radius + 0.2)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) *  parameters.randomness * (parameters.radius - radius + 0.2) / 3
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * (parameters.radius - radius + 0.2)

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)
        
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

let starsGeometry = null;
let starsPoints = null;
let starsMaterial = null;

const generateStars = () => {

    if(starsPoints !== null)
    {
        starsGeometry.dispose()
        starsMaterial.dispose()
        scene.remove(starsPoints)
    }


    starsGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++)
    {
        // Position
        const i3 = i * 3

        const radius = Math.random() * parameters.starsRadius
 

        positions[i3    ] =   (Math.random() - 0.5) * parameters.starsRadius
        positions[i3 + 1] =   (Math.random() - 0.5) * parameters.starsRadius
        positions[i3 + 2] =   (Math.random() - 0.5) * parameters.starsRadius

        // Color
        const mixedColor = colorInside.clone()
        const vec = new THREE.Vector3(positions[i3    ], positions[i3 + 1], positions[i3 + 2])
        // console.log(vec.length )
        if(i < 10) {
            console.log(vec.length() / parameters.starsRadius)
        }
        mixedColor.lerp(colorOutside, vec.length() / parameters.starsRadius)
        
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    starsMaterial = new THREE.PointsMaterial({
        size: parameters.starsSize,
        sizeAttenuation: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    starsPoints = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(starsPoints)

}
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
 
 

gui.add(parameters, 'starsCount').min(1000).max(100000).step(100).onFinishChange(generateStars)
gui.add(parameters, 'starsRadius').min(5).max(50).step(1).onFinishChange(generateStars)
gui.add(parameters, 'starsSize').min(0.01).max(1).step(0.01).onFinishChange(generateStars)

gui.add(parameters, 'galaxyRotationSpeed').min(0).max(10).step(0.1)
gui.add(parameters, 'cameraRotationSpeed').min(-10).max(10).step(0.1)


generateGalaxy()
generateStars();
 
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
camera.position.x = 3
camera.position.y = 3
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
    const elapsedTime = clock.getElapsedTime()

    camera.position.x =  Math.sin(elapsedTime * Math.PI / 16 * parameters.cameraRotationSpeed) * 5 
    camera.position.z =  Math.cos(elapsedTime * Math.PI / 16 * parameters.cameraRotationSpeed) * 5 
    camera.updateProjectionMatrix()
    if(geometry) {
        points.rotation.y = elapsedTime * Math.PI / 8 * parameters.galaxyRotationSpeed;
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()