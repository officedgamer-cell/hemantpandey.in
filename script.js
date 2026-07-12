const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let w = 0;
let h = 0;
let particles = [];

const typingText = document.getElementById('typingText');
const phrases = [
  'I build modern websites with HTML, CSS, JavaScript, and Python.',
  'I enjoy design, animation, and creating experiences that feel alive.',
  'I turn ideas into polished personal brands and interactive web pages.'
];

const languages = ['HTML5', 'CSS3', 'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'GitHub'];
const projects = [
  {
    title: 'Animated Portfolio',
    description: 'A high-impact personal website with motion, media, and layered visual storytelling.',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    link: '#contact'
  },
  {
    title: 'Creative Landing Page',
    description: 'A premium landing experience built with elegant sections, responsive layout, and smooth interactions.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    link: '#about'
  },
  {
    title: 'Media Showcase',
    description: 'A gallery and video-rich layout designed to present photos, clips, and content with style.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    link: '#media'
  }
];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(110, Math.floor(w / 14)) }, () => ({
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

function typeText() {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const current = phrases[phraseIndex];
    typingText.textContent = current.slice(0, charIndex);

    if (!isDeleting && charIndex < current.length) {
      charIndex += 1;
    } else if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      setTimeout(tick, 1400);
      return;
    } else if (isDeleting && charIndex > 0) {
      charIndex -= 1;
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(tick, isDeleting ? 50 : 80);
  };

  tick();
}

function renderLanguageTags() {
  const container = document.getElementById('languageTags');
  container.innerHTML = languages.map((item) => `<span>${item}</span>`).join('');
}

function renderProjects() {
  const container = document.getElementById('projectGrid');
  container.innerHTML = projects.map((project) => `
    <article class="project-card">
      <img src="${project.image}" alt="${project.title}" />
      <div class="project-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a class="project-link" href="${project.link}">Explore</a>
      </div>
    </article>
  `).join('');
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 22));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = target + (target === 100 ? '%' : '');
          clearInterval(timer);
        } else {
          element.textContent = current + (target === 100 ? '%' : '');
        }
      }, 50);
      observer.unobserve(element);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => observer.observe(counter));
}

function initReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
}

const themeToggle = document.getElementById('themeToggle');
function updateThemeButton() {
  themeToggle.textContent = document.body.classList.contains('theme-light') ? '🌙' : '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('theme-light');
  updateThemeButton();
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
  resizeCanvas();
  drawParticles();
  typeText();
  renderLanguageTags();
  renderProjects();
  animateCounters();
  initReveal();
  updateThemeButton();
});

window.addEventListener('scroll', () => {
  const progressBar = document.querySelector('.scroll-progress');
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = `${percent}%`;
});

document.getElementById('year').textContent = new Date().getFullYear();