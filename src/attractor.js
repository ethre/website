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
    const sigma = Math.random() * 20 + 5;
    const rho = Math.random() * 40 + 20;
    const beta = Math.random() * 2 + 2;
    const initialX = Math.random() * 0.1 - 0.05;
    const initialY = Math.random() * 0.1 - 0.05;
    const initialZ = Math.random() * 0.1 - 0.05;
    return { sigma, rho, beta, x: initialX, y: initialY, z: initialZ };
}

const { sigma, rho, beta, x: initialX, y: initialY, z: initialZ } = generateRandomConditions();
const dt = 0.01, maxPoints = 2000;
let trajectory = [];
let x = initialX, y = initialY, z = initialZ;

let rotationX = 0, rotationY = 0;
let isDragging = false, lastMouseX, lastMouseY;

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
            rotationY += deltaX * 0.005;
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

function getOptimalScale() {
    const minDimension = Math.min(lorenzCanvas.width, lorenzCanvas.height);
    return minDimension / 50;
}

function findAttractorBounds(points) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    points.forEach(point => {
        const rotated = rotate3D(point, rotationX, rotationY);
        minX = Math.min(minX, rotated.x);
        maxX = Math.max(maxX, rotated.x);
        minY = Math.min(minY, rotated.y);
        maxY = Math.max(maxY, rotated.y);
    });
    
    return { minX, maxX, minY, maxY };
}

function drawGrid(ctx, scale, width, height, centerX, centerY) {
    const gridSize = 5;
    const gridStep = scale * gridSize;
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let x = centerX % gridStep; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = centerY % gridStep; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function drawAxesLabels(ctx, width, height) {
    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "right";
    
    // Parameters
    ctx.fillText(`σ: ${sigma.toFixed(2)}`, width - 10, 20);
    ctx.fillText(`ρ: ${rho.toFixed(2)}`, width - 10, 40);
    ctx.fillText(`β: ${beta.toFixed(2)}`, width - 10, 60);
    
    // Current point
    ctx.fillText(`x: ${x.toFixed(2)}`, width - 10, height - 60);
    ctx.fillText(`y: ${y.toFixed(2)}`, width - 10, height - 40);
    ctx.fillText(`z: ${z.toFixed(2)}`, width - 10, height - 20);
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

    lorenzCtx.fillStyle = "rgba(0,0,0,0.3)";
    lorenzCtx.fillRect(0, 0, lorenzCanvas.width, lorenzCanvas.height);

    const bounds = findAttractorBounds(trajectory);
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const scale = Math.min(
        (lorenzCanvas.width * 0.8) / width,
        (lorenzCanvas.height * 0.8) / height,
        getOptimalScale()
    );

    const centerX = lorenzCanvas.width / 2;
    const centerY = lorenzCanvas.height / 2;

    // Draw grid
    drawGrid(lorenzCtx, scale, lorenzCanvas.width, lorenzCanvas.height, centerX, centerY);

    // Draw axes
    lorenzCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    lorenzCtx.lineWidth = 1;
    lorenzCtx.beginPath();
    lorenzCtx.moveTo(centerX, 0);
    lorenzCtx.lineTo(centerX, lorenzCanvas.height);
    lorenzCtx.moveTo(0, centerY);
    lorenzCtx.lineTo(lorenzCanvas.width, centerY);
    lorenzCtx.stroke();

    // Draw trajectory
    lorenzCtx.beginPath();
    for (let i = 0; i < trajectory.length - 1; i++) {
        const p1 = rotate3D(trajectory[i], rotationX, rotationY);
        const p2 = rotate3D(trajectory[i + 1], rotationX, rotationY);
        
        const px1 = centerX + p1.x * scale;
        const py1 = centerY + p1.y * scale;
        const px2 = centerX + p2.x * scale;
        const py2 = centerY + p2.y * scale;
        
        lorenzCtx.moveTo(px1, py1);
        lorenzCtx.lineTo(px2, py2);
    }
    lorenzCtx.strokeStyle = "rgba(0, 255, 255, 0.8)";
    lorenzCtx.lineWidth = 1;
    lorenzCtx.stroke();

    // Draw current point
    const currentPoint = rotate3D({ x, y, z }, rotationX, rotationY);
    lorenzCtx.beginPath();
    lorenzCtx.arc(
        centerX + currentPoint.x * scale,
        centerY + currentPoint.y * scale,
        3,
        0,
        Math.PI * 2
    );
    lorenzCtx.fillStyle = "#ff0000";
    lorenzCtx.fill();

    // Draw labels
    drawAxesLabels(lorenzCtx, lorenzCanvas.width, lorenzCanvas.height);
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

function resizeOverlayCanvas() {
    lorenzOverlayCanvas.width = window.innerWidth;
    lorenzOverlayCanvas.height = window.innerHeight;
}
resizeOverlayCanvas();
window.addEventListener("resize", resizeOverlayCanvas);

function updateLorenzOverlay() {
    if (!lorenzOverlay.classList.contains("show")) return;
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

    lorenzOverlayCtx.fillStyle = "rgba(0,0,0,0.3)";
    lorenzOverlayCtx.fillRect(0, 0, lorenzOverlayCanvas.width, lorenzOverlayCanvas.height);

    const bounds = findAttractorBounds(overlayTrajectory);
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const scale = Math.min(
        (lorenzOverlayCanvas.width * 0.8) / width,
        (lorenzOverlayCanvas.height * 0.8) / height,
        getOptimalScale()
    );

    const centerX = lorenzOverlayCanvas.width / 2;
    const centerY = lorenzOverlayCanvas.height / 2;

    // Draw grid
    drawGrid(lorenzOverlayCtx, scale, lorenzOverlayCanvas.width, lorenzOverlayCanvas.height, centerX, centerY);

    // Draw axes
    lorenzOverlayCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    lorenzOverlayCtx.lineWidth = 1;
    lorenzOverlayCtx.beginPath();
    lorenzOverlayCtx.moveTo(centerX, 0);
    lorenzOverlayCtx.lineTo(centerX, lorenzOverlayCanvas.height);
    lorenzOverlayCtx.moveTo(0, centerY);
    lorenzOverlayCtx.lineTo(lorenzOverlayCanvas.width, centerY);
    lorenzOverlayCtx.stroke();

    // Draw trajectory
    lorenzOverlayCtx.beginPath();
    for (let i = 0; i < overlayTrajectory.length - 1; i++) {
        const p1 = rotate3D(overlayTrajectory[i], rotationX, rotationY);
        const p2 = rotate3D(overlayTrajectory[i + 1], rotationX, rotationY);
        
        const px1 = centerX + p1.x * scale;
        const py1 = centerY + p1.y * scale;
        const px2 = centerX + p2.x * scale;
        const py2 = centerY + p2.y * scale;
        
        lorenzOverlayCtx.moveTo(px1, py1);
        lorenzOverlayCtx.lineTo(px2, py2);
    }
    lorenzOverlayCtx.strokeStyle = "rgba(0, 255, 255, 0.8)";
    lorenzOverlayCtx.lineWidth = 1;
    lorenzOverlayCtx.stroke();

    // Draw current point
    const currentPoint = rotate3D({ x: overlayX, y: overlayY, z: overlayZ }, rotationX, rotationY);
    lorenzOverlayCtx.beginPath();
    lorenzOverlayCtx.arc(
        centerX + currentPoint.x * scale,
        centerY + currentPoint.y * scale,
        3,
        0,
        Math.PI * 2
    );
    lorenzOverlayCtx.fillStyle = "#ff0000";
    lorenzOverlayCtx.fill();

    // Draw labels
    drawAxesLabels(lorenzOverlayCtx, lorenzOverlayCanvas.width, lorenzOverlayCanvas.height);
}

function openLorenzOverlay() {
    overlayX = 0.01;
    overlayY = 0;
    overlayZ = 0;
    overlayTrajectory = [];
    lorenzOverlayCtx.clearRect(0, 0, lorenzOverlayCanvas.width, lorenzOverlayCanvas.height);
    lorenzOverlay.classList.add("show");
    updateLorenzOverlay();
    setupRotationEvents(lorenzOverlayCanvas);
}

function closeLorenzOverlay() {
    lorenzOverlay.classList.remove("show");
}

openLorenzButton.addEventListener("click", openLorenzOverlay);
lorenzOverlayClose.addEventListener("click", closeLorenzOverlay);

setTimeout(() => {
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.classList.add("visible");
    }, 800);
}, 2500);