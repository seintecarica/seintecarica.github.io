/* ═══════════════════════════════════════════════════════
   PORTFOLIO — Main JavaScript
   Theme toggle, mobile menu, scroll animations, nav state
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── DOM References ──
  const html = document.documentElement;
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const themeToggle = document.getElementById('themeToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // ═══════════════════════════════════════════
  // 1. THEME TOGGLE
  // ═══════════════════════════════════════════
  const THEME_KEY = 'portfolio-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ═══════════════════════════════════════════
  // 2. MOBILE MENU
  // ═══════════════════════════════════════════
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ═══════════════════════════════════════════
  // 3. NAVBAR SCROLL EFFECT
  // ═══════════════════════════════════════════
  let lastScrollY = 0;

  function handleNavScroll() {
    const currentScrollY = window.scrollY;

    // Add shadow when scrolled
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ═══════════════════════════════════════════
  // 4. ACTIVE NAV LINK ON SCROLL
  // ═══════════════════════════════════════════
  function updateActiveNav() {
    let currentSection = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ═══════════════════════════════════════════
  // 5. SCROLL REVEAL ANIMATIONS
  // ═══════════════════════════════════════════
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));

  // ═══════════════════════════════════════════
  // 6. SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ═══════════════════════════════════════════
  // 7. CONTACT FORM (basic handling)
  // ═══════════════════════════════════════════
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    // If using Formspree or similar, let the form submit normally.
    // For demo purposes, prevent default and show feedback.
    const action = contactForm.getAttribute('action');
    if (action.includes('TU_FORM_ID')) {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }
  });

  // ═══════════════════════════════════════════
  // 8. PARALLAX-LIKE EFFECT ON HERO SHAPES
  // ═══════════════════════════════════════════
  const shapes = document.querySelectorAll('.shape');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
      const factor = (i + 1) * 8;
      shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });

  // ═══════════════════════════════════════════
  // 9. TYPED EFFECT ON HERO TITLE (subtle)
  // ═══════════════════════════════════════════
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const titles = [
      'Desarrollando soluciones web escalables',
      'Especialista en Backend y Arquitectura Web',
      'Apasionado por MLOps & Data Engineering',
      'Construyendo soluciones con impacto real',
      'Transformando ideas en software de calidad',
      'Automatizando procesos mediante CI/CD',
      'Integrando APIs REST y servicios empresariales',
      'Creando aplicaciones robustas con Laravel y .NET',
      'Desarrollando plataformas para Gobierno y Empresas',
      'Cloud Developer con experiencia en AWS',
      'Databricks & Machine Learning Deployment',
      'Impulsando proyectos mediante metodologías ágiles',
      'Del análisis al despliegue en producción',
      'Construyendo software mantenible y escalable',
      'Especializado en integración de sistemas',
      'Convirtiendo requerimientos en soluciones digitales',
      'Desarrollando experiencias web modernas',
      'Backend, Frontend y soluciones Cloud',
      'Código limpio, soluciones eficientes',
      'Más de 15 años desarrollando software',
      'Experiencia en Salud, Gobierno, Educación y Finanzas',
      'Optimizando procesos mediante tecnología',
      'De la idea al producto final'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    function typeEffect() {
      const current = titles[titleIndex];

      if (isDeleting) {
        heroTitle.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        heroTitle.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 30 : 60;

      if (!isDeleting && charIndex === current.length) {
        speed = 2500; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        speed = 400;
      }

      typingTimeout = setTimeout(typeEffect, speed);
    }

    // Start typing after initial animation
    setTimeout(typeEffect, 2000);
  }
});
