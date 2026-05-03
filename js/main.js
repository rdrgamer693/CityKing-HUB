/* ============================================
   CityKing Hub — Main JavaScript
   Particles · Navbar · Theme · Scroll · Forms
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initNavbar();
  initThemeToggle();
  initScrollReveal();
  initParticles();
  initMobileMenu();
});

/* ---------- Loading Screen ---------- */
function initLoading() {
  const loader = document.querySelector('.loading-screen');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
  setTimeout(() => loader.classList.add('hidden'), 3000);
}

/* ---------- Navbar Scroll ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const alwaysScrolled = navbar.classList.contains('scrolled');
  const onScroll = () => {
    if (!alwaysScrolled) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const saved = localStorage.getItem('ck-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(toggle, saved);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ck-theme', next);
    updateThemeIcon(toggle, next);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark'
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Particles ---------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrame;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    animationFrame = requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* ---------- Toast Notification ---------- */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ---------- Form Validation ---------- */
function showValidation(input, message, isError) {
  let msg = input.closest('.form-group').querySelector('.validation-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'validation-msg';
    input.closest('.form-group').appendChild(msg);
  }
  msg.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
  msg.className = `validation-msg show ${isError ? 'error' : 'success'}`;

  const wrapper = input.closest('.input-wrapper');
  if (wrapper) {
    wrapper.style.borderColor = '';
    input.style.borderColor = isError ? 'var(--neon-red)' : 'var(--neon-green)';
  }
}

function clearValidation(input) {
  const msg = input.closest('.form-group').querySelector('.validation-msg');
  if (msg) msg.classList.remove('show');
  input.style.borderColor = '';
}

/* ---------- Password Strength ---------- */
function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 'weak', text: 'Weak', bars: 1 };
  if (score <= 3) return { level: 'medium', text: 'Medium', bars: 3 };
  return { level: 'strong', text: 'Strong', bars: 5 };
}

function updateStrengthUI(password) {
  const bars = document.querySelectorAll('.strength-bar');
  const text = document.querySelector('.strength-text');
  if (!bars.length) return;

  if (!password) {
    bars.forEach(b => { b.className = 'strength-bar'; });
    if (text) text.textContent = '';
    return;
  }

  const result = checkPasswordStrength(password);
  bars.forEach((bar, i) => {
    bar.className = 'strength-bar';
    if (i < result.bars) {
      bar.classList.add('active', result.level);
    }
  });
  if (text) {
    text.textContent = `Password strength: ${result.text}`;
    text.style.color = result.level === 'weak' ? 'var(--neon-red)'
      : result.level === 'medium' ? 'var(--neon-yellow)' : 'var(--neon-green)';
  }
}

/* ---------- Password Toggle ---------- */
function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper').querySelector('input');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.innerHTML = `<i class="fas ${isPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });
  });
}

/* ---------- Copy to Clipboard ---------- */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

/* ---------- News Page — Category Filter ---------- */
function initCategoryFilter() {
  const buttons = document.querySelectorAll('.cat-btn');
  const cards = document.querySelectorAll('.news-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;

      cards.forEach(card => {
        const isHidden = card.dataset.hidden === 'true';
        if ((cat === 'all' || card.dataset.category === cat) && !isHidden) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------- News Page — Load More ---------- */
function initLoadMore() {
  const btn = document.querySelector('.load-more-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const hiddenCards = document.querySelectorAll('.news-card[data-hidden="true"]');
    let shown = 0;
    hiddenCards.forEach(card => {
      if (shown < 3) {
        card.removeAttribute('data-hidden');
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.5s ease';
        shown++;
      }
    });

    const remaining = document.querySelectorAll('.news-card[data-hidden="true"]');
    if (!remaining.length) {
      btn.textContent = 'No More Posts';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    }
  });
}

/* ---------- Smooth Scroll for Anchor Links ---------- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (href === '#' || href.length < 2) return;
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
