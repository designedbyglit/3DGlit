const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / 600,
0.1,
100000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 600);
document.getElementById("viewer").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 5);

const light1 = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(5, 10, 7);
scene.add(light2);

let model;

const loader = new THREE.GLTFLoader();

loader.load(
"models/yes.glb",

function (gltf) {

model = gltf.scene;
scene.add(model);

/* centrer modèle */

const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());

model.position.sub(center);

/* agrandir modèle */

model.scale.set(20,20,20);

},

undefined,

function (error) {

console.error("Erreur chargement modèle :", error);

}

);

function animate() {

requestAnimationFrame(animate);

controls.update();

renderer.render(scene, camera);

}

animate();
