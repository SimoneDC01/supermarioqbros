import * as THREE from 'three';
import Character from './character.js';

class Enemy extends Character {
    constructor(scene, initialX, initialRotation, scale = 1, texture = null, speed = 1, maxDistance = 1, name = 'Enemy1', initialY = 2.524) {
        const initialPosition = new THREE.Vector3(initialX, initialY, 0);
        super(scene, initialPosition, initialRotation, scale, texture, name);
        this.speed = speed;
        this.maxDistance = maxDistance;
    }

    update() {
        if (this.character) {
            let timeFactor = performance.now() / 300;
            this.character.position.set(
                this.initialPosition.x + 2 * this.maxDistance * Math.sin(this.speed * timeFactor / this.maxDistance),
                this.character.position.y,
                this.character.position.z
            );
        }
    }
}

export default Enemy;
