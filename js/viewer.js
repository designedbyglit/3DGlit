const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/600,
0.1,
10000
)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,600)

document.getElementById("viewer").appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera,renderer.domElement)

camera.position.set(0,0,200)

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(100,100,100)

scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff,0.7))

let model

const loader = new THREE.GLTFLoader()

loader.load("models/yes.glb", function(gltf){

model = gltf.scene

scene.add(model)

const box = new THREE.Box3().setFromObject(model)
const center = box.getCenter(new THREE.Vector3())

model.position.sub(center)

})

function changeColor(color){

model.traverse(function(child){

if(child.isMesh){

child.material.color.set(color)

}

})

}

window.changeColor = changeColor

function animate(){

requestAnimationFrame(animate)

controls.update()

renderer.render(scene,camera)

}

animate()
