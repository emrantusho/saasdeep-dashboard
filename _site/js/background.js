// Get the canvas element from our HTML
const canvas = document.getElementById('bg-canvas');

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Starfield
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 15000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 }));
scene.add(stars);

// Planet
const textureLoader = new THREE.TextureLoader();
const planetTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const planetGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planetMesh);

// Animation Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    stars.rotation.z -= 0.0001;
    planetMesh.rotation.y += 0.002;
    planetMesh.position.x = Math.sin(elapsedTime * 0.2) * 8;
    planetMesh.position.z = Math.cos(elapsedTime * 0.2) * 8 - 5;
    renderer.render(scene, camera);
}
animate();

// Handle Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
