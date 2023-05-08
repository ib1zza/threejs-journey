import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { gsap } from "gsap";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

// scene.add(sphere, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const arr = [];
const textureLoader = new THREE.TextureLoader();

const matCapTexture = textureLoader.load("/textures/matcaps/8.png");

const triangleMaterial = new THREE.MeshNormalMaterial({
  wireframe: true,
  side: THREE.DoubleSide,
  map: matCapTexture,
});

const createText = (text1, font, x = 0, y = 0, z = 0, rotate) => {
  const textGeometry = new TextGeometry(text1, {
    font: font,
    size: 0.2,
    height: 0.2,

    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.005,
    bevelOffset: 0,
    bevelSegments: 3,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.2) / 2,
  //     -(textGeometry.boundingBox.max.y - 0.2) / 2,
  //     -(textGeometry.boundingBox.max.z - 0.3) / 2
  //   );

  if (rotate) {
    textGeometry.rotateX(rotate.x);
    textGeometry.rotateY(rotate.y);
    textGeometry.rotateZ(rotate.z);
  }
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    // wireframe: true,
    side: THREE.DoubleSide,
    matcap: matCapTexture,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.y = y;
  text.position.z = z;
  text.position.x = x;
  return text;
};

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const text = createText("Color", font, 0, 1, -0.3, {
    x: -Math.PI / 2,
    y: 0,
    z: 0,
  });
  scene.add(text);
  const text1 = createText("is", font, 0, 1, 0, {
    x: -Math.PI / 2,
    y: 0,
    z: 0,
  });
  scene.add(text1);
  const text2 = createText("everything", font, 0, 1, 0.3, {
    x: -Math.PI / 2,
    y: 0,
    z: 0,
  });
  scene.add(text2);
});

const group = new THREE.Group();
const count = 80;
for (let i = 0; i < count; i++) {
  const element = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    triangleMaterial
  );

  arr.push(element);

  element.rotation.y = (Math.PI * 2 * (count - i)) / count;

  element.position.z = Math.sin((Math.PI * 2 * (count - i + 10)) / count);

  element.position.x = -Math.cos((Math.PI * 2 * (count - i + 10)) / count);
  //   element.position.z = Math.abs((i - 50) / 100);
  group.add(element);
  // console.log(element.rotation.y);
}

scene.add(group);
/**
 * Animate
 */
const clock = new THREE.Clock();

camera.position.y = 4;
camera.position.z = 0;
camera.position.x = 0;
camera.lookAt(0, 0, 0);

function animateFov() {
  gsap.to(camera, {
    fov: 70,
    duration: 6,
    ease: "power2.inout",
  });
  console.log("animate");
}

const timeout = setTimeout(() => {
  animateFov();
}, 1000);

window.addEventListener(
  "mousemove",
  () => {
    clearTimeout(timeout);
    animateFov();
  },
  { once: true }
);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  group.rotation.y = elapsedTime / 2;
  //   group.rotation.x = elapsedTime / 2;
  //   group.rotation.z = elapsedTime /
  // Update controls
  controls.update();
  camera.updateProjectionMatrix();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
