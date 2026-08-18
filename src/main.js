import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Scene
const scene = new THREE.Scene()

const flower = new THREE.Group()
scene.add(flower)


// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(
    window.innerWidth,
    window.innerHeight
)

// Enable shadows
renderer.shadowMap.enabled = true

document.body.appendChild(
    renderer.domElement
)

// Orbit Controls
const controls = new OrbitControls(
    camera,
    renderer.domElement
)

controls.enableDamping = true
controls.minDistance = 2
controls.maxDistance = 10
controls.target.set(0, 1, 0)


// ==========================================
// TEXTURE
// ==========================================

// 1. Create a TextureLoader
const textureLoader = new THREE.TextureLoader()

// 2. Load our wood image
const floorTexture = textureLoader.load(
    '/textures/wood.avif'
)

// 3. Allow the texture to repeat
floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.wrapT = THREE.RepeatWrapping

// 4. Repeat it 4 × 4 times
floorTexture.repeat.set(4, 4)


// ==========================================
// TORUS KNOT
// ==========================================

// Geometry
const geometry = new THREE.TorusKnotGeometry(
    1,
    0.3,
    100,
    16
)

// Material
const material = new THREE.MeshStandardMaterial({
    color: 0xff69b4,
    roughness: 0.2,
    metalness: 0.8
})

// Mesh
const object = new THREE.Mesh(
    geometry,
    material
)

// Cast shadow
object.castShadow = true

//scene.add(object)

// ==========================================
// FLOWER
// ==========================================

// Flower center
const centerGeometry = new THREE.SphereGeometry(
    0.35,
    32,
    32
)

const centerMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    roughness: 0.5
})

const flowerCenter = new THREE.Mesh(
    centerGeometry,
    centerMaterial
)

flower.add(flowerCenter)
// Petal geometry
const petalGeometry = new THREE.SphereGeometry(
    0.4,
    32,
    32
)

const petalMaterial = new THREE.MeshStandardMaterial({
    color: 0xff69b4,
    roughness: 0.4
})

const petalCount = 6

for (let i = 0; i < petalCount; i++) {

    const petal = new THREE.Mesh(
        petalGeometry,
        petalMaterial
    )

    const angle =
        (i / petalCount) * Math.PI * 2

    petal.position.x = Math.cos(angle) * 0.7
    petal.position.y = Math.sin(angle) * 0.7

    petal.rotation.z = angle - Math.PI / 2

    petal.scale.set(
        0.7,
        1.5,
        0.3
    )

    flower.add(petal)
}

// Stem
const stemGeometry = new THREE.CylinderGeometry(
    0.08,
    0.08,
    2.5,
    16
)

const stemMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,
    roughness: 0.8
})

const stem = new THREE.Mesh(
    stemGeometry,
    stemMaterial
)

stem.position.y = -1.5

flower.add(stem)


// ==========================================
// FLOOR
// ==========================================

const floorGeometry = new THREE.PlaneGeometry(
    10,
    10
)

// Use our texture here 👇
const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.8,
    metalness: 0
})

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
)

floor.rotation.x = -Math.PI / 2
floor.position.y = -1.7

// Receive shadow
floor.receiveShadow = true

scene.add(floor)


// ==========================================
// LIGHTS
// ==========================================

// Directional Light
const light = new THREE.DirectionalLight(
    0xffffff,
    3
)

light.position.set(
    -3,
    3,
    5
)

light.castShadow = true

scene.add(light)

// Ambient Light
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.5
)

scene.add(ambientLight)


// ==========================================
// CAMERA POSITION
// ==========================================

camera.position.z = 4


// ==========================================
// ANIMATION
// ==========================================

function animate() {

    requestAnimationFrame(animate)

    object.rotation.x += 0.01
    object.rotation.y += 0.01

    //group.rotation.y += 0.01

    controls.update()

    renderer.render(
        scene,
        camera
    )
}

animate()