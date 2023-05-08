import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Textures

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matCapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
// Scene
const scene = new THREE.Scene();

// const material = new THREE.MeshBasicMaterial({
//   map: doorColorTexture,
//   alphaMap: doorAlphaTexture,
//   transparent: true,
// });

// const material = new THREE.MeshNormalMaterial({
//   side: THREE.DoubleSide,
// });

// const material = new THREE.MeshMatcapMaterial({
//   matcap: matCapTexture,
//   side: THREE.DoubleSide,
// });

// const material = new THREE.MeshLambertMaterial({

// })

// const material = new THREE.MeshStandardMaterial({
//   map: doorColorTexture,
//   side: THREE.DoubleSide,
//   aoMap: doorAmbientOcclusionTexture,
//   displacementMap: doorHeightTexture,
//   displacementScale: 0.1,
//   metalnessMap: doorMetalnessTexture,
//   roughnessMap: doorRoughnessTexture,
//   alphaMap: doorAlphaTexture,
//   transparent: true,
//   normalMap: doorNormalTexture,
// });

const material = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  envMap: envMap,
});

const gui = new dat.GUI();
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
sphere.position.x = -3;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 30, 30), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.5, 32, 64), material);
torus.position.x = 3;

sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
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

const speed = 0.3;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.x = elapsedTime * speed;
  plane.rotation.x = elapsedTime * speed;
  torus.rotation.x = elapsedTime * speed;

  sphere.rotation.y = elapsedTime * speed;
  plane.rotation.y = elapsedTime * speed;
  torus.rotation.y = elapsedTime * speed;
  // Update controls
  controls.update();
  //   camera.lookAt(plane.position);
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
