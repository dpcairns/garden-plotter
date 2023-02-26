import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import * as dat from 'dat.gui';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

// const gui = new dat.GUI();

function tweenTo(mesh, xyz, delay = 1000, fromRight = false, fromBelow = false) {
    mesh.position.set(
        0, fromBelow ? -3 : 20, 
        fromBelow ? 0 : fromRight ? -50 : 50
    );

    new TWEEN.Tween(mesh.position)
        .to(xyz, 500)
        .delay(delay)
        .easing(TWEEN.Easing.Cubic.Out)
        //.onUpdate(() => render())
        .start();
}

const BROWN = '#964B00';

const plants = [
    ['kale', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'tomato', 'kale', 'kale', 'kale', 'kale'],
    ['tomato', 'potato', 'corn', 'kale', 'kale', 'kale', 'kale'],
    ['tomato', 'tomato', 'tomato', 'kale', 'kale', 'kale', 'kale'],
    ['tomato', 'tomato', 'kale', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['corn', 'corn', 'corn', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['corn', 'potato', 'potato', 'potato', 'kale', 'kale', 'kale'],
];


const manager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(manager);

// Scene
const scene = new THREE.Scene();

const canvas = document.querySelector('canvas.webgl');
const grassTexture = textureLoader.load('/textures/grass.jpg');
const grassGeo = new THREE.CylinderGeometry(100, .6, .01, 24);

const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, color: 'green' });
const grassMesh = new THREE.Mesh(grassGeo, grassMaterial);
scene.add(grassMesh);


const garden = new THREE.Group();
// Objects
const soilSizes = {
    width: 12,
    length: 12,
    height: 1,
};


const skyMadcap = textureLoader.load('/textures/sky.png');
const tomatoTexture = textureLoader.load('/textures/tomatoes.png');
const blueSkyTexture = textureLoader.load('/textures/blue-sky-bg.jpg');
const cornTexture = textureLoader.load('/textures/corn.png');
const potatoTexture = textureLoader.load('/textures/potatoes.png');
const kaleTexture = textureLoader.load('/textures/kale.png');
const dirtTexture = textureLoader.load('/textures/dirt.jpg');
const soloDirtTexture = textureLoader.load('/textures/dirt.jpg');
dirtTexture.repeat.set(5, 5);

scene.background = blueSkyTexture;
const soilGeo = new THREE.CylinderGeometry(soilSizes.width, soilSizes.width, .1, 12);
const labelGeo = new THREE.CylinderGeometry(.6, .6, .01, 24);


const soilMaterial = new THREE.MeshStandardMaterial({ map: dirtTexture });
soilMaterial.color = new THREE.Color(BROWN);

const soilMesh = new THREE.Mesh(soilGeo, soilMaterial);
const soilMesh2 = new THREE.Mesh(soilGeo, soilMaterial);

soilMesh2.scale.set(2, 2, 2);
soilMesh2.scale.set(2, 2, 2);

garden.add(soilMesh);
scene.add(soilMesh2);


[dirtTexture, grassTexture].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
});

dirtTexture.repeat.set(5, 5);
grassTexture.repeat.set(15, 15);


let plantGroup = new THREE.Group();
const gutter = 2;

const plantGeo = new THREE.CylinderGeometry(.6, .6, 1, 24);


const veggies = {
    tomato: {
        height: 1.52,
        emoji: '🍅',
        texture: tomatoTexture,
        color: 'darkred'
    },
    corn: {
        height: 2.44,
        emoji: '🌽',
        texture: cornTexture,
        color: 'orange',
    },
    potato: {
        height: .61,
        emoji: '🥔',
        color: '#4E3524',
        texture: potatoTexture
    },  
    kale: {
        height: .61,
        emoji: '🥬',
        color: 'darkgreen',
        texture: kaleTexture,
    },    
    empty: {
        height: 0,
        emoji: '🪱',
        texture: soloDirtTexture,
        color: BROWN
    }
};


const veggieKeys = [...Object.keys(veggies)];



function displayPlantsThree() {
    garden.remove(plantGroup);
    plantGroup = new THREE.Group();

    plants.
        forEach((row, i) => {
            [...row].reverse().forEach((plant, k) => {
                const plantItemGroup = new THREE.Group();
                const { texture, color, height = 0 } = veggies[plant];

                const threeColor = new THREE.Color(color);
                const plantMaterial = new THREE.MeshStandardMaterial({ color: threeColor, map: texture });
                const plantMesh = new THREE.Mesh(plantGeo, plantMaterial);

                const labelMaterial = new THREE.MeshStandardMaterial({ map: texture });

                if (plant === 'empty') labelMaterial.color = threeColor;
                
                const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
            
                plantMesh.scale.y = height;
                labelMesh.rotation.y = Math.PI / 2;


                plantMesh.castShadow = true;

                labelMesh.position.set(i * gutter, height + .5, k * gutter);
                plantMesh.position.set(i * gutter, height / 2 + .5, k * gutter);

                plantItemGroup.add(plantMesh);
                plantItemGroup.add(labelMesh);
                plantGroup.add(plantItemGroup);
            });
        });

    const offset = soilSizes.width / 2;
    plantGroup.position.x = soilMesh.position.x - offset + 2;
    plantGroup.position.z = soilMesh.position.z - offset - 2;

    garden.add(plantGroup);
}

displayPlantsThree();


manager.onLoad = () => {
    scene.add(garden);

    tweenTo(garden, { x: 0, y: 0, z: 0 }, 1500, true, true);
};



let cornModel;

const loader = new GLTFLoader();

loader.load('/models/EarOfCorn.glb', function(gltf) {

    scene.add(gltf.scene);
    const corn = gltf.scene;
    corn.scale.set(3.2, 3.2, 3.2);

    tweenTo(corn, {
        x: -17,
        y: 5,
        z: -12
    }, 50, true);

    cornModel = corn;
}, undefined, function(error) {

    console.error(error);
});


loader.load('/models/Mountains.glb', function(gltf) {

    const children = [...gltf.scene.children];
    for (const child of children) {
        scene.add(child);

        child.scale.set(.4, .4, .7);
        child.rotation.set(0, -48.4, 0);
        child.position.set(-100,
            -11.5,
            47); 
            
    }   

    

    // mountainsModel = mountains;
}, undefined, function(error) {

    console.error(error);
});

let carrotModel;

loader.load('/models/Carrot.glb', function(gltf) {

    scene.add(gltf.scene);
    const carrot = gltf.scene;
    carrot.scale.set(2, 2, 2);
    carrot.rotation.set(-1.5, 0, 0);

    tweenTo(carrot, {
        x: -5,
        y: 7,
        z: 8.5
    }, 400);

    carrotModel = carrot;
}, undefined, function(error) {

    console.error(error);
});

let broccoliModel;

loader.load('/models/Broccoli.glb', function(gltf) {

    scene.add(gltf.scene);
    const broccoli = gltf.scene;
    broccoli.scale.set(30, 30, 30);

    tweenTo(broccoli, {
        x: -12,
        y: 5,
        z: -1
    }, 700, true);

    broccoliModel = broccoli;
}, undefined, function(error) {

    console.error(error);
});

let tomatoModel;

loader.load('/models/Tomato.glb', function(gltf) {

    scene.add(gltf.scene);
    const tomato = gltf.scene;
    tomato.scale.set(.03, .03, .03);
    
    tweenTo(tomato, {
        x: -2,
        y: 4.2,
        z: 19.5
    }, 1000);

    tomatoModel = tomato;
}, undefined, function(error) {

    console.error(error);
});

const fontLoader = new THREE.FontLoader();

fontLoader.load(
    '/fonts/helvetiker_bold.typeface.json',
    (font) =>
    {
        const options = {
            font: font,
            size: 1,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        };

        const textGeometry = new THREE.TextGeometry(
            'Dani Cairns', options);
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: skyMadcap });
        const text = new THREE.Mesh(textGeometry, textMaterial);

        const textGeometry2 = new THREE.TextGeometry(
            'Web Developer',
            options
        );
        const text2 = new THREE.Mesh(textGeometry2, textMaterial);

        const rotations = [0, Math.PI * .7, 0];
        text.position.set(5.8, 4.6, 6.2);
        text2.position.set(4.8, 3.3, 4.1);
        text.rotation.set(...rotations);
        text2.rotation.set(...rotations);
        
        const textGroup = new THREE.Group();
        
        const invisibleBoxGeo = new THREE.BoxGeometry(10, 4, 0);
        const invisibleBoxMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 });

        invisibleBoxMaterial.neverOpaque = true;
        const invisibleMesh = new THREE.Mesh(invisibleBoxGeo, invisibleBoxMaterial);
        
        invisibleMesh.position.set(3.8, 4.6, -0.5);
        invisibleMesh.rotation.set(...rotations);
        textGroup.add(invisibleMesh);
        textGroup.add(text);
        textGroup.add(text2);

        textGroup.children.forEach(child => child.onClick = () => {
            window.open('https://dannycairns.com/DaniCairns--Resume.pdf');
        });

        scene.add(textGroup);
    }
);

// scene.fog = new THREE.Fog('#4E3524', 50, 125);

// Lights
const ambientLight = new THREE.AmbientLight('white', 1);

scene.add(ambientLight);
const pointLight = new THREE.PointLight('white', 1, 18);

pointLight.position.set(4.5, 6, -4);
scene.add(pointLight);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, .01, 1000);
camera.position.set(12.4, 4.1, -5.2);

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * .4; 
controls.minDistance = 2;
controls.maxDistance = 30;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('skyblue');


/**
 * Animate
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersects = [];
let hovered = null;

function measureMouse(e) {
    mouse.set((e.clientX / sizes.width) * 2 - 1, -(e.clientY / sizes.height) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children, true);

}
window.addEventListener('mousemove', (e) => {
    measureMouse(e);
    const object = intersects[0] && intersects[0].object && intersects[0].object;
    
    if (hovered && object !== hovered) {
        hovered.parent.children.forEach((mesh) => {
            if (!mesh.material.neverOpaque) {
                mesh.material.opacity = 1;
                mesh.material.transparent = false;
            }
            hovered = null;
            document.body.style.cursor = 'default';
        });
    }

    if (object && object.onClick) {
        object.parent.children.forEach((mesh) => {
            if (!mesh.material.neverOpaque) {
                mesh.material.transparent = true;
                mesh.material.opacity = .7;    
            }
            document.body.style.cursor = 'pointer';
        });
        hovered = object;
    }
});

window.addEventListener('click', (e) => {
    measureMouse(e);
    const clickedOn = intersects[0];
    if (clickedOn && clickedOn && clickedOn.object && clickedOn.object.onClick) {
        clickedOn.object.onClick(clickedOn);
    }
});

const clock = new THREE.Clock();

const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    if (cornModel) {
        cornModel.rotation.x = -.5 * elapsedTime;
        cornModel.rotation.z = -.5 * elapsedTime;
    }

    if (carrotModel) {
        carrotModel.rotation.y = .8 * elapsedTime;
        carrotModel.rotation.z = .2 * elapsedTime;
    }

    if (broccoliModel) {
        broccoliModel.rotation.x = .3 * elapsedTime;
        broccoliModel.rotation.z = .3 * elapsedTime;
    }

    if (tomatoModel) {
        tomatoModel.rotation.x = -.9 * elapsedTime;
        tomatoModel.rotation.z = -.9 * elapsedTime;
    }
    // Update Orbital Controls

    TWEEN.update();
    controls.update();
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();


// Debug
function doRandomClick() {
    const veggieToChangeCol = Math.floor(Math.random() * 6); // protect viewer from obstruction, no index 7
    const veggieToChangeRow = Math.floor(Math.random() * 7);
    const randomVeggieKey = Math.floor(Math.random() * veggieKeys.length);
    plants[veggieToChangeCol][veggieToChangeRow] = veggieKeys[randomVeggieKey];

    displayPlantsThree();
}

setInterval(doRandomClick, 50);