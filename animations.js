/* ==========================================================================
   CR3CKA SECURITY — animations.js
   Loading screen, backgrounds, navbar behaviour, theme toggle,
   scroll reveal, animated counters, hero typing effect.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Loading screen
     --------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;
    setTimeout(() => loader.classList.add('hidden'), 500);
  });

  /* ---------------------------------------------------------------------
     Theme toggle (persists for the session only — no localStorage per
     artifact/output constraints; falls back gracefully on static hosting)
     --------------------------------------------------------------------- */
  const themeToggle = document.querySelectorAll('[data-theme-toggle]');
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.forEach((btn) => {
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      const icon = btn.querySelector('[data-icon]');
      if (icon) icon.textContent = theme === 'light' ? '🌙' : '☀️';
    });
  }

  themeToggle.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(current);
    });
  });

  /* ---------------------------------------------------------------------
     Navbar: scroll shadow + active link + mobile toggle
     --------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    toggleBackToTop();
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      })
    );
  }

  // Highlight active section link on the landing page
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach((a) => a.classList.remove('active'));
          const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (match) match.classList.add('active');
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------------------
     Back to top
     --------------------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 600);
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Animated counters
     --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------------------
     Skill bar fill on reveal
     --------------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.width = entry.target.dataset.width;
          skillObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    skillBars.forEach((b) => skillObserver.observe(b));
  }

  /* ---------------------------------------------------------------------
     Hero terminal typing effect
     --------------------------------------------------------------------- */
  const typedEl = document.getElementById('typed-cmd');
  if (typedEl) {
    const commands = [
      'nmap -sV -p- target.io',
      'nuclei -u https://target.io -severity high',
      'subfinder -d target.io -silent',
      'python3 recon.py --osint --domain target.io',
    ];
    let cmdIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = commands[cmdIndex];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          cmdIndex = (cmdIndex + 1) % commands.length;
        }
      }
      setTimeout(typeLoop, deleting ? 28 : 46);
    }
    typeLoop();
  }

  /* ---------------------------------------------------------------------
     Lightweight matrix rain (canvas)
     --------------------------------------------------------------------- */
  const matrixCanvas = document.getElementById('matrix-canvas');
  if (matrixCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = matrixCanvas.getContext('2d');
    const glyphs = 'アイウエオカキクケコサシスセソ01337#$%&';
    let columns, drops, fontSize = 15;

    function sizeCanvas() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      columns = Math.floor(matrixCanvas.width / fontSize);
      drops = new Array(columns).fill(1);
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    function draw() {
      ctx.fillStyle = 'rgba(5, 7, 13, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    setInterval(draw, 55);
  }

  /* ---------------------------------------------------------------------
     Ambient particle field (canvas)
     --------------------------------------------------------------------- */
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];

    function sizeCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    const count = Math.min(60, Math.floor(window.innerWidth / 22));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }
})();
