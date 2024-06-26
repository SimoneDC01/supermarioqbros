// index.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as dat from 'dat.gui';
import Mario from './mario.js';
import Enemy from './enemy.js';

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// Add event listener for window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load background texture
const bgTextureLoader = new THREE.TextureLoader();
const bgTexture = bgTextureLoader.load('../../img/bg.jpg');
scene.background = bgTexture;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Directional lights
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight1.position.set(0, 10, 50);
directionalLight1.castShadow = true;
scene.add(directionalLight1);
directionalLight1.shadow.camera.top = 20;
directionalLight1.shadow.camera.bottom = -20;
directionalLight1.shadow.camera.left = -150;
directionalLight1.shadow.camera.right = 200;
directionalLight1.shadow.bias = -0.001;
directionalLight1.shadow.mapSize.width = 4096;
directionalLight1.shadow.mapSize.height = 4096;

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight2.position.set(0, 40, 0);
directionalLight2.castShadow = true;
scene.add(directionalLight2);
directionalLight2.shadow.camera.top = 20;
directionalLight2.shadow.camera.bottom = -20;
directionalLight2.shadow.camera.left = -150;
directionalLight2.shadow.camera.right = 200;
directionalLight2.shadow.bias = -0.001;
directionalLight2.shadow.mapSize.width = 4096;
directionalLight2.shadow.mapSize.height = 4096;

// GUI setup
var settings = {
    zoom: 1.0
}

const gui = new dat.GUI();
gui.add(directionalLight1, 'intensity', 0, 10).name('FrontLight');
gui.add(directionalLight2, 'intensity', 0, 10).name('TopLight');
gui.add(settings, 'zoom', 0.5, 2).name('Zoom')

// Configure GLTFLoader with DRACOLoader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/utils/draco/');
loader.setDRACOLoader(dracoLoader);

// Load environment
let environmentBoundingBoxes = [];

function createBoundingBoxForEnvironmentObject(object) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    environmentBoundingBoxes.push({boundingBox, name: object.name});
}

function loadGLTFModel() {
    return new Promise((resolve, reject) => {
        loader.load('../../scene/experiment.glb', function (gltf) {
            // Apply transformations to the scene
            gltf.scene.scale.set(0.45, 0.45, 0.45);
            gltf.scene.rotation.y = Math.PI / 2;
            gltf.scene.position.set(0, 0, 5.2);

            // Wait until the scene is fully transformed
            gltf.scene.updateMatrixWorld(true);

            // Traverse the scene after transformations
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    const targetMaterial = new THREE.MeshStandardMaterial();
                    THREE.MeshBasicMaterial.prototype.copy.call(targetMaterial, child.material);
                    child.material = targetMaterial;
                    
                    // Create bounding box for this object
                    createBoundingBoxForEnvironmentObject(child);
                }
            });

            // Add the scene to the main scene
            scene.add(gltf.scene);
            resolve();
        }, undefined, function (error) {
            reject(error);
        });
    });
}

// Load textures
const textureLoader = new THREE.TextureLoader();
const marioTexture = textureLoader.load('../../img/mario.png');
const fireMarioTexture = textureLoader.load('../../img/fire_mario.png');
const goombaTexture = textureLoader.load('../../img/goomba.png');

// Load models and start animation
const mario = new Mario(scene, -100, new THREE.Euler(0, 0, 0), 0.5, marioTexture);
const enemy1 = new Enemy(scene, -82, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 1, 1, 'Enemy1');
const enemy2 = new Enemy(scene, -59.35, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 1, 1.5, 'Enemy2');
const enemy3 = new Enemy(scene, -49.2, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 1, 2.1, 'Enemy3');
const enemy4 = new Enemy(scene, -48.3, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 1, 2.1, 'Enemy4');
const enemy5 = new Enemy(scene, -19.9, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 0.5, 0.55, 'Enemy5', 8.09088);
const enemy6 = new Enemy(scene, -13.4, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 1, 2.15, 'Enemy6', 13.7835);
const enemy7 = new Enemy(scene, -6, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 2, 10, 'Enemy7');
const enemy8 = new Enemy(scene, 3, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 2, 10, 'Enemy8');
const enemy9 = new Enemy(scene, 12, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 2, 10, 'Enemy9');
const enemy10 = new Enemy(scene, 21, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 2, 10, 'Enemy10');
const enemy11 = new Enemy(scene, 84.3, new THREE.Euler(0, 0, 0), 0.8, goombaTexture, 1.5, 3.8, 'Enemy11');

let enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10, enemy11];
let defeatedEnemies = [];

Promise.all([loadGLTFModel(), mario.loadModel(), ...enemies.map(enemy => enemy.loadModel())]).then(() => {
    // Make enemies collidable
    enemies.forEach(enemy => {
        const enemyBoundingBox = new THREE.Box3().setFromObject(enemy.character);
        environmentBoundingBoxes.push({boundingBox: enemyBoundingBox, name: enemy.name});
    });

    // Start the animation
    displayStartScreen();
});

// Keyboard controls
const keysPressed = {};
window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

// Return name, side and distance of the collision
function checkCollisions(character) {
    var collisions = [];
    for (const {boundingBox, name} of environmentBoundingBoxes) {
        if (character.boundingBox.intersectsBox(boundingBox)) {
            const characterBox = character.boundingBox;
            const intersection = boundingBox.clone().intersect(characterBox);
            const width = intersection.max.x - intersection.min.x;
            const height = intersection.max.y - intersection.min.y;
            const depth = intersection.max.z - intersection.min.z;
            const minDist = Math.min(width, height, depth);
            
            if (minDist === height) {
                if (characterBox.max.y > boundingBox.max.y) collisions.push({ name, side: 'top', distance: boundingBox.max.y - characterBox.min.y });
                else if (characterBox.min.y < boundingBox.min.y) collisions.push({ name, side: 'bottom', distance: characterBox.max.y - boundingBox.min.y });
            }
            if (minDist === width) {
                if (characterBox.max.x > boundingBox.max.x) collisions.push({ name, side: 'right', distance: boundingBox.max.x - characterBox.min.x });
                if (characterBox.min.x < boundingBox.min.x) collisions.push({ name, side: 'left', distance: characterBox.max.x - boundingBox.min.x });
            }
            if (minDist === depth) {
                if (characterBox.max.z > boundingBox.max.z) collisions.push({ name, side: 'front', distance: boundingBox.max.z - characterBox.min.z });
                if (characterBox.min.z < boundingBox.min.z) collisions.push({ name, side: 'back', distance: characterBox.max.z - boundingBox.min.z });
            }
        }
    }
    return collisions;
}

function handleCollisions(character, collisions){
    collisions.forEach(collision => {
        // Handle collision response
        if (collision.side === 'top') {
            character.speed.y = Math.max(character.speed.y, 0);  // Stop Mario from moving down further
            character.character.position.y += collision.distance;

            if (isObjectCube(collision.name) && character.isGroundpounding) hitObjectCube(collision.name, 'top');
            if (isBrickCube(collision.name) && character.isGroundpounding && character.state != 'small'){
                if(destroyableBrickCubes.includes(getNumberFromName(collision.name))) destroyBrickCube(collision.name);
                else hitBrickCube(collision.name);
            }
            
            character.gravity = character.baseGravity;  // Reset gravity
            jumpSound.stop();
            character.isJumping = false;
            if (character.isGroundpounding){
                character.isGroundpounding = false;
                bumpSound.play();
            }
        }
        if (collision.side === 'bottom'){
            character.speed.y = Math.min(character.speed.y, 0);  // Stop Mario from moving up further
            character.character.position.y -= collision.distance;

            if (isObjectCube(collision.name)) hitObjectCube(collision.name, 'bottom');
            if (isBrickCube(collision.name)){
                if (character.state != 'small'){
                    if(destroyableBrickCubes.includes(getNumberFromName(collision.name))) destroyBrickCube(collision.name);
                    else hitBrickCube(collision.name);
                }
                else bumpSound.play();
            }
        }
        if (collision.side === 'front'){
            character.speed.z = Math.max(character.speed.z, 0);  // Stop Mario from moving backwards further
            character.character.position.z += collision.distance;
        }
        if (collision.side === 'back'){
            character.speed.z = Math.min(character.speed.z, 0);  // Stop Mario from moving forwards further
            character.character.position.z -= collision.distance;
        }
        if (collision.side === 'left'){
            character.speed.x = Math.min(character.speed.x, 0);  // Stop Mario from moving right further
            character.character.position.x -= collision.distance;
        }
        if (collision.side === 'right'){
            character.speed.x = Math.max(character.speed.x, 0);  // Stop Mario from moving left further
            character.character.position.x += collision.distance;
        }

        if (isMushroomCube(collision.name)){
            if (collectedItems.includes(collision.name)) return;
            collectedItems.push(collision.name);

            scene.remove(scene.getObjectByName(collision.name));
            environmentBoundingBoxes = environmentBoundingBoxes.filter(({name}) => name !== collision.name);
            mario.character.scale.set(1.5, 1.5, 1.5);
            if (mario.state == 'small'){
                lastDamageTime = performance.now(); // Can't take damage for 1 second after powerup
                mario.state = 'big';
                powerupSound.play();
            }
        }
        if (isFlowerCube(collision.name)){
            if (collectedItems.includes(collision.name)) return;
            collectedItems.push(collision.name);

            scene.remove(scene.getObjectByName(collision.name));
            environmentBoundingBoxes = environmentBoundingBoxes.filter(({name}) => name !== collision.name);
            mario.character.material.map = fireMarioTexture;
            mario.character.scale.set(1.5, 1.5, 1.5);
            if (mario.state != 'fire'){
                lastDamageTime = performance.now(); // Can't take damage for 1 second after powerup
                mario.state = 'fire'
                powerupSound.play();
            }
        }
        if (isCoinCube(collision.name)){
            if (collectedItems.includes(collision.name)) return;
            collectedItems.push(collision.name);

            scene.remove(scene.getObjectByName(collision.name));
            environmentBoundingBoxes = environmentBoundingBoxes.filter(({name}) => name !== collision.name);
            mario.coins++;
            document.getElementById('coinCount').innerText = mario.coins;
            coinSound.play();
        }
        if (isEnemy(collision.name)){
            if (collision.side === 'top'){
                if (defeatedEnemies.includes(collision.name)) return;
                defeatedEnemies.push(collision.name);

                scene.remove(scene.getObjectByName(collision.name));
                environmentBoundingBoxes = environmentBoundingBoxes.filter(({name}) => name !== collision.name);
                mario.jump();
                enemyDefeatedsound.play();
            }
            else if (! defeatedEnemies.includes(collision.name)) takeDamage();
        }

        if (isGoal(collision.name)) startWin();

        if (collision.name == 'Pipe_4' && (keysPressed['ArrowDown'] || keysPressed['s'])) startTeleport();
    });
}

let lastDamageTime = 0;
const damageCooldown = 2000;  // Cooldown of two seconds

// Handle damage
function takeDamage(){
    if (mario.state == 'ko') return;

    const currentTime = performance.now();
    if (currentTime - lastDamageTime < damageCooldown) {
        return;
    }

    lastDamageTime = currentTime;

    if(mario.state == 'small'){
        gameOver();
    }
    else if(mario.state == 'big'){
        pipe_damageSound.play();
        mario.character.scale.set(1, 1, 1);
        mario.state = 'small';
    }
    else{
        pipe_damageSound.play();
        mario.character.material.map = marioTexture;
        mario.state = 'big';
    }
}

function gameOver(){
    if (mario.state == 'ko') return;
    mario.state = 'ko'
    mainSound.stop();
    gameOverSound.play();
    mario.character.visible = false;
    displayGameoverScreen();
}

function startWin(){
    if (mario.state == 'winner') return;
    mario.state = 'winner';

    mainSound.stop();
    flagPoleSound.play();
    animateWin();
}

function animateWin() {
    const startY = mario.character.position.y;
    const endY = mario.state == 'small' ? 2.37414052646334 : 2.499140526463344;
    const duration = 1228; // 1 second
    const startTime = performance.now();
    mario.isTeleporting = true;

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        mario.character.position.y = startY + (endY - startY) * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else win();
    }

    animate();
}

function win(){
    winSound.play();
    startFinalAnimation();
}

function startFinalAnimation(){
    const startZ = mario.character.position.z;
    const endZ = 1.8;
    const duration = 1700; // 1.7 seconds
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        mario.character.position.z = startZ + (endZ - startZ) * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else continueFinalAnimation();
    }

    animate();
}

function continueFinalAnimation(){
    const startX = mario.character.position.x;
    const endX = 120.5;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        mario.character.position.x = startX + (endX - startX) * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else endFinalAnimation();
    }

    animate();
}

function endFinalAnimation(){
    const startZ = mario.character.position.z;
    const endZ = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        mario.character.position.z = startZ + (endZ - startZ) * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }

        else displayEndScreen();
    }

    animate();
}

function displayEndScreen() {
    // Create a div element for the end screen
    var endScreen = document.createElement('div');
    
    // Set style of the div
    endScreen.style.position = 'fixed';
    endScreen.style.top = '0';
    endScreen.style.left = '0';
    endScreen.style.width = '100%';
    endScreen.style.height = '100%';
    endScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Semi-transparent background
    endScreen.style.display = 'flex';
    endScreen.style.justifyContent = 'center';
    endScreen.style.alignItems = 'center';
    endScreen.style.zIndex = '1000';
    
    // Create an h1 element with the text "You won!"
    var message = document.createElement('h1');
    message.innerText = 'You won!\nPress [Space] to restart';
    
    message.style.color = 'white';
    message.style.fontSize = '60px';
    message.style.fontFamily = 'Arial, sans-serif';
    message.style.textAlign = 'center';
    message.style.textShadow = '2px 2px 4px #000000'; // Ombra del testo
    message.style.background = 'linear-gradient(to right, #ffcc00, #ff0000)'; // Gradiente del testo
    message.style.webkitBackgroundClip = 'text'; // Clip di background per testo
    message.style.webkitTextFillColor = 'transparent'; // Rendi il colore del testo trasparente per mostrare il gradiente
    message.style.animation = 'glow 1.5s ease-in-out infinite alternate'; // Animazione del testo
    
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '@keyframes glow { from { text-shadow: 0 0 10px #ffcc00, 0 0 20px #ffcc00; } to { text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000; } }';
    document.getElementsByTagName('head')[0].appendChild(style);
    
    endScreen.appendChild(message);
    
    document.body.appendChild(endScreen);

    // Add a listener for the `keydown` event to reload the page when the space bar is pressed
    function restartGame(event) {
        if (event.code === 'Space') location.reload();
    }
    document.addEventListener('keydown', restartGame);
}

function displayStartScreen() {
    // Create a div element for the start screen
    var startScreen = document.createElement('div');
    
    // Set style of the div
    startScreen.style.position = 'fixed';
    startScreen.style.top = '0';
    startScreen.style.left = '0';
    startScreen.style.width = '100%';
    startScreen.style.height = '100%';
    startScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Sfondo semi-trasparente
    startScreen.style.display = 'flex';
    startScreen.style.justifyContent = 'center';
    startScreen.style.alignItems = 'center';
    startScreen.style.zIndex = '1000'; // Assicurarsi che sia davanti a tutto
    
    // Create an h1 element with the title
    var message = document.createElement('h1');
    message.innerText = 'Super Mario QBros!\nPress [Space] to start';
    
    message.style.color = 'white';
    message.style.fontSize = '60px';
    message.style.fontFamily = 'Arial, sans-serif';
    message.style.textAlign = 'center';
    message.style.textShadow = '2px 2px 4px #000000';
    message.style.background = 'linear-gradient(to right, #ffcc00, #ff0000)';
    message.style.webkitBackgroundClip = 'text';
    message.style.webkitTextFillColor = 'transparent';
    message.style.animation = 'glow 1.5s ease-in-out infinite alternate';
    
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '@keyframes glow { from { text-shadow: 0 0 10px #ffcc00, 0 0 20px #ffcc00; } to { text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000; } }';
    document.getElementsByTagName('head')[0].appendChild(style);
    
    startScreen.appendChild(message);
    
    document.body.appendChild(startScreen);
    
    // Add a listener for the `keydown` event to start the game when the space bar is pressed
    function startGame(event) {
        if (event.code === 'Space') {
            document.body.removeChild(startScreen);
            document.removeEventListener('keydown', startGame);
            mainSound.play();
            animate();
        }
    }
    
    document.addEventListener('keydown', startGame);
}

function displayGameoverScreen() {
    // Create a div element for the end screen
    var endScreen = document.createElement('div');
    
    // Set style of the div
    endScreen.style.position = 'fixed';
    endScreen.style.top = '0';
    endScreen.style.left = '0';
    endScreen.style.width = '100%';
    endScreen.style.height = '100%';
    endScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    endScreen.style.display = 'flex';
    endScreen.style.justifyContent = 'center';
    endScreen.style.alignItems = 'center';
    endScreen.style.zIndex = '1000';
    
    // Create an h1 element with the text "You lost!"
    var message = document.createElement('h1');
    message.innerText = 'You lost!\nPress [Space] to restart';
    
    message.style.color = 'white';
    message.style.fontSize = '60px';
    message.style.fontFamily = 'Arial, sans-serif';
    message.style.textAlign = 'center';
    message.style.textShadow = '2px 2px 4px #000000';
    message.style.background = 'linear-gradient(to right, #ffcc00, #ff0000)';
    message.style.webkitBackgroundClip = 'text';
    message.style.webkitTextFillColor = 'transparent';
    message.style.animation = 'glow 1.5s ease-in-out infinite alternate';
    
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '@keyframes glow { from { text-shadow: 0 0 10px #ffcc00, 0 0 20px #ffcc00; } to { text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000; } }';
    document.getElementsByTagName('head')[0].appendChild(style);
    
    endScreen.appendChild(message);
    
    document.body.appendChild(endScreen);

    // Add a listener for the `keydown` event to reload the page when the space bar is pressed
    function restartGame(event) {
        if (event.code === 'Space') location.reload();
    }
    document.addEventListener('keydown', restartGame);
}

function getNumberFromName(name) {
    return parseInt(name.split('_')[1]);
}

function isObjectCube(name) {
    const regex = /^ObjectCube_\d{1,2}$/;
    return regex.test(name);
}

function isBrickCube(name) {
    const regex = /^BrickCube_\d{1,2}$/;
    return regex.test(name);
}

function isMushroomCube(name) {
    const regex = /^MushroomCube_\d{1,2}$/;
    return regex.test(name);
}

function isFlowerCube(name) {
    const regex = /^FlowerCube_\d{1,2}$/;
    return regex.test(name);
}

function isCoinCube(name) {
    const regex = /^CoinCube_\d{1,2}$/;
    return regex.test(name);
}

function isEnemy(name) {
    const regex = /^Enemy\d{1,2}$/;
    return regex.test(name);
}

function isGoal(name) {
    return name === 'FlagPole' || name == 'FlagSphere';
}

let itemCubes = [2, 5, 11]
let destroyableBrickCubes = [1, 2, 3, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

let hitCubes = [];
let collectedItems = [];
let destroyedBricks = [];

function hitObjectCube(name, side) {
    // Check if the cube has already been hit
    if (hitCubes.includes(name)){
        bumpSound.play();
        return;
    }
    hitCubes.push(name);

    const block = scene.getObjectByName(name);
    block.material = new THREE.MeshStandardMaterial({ color: 0x893318 });
    blockHitSound.play();

    let type;
    if (itemCubes.includes(getNumberFromName(name)) && mario.state == 'small') type = 'mushroom';
    else if (itemCubes.includes(getNumberFromName(name))) type = 'flower';
    else type = 'coin';

    createItemCube(type, block, side === 'bottom' ? 'up' : 'down');
}

function hitBrickCube(name) {
    // Check if the cube has already been hit
    if (hitCubes.includes(name)) return;
    hitCubes.push(name);

    const block = scene.getObjectByName(name);
    block.material = new THREE.MeshStandardMaterial({ color: 0x893318 });
}

function destroyBrickCube(brickName) {
    if (destroyedBricks.includes(brickName)) return;
    destroyedBricks.push(brickName);

    const brick = scene.getObjectByName(brickName);
    brick.parent.remove(brick);
    environmentBoundingBoxes = environmentBoundingBoxes.filter(({ name }) => name !== brickName);
    blockBrokenSound.play();
}


let items = 0;

function createItemCube(type, block, direction) {
    // Get the world position of the block
    const position = new THREE.Vector3();
    block.getWorldPosition(position);

    // Add a new cube at the position of the removed object
    const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const texture = textureLoader.load(type == "mushroom" ? '../../img/mushroom.png' : type == "flower" ? '../../img/flower.png' : '../../img/coin.png');
    const material = new THREE.MeshStandardMaterial({ map: texture});
    const itemCube = new THREE.Mesh(geometry, material);
    itemCube.name = type == "mushroom" ? `MushroomCube_${items++}` : type == "flower" ? `FlowerCube_${items++}` : `CoinCube_${items++}`;
    itemCube.position.copy(position);
    itemCube.castShadow = true;
    itemCube.receiveShadow = true;
    scene.add(itemCube);

    const targetY = position.y + (direction === 'up' ? 1.5 : -0.5);
    const speed = 0.1;

    function animateCube() {
        if ((direction === 'up' && itemCube.position.y < targetY) || (direction === 'down' && itemCube.position.y > targetY)) {
            itemCube.position.y += (direction === 'up' ? speed : -speed);
            requestAnimationFrame(animateCube);
        } else {
            itemCube.position.y = targetY;
            createBoundingBoxForEnvironmentObject(itemCube);
        }
    }

    animateCube();
}

let rotationStartTime = null;

function startGroundpound() {
    rotationStartTime = performance.now();
    function animate(){
        const currentTime = performance.now();
        const elapsedTime = (currentTime - rotationStartTime) / 1000;
        if (elapsedTime < mario.rotationDuration) {
            const rotationAngle = (elapsedTime / mario.rotationDuration) * Math.PI * 2;
            mario.character.rotation.x = rotationAngle;
            requestAnimationFrame(animate);
        } else {
            mario.character.rotation.x = 0;  // Reset to initial orientation
            rotationStartTime = null;  // Stop rotation
            mario.gravity = mario.baseGravity * mario.groundpoundCoeff;  // Increase gravity
        }
    }
    animate();
}

function startTeleport() {
    mario.isTeleporting = true;
    mario.character.position.x = -42.6; // Center of the pipe
    pipe_damageSound.play();
    animateMarioDown();
}

function animateMarioDown() {
    const startY = mario.character.position.y;
    const duration = 1000; // 1 second
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        mario.character.position.y = startY - (8 * progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            mario.character.visible = false;
            animateMarioRight();
        }
    }

    animate();
}

function animateMarioRight() {
    const startX = mario.character.position.x;
    const endX = 75.4;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        mario.character.position.x = startX + (endX - startX) * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            mario.character.visible = true;
            animateMarioUp();
        }
    }

    animate();
}

function animateMarioUp() {
    const startY = mario.character.position.y;
    const endY = 5.3869;
    const duration = 1000; // 1 second
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        mario.character.position.y = startY + (endY - startY) * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else mario.isTeleporting = false;
    }

    animate();
    pipe_damageSound.play();
}

// Audio setup
const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader();

const mainSound = new THREE.Audio(listener);
audioLoader.load('../audio/main.mp3', function(buffer) {
    mainSound.setBuffer(buffer);
    mainSound.setLoop(true);
    mainSound.setVolume(0.5);
});

const coinSound = new THREE.Audio(listener);
audioLoader.load('../audio/coin.mp3', function(buffer) {
    coinSound.setBuffer(buffer);
    coinSound.setVolume(0.9);
});

const jumpSound = new THREE.Audio(listener);
audioLoader.load('../audio/jump.mp3', function(buffer) {
    jumpSound.setBuffer(buffer);
    jumpSound.setVolume(0.1);
});

const powerupSound = new THREE.Audio(listener);
audioLoader.load('../audio/powerup.mp3', function(buffer) {
    powerupSound.setBuffer(buffer);
    powerupSound.setVolume(0.5);
});

const pipe_damageSound = new THREE.Audio(listener);
audioLoader.load('../audio/pipe-damage.mp3', function(buffer) {
    pipe_damageSound.setBuffer(buffer);
    pipe_damageSound.setVolume(0.5);
});

const gameOverSound = new THREE.Audio(listener);
audioLoader.load('../audio/gameover.mp3', function(buffer) {
    gameOverSound.setBuffer(buffer);
    gameOverSound.setVolume(0.5);
});

const enemyDefeatedsound = new THREE.Audio(listener);
audioLoader.load('../audio/enemy_defeated.mp3', function(buffer) {
    enemyDefeatedsound.setBuffer(buffer);
    enemyDefeatedsound.setVolume(0.5);
});

const blockHitSound = new THREE.Audio(listener);
audioLoader.load('../audio/block_hit.mp3', function(buffer) {
    blockHitSound.setBuffer(buffer);
    blockHitSound.setVolume(0.5);
});

const blockBrokenSound = new THREE.Audio(listener);
audioLoader.load('../audio/block_broken.mp3', function(buffer) {
    blockBrokenSound.setBuffer(buffer);
    blockBrokenSound.setVolume(0.5);
});

const bumpSound = new THREE.Audio(listener);
audioLoader.load('../audio/bump.mp3', function(buffer) {
    bumpSound.setBuffer(buffer);
    bumpSound.setVolume(0.5);
});

const winSound = new THREE.Audio(listener);
audioLoader.load('../audio/win.mp3', function(buffer) {
    winSound.setBuffer(buffer);
    winSound.setVolume(0.5);
});

const flagPoleSound = new THREE.Audio(listener);
audioLoader.load('../audio/flagpole.mp3', function(buffer) {
    flagPoleSound.setBuffer(buffer);
    flagPoleSound.setVolume(0.5);
});

function animate() {
    requestAnimationFrame(animate);
    
    if (! mario.isTeleporting && mario.state != 'ko'){
        // Update Mario's speed based on key presses

        if (keysPressed['z'] && settings.zoom < 5) settings.zoom += 0.01;
        if (keysPressed['x'] && settings.zoom > 0.1) settings.zoom -= 0.01;
        if (keysPressed['r']) settings.zoom = 1;

        if (keysPressed['ArrowLeft'] || keysPressed['a'] && !mario.isGroundpounding && mario.state != 'ko') mario.speed.x -= mario.speedCoeff;
        if (keysPressed['ArrowRight'] || keysPressed['d'] && !mario.isGroundpounding && mario.state != 'ko') mario.speed.x += mario.speedCoeff;

        if ((keysPressed[' '] || keysPressed['ArrowUp'] || keysPressed['w']) && !mario.isJumping){
            mario.jump()
            jumpSound.play();
        }

        if ((keysPressed['ArrowDown'] || keysPressed['Enter'] || keysPressed['s']) && mario.isJumping && !mario.isGroundpounding) {
            mario.speed.y = 0;
            mario.isGroundpounding = true;
            mario.gravity = 0;
            startGroundpound();
        }

        var collisions = checkCollisions(mario);

        if (collisions.length === 0) mario.isJumping = true;

        handleCollisions(mario, collisions);
    
        mario.update();
    }

    // Move enemies
    enemies.forEach(enemy => {
        enemy.update();
    });

    // Update enemy bounding box position
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const enemyBoundingBox = environmentBoundingBoxes.find(({ name }) => name === enemy.name);
        if (enemyBoundingBox) {
            enemyBoundingBox.boundingBox.setFromObject(enemy.character);
        }
    }

    if (mario.character.position.y < -20) {
        gameOver();
    }

    // Update controls target to Mario's position
    camera.position.set(mario.character.position.x, mario.character.position.y + (15 / settings.zoom), mario.character.position.z + (20 / settings.zoom));
    camera.lookAt(mario.character.position);

    renderer.render(scene, camera);
}
