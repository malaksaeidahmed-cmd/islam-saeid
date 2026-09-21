// 1. Splash Screen
window.addEventListener('load', () => {
  const splash = document.getElementById('introSplash');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
      setTimeout(() => splash.remove(), 600);
    }, 450);
  }
});

// 2. Year update
document.getElementById('currentYear').textContent = new Date().getFullYear();

// 3. Scroll progress
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById('progressBar').style.width = ((winScroll / height) * 100) + '%';
}, { passive: true });

// 4. Custom Cursor
const cursorDot = document.getElementById('cursorDot');
const cursorCircle = document.getElementById('cursorCircle');
if (window.innerWidth >= 1024 && cursorDot && cursorCircle) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorCircle.style.left = `${e.clientX}px`;
    cursorCircle.style.top = `${e.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('a, button, input, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorCircle.style.width = '48px';
      cursorCircle.style.height = '48px';
      cursorCircle.style.borderColor = '#F97316';
    });
    el.addEventListener('mouseleave', () => {
      cursorCircle.style.width = '32px';
      cursorCircle.style.height = '32px';
      cursorCircle.style.borderColor = 'rgba(217, 70, 239, 0.65)';
    });
  });
}

// 5. Canvas Particles
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.5 ? '#7C3AED' : '#D946EF';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const count = Math.min(35, Math.floor((window.innerWidth * window.innerHeight) / 30000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// 6. Counters Animation
const counters = document.querySelectorAll('.counter');
let counted = false;
window.addEventListener('scroll', () => {
  const hero = document.getElementById('home');
  if (hero && hero.getBoundingClientRect().top <= window.innerHeight && !counted) {
    counters.forEach(c => {
      const target = +c.getAttribute('data-target');
      let val = 0;
      const inc = target / 30;
      const run = () => {
        val += inc;
        if (val < target) {
          c.innerText = Math.ceil(val);
          setTimeout(run, 30);
        } else {
          c.innerText = target;
        }
      };
      run();
    });
    counted = true;
  }
}, { passive: true });

// 7. Early Bird Timer (48 Hours)
let secondsLeft = 48 * 3600;
const timerEl = document.getElementById('earlyBirdTimer');
if (timerEl) {
  setInterval(() => {
    if (secondsLeft > 0) secondsLeft--;
    const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
    const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// 8. Ticker Trigger (يظهر مرتين فقط للزائر)
const ticker = document.getElementById('interviewTicker');
if (ticker) {
  let countTicker = 0;
  const tInterval = setInterval(() => {
    if (countTicker < 2) {
      ticker.classList.remove('opacity-0', 'translate-y-4');
      setTimeout(() => ticker.classList.add('opacity-0', 'translate-y-4'), 4000);
      countTicker++;
    } else {
      clearInterval(tInterval);
    }
  }, 12000);
}

// 9. Course Form Submit
const form = document.getElementById('waitlistForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('subName').value;
    const phone = document.getElementById('subPhone').value;
    const field = document.getElementById('subField').value;
    form.classList.add('hidden');
    document.getElementById('waitlistSuccess').classList.remove('hidden');
    setTimeout(() => {
      const text = encodeURIComponent(`مرحباً إسلام، أنا ${name} أرسلت طلب ترشح للمقابلة الشخصية للبرنامج التدريبي الأوفلاين في القاهرة (الدفعة المغلقة - 20 مقعداً). صفتي: [${field}] ورقمي: ${phone}.`);
      window.open(`https://wa.me/201021252183?text=${text}`, '_blank');
    }, 1200);
  });
}

// 10. Mobile Menu
const mBtn = document.getElementById('mobileMenuBtn');
const mMenu = document.getElementById('mobileMenu');
if (mBtn && mMenu) {
  mBtn.addEventListener('click', () => mMenu.classList.toggle('hidden'));
  mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mMenu.classList.add('hidden')));
}
