export function makeCows(scene, firstCow) {
    for (let i = 0; i < 70; i++) {
        const cow = firstCow.clone();
        cow.scale.set(.3, .3, .3);
            
        const xFactor = 60; // forward back spread
        const xOffset = 15;
        const zFactor = 100; // left right spread
        const zOffset = 0;
        
        cow.position.set(
            Math.random() > .5 // front or back 
                ? Math.random() * xFactor + xOffset 
                : Math.random() * -xFactor - xOffset, 
            0,
            Math.random() > .5 // left or right
                ? Math.random() * zFactor + zOffset 
                : Math.random() * -zFactor - zOffset);
    
    
        cow.rotation.set(0, Math.random() * 10, 0);    
        scene.add(cow);
    }
}