/***************************************************************
 * Main Lorenz Attractor (Loading Screen)
 ***************************************************************/
const lorenzCanvas = document.getElementById("lorenzCanvas");
const lorenzCtx = lorenzCanvas.getContext("2d");

function resizeLorenzCanvas() {
    lorenzCanvas.width = window.innerWidth;
    lorenzCanvas.height = window.innerHeight;
}
resizeLorenzCanvas();
window.addEventListener("resize", resizeLorenzCanvas);

// Generate random conditions for the attractor
function generateRandomConditions() {
    const sigma = Math.random() * 20 + 5; // Random sigma in range [5, 25]
    const rho = Math.random() * 40 + 20; // Random rho in range [20, 60]
    const beta = Math.random() * 2 + 2; // Random beta in range [2, 4]
    const initialX = Math.random() * 0.1 - 0.05; // Initial x in range [-0.05, 0.05]
    const initialY = Math.random() * 0.1 - 0.05; // Initial y in range [-0.05, 0.05]
    const initialZ = Math.random() * 0.1 - 0.05; // Initial z in range [-0.05, 0.05]
    return { sigma, rho, beta, x: initialX, y: initialY, z: initialZ };
}

const { sigma, rho, beta, x: initialX, y: initialY, z: initialZ } = generateRandomConditions();
const dt = 0.01, maxPoints = 2000;
let trajectory = [];
let x = initialX, y = initialY, z = initialZ;

let rotationX = 0, rotationY = 0;
let isDragging = false, lastMouseX, lastMouseY;

// Add rotation event listeners for the loading canvas
function setupRotationEvents(canvas) {
    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const deltaX = e.clientX - lastMouseX;
            const deltaY = e.clientY - lastMouseY;
            rotationY += deltaX * 0.005; // Adjust rotation sensitivity
            rotationX -= deltaY * 0.005;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
        isDragging = false;
    });
}

setupRotationEvents(lorenzCanvas);

function rotate3D(point, angleX, angleY) {
    const { x, y, z } = point;
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;
    return { x: x2, y: y1, z: z2 };
}

function updateLorenz() {
    requestAnimationFrame(updateLorenz);
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    trajectory.push({ x, y, z });
    if (trajectory.length > maxPoints) {
        trajectory.shift();
    }

    lorenzCtx.fillStyle = "rgba(0,0,0,0.1)";
    lorenzCtx.fillRect(0, 0, lorenzCanvas.width, lorenzCanvas.height);

    lorenzCtx.beginPath();
    for (let i = 0; i < trajectory.length - 1; i++) {
        const p1 = rotate3D(trajectory[i], rotationX, rotationY);
        const p2 = rotate3D(trajectory[i + 1], rotationX, rotationY);
        const scale = 12;
        const px1 = lorenzCanvas.width / 2 + p1.x * scale;
        const py1 = lorenzCanvas.height / 2 + p1.y * scale;
        const px2 = lorenzCanvas.width / 2 + p2.x * scale;
        const py2 = lorenzCanvas.height / 2 + p2.y * scale;
        lorenzCtx.moveTo(px1, py1);
        lorenzCtx.lineTo(px2, py2);
    }
    lorenzCtx.strokeStyle = "#FFFFFF";
    lorenzCtx.lineWidth = 1;
    lorenzCtx.stroke();
}
updateLorenz();

/***************************************************************
 * Overlay and Main Content Logic
 ***************************************************************/
const loadingScreen = document.getElementById("loadingScreen");
const mainContent = document.getElementById("mainContent");
const lorenzOverlay = document.getElementById("lorenzOverlay");
const lorenzOverlayCanvas = document.getElementById("lorenzOverlayCanvas");
const lorenzOverlayCtx = lorenzOverlayCanvas.getContext("2d");
const lorenzOverlayClose = document.getElementById("lorenzOverlayClose");
const openLorenzButton = document.getElementById("openLorenzButton");

let overlayTrajectory = [];
let overlayX = 0.01, overlayY = 0, overlayZ = 0;

// Resize the overlay canvas
function resizeOverlayCanvas() {
    lorenzOverlayCanvas.width = window.innerWidth;
    lorenzOverlayCanvas.height = window.innerHeight;
}
resizeOverlayCanvas();
window.addEventListener("resize", resizeOverlayCanvas);

function updateLorenzOverlay() {
    if (!lorenzOverlay.classList.contains("show")) return; // Only animate when visible
    requestAnimationFrame(updateLorenzOverlay);

    const dx = sigma * (overlayY - overlayX);
    const dy = overlayX * (rho - overlayZ) - overlayY;
    const dz = overlayX * overlayY - beta * overlayZ;

    overlayX += dx * dt;
    overlayY += dy * dt;
    overlayZ += dz * dt;

    overlayTrajectory.push({ x: overlayX, y: overlayY, z: overlayZ });
    if (overlayTrajectory.length > maxPoints) {
        overlayTrajectory.shift();
    }

    lorenzOverlayCtx.fillStyle = "rgba(0,0,0,0.1)";
    lorenzOverlayCtx.fillRect(0, 0, lorenzOverlayCanvas.width, lorenzOverlayCanvas.height);

    lorenzOverlayCtx.beginPath();
    for (let i = 0; i < overlayTrajectory.length - 1; i++) {
        const p1 = rotate3D(overlayTrajectory[i], rotationX, rotationY);
        const p2 = rotate3D(overlayTrajectory[i + 1], rotationX, rotationY);
        const scale = 12;
        const px1 = lorenzOverlayCanvas.width / 2 + p1.x * scale;
        const py1 = lorenzOverlayCanvas.height / 2 + p1.y * scale;
        const px2 = lorenzOverlayCanvas.width / 2 + p2.x * scale;
        const py2 = lorenzOverlayCanvas.height / 2 + p2.y * scale;
        lorenzOverlayCtx.moveTo(px1, py1);
        lorenzOverlayCtx.lineTo(px2, py2);
    }
    lorenzOverlayCtx.strokeStyle = "#FFFFFF";
    lorenzOverlayCtx.lineWidth = 1;
    lorenzOverlayCtx.stroke();
}

// Open the overlay and reset the attractor state
function openLorenzOverlay() {
    overlayX = 0.01;
    overlayY = 0;
    overlayZ = 0;
    overlayTrajectory = [];
    lorenzOverlayCtx.clearRect(0, 0, lorenzOverlayCanvas.width, lorenzOverlayCanvas.height);
    lorenzOverlay.classList.add("show");
    updateLorenzOverlay();
    setupRotationEvents(lorenzOverlayCanvas); // Add rotation interactions
}

// Close the overlay
function closeLorenzOverlay() {
    lorenzOverlay.classList.remove("show");
}

openLorenzButton.addEventListener("click", openLorenzOverlay);
lorenzOverlayClose.addEventListener("click", closeLorenzOverlay);

// Handle loading screen fade-out
setTimeout(() => {
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.classList.add("visible");
    }, 800);
}, 2500);
