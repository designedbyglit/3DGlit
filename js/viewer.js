const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / 600,
0.1,
10000
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, 600)

document.getElementById("viewer").appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 1))

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(100, 100, 100)
scene.add(light)

const loader = new THREE.GLTFLoader()

loader.load("models/yes.glb", function (gltf) {

    const model = gltf.scene
    scene.add(model)

    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    model.position.x -= center.x
    model.position.y -= center.y
    model.position.z -= center.z

    const maxDim = Math.max(size.x, size.y, size.z)

    camera.position.set(0, maxDim, maxDim * 2)

    controls.target.set(0, 0, 0)
    controls.update()

})

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

animate()
