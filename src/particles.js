 /********************************************/
    /*        Hero Container & Canvas           */
    /********************************************/
    const hero = document.getElementById('hero');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

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
    /*              Particle Setup              */
    /********************************************/
    const particles = [];
    const particleCount = 85;
    const connectionDistance = 200;

    // Mouse object:
    // - isDown: if mouse button is pressed
    // - downTime: record time pressed
    // - x,y: cursor coordinates
    const mouse = {
      x: null,
      y: null,
      radius: 500,   // repulsion distance
      isDown: false,
      downTime: 0
    };

    // Listen for mouse movement relative to the hero
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // On mouse down
    hero.addEventListener('mousedown', () => {
      mouse.isDown = true;
      mouse.downTime = performance.now();
    });
    // On mouse up
    hero.addEventListener('mouseup', () => {
      mouse.isDown = false;
      // after 0.5s, we revert, see logic in the animation loop
    });

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;

      particles.push({
        x: Math.random() * heroWidth,
        y: Math.random() * heroHeight,
        vx: vx,
        vy: vy,
        initVx: vx, // store for reset
        initVy: vy,
        size: 2
      });
    }

    /********************************************/
    /*            Animation Loop                */
    /********************************************/
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, heroWidth, heroHeight);

      const now = performance.now();
      let inAttractMode = false;

      if (mouse.isDown) {
        // how long since mousedown?
        const elapsed = now - mouse.downTime;
        if (elapsed < 500) {
          // within 0.5s => attraction mode
          inAttractMode = true;
        } else {
          // revert velocities
          mouse.isDown = false; 
          particles.forEach(p => {
            p.vx = p.initVx;
            p.vy = p.initVy;
          });
        }
      }

      particles.forEach((p, index) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on edges
        if (p.x < 0 || p.x > heroWidth) p.vx *= -1;
        if (p.y < 0 || p.y > heroHeight) p.vy *= -1;

        // If mouse in hero
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            // Repel: push away
            const force = (mouse.radius - dist) / mouse.radius;
            const fx = (dx / dist) * force * 2.0; 
            const fy = (dy / dist) * force * 2.0;
            p.x += fx;
            p.y += fy;

            // If in attract mode, add a mild pull
            if (inAttractMode) {
              const attractFactor = 0.001; 
              p.vx -= attractFactor * dx;
              p.vy -= attractFactor * dy;
            }
          }
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(75, 85, 99, 0.8)';
        ctx.fill();

        // Connections
        for (let j = index + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx2 = p.x - q.x;
          const dy2 = p.y - q.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < connectionDistance) {
            const lineOpacity = 1 * (1 - dist2 / connectionDistance);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(75,85,99,${lineOpacity})`;
            ctx.stroke();
          }
        }
      });
    }

    animate();