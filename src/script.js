import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()


const options = {
    fog: "#262837",
}



// Canvas
const canvas = document.querySelector('canvas.webgl');


const fog = new THREE.Fog(options.fog, 1, 15);


// Scene
const scene = new THREE.Scene()
scene.fog = fog
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')


const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
/**
 * House
 */


const house = new THREE.Group();
scene.add(house);

// House

const height = 2.5;

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, height, 4),
    new THREE.MeshStandardMaterial({
        // color: '#a1361b',

        normalMap: bricksNormalTexture,
        aoMap: bricksAmbientOcclusionTexture,
        roughnessMap: bricksRoughnessTexture,
        map: bricksColorTexture
    })
)
walls.castShadow = true
walls.receiveShadow = true
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))

walls.position.y = height /2 ;
house.add(walls)

const roofHeight = 1;
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
        color: '#827673',
    })
)

roof.position.y = height + roofHeight / 2;
roof.rotation.y = Math.PI / 4;

house.add(roof)

const doorHeight = 2;
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(doorHeight,doorHeight, 100, 100),
    new THREE.MeshStandardMaterial({
        
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        aoMap: doorAmbientOcclusionTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
         
        transparent: true,

    })
)

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.z = 4/2 + 0.001;
door.position.y = doorHeight/2;

house.add(door)

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)




gui.addColor(walls.material, 'color').name("house col").onChange((e) => {
    walls.material.color.set(e)
})

gui.addColor(roof.material, 'color').name("roof col").onChange((e) => {
    roof.material.color.set(e)
})


// graves

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b2b2'})

for(let i = 0; i< 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.2, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.2
    grave.rotation.z = (Math.random() - 0.5) * 0.2
    graves.add(grave)

    grave.castShadow = true
    grave.receiveShadow = true
}

gui.addColor(graveMaterial, 'color').name("grave col").onChange((e) => {
    graveMaterial.color.set(e)
})

 

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
     })
)

floor.receiveShadow = true

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name("ambient intensity")
scene.add(ambientLight)

gui.addColor(ambientLight, 'color').name("ambientLight col").onChange((e) => {
    ambientLight.color.set(e)
})

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name("moonLight intensity")
gui.addColor(moonLight, 'color').name("moonLight col").onChange((e) => {
    moonLight.color.set(e)
})
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);



const ghost1 = new THREE.PointLight(
    "#ff00ff",
    2,3
)

const ghost2 = new THREE.PointLight(
    '#00ffff',
    2,3
)

const ghost3 = new THREE.PointLight(
    
    '#ffff00',
    2,3
)

scene.add(ghost1, ghost2, ghost3)
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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(options.fog)

gui.addColor(options, 'fog').onChange((e) => {
    options.fog = e;
    fog.color.set(e)
    renderer.setClearColor(e)
})
/**
 * Animate
 */
const clock = new THREE.Clock()

moonLight.castShadow = true
moonLight.shadow.mapSize.set(256, 256)
moonLight.shadow.camera.far = 7
doorLight.castShadow = true
doorLight.shadow.mapSize.set(256, 256)
doorLight.shadow.camera.far = 10

ghost1.castShadow = true
ghost1.shadow.mapSize.set(256, 256)
ghost1.shadow.camera.far = 7

ghost2.castShadow = true
ghost2.shadow.mapSize.set(256, 256)
ghost2.shadow.camera.far = 7

ghost3.castShadow = true
ghost3.shadow.mapSize.set(256, 256)
ghost3.shadow.camera.far = 7



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if(Math.floor(elapsedTime) % 3 === 0) {
        const val = Math.abs(elapsedTime % 3)  ;
        console.log(val)
        renderer.setClearColor(options.fog, val)
    }else {
        // renderer.setClearColor(options.fog, 1)
    }

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3) 

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 3) 

    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * 7
    ghost3.position.z = Math.sin(ghost3Angle) * 7
    ghost3.position.y = Math.sin(elapsedTime * 5) 

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()