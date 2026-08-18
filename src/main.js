import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050505)


// ==========================================
// CAMERA
// ==========================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.set(0, 3, 8)


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

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
)

renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)


// ==========================================
// ORBIT CONTROLS
// ==========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
)

controls.enableDamping = true
controls.target.set(0, 2, 0)


// ==========================================
// LIGHT
// ==========================================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
)

scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    3
)

directionalLight.position.set(4, 8, 5)

directionalLight.castShadow = true

scene.add(directionalLight)


// ==========================================
// BOUQUET GROUP
// EVERYTHING GOES INSIDE THIS GROUP
// ==========================================

const bouquet = new THREE.Group()

scene.add(bouquet)


// ==========================================
// CREATE FLOWER FUNCTION
// ==========================================

function createFlower(color = 0xff3366) {

    const flower = new THREE.Group()

    // --------------------------------------
    // Flower center
    // --------------------------------------

    const centerGeometry =
        new THREE.SphereGeometry(0.2, 32, 32)

    const centerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffcc33
        })

    const center =
        new THREE.Mesh(
            centerGeometry,
            centerMaterial
        )

    center.castShadow = true

    flower.add(center)


    // --------------------------------------
    // Petals
    // --------------------------------------

    const petalGeometry =
        new THREE.SphereGeometry(
            0.35,
            32,
            32
        )

    const petalMaterial =
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5
        })


    const petalCount = 10


    for (
        let i = 0;
        i < petalCount;
        i++
    ) {

        const petal =
            new THREE.Mesh(
                petalGeometry,
                petalMaterial
            )


        const angle =
            (i / petalCount)
            * Math.PI
            * 2


        petal.position.x =
            Math.cos(angle) * 0.45

        petal.position.y =
            Math.sin(angle) * 0.45


        petal.scale.set(
            0.65,
            1.2,
            0.35
        )


        petal.rotation.z =
            angle - Math.PI / 2


        petal.castShadow = true


        flower.add(petal)
    }


    // --------------------------------------
    // Second petal layer
    // --------------------------------------

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const petal =
            new THREE.Mesh(
                petalGeometry,
                petalMaterial
            )


        const angle =
            (i / 8)
            * Math.PI
            * 2
            + 0.3


        petal.position.x =
            Math.cos(angle) * 0.3

        petal.position.y =
            Math.sin(angle) * 0.3


        petal.position.z = 0.12


        petal.scale.set(
            0.5,
            0.9,
            0.3
        )


        petal.rotation.z =
            angle - Math.PI / 2


        flower.add(petal)
    }


    return flower
}


// ==========================================
// CREATE MANY FLOWERS
// ==========================================

const flower1 = createFlower(0xff3344)

flower1.position.set(
    0,
    3.5,
    0
)

bouquet.add(flower1)



const flower2 = createFlower(0xff6688)

flower2.position.set(
    -1.1,
    3.1,
    0.2
)

flower2.rotation.y = 0.3

bouquet.add(flower2)



const flower3 = createFlower(0xffaaaa)

flower3.position.set(
    1.1,
    3.1,
    0.1
)

flower3.rotation.y = -0.3

bouquet.add(flower3)



const flower4 = createFlower(0xff2244)

flower4.position.set(
    -0.65,
    4.1,
    -0.3
)

flower4.scale.setScalar(0.9)

bouquet.add(flower4)



const flower5 = createFlower(0xff7799)

flower5.position.set(
    0.7,
    4.2,
    -0.2
)

flower5.scale.setScalar(0.85)

bouquet.add(flower5)



const flower6 = createFlower(0xffdddd)

flower6.position.set(
    0,
    2.8,
    0.5
)

flower6.scale.setScalar(0.8)

bouquet.add(flower6)


// ==========================================
// STEMS
// ==========================================

const stemMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x295b32
    })


function createStem(x, y, z, height) {

    const geometry =
        new THREE.CylinderGeometry(
            0.04,
            0.055,
            height,
            12
        )

    const stem =
        new THREE.Mesh(
            geometry,
            stemMaterial
        )


    stem.position.set(
        x,
        y,
        z
    )


    stem.castShadow = true


    bouquet.add(stem)
}


// several stems

createStem(
    0,
    1.7,
    0,
    3.4
)

createStem(
    -0.5,
    1.6,
    0,
    3
)

createStem(
    0.5,
    1.6,
    0,
    3
)

createStem(
    -0.8,
    1.7,
    -0.2,
    3.2
)

createStem(
    0.8,
    1.7,
    -0.2,
    3.2
)


// ==========================================
// BOUQUET WRAPPER
// ==========================================

const wrapperGeometry =
    new THREE.ConeGeometry(
        1,
        2.2,
        32,
        1,
        true
    )

const wrapperMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x8b1e2d,

        transparent: true,

        opacity: 0.7,

        side: THREE.DoubleSide,

        roughness: 0.6
    })


const wrapper =
    new THREE.Mesh(
        wrapperGeometry,
        wrapperMaterial
    )


wrapper.position.y = 0.7

bouquet.add(wrapper)


// ==========================================
// RIBBON
// ==========================================

const ribbonMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffdddd,
        roughness: 0.4
    })


const ribbonGeometry =
    new THREE.TorusGeometry(
        0.45,
        0.05,
        16,
        60
    )


const ribbon =
    new THREE.Mesh(
        ribbonGeometry,
        ribbonMaterial
    )


ribbon.position.y = 1.25

ribbon.rotation.x =
    Math.PI / 2

bouquet.add(ribbon)


// ==========================================
// FLOOR
// ==========================================

const floorGeometry =
    new THREE.PlaneGeometry(
        30,
        30
    )

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x21130d,
        roughness: 0.7
    })


const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    )


floor.rotation.x =
    -Math.PI / 2

floor.position.y =
    -0.45

floor.receiveShadow = true

scene.add(floor)


// ==========================================
// IMPORTANT
// CENTER OF ROTATION
// ==========================================

// Move bouquet slightly down so rotation
// feels centered around the bouquet

bouquet.position.y = 0


// ==========================================
// CLOCK
// ==========================================

const clock =
    new THREE.Clock()


// ==========================================
// ANIMATION
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    )


    const elapsedTime =
        clock.getElapsedTime()


    // --------------------------------------
    // ROTATE WHOLE BOUQUET
    // --------------------------------------

    bouquet.rotation.y =
        elapsedTime * 0.25


    // very small floating movement

    bouquet.position.y =
        Math.sin(
            elapsedTime * 1.2
        ) * 0.05


    controls.update()


    renderer.render(
        scene,
        camera
    )
}


animate()


// ==========================================
// RESPONSIVE
// ==========================================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight


        camera.updateProjectionMatrix()


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )
    }
)