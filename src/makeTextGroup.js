import * as THREE from 'three';

export function makeTextGroup({ 
    font, 
    skyMadcap, 
    isMobile, 
    sizes,
}) {
    const options = {
        font: font,
        size: isMobile ? .4 : .5,
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
        options);

    const text2 = new THREE.Mesh(textGeometry2, textMaterial);

    const rotations = [0, 1.6, 0];
    text.rotation.set(...rotations);
    text2.rotation.set(...rotations);

    text.geometry.center();
    text2.geometry.center();

    const textGroup = new THREE.Group();

    const invisibleBoxGeo = new THREE.BoxGeometry(sizes.width < 600 ? 4 : 5.8, 1.8, .5);
    const invisibleBoxMaterial = new THREE.MeshStandardMaterial({ color: 'black', transparent: true, opacity: .75 });

    invisibleBoxMaterial.neverOpaque = true;
    const invisibleMesh = new THREE.Mesh(invisibleBoxGeo, invisibleBoxMaterial);

    invisibleMesh.rotation.set(...rotations);

    if (isMobile) {
        text.position.set(12, 1.5, -4);
        text2.position.set(12, .8, -4.4);
        invisibleMesh.position.set(11.5, 1.1, -4.3);
    } else {
        text.position.set(9, 2.4 + .25, -3.8);
        text2.position.set(9, 1.6 + .25, -4);
        invisibleMesh.position.set(8.5, 2. + .25, -3.8);
    }

    textGroup.add(invisibleMesh);
    textGroup.add(text);
    textGroup.add(text2);
    return textGroup;
}
