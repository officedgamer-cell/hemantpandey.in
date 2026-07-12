const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let w = 0;
let h = 0;
let particles = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(90, Math.floor(w / 16)) }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.6,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6,
    color: Math.random() > 0.5 ? '#56e7ff' : '#ff5ea0'
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach((p, i) => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > w) p.dx *= -1;
    if (p.y < 0 || p.y > h) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist / 120)})`;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
  resizeCanvas();
  drawParticles();
});

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

document.getElementById('year').textContent = new Date().getFullYear();