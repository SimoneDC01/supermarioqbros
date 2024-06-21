import * as THREE from 'three';

class Character {
    constructor(scene, initialPosition, initialRotation, scale = 0.5, texture = null, name = null) {
        this.scene = scene;
        this.character = null;
        this.initialPosition = initialPosition;
        this.position = initialPosition;
        this.rotation = initialRotation;
        this.scale = scale;
        this.texture = texture;
        this.speed = new THREE.Vector3(0, 0, 0);
        this.metalness = 0.5;
        this.roughness = 0.5;
        this.boundingBox = new THREE.Box3();
        this.gravity = 0.013;
        this.name = name;
    }

    loadModel() {
        return new Promise((resolve) => {
            const geometry = new THREE.BoxGeometry(this.scale, this.scale, this.scale);
            const material = new THREE.MeshStandardMaterial({ map: this.texture , metalness: this.metalness, roughness: this.roughness });
            const cube = new THREE.Mesh(geometry, material);
            cube.castShadow = true;
            cube.receiveShadow = true;

            this.character = cube;
            this.character.position.copy(this.position);
            this.character.rotation.copy(this.rotation);
            this.scene.add(this.character);
            this.character.name = this.name;
            
            // Update bounding box
            this.boundingBox.setFromObject(this.character);

            resolve();
        });
    }
}

export default Character;
