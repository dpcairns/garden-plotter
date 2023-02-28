import * as THREE from 'three';
import { BROWN } from './constants';

export function makeVeggieMap({ tomatoTexture,
    cornTexture,
    potatoTexture,
    kaleTexture,
    soloDirtTexture,
}) {
    return {
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
            color: '#4E3524',
            material: new THREE.MeshStandardMaterial({ map: potatoTexture, color: '#4E3524' }),
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
}

