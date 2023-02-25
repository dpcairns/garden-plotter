import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'dat.gui';

const plants = [
    ['tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'potato', 'corn', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'potato', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato'],
    ['tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'potato', 'potato'],

];

const veggies = {
    tomato: {
        height: 2.5,
        emoji: '🍅'
    },
    corn: {
        height: 5,
        emoji: '🌽',
    },
    potato: {
        height: 3.5,
        emoji: '🥔'
    },   
};

const tbody = document.querySelector('tbody');

function renderDropdown(plant) {
    const selectEl = document.createElement('select');

    for (let [name, dataPlant] of Object.entries(veggies)) {
        const optionEl = document.createElement('option');
    
        optionEl.textContent = dataPlant.emoji;
        optionEl.value = name;
        
        if (name === plant) {
            optionEl.selected = true;
        }

        selectEl.append(optionEl);
    }

    return selectEl;

}

for (let [i, row] of Object.entries(plants)) {
    const rowEl = document.createElement('tr');
    for (let [k, plant] of Object.entries(row)) {
        const td = document.createElement('td');

        const selectEl = renderDropdown(plant);

        selectEl.addEventListener('change', (e) => {
            plants[i][k] = e.target.value;

            console.log([...plants]);
            displayPlantsThree();
        });

        td.append(selectEl);
        rowEl.append(td);
    }
    tbody.append(rowEl);
}

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

// Materials

const floorMaterial = new THREE.MeshStandardMaterial();
floorMaterial.color = new THREE.Color('#964B00');

const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
scene.add(floorMesh);

let plantGroup = new THREE.Group();
const gutter = 1.5;

function displayPlantsThree() {
    scene.remove(plantGroup);
    plantGroup = new THREE.Group();

    console.table(plants);
    plants.
        forEach((row, i) => {
            [...row].reverse().forEach((plant, k) => {
                const plantHeight = veggies[plant].height;
                const plantGeo = new THREE.BoxGeometry(1, plantHeight, 1);
                const plantMaterial = new THREE.MeshStandardMaterial();
                plantMaterial.color = new THREE.Color('green');
                const plantMesh = new THREE.Mesh(plantGeo, plantMaterial);

            // distance from middle to bottom is half of height
                plantMesh.position.set(i * gutter, plantHeight / 2 + .5, k * gutter);

                plantGroup.add(plantMesh);
            });
        });

// const boundingBox = new THREE.Box3().setFromObject(plantGroup);
// const { x, z } = boundingBox.getSize();
    const offset = floorSizes.width / 2 - gutter;
    plantGroup.position.x = floorMesh.position.x - offset;
    plantGroup.position.z = floorMesh.position.z - offset;

    console.log(plantGroup);
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
const clock = new THREE.Clock();

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
