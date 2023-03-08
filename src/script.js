import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import spinner from './spinner.gif';

const loadingImgEl = document.querySelector('.loading img');
loadingImgEl.src = spinner;
// import * as dat from 'dat.gui';

// const gui = new dat.GUI();


const MOBILE_WIDTH = 600;

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


function isMobile() {
    return sizes.width < MOBILE_WIDTH;
}

const modelPositions = {
    corn: {
        x: -17,
        y: 6.3,
        z: -13
    },
    tomato: {
        x: -12,
        y: 10,
        z: -1
    },
    carrot: {
        x: -2,
        y: 6.2,
        z: 19.5
    },
    broccoli: {
        x: -5,
        y: 7,
        z: isMobile() ? 5.5 : 8.5
    }
};

function tweenTo(mesh, xyz, delay = 1000, fromRight = false, fromBelow = false, isLittleWords = false) {
    mesh.position.set(
        0, fromBelow 
            ? -3
            : 20, 
        fromBelow 
            ? isLittleWords ? -10 : 0 
            : fromRight 
                ? -50 
                : 50
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
    ['tomato', 'potato', 'kale', 'kale', 'kale', 'kale', 'kale'],
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
const grassGeo = new THREE.CylinderGeometry(120, .6, .01, 24);

const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, color: '#4CBB17' });
const grassMesh = new THREE.Mesh(grassGeo, grassMaterial);

const garden = new THREE.Group();
// Objects
const soilSizes = {
    width: 12,
    length: 12,
    height: 1,
};


const skyMadcap = textureLoader.load('/textures/reflect2.png');
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



[dirtTexture, grassTexture].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
});

dirtTexture.repeat.set(5, 5);
grassTexture.repeat.set(20, 20);


let plantGroup = new THREE.Group();
const gutter = 2;

const plantGeo = new THREE.CylinderGeometry(.6, .6, 1, 24);


const veggies = {
    tomato: {
        height: 1.52,
        emoji: '🍅',
        material: new THREE.MeshStandardMaterial({ map: tomatoTexture, color: 'darkred' }),
        color: 'darkred'
    },
    corn: {
        height: 2.44,
        emoji: '🌽',
        texture: cornTexture,
        color: 'orange',
        material: new THREE.MeshStandardMaterial({ map: cornTexture, color: 'orange' }),
    },
    potato: {
        height: .61,
        emoji: '🥔',
        color: '#988558',
        material:  new THREE.MeshStandardMaterial({ map: potatoTexture, color: '#988558' }),
    },  
    kale: {
        height: .61,
        emoji: '🥬',
        color: 'darkgreen',
        material: new THREE.MeshStandardMaterial({ map: kaleTexture, color: 'darkgreen' }),
    },    
    empty: {
        height: 0,
        emoji: '🪱',
        material: new THREE.MeshStandardMaterial({ map: soloDirtTexture, color: BROWN }),
        color: BROWN
    }
};


const veggieKeys = [...Object.keys(veggies)];


const emptyColor = new THREE.Color({ color: BROWN });
function displayPlantsThree() {
    garden.remove(plantGroup);
    plantGroup = new THREE.Group();

    plants.
        forEach((row, i) => {
            [...row].reverse().forEach((plant, k) => {
                const plantItemGroup = new THREE.Group();
                const { material, height = 0 } = veggies[plant];

                const plantMesh = new THREE.Mesh(plantGeo, material);
                const labelMesh = new THREE.Mesh(labelGeo, material);
            
                if (plants === 'empty') labelMesh.color = emptyColor;
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

let cornModel;

const loader = new GLTFLoader(manager);

loader.load('/models/Corn2.glb', function(gltf) {
    const corn = gltf.scene;
    corn.scale.set(20, 20, 20);
    corn.position.set(-14, 5.1, -13);
    corn.rotation.set(-10, 10, 0);
    
    cornModel = corn;
}, undefined, function(error) {

    console.error(error);
});


let farmModel;
loader.load('/models/Farm.glb', function(gltf) {
    const farm = gltf.scene;
    farm.scale.set(.2, .2, .2);
    farm.position.set(75, 0, 17);
    farm.rotation.set(0, 1, 0);

    farmModel = farm;


}, undefined, function(error) {
    
    console.error(error);
});

let firstCow;

loader.load('/models/Cow.glb', function(gltf) {
    firstCow = gltf.scene;

}, undefined, function(error) {

    console.error(error);
});


let mountainModel;

loader.load('/models/Mountains.glb', function(gltf) {
    mountainModel = [...gltf.scene.children];

}, undefined, function(error) {

    console.error(error);
});

let carrotModel;

loader.load('/models/Carrot.glb', function(gltf) {
    const carrot = gltf.scene;
    carrot.scale.set(2, 2, 2);
    carrot.rotation.set(-1.5, 0, 0);

    carrotModel = carrot;
}, undefined, function(error) {

    console.error(error);
});

let broccoliModel;
loader.load('/models/Broccoli.glb', function(gltf) {

 
    const broccoli = gltf.scene;
    broccoli.scale.set(30, 30, 30);

    


    broccoliModel = broccoli;
}, undefined, function(error) {

    console.error(error);
});

let tomatoModel;

loader.load('/models/Tomato.glb', function(gltf) {

 
    const tomato = gltf.scene;
    tomato.scale.set(.03, .03, .03);
    
    


    tomatoModel = tomato;
}, undefined, function(error) {

    console.error(error);
});

const fontLoader = new THREE.FontLoader();

let textGroup;
let textGroup2;
let musicianText;
let writerText;
let boardGameText;
fontLoader.load(
    '/fonts/optimer_regular.typeface.json',
    (font) =>
    {
        const options = {
            font: font,
            size: isMobile() ? .4 : .5,
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
        const textGeometry2 = new THREE.TextGeometry(
            'Web Developer', options);
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: skyMadcap });
        const nameText = new THREE.Mesh(textGeometry, textMaterial);
        const webDeveloperText = new THREE.Mesh(textGeometry2, textMaterial);

        const rotations = [0, Math.PI / 2, 0];

        nameText.rotation.set(...rotations);
        webDeveloperText.rotation.set(...rotations);
        
        nameText.geometry.center();
        webDeveloperText.geometry.center();

        textGroup = new THREE.Group();
        
        const backgroundBoxGeo = new THREE.BoxGeometry(sizes.width < 600 ? 4 : 5.8, 1.8, .5);
        const backgroundBoxMaterial = new THREE.MeshStandardMaterial({ color: 'black', transparent: true, opacity: .75 });

        backgroundBoxMaterial.neverOpaque = true;
        const backgroundMesh = new THREE.Mesh(backgroundBoxGeo, backgroundBoxMaterial);
        
        backgroundMesh.rotation.set(...rotations);

        const textGeometry3 = new THREE.TextGeometry(
            'musician', options);
        const textGeometry4 = new THREE.TextGeometry(
            'writer', options);
        const textGeometry5 = new THREE.TextGeometry(
            'board game liker', options);

        musicianText = new THREE.Mesh(textGeometry3, textMaterial);
        writerText = new THREE.Mesh(textGeometry4, textMaterial);
        boardGameText = new THREE.Mesh(textGeometry5, textMaterial);

        musicianText.geometry.center();
        writerText.geometry.center();
        boardGameText.geometry.center();
        textGroup2 = new THREE.Group();

        if (isMobile()){
            nameText.position.set(12, 1.5, -4);
            webDeveloperText.position.set(12, .8, -4.4); 
            backgroundMesh.position.set(11.5, 1.1, -4.3); 
            textGroup2.position.set(15, .2, -2);
            textGroup2.rotation.set(0, Math.PI / 2 + .3, 0);
            
            textGroup2.add(musicianText);
            textGroup2.add(writerText);
            textGroup2.add(boardGameText);
            boardGameText.position.x = 2.3;
            musicianText.position.x = 2.8;
            musicianText.position.y = -1.5;
            writerText.position.x = 1.8;
            writerText.position.y = -2.8;
  
        } else {
            nameText.position.set(9, 2.4 + .25, -3.8);
            webDeveloperText.position.set(9, 1.6 + .25, -4); 
            backgroundMesh.position.set(8.5, 2. + .25, -3.8);
            textGroup2.position.set(11, .2, -2);
            textGroup2.rotation.set(0, Math.PI / 2 + .3, 0);
            textGroup2.add(musicianText);
            textGroup2.add(writerText);
            textGroup2.add(boardGameText);
            musicianText.position.x = .4;
            musicianText.position.y = -.1;
            writerText.position.y = .5;
            writerText.position.x = 3.8;
            boardGameText.position.y = 1.5;
        
        }
        const TILT = .5;
        musicianText.rotateX(TILT);
        writerText.rotateX(TILT);
        boardGameText.rotateX(TILT);
        textGroup2.rotateX(-Math.PI / 2);


        textGroup.add(backgroundMesh);
        textGroup.add(nameText);
        textGroup.add(webDeveloperText);
    }
);


// Lights
const ambientLight = new THREE.AmbientLight('white', .9);


const directionalLight = new THREE.DirectionalLight('white', 1, 18);


directionalLight.position.set(4.5, 6, -4);

let hasClicked = false;
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, .01, 1000);

if (isMobile())camera.position.set(22, 2.8, -6.5);
else camera.position.set(13, 2, -4.8);



// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * .455; 
controls.minDistance = 14.5;
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




manager.onLoad = () => {

    window.addEventListener('click', () => {
        if (!hasClicked) {
            new TWEEN.Tween(camera.position)
                .to({ x: 8.7, y: 6.8, z: -14 }, 500)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }

        hasClicked = true;
    });

    window.addEventListener('touchend', () => {
        if (!hasClicked) {
            new TWEEN.Tween(camera.position)
                .to({ x: 10, y: 5, z: -10 }, 500)
                .easing(TWEEN.Easing.Cubic.Out)
    //.onUpdate(() => render())
                .start();
        }

        hasClicked = true;
    });

    document.body.style.cursor = 'grab';
    window.addEventListener('pointerdown', () => {
        document.body.style.cursor = 'grabbing';
    });
    
    window.addEventListener('pointerup', () => {
        document.body.style.cursor = 'grab';
    });
    document.querySelector('.loading').classList.add('hide');
    scene.add(soilMesh);
    scene.add(soilMesh2);
    scene.add(grassMesh);
    scene.add(garden);
    scene.add(cornModel);
    scene.add(tomatoModel);
    scene.add(broccoliModel);
    scene.add(carrotModel);
    scene.add(ambientLight);
    scene.add(directionalLight);

    scene.add(camera);
    scene.add(farmModel);
    scene.add(textGroup);
    scene.add(textGroup2);
    for (let i = 0; i < 70; i++) {
        const cow = firstCow.clone();
        cow.scale.set(.3, .3, .3);
        
        const xFactor = 60; // forward back spread
        const xOffset = 15;
        const zFactor = 100; // left right spread
        const zOffset = 0;
        const maxCowClosesness = isMobile() ? 25 : 16;
        const randomCowX = Math.random() > .5 // close or far
        ? Math.random() * xFactor + xOffset
        : Math.random() * -xFactor - xOffset;

        const cowX = randomCowX > 0 ? Math.max(randomCowX, maxCowClosesness) : randomCowX;
        cow.position.set(
            cowX
            ,
            0,
            Math.random() > .5 // left or right
                ? Math.random() * zFactor + zOffset 
                : Math.random() * -zFactor - zOffset);


        cow.rotation.set(0, Math.random() * 10, 0);    
        scene.add(cow);
    }


    for (const child of mountainModel) {
        child.scale.set(.4, .4, .7);
        child.rotation.set(0, -48.4, 0);
        child.position.set(-100,
            -11.5,
            47); 
        scene.add(child);  
    }   

    tweenTo(garden, { x: 0, y: 0, z: 0 }, 1500, true, true);
    tweenTo(musicianText, { ...musicianText.position }, 2000, true, true, true);
    tweenTo(boardGameText, { ...boardGameText.position }, 2500, true, true, true);
    tweenTo(writerText, {...writerText.position }, 3000, true, true, true);


    tweenTo(cornModel, modelPositions.corn, 800, true);
    tweenTo(carrotModel, modelPositions.carrot, 400);
    tweenTo(broccoliModel, modelPositions.broccoli, 700, true);
    tweenTo(tomatoModel, modelPositions.tomato, 1000);
    tweenTo(textGroup, { x: 0, y: 0, z: 0 }, 1000);
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

const clock = new THREE.Clock();

const randoms = Array(4).fill(null).map(() => Math.random() * -.6);

const tick = () => {
    const models = [carrotModel, broccoliModel, tomatoModel];

    const elapsedTime = clock.getElapsedTime();


    if (models.every(model => !!model)) {
        models.forEach((model, i) => {
            const factor = Math.abs(randoms[i]) < .25 ? .25 : randoms[i];
            model.rotation.x = factor * elapsedTime;
            model.rotation.z = factor * elapsedTime;
        });

        cornModel.rotation.x = .2 * elapsedTime;
        cornModel.rotation.z = .2 * elapsedTime;
        tomatoModel.rotation.x = .4 * elapsedTime;
        tomatoModel.rotation.z = -.4 * elapsedTime;

    }
    // Update objects

    
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
    const veggieToChangeCol = Math.floor(Math.random() * 7); // protect viewer from obstruction, no index 7
    const veggieToChangeRow = Math.floor(Math.random() * 7);
    const randomVeggieKey = Math.floor(Math.random() * veggieKeys.length);
    plants[veggieToChangeCol][veggieToChangeRow] = veggieKeys[randomVeggieKey];

    displayPlantsThree();

}

setInterval(doRandomClick, 50);

