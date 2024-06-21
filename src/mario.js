import * as THREE from 'three';
import Character from './character.js';

class Mario extends Character {
    constructor(scene, initialX, initialRotation, scale = 1, texture = null, name = 'Mario') {
        const initialPosition = new THREE.Vector3(initialX, 10, 0);
        super(scene, initialPosition, initialRotation, scale, texture, name);
        this.baseGravity = 0.015;
        this.speedCoeff = 0.2;
        this.jumpSpeed = 0.4;
        this.groundpoundCoeff = 2;
        this.isJumping = false;
        this.isGroundpounding = false;
        this.isTeleporting = false;
        this.rotationDuration = 0.3;
        this.state = 'small';
        this.coins = 0;
    }

    jump() {
        this.speed.y = this.jumpSpeed;
        this.isJumping = true;
    }

    update() {
        if (this.character) {
            this.speed.x *= 0.5;
            this.speed.z *= 0.5;

            this.character.position.add(this.speed);
            this.boundingBox.setFromObject(this.character);

            this.speed.y -= this.gravity;
        }
    }
}

export default Mario;
