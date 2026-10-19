// ============================================================
// Confetti — Canvas-based celebration animations
// ============================================================

const COLORS = ['#d946ef', '#7c3aed', '#f97316', '#f59e0b', '#06b6d4', '#22c55e', '#ef4444'];

export function triggerConfetti(options = {}) {
  const {
    particleCount = 120,
    duration = 3000,
    spread = 70,
    origin = { x: 0.5, y: 0.6 },
    colors = COLORS
  } = options;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none; z-index: 99999;
  `;
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const particles = [];
  const startX = window.innerWidth * origin.x;
  const startY = window.innerHeight * origin.y;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() - 0.5) * spread + Math.PI / 2;
    const velocity = 8 + Math.random() * 12;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * velocity,
      vy: -Math.abs(Math.sin(angle) * velocity) - Math.random() * 4,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      gravity: 0.4,
      opacity: 1,
      decay: 0.008 + Math.random() * 0.005
    });
  }

  const startTime = Date.now();
  let animationId;

  function animate() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0) return;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    if (elapsed < duration) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      canvas.remove();
    }
  }

  animate();
}

export function triggerFireworks(options = {}) {
  const { burstCount = 3, delayBetween = 400 } = options;
  let current = 0;

  const burst = () => {
    triggerConfetti({
      particleCount: 80,
      duration: 2000,
      spread: 360,
      origin: {
        x: 0.2 + Math.random() * 0.6,
        y: 0.3 + Math.random() * 0.3
      }
    });
    current++;
    if (current < burstCount) {
      setTimeout(burst, delayBetween);
    }
  };

  burst();
}

export function triggerSmallConfetti() {
  triggerConfetti({
    particleCount: 60,
    duration: 1500,
    spread: 50,
    origin: { x: 0.5, y: 0.7 }
  });
}
