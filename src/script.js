import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matCapTexture = textureLoader.load("/textures/matcaps/8.png");
/*
 * Fonts
 */

const material = new THREE.MeshMatcapMaterial({
  matcap: matCapTexture,
});

const createText = (text1, font, x = 0, y = 0, z = 0) => {
  const textGeometry = new TextGeometry(text1, {
    font: font,
    size: 0.5,
    height: 0.2,

    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.2) / 2,
  //     -(textGeometry.boundingBox.max.y - 0.2) / 2,
  //     -(textGeometry.boundingBox.max.z - 0.3) / 2
  //   );

  textGeometry.center();

  const textMaterial = material;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.y = y;
  return text;
};
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const text = createText("Light", font, 0, 0.7, 0);
  scene.add(text);
  const text1 = createText("is", font, 0, 0, 0);
  scene.add(text1);
  const text2 = createText("everything", font, 0, -0.7, 0);
  scene.add(text2);
});

function createFigures() {
  const range = 50;

  const arr = [];
  for (let i = 0; i < 2000; i++) {
    const figure = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 16, 100),
      material
    );
    figure.position.x = (Math.random() - 0.5) * range;
    figure.position.y = (Math.random() - 0.5) * range;
    figure.position.z = (Math.random() - 0.5) * range;

    figure.rotation.x = Math.random() * Math.PI;
    figure.rotation.y = Math.random() * Math.PI;
    figure.rotation.z = Math.random() * Math.PI;
    arr.push(figure);
    scene.add(figure);
  }

  return arr;
}

const figures = createFigures();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

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
  75,
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

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  figures.forEach((figure) => {
    figure.rotation.x += Math.random() % 0.02;
    figure.rotation.y += Math.random() % 0.02;
    figure.rotation.z += Math.random() % 0.02;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
