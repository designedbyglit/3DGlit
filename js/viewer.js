const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("viewer").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 3);

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

const loader = new THREE.GLTFLoader();

loader.load(
"models/yes.glb",

function (gltf) {

const model = gltf.scene;
scene.add(model);

console.log("MODELE CHARGE");

},

undefined,

function (error) {

console.error("ERREUR GLB :", error);

}

);

function animate() {

requestAnimationFrame(animate);

controls.update();

renderer.render(scene, camera);

}

animate();
