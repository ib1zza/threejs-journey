import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterParticlesVertexShader from './shaders/coolWavesParticles/vertex.glsl';
import waterParticlesFragmentShader from './shaders/coolWavesParticles/fragment.glsl';
import gsap from "gsap";

const duration = 0.5;
 


/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Material

const parameters = {}
parameters.count = 100
parameters.size = 0.5
 


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
camera.position.set(-0.01, 0.3, 0)
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


const material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: waterParticlesVertexShader,
    fragmentShader: waterParticlesFragmentShader,
    uniforms: {
        uTime: {value: 0},
        uSize: {value: parameters.size * renderer.getPixelRatio()},
        
        uDepthColor: { value: new THREE.Color("#000000") },
        uSurfaceColor: { value: new THREE.Color("#ffffff") },
        uColorOffset: { value: 0.03},
        uColorMultiplier: { value: 5 },

        uSmallWavesElevation: { value: 1 },
        uSmallWavesFrequency: { value: 5.0},
        uSmallWavesSpeed: {value: 0.6},
        uSmallWavesIterations: {value: 1.0},

        uMultiplierElevation: { value: 0 },
    }
})

if(window.location.hash == '#debug')
{
    const gui = new dat.GUI();
    
    gui.add(material.uniforms.uSize, 'value').min(0).max(10).step(0.001).name('point size')
    gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('color offset')
    gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('color multiplier')

    gui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(10).step(0.001).name('small waves elevation')
    gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.001).name('small waves frequency')
    gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(10).step(0.001).name('small waves speed')
    gui.add(material.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(0.001).name('small waves iterations')
}

 
/**
 * Points
 */

const createPoints = () => {
    const geometry = new THREE.BufferGeometry()

    const vertices = [];
    
    for ( let i = 0; i < parameters.count; i ++ ) {
        for ( let j = 0; j < parameters.count; j ++ ) {
            const x = (i) / parameters.count - 0.5;
            const y = 0;
            const z =  (j) / parameters.count - 0.5;
            vertices.push( x, y, z );
        }
    }
    
    
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    
    const points = new THREE.Points(geometry, material)

    scene.add(points)
}

createPoints()

/**
 * Animate
 */
const clock = new THREE.Clock()

const group = new THREE.Group();
let arr = [];

const triangleMaterial = new THREE.ShaderMaterial({
    vertexShader: `
  
    varying vec2 vUv;
 
      varying float vPosY;
  
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        vPosY = position.y;
        vUv = uv;
      
      }
    `,
    fragmentShader: `
   
    varying vec2 vUv;
 
    varying float vPosY;
    uniform float uOpacityMultiplier;
  
      void main() {
        vec3 color = vec3(1.0) * uOpacityMultiplier;

        vec2 newUv = vUv;
        newUv.y = newUv.y * newUv.y + 0.1;

        vec3 mul = vec3(newUv.y);

        float strength = step(0.495, abs(vUv.x - 0.5)) + step(0.495, abs(vUv.y - 0.5)) ;

        gl_FragColor = vec4( color, mul * strength );
      }
  
    `,
    uniforms: {
        uOpacityMultiplier: { value: 1 },
    },
 
    transparent: true,
    side: THREE.DoubleSide,
  });
  




const count = 120;
const multiplier = 0.12;

const sizeHeight = 1.0 * multiplier;
const sizeWidth = 0.5 * multiplier;


const createRectangles = () => {
  if(arr.length > 0) {
    animateRectanglesToBase();
  } else {
    for (let i = 0; i < count; i++) {
        const element = new THREE.Mesh(
          new THREE.PlaneGeometry(sizeWidth, sizeHeight),
          triangleMaterial
        );
    
        element.rotation.y = (Math.PI * 2 * (count - i)) / count;
    
        element.position.z = Math.sin((Math.PI * 2 * (count - i + 70)) / (count)) * multiplier;
        element.position.x = -Math.cos((Math.PI * 2 * (count - i + 70)) / (count)) * multiplier;

        arr.push(element);
        group.add(element); 
    }
  }
 
  group.position.y = 0.025;
  scene.add(group);
}

createRectangles();


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    material.uniforms.uTime.value = elapsedTime;
    group.rotation.y = elapsedTime / 2
 
    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


// ! animations

const button = document.querySelector('.button')

let state = false;



button.addEventListener('click', () =>
{
    if(state) {
        showRectangles();
        button.style.color = "#ffffff";
        button.style.opacity = "1";
    } else {
        hideRectangles()
        button.style.color = "#bbbbbb";
        button.style.opacity = "0.45";
    }
    state = !state;
})

function hideRectangles  () {
    gsap.to(camera.position, {
        duration: duration,
        x: -0.5,
        y: 0.2,
        z: 0,
      });

      gsap.to(material.uniforms.uMultiplierElevation, {
        duration: duration,
        value: 1
      });

      gsap.to(triangleMaterial.uniforms.uOpacityMultiplier, {
        duration: duration,
        value:  0,
        ease: 'linear',
      })


    arr.forEach(element => {
        gsap.to(element.rotation, {
            duration: duration,
            x: Math.random(),
            z: Math.random(),
          })
         
        gsap.to(element.position, {
            duration: duration,
            x: element.position.x * 2.0 ,
            z: element.position.z * 2.0,
          }).then(() => {
            scene.remove(group);
            group.remove(element);
          })
    })
}

function showRectangles  () {
     
    createRectangles();
    gsap.to(camera.position, {
        duration: duration,
        x: -0.01,
        y: 0.3,
        z: 0,
      });

      gsap.to(material.uniforms.uMultiplierElevation, {
        duration: duration,
        value: 0
      });

      gsap.to(triangleMaterial.uniforms.uOpacityMultiplier, {
        duration: duration,
        value:  1,
        ease: 'linear',
      })

    scene.add(group);
}

function animateRectanglesToBase () {
    for (let i = 0; i < count; i++) {
        const element = arr[i]
     
        gsap.to(element.rotation, {
            duration: duration,
            x: 0,
            z: 0,
            y: (Math.PI * 2 * (count - i)) / count,
          })
         
        gsap.to(element.position, {
            duration: duration,
            z: Math.sin((Math.PI * 2 * (count - i + 70)) / (count)) * multiplier ,
            x: -Math.cos((Math.PI * 2 * (count - i + 70)) / (count)) * multiplier,
          })
          group.add(element); 
    }
}
