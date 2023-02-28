import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const modelLoader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
const fontLoader = new THREE.FontLoader(manager);

export async function loadAssets() {
    return await Promise.all(
        [
            ...[
                'Broccoli',
                'Carrot',
                'EarOfCorn',
                'Farm',
                'Cow',
                'Mountains',
                'Tomato',
            ].map(name => modelLoader.loadAsync(`/models/${name}.glb`).then(({ scene }) => scene)),
            ...['grass.jpg',
                'reflect2.png',
                'tomatoes.png',
                'blue-sky-bg.jpg',
                'corn.png',
                'potatoes.png',
                'kale.png',
                'dirt.jpg',
                'dirt.jpg'
            ].map(name => textureLoader.loadAsync(`/textures/${name}`)),
            fontLoader.loadAsync('/fonts/optimer_regular.typeface.json')
        ]);
}