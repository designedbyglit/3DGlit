const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/600,
0.1,
100000
)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,600)

document.getElementById("viewer").appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff,1))

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(200,200,200)
scene.add(light)

const loader = new THREE.GLTFLoader()

loader.load("models/yes.glb", function(gltf){

const model = gltf.scene
scene.add(model)

/* calculer la taille du modèle */

const box = new THREE.Box3().setFromObject(model)
const size = box.getSize(new THREE.Vector3()).length()
const center = box.getCenter(new THREE.Vector3())

/* centrer modèle */

model.position.x -= center.x
model.position.y -= center.y
model.position.z -= center.z

/* placer caméra automatiquement */

camera.position.set(0, size/2, size*1.5)

controls.target.set(0,0,0)
controls.update()

})

function animate(){

requestAnimationFrame(animate)

controls.update()

renderer.render(scene,camera)

}

animate()
