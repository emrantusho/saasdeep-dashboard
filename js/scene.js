// PART 1: DYNAMIC "HUD" BACKGROUND
const bgCanvas = document.getElementById('bg-canvas');
const bgScene = new THREE.Scene();
const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: true });
bgRenderer.setSize(window.innerWidth, window.innerHeight);
bgCamera.position.z = 50;

const textureLoader = new THREE.TextureLoader();

const gridHelper = new THREE.GridHelper(200, 50, 0x00ffff, 0x00ffff);
gridHelper.material.opacity = 0.15;
gridHelper.material.transparent = true;
bgScene.add(gridHelper);

const hudTexture = textureLoader.load('/assets/hud.png');
const hudMaterial = new THREE.MeshBasicMaterial({
    map: hudTexture,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
const hudGeometry = new THREE.PlaneGeometry(50, 50);
const hudPlane = new THREE.Mesh(hudGeometry, hudMaterial);
hudPlane.position.z = 10;
bgScene.add(hudPlane);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200;
}
particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});
const codeRain = new THREE.Points(particlesGeometry, particlesMaterial);
bgScene.add(codeRain);

// PART 2: 3D LOGO IN SIDEBAR
const logoCanvas = document.getElementById('logo-canvas');
const logoScene = new THREE.Scene();
const logoCamera = new THREE.PerspectiveCamera(75, logoCanvas.clientWidth / logoCanvas.clientHeight, 0.1, 1000);
const logoRenderer = new THREE.WebGLRenderer({ canvas: logoCanvas, antialias: true, alpha: true });
logoRenderer.setSize(logoCanvas.clientWidth, logoCanvas.clientHeight);
logoRenderer.setClearColor(0x000000, 0);

const logoAmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
logoScene.add(logoAmbientLight);
const logoDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
logoDirectionalLight.position.set(2, 5, 5);
logoScene.add(logoDirectionalLight);

const glitterLight1 = new THREE.PointLight(0x00c3ff, 2, 5);
logoScene.add(glitterLight1);
const glitterLight2 = new THREE.PointLight(0x7f00ff, 2, 5);
logoScene.add(glitterLight2);

logoCamera.position.z = 2.5;

const loader = new THREE.GLTFLoader();
let logoModel;
loader.load(
    '/models/SAASDEEP.glb',
    function (gltf) {
        logoModel = gltf.scene;
        logoModel.scale.set(0.8, 0.8, 0.8);
        logoScene.add(logoModel);
    },
    undefined,
    function (error) { console.error('Error loading logo model:', error); }
);

// PART 3: COMBINED ANIMATION LOOP
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    hudPlane.rotation.z -= 0.002;
    hudPlane.scale.setScalar(Math.sin(elapsedTime * 0.5) * 0.1 + 0.9);
    
    const positions = codeRain.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        let i3 = i * 3;
        positions[i3 + 1] -= 0.1;
        if (positions[i3 + 1] < -100) {
            positions[i3 + 1] = 100;
        }
    }
    codeRain.geometry.attributes.position.needsUpdate = true;

    if (logoModel) {
        logoModel.rotation.y += 0.01;
        glitterLight1.position.x = Math.sin(elapsedTime * 0.7) * 2;
        glitterLight1.position.z = Math.cos(elapsedTime * 0.7) * 2;
        glitterLight1.position.y = Math.cos(elapsedTime * 0.7) * 2;
        glitterLight2.position.x = Math.cos(elapsedTime * 0.5) * 2;
        glitterLight2.position.z = Math.sin(elapsedTime * 0.5) * 2;
        glitterLight2.position.y = Math.sin(elapsedTime * 0.5) * 2;
    }
    
    bgRenderer.render(bgScene, bgCamera);
    logoRenderer.render(logoScene, logoCamera);
}
animate();

window.addEventListener('resize', () => {
    bgCamera.aspect = window.innerWidth / window.innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    logoCamera.aspect = logoCanvas.clientWidth / logoCanvas.clientHeight;
    logoCamera.updateProjectionMatrix();
    logoRenderer.setSize(logoCanvas.clientWidth, logoCanvas.clientHeight);
});
