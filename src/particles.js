/********************************************/
/*        Hero Container & Canvas           */
/********************************************/
const hero = document.getElementById('hero');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function isMobile() {
  // Adjust for your breakpoint preference
  return window.innerWidth <= 800;
}

let heroWidth = hero.clientWidth;
let heroHeight = hero.clientHeight;

function resizeCanvas() {
  heroWidth = hero.clientWidth;
  heroHeight = hero.clientHeight;
  canvas.width = heroWidth;
  canvas.height = heroHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/********************************************/
/*          Global / Configurable           */
/********************************************/
// Fewer particles for mobile, more for desktop
const particleCount = isMobile() ? 20 : 100;
// Distance at which particles connect lines
const connectionDistance = isMobile() ? 125 : 200;
// Mouse interaction object
const mouse = {
  x: null,
  y: null,
  radius: 500,   // repulsion/attraction range
  isDown: false,
  downTime: 0
};
// For time-based animations (color shifting, etc.)
let time = 0;

/********************************************/
/*        Set Up Event Listeners            */
/********************************************/
hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
hero.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

hero.addEventListener('mousedown', () => {
  mouse.isDown = true;
  mouse.downTime = performance.now();
});
hero.addEventListener('mouseup', () => {
  mouse.isDown = false;
});


//********************************************/
//          Create Initial Particles
//********************************************/
const particles = [];
for (let i = 0; i < particleCount; i++) {
  // Random base velocity
  const vx = (Math.random() - 0.5) * 0.5;
  const vy = (Math.random() - 0.5) * 0.5;

  // Random size (1–4)
  const size = 1 + Math.random() * 3;

  // Random pastel color (via HSL)
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.random() * 30; // 70%-100%
  const lightness = 70 + Math.random() * 20;  // 70%-90%
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // A random offset for time-based color shifting
  const colorOffset = Math.random() * 360;

  particles.push({
    x: Math.random() * heroWidth,
    y: Math.random() * heroHeight,
    vx: vx,
    vy: vy,
    initVx: vx,
    initVy: vy,
    size: size,
    baseColor: color,  // store initial color
    colorOffset: colorOffset
  });
}

/********************************************/
/*                Animation Loop            */
/********************************************/
function animate() {
  requestAnimationFrame(animate);
  
  // Increment time (used for color oscillation)
  time += 0.5;

  // Create a trailing effect by drawing a semi-transparent
  // rectangle over the whole canvas instead of a full clear.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // or your hero bg color
  ctx.fillRect(0, 0, heroWidth, heroHeight);

  const now = performance.now();
  let inAttractMode = false;

  // Check if mouse is held down < 500ms => "attract" mode
  if (mouse.isDown) {
    const elapsed = now - mouse.downTime;
    if (elapsed < 500) {
      inAttractMode = true;
    } else {
      // Revert velocities
      mouse.isDown = false;
      particles.forEach(p => {
        p.vx = p.initVx;
        p.vy = p.initVy;
      });
    }
  }

  // Update each particle
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // --- 1) Move with velocity ---
    p.x += p.vx;
    p.y += p.vy;

    // --- 2) Mouse interaction (Repel / Attract) ---
    if (mouse.x !== null && mouse.y !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        // "Spring-like" repel, so we smoothly adjust velocity
        const force = (mouse.radius - dist) / mouse.radius;
        const repelStrength = 0.2; // bigger = stronger push
        const fx = (dx / dist) * force * repelStrength;
        const fy = (dy / dist) * force * repelStrength;

        // We "add" to position with a fraction of the force
        // for a softer push than a direct bounce
        p.x += fx;
        p.y += fy;

        // If in attract mode, add a mild pull to velocity
        if (inAttractMode) {
          const attractFactor = 0.0005;
          p.vx -= attractFactor * dx;
          p.vy -= attractFactor * dy;
        }
      }
    }

    // --- 3) Boundary clamping (bounce) ---
    if (p.x < 0) {
      p.x = 0;
      p.vx *= -1;
    } else if (p.x > heroWidth) {
      p.x = heroWidth;
      p.vx *= -1;
    }
    if (p.y < 0) {
      p.y = 0;
      p.vy *= -1;
    } else if (p.y > heroHeight) {
      p.y = heroHeight;
      p.vy *= -1;
    }

    // --- 4) Optional color shift over time ---
    // We'll rotate the hue a bit around the original color offset
    const hueShift = (time * 0.2 + p.colorOffset) % 360;
    // Use the same saturation and lightness as baseColor, but override hue
    // parse out H,S,L from the base color's HSL string:
    // baseColor looks like: "hsl(hue, sat%, light%)"
    // We'll extract sat% and light% with a regex or substring approach.
    const baseColor = p.baseColor;
    const openParenIdx = baseColor.indexOf('(');
    const closeParenIdx = baseColor.indexOf(')');
    const inside = baseColor.substring(openParenIdx + 1, closeParenIdx); 
    // inside looks like "hue, sat%, light%"
    const [origHue, origSat, origLight] = inside.split(',').map(s => s.trim());
    // We'll keep original saturation & lightness:
    const color = `hsl(${hueShift}, ${origSat}, ${origLight})`;

    // --- 5) Draw the particle ---
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 6) Draw lines between particles (with gradient) ---
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p = particles[i];
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance) {
        // lineOpacity decreases with distance
        const lineOpacity = 1 - dist / connectionDistance;
        // Gradient from p to q
        const gradient = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
        // We'll do a simple red-to-blue or you could use color from p & q
        gradient.addColorStop(0, `rgba(255, 0, 0, ${lineOpacity})`);
        gradient.addColorStop(1, `rgba(0, 0, 255, ${lineOpacity})`);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
    }
  }
}

animate();
