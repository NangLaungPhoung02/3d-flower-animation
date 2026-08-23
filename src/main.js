import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene()

scene.background =
    new THREE.Color(0x030303)


// =====================================================
// CAMERA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

camera.position.set(
    0,
    3.3,
    8
)


// =====================================================
// RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    })

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

renderer.shadowMap.enabled = true

document.body.appendChild(
    renderer.domElement
)


// =====================================================
// CONTROLS
// =====================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    )

controls.enableDamping = true

controls.target.set(
    0,
    2.3,
    0
)


// =====================================================
// LIGHT
// =====================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1
    )

scene.add(ambientLight)


const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    )

directionalLight.position.set(
    4,
    8,
    5
)

directionalLight.castShadow = true

scene.add(directionalLight)


// =====================================================
// BOUQUET
// =====================================================

const bouquet =
    new THREE.Group()

scene.add(bouquet)


// =====================================================
// SOFT PARTICLE TEXTURE
// =====================================================

function createParticleTexture() {

    const canvas =
        document.createElement('canvas')

    canvas.width = 64
    canvas.height = 64

    const context =
        canvas.getContext('2d')


    const gradient =
        context.createRadialGradient(
            32,
            32,
            0,
            32,
            32,
            32
        )


    gradient.addColorStop(
        0,
        'rgba(255,255,255,1)'
    )

    gradient.addColorStop(
        0.25,
        'rgba(255,255,255,0.9)'
    )

    gradient.addColorStop(
        0.6,
        'rgba(255,255,255,0.35)'
    )

    gradient.addColorStop(
        1,
        'rgba(255,255,255,0)'
    )


    context.fillStyle = gradient

    context.fillRect(
        0,
        0,
        64,
        64
    )


    return new THREE.CanvasTexture(
        canvas
    )
}


const particleTexture =
    createParticleTexture()


// =====================================================
// CREATE ONE PARTICLE PETAL
// =====================================================

function createParticlePetal(
    color,
    width,
    height,
    curve,
    particleCount = 350
) {

    const positions = []


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        // height of point on petal
        const v = Math.random()


        // width position
        const u =
            Math.random() * 2 - 1


        // petal becomes narrow
        // at top and bottom
        const widthFactor =
            Math.sin(
                v * Math.PI
            )


        const x =
            u *
            width *
            widthFactor


        const y =
            (v - 0.2) *
            height


        // curve petal forward
        const z =
            curve *
            (1 - u * u) *
            Math.sin(
                v * Math.PI
            )


        // little randomness
        const jitter = 0.015


        positions.push(

            x +
            THREE.MathUtils.randFloatSpread(
                jitter
            ),

            y +
            THREE.MathUtils.randFloatSpread(
                jitter
            ),

            z +
            THREE.MathUtils.randFloatSpread(
                jitter
            )
        )
    }


    const geometry =
        new THREE.BufferGeometry()


    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    )


    // -----------------------------------------
    // Main particles
    // -----------------------------------------

    const material =
        new THREE.PointsMaterial({

            color: color,

            size: 0.035,

            map: particleTexture,

            transparent: true,

            opacity: 0.8,

            alphaTest: 0.02,

            depthWrite: false,

            blending:
                THREE.NormalBlending
        })


    const petal =
        new THREE.Points(
            geometry,
            material
        )


    // -----------------------------------------
    // Soft glow
    // -----------------------------------------

    const glowMaterial =
        new THREE.PointsMaterial({

            color: color,

            size: 0.055,

            map: particleTexture,

            transparent: true,

            opacity: 0.07,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        })


    const glow =
        new THREE.Points(
            geometry,
            glowMaterial
        )


    const petalGroup =
        new THREE.Group()


    petalGroup.add(glow)

    petalGroup.add(petal)


    return petalGroup
}


// =====================================================
// CREATE PARTICLE ROSE
// =====================================================

function createRose(
    color = 0xff315c
) {

    const rose =
        new THREE.Group()


    // =================================================
    // OUTER PETALS
    // =================================================

    const outerCount = 9


    for (
        let i = 0;
        i < outerCount;
        i++
    ) {

        const angle =
            (i / outerCount) *
            Math.PI *
            2


        const petal =
            createParticlePetal(
                color,
                0.42,
                0.65,
                0.18,
                420
            )


        petal.position.set(

            Math.cos(angle) * 0.28,

            Math.sin(angle) * 0.28,

            -0.05
        )


        petal.rotation.z =
            angle -
            Math.PI / 2


        petal.rotation.x =
            -0.20


        rose.add(petal)
    }


    // =================================================
    // MIDDLE PETALS
    // =================================================

    const middleCount = 7


    for (
        let i = 0;
        i < middleCount;
        i++
    ) {

        const angle =
            (i / middleCount) *
            Math.PI *
            2 +
            0.3


        const petal =
            createParticlePetal(
                color,
                0.32,
                0.52,
                0.22,
                380
            )


        petal.position.set(

            Math.cos(angle) * 0.17,

            Math.sin(angle) * 0.17,

            0.10
        )


        petal.rotation.z =
            angle -
            Math.PI / 2


        petal.rotation.x =
            -0.35


        rose.add(petal)
    }


    // =================================================
    // INNER PETALS
    // =================================================

    const innerCount = 5


    for (
        let i = 0;
        i < innerCount;
        i++
    ) {

        const angle =
            (i / innerCount) *
            Math.PI *
            2 +
            0.6


        const petal =
            createParticlePetal(
                color,
                0.22,
                0.38,
                0.25,
                350
            )


        petal.position.set(

            Math.cos(angle) * 0.08,

            Math.sin(angle) * 0.08,

            0.22
        )


        petal.rotation.z =
            angle -
            Math.PI / 2


        petal.rotation.x =
            -0.5


        rose.add(petal)
    }


    // =================================================
    // TINY CENTER
    // =================================================

    const centerGeometry =
        new THREE.SphereGeometry(
            0.12,
            20,
            20
        )


    const centerMaterial =
        new THREE.PointsMaterial({

            color:
                new THREE.Color(color)
                    .multiplyScalar(0.75),

            size: 0.025,

            map: particleTexture,

            transparent: true,

            opacity: 0.9,

            depthWrite: false
        })


    const center =
        new THREE.Points(
            centerGeometry,
            centerMaterial
        )


    center.position.z = 0.3


    rose.add(center)


    return rose
}


// =====================================================
// CREATE ROSES
// =====================================================

// center red rose
const rose1 =
    createRose(0xff264f)

rose1.position.set(
    0,
    3.8,
    0.5
)

rose1.scale.setScalar(1.05)

bouquet.add(rose1)


// left pink
const rose2 =
    createRose(0xff668f)

rose2.position.set(
    -1.0,
    3.5,
    0.15
)

rose2.rotation.z = 0.15

rose2.rotation.y = 0.25

rose2.scale.setScalar(0.95)

bouquet.add(rose2)


// right red
const rose3 =
    createRose(0xff1744)

rose3.position.set(
    1.0,
    3.5,
    0.1
)

rose3.rotation.z = -0.15

rose3.rotation.y = -0.25

bouquet.add(rose3)


// upper left
const rose4 =
    createRose(0xff416c)

rose4.position.set(
    -0.65,
    4.4,
    -0.25
)

rose4.scale.setScalar(0.9)

rose4.rotation.z = 0.2

bouquet.add(rose4)


// upper right
const rose5 =
    createRose(0xff819c)

rose5.position.set(
    0.65,
    4.35,
    -0.3
)

rose5.scale.setScalar(0.88)

rose5.rotation.z = -0.2

bouquet.add(rose5)


// bottom center
const rose6 =
    createRose(0xff365e)

rose6.position.set(
    0,
    3.05,
    0.75
)

rose6.scale.setScalar(0.82)

bouquet.add(rose6)


// extra left
const rose7 =
    createRose(0xff8faa)

rose7.position.set(
    -1.45,
    3.9,
    -0.35
)

rose7.scale.setScalar(0.75)

rose7.rotation.z = 0.3

bouquet.add(rose7)


// extra right
const rose8 =
    createRose(0xff486b)

rose8.position.set(
    1.4,
    3.9,
    -0.3
)

rose8.scale.setScalar(0.78)

rose8.rotation.z = -0.3

bouquet.add(rose8)


// =====================================================
// STEMS
// =====================================================

const stemMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x183c24,
        roughness: 0.8
    })


function createStem(
    x,
    y,
    z,
    height,
    angleZ = 0
) {

    const geometry =
        new THREE.CylinderGeometry(
            0.035,
            0.045,
            height,
            10
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


    stem.rotation.z =
        angleZ


    bouquet.add(stem)
}


createStem(
    0,
    1.8,
    0,
    3.6
)

createStem(
    -0.4,
    1.8,
    0,
    3.4,
    0.08
)

createStem(
    0.4,
    1.8,
    0,
    3.4,
    -0.08
)

createStem(
    -0.75,
    1.9,
    -0.1,
    3.3,
    0.15
)

createStem(
    0.75,
    1.9,
    -0.1,
    3.3,
    -0.15
)


// =====================================================
// FLOATING PARTICLES AROUND FLOWERS
// =====================================================

const sparklePositions = []

const sparkleCount = 1800


for (
    let i = 0;
    i < sparkleCount;
    i++
) {

    const radius =
        Math.random() * 2.2


    const angle =
        Math.random() *
        Math.PI *
        2


    const x =
        Math.cos(angle) *
        radius


    const z =
        Math.sin(angle) *
        radius *
        0.55


    const y =
        2.7 +
        Math.random() *
        2.4


    sparklePositions.push(
        x,
        y,
        z
    )
}


const sparkleGeometry =
    new THREE.BufferGeometry()


sparkleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        sparklePositions,
        3
    )
)


const sparkleMaterial =
    new THREE.PointsMaterial({

        color: 0xffb6c8,

        size: 0.025,

        map: particleTexture,

        transparent: true,

        opacity: 0.35,

        depthWrite: false,

        blending:
            THREE.AdditiveBlending
    })


const sparkles =
    new THREE.Points(
        sparkleGeometry,
        sparkleMaterial
    )


bouquet.add(sparkles)


// =====================================================
// WRAPPER
// =====================================================

const wrapperGeometry =
    new THREE.ConeGeometry(
        0.95,
        2.1,
        32,
        1,
        true
    )


const wrapperMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x741829,

        transparent: true,

        opacity: 0.6,

        side: THREE.DoubleSide,

        roughness: 0.5
    })


const wrapper =
    new THREE.Mesh(
        wrapperGeometry,
        wrapperMaterial
    )


wrapper.position.y = 0.65

bouquet.add(wrapper)


// =====================================================
// RIBBON
// =====================================================

const ribbonGeometry =
    new THREE.TorusGeometry(
        0.43,
        0.045,
        16,
        60
    )


const ribbonMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffd9df,
        roughness: 0.3
    })


const ribbon =
    new THREE.Mesh(
        ribbonGeometry,
        ribbonMaterial
    )


ribbon.position.y = 1.2

ribbon.rotation.x =
    Math.PI / 2


bouquet.add(ribbon)


// =====================================================
// FLOOR
// =====================================================

const floorGeometry =
    new THREE.PlaneGeometry(
        30,
        30
    )


const floorMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x150d0b,

        roughness: 0.75
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


// =====================================================
// ANIMATION
// =====================================================

const clock =
    new THREE.Clock()


function animate() {

    requestAnimationFrame(
        animate
    )


    const elapsedTime =
        clock.getElapsedTime()


    // 🌹 rotate WHOLE bouquet
    bouquet.rotation.y =
        elapsedTime * 0.18


    // tiny floating movement
    bouquet.position.y =
        Math.sin(
            elapsedTime * 1.1
        ) * 0.035


    // ✨ sparkle movement
    sparkles.rotation.y =
        -elapsedTime * 0.06


    sparkles.rotation.z =
        Math.sin(
            elapsedTime * 0.3
        ) * 0.03


    controls.update()


    renderer.render(
        scene,
        camera
    )
}


animate()


// =====================================================
// RESPONSIVE
// =====================================================

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