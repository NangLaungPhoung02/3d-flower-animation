import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene()

const flower = new THREE.Group()
scene.add(flower)


// ==========================================
// CAMERA
// ==========================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.z = 4


// ==========================================
// RENDERER
// ==========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(
    window.innerWidth,
    window.innerHeight
)

renderer.shadowMap.enabled = true

document.body.appendChild(
    renderer.domElement
)


// ==========================================
// ORBIT CONTROLS
// ==========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
)

controls.enableDamping = true
controls.minDistance = 2
controls.maxDistance = 10
controls.target.set(0, 0, 0)


// ==========================================
// TEXTURE
// ==========================================

const textureLoader = new THREE.TextureLoader()

const floorTexture = textureLoader.load(
    '/textures/wood.avif'
)

floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.wrapT = THREE.RepeatWrapping

floorTexture.repeat.set(4, 4)


// ==========================================
// FLOWER CENTER
// ==========================================

const centerGeometry = new THREE.SphereGeometry(
    0.4,
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

flowerCenter.position.z = 0.15

flowerCenter.castShadow = true

flower.add(flowerCenter)


// ==========================================
// PETALS
// ==========================================

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

    petal.position.x =
        Math.cos(angle) * 0.75

    petal.position.y =
        Math.sin(angle) * 0.75

    petal.position.z = -0.05

    petal.rotation.z =
        angle - Math.PI / 2

    petal.rotation.x = 0.15

    petal.scale.set(
        0.65,
        1.4,
        0.22
    )

    petal.castShadow = true

    flower.add(petal)
}


// ==========================================
// STEM
// ==========================================

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

stem.castShadow = true

flower.add(stem)


// ==========================================
// LEAF 1
// ==========================================

const leafGeometry = new THREE.SphereGeometry(
    0.3,
    24,
    24
)

const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e8b57,
    roughness: 0.8
})

const leaf = new THREE.Mesh(
    leafGeometry,
    leafMaterial
)

leaf.scale.set(
    0.5,
    1.3,
    0.15
)

leaf.position.set(
    0.35,
    -1.2,
    0
)

leaf.rotation.z = -0.8

leaf.castShadow = true

flower.add(leaf)


// ==========================================
// LEAF 2
// ==========================================

const leaf2 = leaf.clone()

leaf2.position.set(
    -0.35,
    -1.7,
    0
)

leaf2.rotation.z = 0.8

leaf2.castShadow = true

flower.add(leaf2)


// ==========================================
// MOVE WHOLE FLOWER
// ==========================================

flower.position.set(
    0,
    0.3,
    0
)


// ==========================================
// FLOOR
// ==========================================

const floorGeometry = new THREE.PlaneGeometry(
    10,
    10
)

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
floor.position.y = -2.5

floor.receiveShadow = true

scene.add(floor)


// ==========================================
// LIGHTS
// ==========================================

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

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.5
)

scene.add(ambientLight)


// ==========================================
// ANIMATION
// ==========================================

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(
        scene,
        camera
    )
}

animate()