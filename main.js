import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;
let planet_sun_label;


let mercury_orbit_radius = 50;
let venus_orbit_radius = 60;
let earth_orbit_radius = 70;
let mars_orbit_radius = 80;
let jupiter_orbit_radius = 100;
let saturn_orbit_radius = 120;
let uranus_orbit_radius = 140;
let neptune_orbit_radius = 160;

let mercury_revolution_speed = 2;
let venus_revolution_speed = 1.5;
let earth_revolution_speed = 1;
let mars_revolution_speed = 0.8;
let jupiter_revolution_speed = 0.7;
let saturn_revolution_speed = 0.6;
let uranus_revolution_speed = 0.5;
let neptune_revolution_speed = 0.4;








const { innerWidth, innerHeight} = window;
// Basic Setup
const textureLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  85,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(100, 150, 200);

planet_sun = loadPlanetTexture("../img/sun_hd.jpg", 20, 100, 100, 'basic');
planet_earth = loadPlanetTexture("../img/earth_hd.jpg", 4, 100, 100, 'standard');
planet_mercury = loadPlanetTexture("../img/mercury_hd.jpg", 2, 100, 100, 'standard');
planet_venus = loadPlanetTexture("../img/venus_hd.jpg", 3, 100, 100, 'standard');
planet_mars = loadPlanetTexture("../img/mars_hd.jpg", 3.5, 100, 100, 'standard');
planet_jupiter = loadPlanetTexture("../img/jupiter_hd.jpg", 10, 100, 100, 'standard');
planet_saturn = loadPlanetTexture("../img/saturn_hd.jpg", 8, 100, 100, 'standard');
planet_uranus = loadPlanetTexture("../img/uranus_hd.jpg", 6, 100, 100, 'standard');
planet_neptune = loadPlanetTexture("../img/neptune_hd.jpg", 5, 100, 100, 'standard');
camera.lookAt(planet_sun);

scene.add(planet_sun, planet_earth, planet_mercury, planet_venus, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune);
generateRing(mercury_orbit_radius);
generateRing(venus_orbit_radius);
generateRing(earth_orbit_radius);
generateRing(mars_orbit_radius);
generateRing(jupiter_orbit_radius);
generateRing(saturn_orbit_radius);
generateRing(uranus_orbit_radius);
generateRing(neptune_orbit_radius);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

// Apply the skybox texture
const skyboxTexture = loadSkybox();
scene.background = skyboxTexture;

function animate(time) {
  planet_sun.rotation.y += 0.001;
  planet_earth.rotation.y += 0.001;
  planet_mercury.rotation.y += 0.001;
  planet_venus.rotation.y += 0.001;
  planet_mars.rotation.y += 0.001;
  planet_jupiter.rotation.y += 0.001;
  planet_saturn.rotation.y += 0.001;
  planet_uranus.rotation.y += 0.001;
  planet_neptune.rotation.y += 0.001;
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);

  planetRevolver(time, mercury_revolution_speed, planet_mercury, mercury_orbit_radius, 'mercury');
  planetRevolver(time, venus_revolution_speed, planet_venus, venus_orbit_radius, 'venus');
  planetRevolver(time, earth_revolution_speed, planet_earth, earth_orbit_radius, 'earth');
  planetRevolver(time, mars_revolution_speed, planet_mars, mars_orbit_radius, 'mars');
  planetRevolver(time, jupiter_revolution_speed, planet_jupiter, jupiter_orbit_radius, 'jupiter');
  planetRevolver(time, saturn_revolution_speed, planet_saturn, saturn_orbit_radius, 'saturn');
  planetRevolver(time, uranus_revolution_speed, planet_uranus, uranus_orbit_radius, 'uranus');
  planetRevolver(time, neptune_revolution_speed, planet_neptune, neptune_orbit_radius, 'neptune');
}
animate(0);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Replace with loadSkybox function
function loadSkybox() {
  const loader = new THREE.CubeTextureLoader();
  const skyboxImagepaths = [
    '../img/skybox/space_ft.png',
    '../img/skybox/space_bk.png',
    '../img/skybox/space_up.png',
    '../img/skybox/space_dn.png',
    '../img/skybox/space_rt.png',
    '../img/skybox/space_lf.png'
  ];
  const skyboxTexture = loader.load(skyboxImagepaths);
  return skyboxTexture;
}

function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const planetTexture = textureLoader.load(texture);
  const material = new THREE.MeshBasicMaterial({ map: planetTexture });
  const planet = new THREE.Mesh(geometry, material);

  return planet;
}

function planetRevolver(time, speed, planet, orbitRadius, planetName) {
  const orbitMultiplier = 0.001;
  const planetOrbitAngle = time * orbitMultiplier * speed;
  planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetOrbitAngle);
  planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetOrbitAngle);
}

function generateRing(innerRadius) {
  const outerRadius = innerRadius - 0.5;
  const thetaSegment = 64;
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegment);
  const material = new THREE.MeshBasicMaterial({ color: 'gray', side: THREE.DoubleSide });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
}