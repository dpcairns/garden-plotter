import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { loadAssets } from './loadAssets';
import { makeTextGroup } from './makeTextGroup';
import { makeVeggieMap } from './makeVeggieMap';
import { soilSizes, plants as rawPlants, BROWN, MOBILE_WIDTH } from './constants';
import { tweenTo } from './tweens.js';
import { makeCows } from './makeCows';
const plants = [...rawPlants];


// import * as dat from 'dat.gui';
// const gui = new dat.GUI();
        /**
     * Sizes
     */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

let hasClicked = false;
let plantGroup = new THREE.Group();
let intersects = [];
let hovered = null;
const clock = new THREE.Clock();
const randoms = Array(4).fill(null).map(() => Math.random() * -.6);

async function makeScene() {
    const [
        broccoliModel,
        carrotModel,
        cornModel,
        farmModel,
        firstCow,
        mountainModel,
        tomatoModel,
        grassTexture,
        skyMadcap,
        tomatoTexture,
        blueSkyTexture,
        cornTexture,
        potatoTexture, 
        kaleTexture,
        dirtTexture,
        soloDirtTexture,
        font,
    ] = await loadAssets();

    function isMobile() {
        return sizes.width < MOBILE_WIDTH;
    }    

    const veggies = makeVeggieMap({
        tomatoTexture, 
        cornTexture, 
        potatoTexture, 
        kaleTexture,
        soloDirtTexture 
    });
    
    
    const veggieKeys = [...Object.keys(veggies)];
    
    const modelPositions = {
        tomato: {
            x: -17,
            y: 6.3,
            z: -13
        },
        carrot: {
            x: -12,
            y: 10,
            z: -1
        },
        corn: {
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
    
 
    
    // Scene
    const scene = new THREE.Scene();
    
    const canvas = document.querySelector('canvas.webgl');

    // Geometries
    const plantGeo = new THREE.CylinderGeometry(.6, .6, 1, 24);
    const grassGeo = new THREE.CylinderGeometry(120, .6, .01, 24);
    const soilGeo = new THREE.CylinderGeometry(soilSizes.width, soilSizes.width, .1, 12);
    const labelGeo = new THREE.CylinderGeometry(.6, .6, .01, 24);

    const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, color: '#4CBB17' });
    const soilMaterial = new THREE.MeshStandardMaterial({ map: dirtTexture });

    const grassMesh = new THREE.Mesh(grassGeo, grassMaterial);
    const soilMesh = new THREE.Mesh(soilGeo, soilMaterial);
    const soilMesh2 = new THREE.Mesh(soilGeo, soilMaterial);

    const garden = new THREE.Group();

    dirtTexture.repeat.set(5, 5);
    scene.background = blueSkyTexture;
    soilMaterial.color = new THREE.Color(BROWN);
    soilMesh2.scale.set(2, 2, 2);
    soilMesh2.scale.set(2, 2, 2);
    [dirtTexture, grassTexture].forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    });
    dirtTexture.repeat.set(5, 5);
    grassTexture.repeat.set(20, 20);
      
    const emptyColor = new THREE.Color({ color: BROWN });

    const gutter = 2;

    // 
    function displayPlantCylinders() {
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

    displayPlantCylinders();

    const textGroup = makeTextGroup({ 
        font, 
        skyMadcap, 
        isMobile: isMobile(), 
        sizes,
    });
    
    // Lights
    const ambientLight = new THREE.AmbientLight('white', .9);
    const pointLight = new THREE.PointLight('white', 1.2, 18);
    pointLight.position.set(4.5, 6, -4); 
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, .01, 1000);
    
    if (isMobile())camera.position.set(22, 2.8, -6.5);
    else camera.position.set(13, 2, -4.8);
    
    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * .455; 
    controls.minDistance = 14.5;
    controls.maxDistance = 30;
    
     // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas });
    
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor('skyblue');   



    carrotModel.scale.set(2, 2, 2);
    carrotModel.rotation.set(-1.5, 0, 0);
    broccoliModel.scale.set(30, 30, 30);
    cornModel.scale.set(3.2, 3.2, 3.2);
    farmModel.scale.set(.2, .2, .2);
    farmModel.position.set(75, 0, 17);
    farmModel.rotation.set(0, 1, 0);
    tomatoModel.scale.set(.03, .03, .03);

    
    [
        soilMesh,
        soilMesh2,
        grassMesh,
        garden,
        cornModel,
        tomatoModel,
        broccoliModel,
        carrotModel,
        ambientLight,
        pointLight,
        camera,
        farmModel,
        textGroup
    ].forEach((it) => scene.add(it));

    makeCows(scene, firstCow);
    
    
    for (const child of [...mountainModel.children]) {
        child.scale.set(.4, .4, .7);
        child.rotation.set(0, -48.4, 0);
        child.position.set(-100, -11.5, 47); 
        scene.add(child);  
    }   
    
    tweenTo(garden, { x: 0, y: 0, z: 0 }, 1500, true, true);
    tweenTo(cornModel, modelPositions.corn, 800, true);
    tweenTo(carrotModel, modelPositions.carrot, 400);
    tweenTo(broccoliModel, modelPositions.broccoli, 700, true);
    tweenTo(tomatoModel, modelPositions.tomato, 1000);
    tweenTo(textGroup, { x: 0, y: 0, z: 0 }, 1000);
    
    
    const tick = () => {
        const models = [cornModel, carrotModel, broccoliModel, tomatoModel];
    
        const elapsedTime = clock.getElapsedTime();
    
    
        if (models.every(model => !!model)) {
            models.forEach((model, i) => {
                const factor = Math.abs(randoms[i]) < .25 ? .25 : randoms[i];
                model.rotation.x = factor * elapsedTime;
                model.rotation.z = factor * elapsedTime;
            });
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
   
    document.querySelector('.loading').classList.add('hide');

    tick();
    
    function shuffleCylinders() {
        const veggieToChangeCol = Math.floor(Math.random() * 7);
        const veggieToChangeRow = Math.floor(Math.random() * 7);
        const randomVeggieKey = Math.floor(Math.random() * veggieKeys.length);
        plants[veggieToChangeCol][veggieToChangeRow] = veggieKeys[randomVeggieKey];
    
        displayPlantCylinders();
    }
    
    setInterval(shuffleCylinders, 50);
    
    // event listeners
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function measureMouse(e) {
        mouse.set((e.clientX / sizes.width) * 2 - 1, -(e.clientY / sizes.height) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(scene.children, true);
    }


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
    
    window.addEventListener('click', () => {
        if (!hasClicked) {
            new TWEEN.Tween(camera.position)
                // .to({ x: 22, y: 2.8, z: -6.5 }, 500)
                .to({ x: 8.7, y: 6.8, z: -14 }, 500)
    
                .easing(TWEEN.Easing.Cubic.Out)
        //.onUpdate(() => render())
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

}



makeScene();
