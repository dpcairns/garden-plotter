import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'dat.gui';
import cornImg from './textures/corn.png';
import potatoesImg from './textures/potatoes.png';
import tomatoesImg from './textures/tomatoes.png';
import kaleImg from './textures/kale.png';
import dirtImg from './textures/dirt.jpg';

const BROWN = '#964B00';

const plants = [
    ['tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'tomato', 'kale', 'kale', 'kale', 'kale'],
    ['tomato', 'potato', 'corn', 'kale', 'kale', 'kale', 'kale'],
    ['tomato', 'tomato', 'tomato', 'kale', 'kale', 'kale', 'kale'],
    ['tomato', 'tomato', 'kale', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['corn', 'corn', 'corn', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'tomato', 'potato', 'potato', 'potato', 'potato'],

];

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const floorSizes = {
    width: 12,
    length: 12,
    height: 1,
};

const floorGeo = new THREE.BoxGeometry(floorSizes.width, floorSizes.height, floorSizes.length);
const labelGeo = new THREE.CylinderGeometry(.6, .6, .01);

const textureLoader = new THREE.TextureLoader();

const tomatoTexture = textureLoader.load(tomatoesImg);
const cornTexture = textureLoader.load(cornImg);
const potatoTexture = textureLoader.load(potatoesImg);
const kaleTexture = textureLoader.load(kaleImg);
const dirtTexture = textureLoader.load(dirtImg);
const soloDirtTexture = textureLoader.load(dirtImg);

dirtTexture.wrapS = THREE.RepeatWrapping;
dirtTexture.wrapT = THREE.RepeatWrapping;
dirtTexture.repeat.set(5, 5);

// Materials

const floorMaterial = new THREE.MeshStandardMaterial({ map: dirtTexture });
floorMaterial.color = new THREE.Color(BROWN);

const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
scene.add(floorMesh);

let plantGroup = new THREE.Group();
const gutter = 1.5;

const plantGeo = new THREE.CylinderGeometry(.6, .6, 1);

const veggies = {
    tomato: {
        height: 2.5,
        emoji: '🍅',
        texture: tomatoTexture,
        color: 'darkred'
    },
    corn: {
        height: 5,
        emoji: '🌽',
        texture: cornTexture,
        color: 'orange',
    },
    potato: {
        height: 3.5,
        emoji: '🥔',
        color: '#4E3524',
        texture: potatoTexture
    },  
    kale: {
        height: 1.5,
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
    scene.remove(plantGroup);
    plantGroup = new THREE.Group();

    plants.
        forEach((row, i) => {
            [...row].reverse().forEach((plant, k) => {
                const plantItemGroup = new THREE.Group();
                const { texture, color, height = 0 } = veggies[plant];
                const threeColor = new THREE.Color(color);
                const plantMaterial = new THREE.MeshStandardMaterial({ color: threeColor });
                const plantMesh = new THREE.Mesh(plantGeo, plantMaterial);

                const labelMaterial = new THREE.MeshStandardMaterial({ map: texture });

                if (plant === 'empty') labelMaterial.color = threeColor;
                
                const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);

                function onClick(clickedVeg) {
                    const [row, col] = clickedVeg.object.rowCol;
                    const veggieKeyIndex = veggieKeys.indexOf(plants[row][col]);
                    const nextPlant = veggieKeys[veggieKeyIndex + 1] || veggieKeys[0];
                    console.log(plants[row][col], 'to', nextPlant);
                    plants[row][col] = nextPlant;
                    displayPlantsThree();
                }
            
                const rowCol = [i, plants.length - 1 - k];

                [labelMesh, plantMesh].forEach((mesh) => {
                    mesh.rowCol = rowCol;
                    mesh.onClick = onClick;
                });

                plantMesh.scale.y = height;
                labelMesh.rotation.y = Math.PI / 2;



                labelMesh.position.set(i * gutter, height + .5, k * gutter);
                plantMesh.position.set(i * gutter, height / 2 + .5, k * gutter);

                plantItemGroup.add(plantMesh);
                plantItemGroup.add(labelMesh);
                plantGroup.add(plantItemGroup);
            });
        });

    const offset = floorSizes.width / 2 - gutter;
    plantGroup.position.x = floorMesh.position.x - offset;
    plantGroup.position.z = floorMesh.position.z - offset;

    scene.add(plantGroup);
}

displayPlantsThree();

// plantGroup.position.z -= z / 2 - gutter;



// Lights
const ambientLight = new THREE.AmbientLight('white', 1);

scene.add(ambientLight);
const pointLight = new THREE.PointLight('white', 3, 15);
pointLight.position.set(4.4, 1, -4);
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .01, 100);
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 2;

camera.position.normalize().multiplyScalar(15);

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));




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
    console.log(hovered);
    measureMouse(e);
    const object = intersects[0] && intersects[0].object && intersects[0].object;
    
    if (hovered && object !== hovered) {
        hovered.parent.children.forEach((mesh) => {
            mesh.material.opacity = 1;
            mesh.material.transparent = false;
            hovered = null;
        });
    }

    if (object && object.onClick) {
        object.parent.children.forEach((mesh) => {
            mesh.material.transparent = true;
            mesh.material.opacity = .7;
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


const tick = () =>
{



    // const elapsedTime = clock.getElapsedTime();

    // Update objects
    // boxMesh.rotation.y = .5 * elapsedTime;

    // Update Orbital Controls
    // controls.update()

    controls.update();
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();



// gui.add(plantGroup.position, 'x', -10, 10, .1);
// gui.add(plantGroup.position, 'y', -10, 10, .1);
// gui.add(plantGroup.position, 'z', -10, 10, .1);
