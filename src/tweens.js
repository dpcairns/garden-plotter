import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

export function tweenTo(mesh, xyz, delay = 1000, fromRight = false, fromBelow = false) {
    mesh.position.set(
        0, fromBelow 
            ? -3
            : 20, 
        fromBelow 
            ? 0 
            : fromRight 
                ? -50 
                : 50
    );

    new TWEEN.Tween(mesh.position)
        .to(xyz, 500)
        .delay(delay)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
}  