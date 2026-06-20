document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. GLOBAL ELEMENT SELECTORS
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const themeToggle = document.getElementById('themeToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollToTop = document.getElementById('scrollToTop');
  const cursorGlow = document.getElementById('cursorGlow');
  const typewriterText = document.getElementById('typewriterText');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const particleCanvas = document.getElementById('particleCanvas');
  const progressFills = document.querySelectorAll('.progress-fill');
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  // ==========================================================================
  // 2. CURSOR GLOW TRAIL EFFECT (LERPING)
  // ==========================================================================
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursorGlow() {
    // Linear interpolation for smooth lag effect
    const ease = 0.08;
    glowX += (mouseX - glowX) * ease;
    glowY += (mouseY - glowY) * ease;
    
    if (cursorGlow) {
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(updateCursorGlow);
  }
  updateCursorGlow();

  // ==========================================================================
  // 3. THEME TOGGLE (DARK / LIGHT MODE)
  // ==========================================================================
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    
    // Quick flash effect on canvas
    if (canvasContext) {
      particles = [];
      initParticles();
    }
  });

  // ==========================================================================
  // 4. INTERACTIVE PARTICLES CANVAS BACKGROUND
  // ==========================================================================
  const canvasContext = particleCanvas.getContext('2d');
  let particles = [];
  let particleCount = 60;
  let maxDistance = 120;

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    
    if (window.innerWidth < 768) {
      particleCount = 30;
      maxDistance = 80;
    } else {
      particleCount = 70;
      maxDistance = 120;
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * particleCanvas.width;
      this.y = Math.random() * particleCanvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = Math.random() * 0.6 - 0.3;
      // Get colors based on theme
      const currentTheme = document.documentElement.getAttribute('data-theme');
      this.color = currentTheme === 'dark' ? 'rgba(0, 242, 254, 0.4)' : 'rgba(2, 132, 199, 0.25)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce/Wrap boundaries
      if (this.x < 0 || this.x > particleCanvas.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > particleCanvas.height) this.speedY = -this.speedY;
    }

    draw() {
      canvasContext.fillStyle = this.color;
      canvasContext.beginPath();
      canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      canvasContext.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function animateParticles() {
    canvasContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    // Dynamically retrieve theme line color
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const lineColor = currentTheme === 'dark' ? 'rgba(0, 242, 254, 0.04)' : 'rgba(2, 132, 199, 0.05)';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          canvasContext.strokeStyle = lineColor;
          canvasContext.lineWidth = 1 - dist / maxDistance;
          canvasContext.beginPath();
          canvasContext.moveTo(particles[i].x, particles[i].y);
          canvasContext.lineTo(particles[j].x, particles[j].y);
          canvasContext.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================================================
  // 5. TYPEWRITER EFFECT
  // ==========================================================================
  const professions = [
    'Computer Engineer',
    'Web Developer',
    'Shopify Creator',
    'Wix Studio Designer'
  ];
  let wordIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  let typewriterSpeed = 150;

  function typeEffect() {
    const currentWord = professions[wordIndex];
    if (isDeleting) {
      typewriterText.textContent = currentWord.substring(0, letterIndex - 1);
      letterIndex--;
      typewriterSpeed = 60; // Faster deleting
    } else {
      typewriterText.textContent = currentWord.substring(0, letterIndex + 1);
      letterIndex++;
      typewriterSpeed = 120; // Natural typing speed
    }

    if (!isDeleting && letterIndex === currentWord.length) {
      // Pause at full word
      typewriterSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % professions.length;
      typewriterSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typewriterSpeed);
  }
  
  if (typewriterText) {
    typeEffect();
  }

  // ==========================================================================
  // 6. SCROLL MONITORING (NAVBAR, ACTIVE LINK & PROGRESS)
  // ==========================================================================
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Navbar visual compression
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll progress line width
    const scrolledPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrolledPercent}%`;

    // Back to top button visibility
    if (scrollTop > 500) {
      scrollToTop.classList.add('visible');
    } else {
      scrollToTop.classList.remove('visible');
    }

    // Scrollspy (Active Navigation Link detection)
    const sections = document.querySelectorAll('section');
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  scrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================================================
  // 7. INTERSECTION OBSERVER FOR FADE-IN & PROGRESS FILL
  // ==========================================================================
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(element => {
    scrollObserver.observe(element);
  });

  // Skill Bar filler observer
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillElement = entry.target;
        const targetPercent = fillElement.getAttribute('data-progress');
        fillElement.style.width = targetPercent;
        skillObserver.unobserve(fillElement);
      }
    });
  }, {
    threshold: 0.5
  });

  progressFills.forEach(fill => {
    skillObserver.observe(fill);
  });

  // ==========================================================================
  // 8. MOBILE MENU INTERACTION
  // ==========================================================================
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    mobileMenuToggle.classList.toggle('active');
    
    // Burger rotation transitions
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (mobileMenuToggle.classList.contains('active')) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileMenuToggle.classList.remove('active');
      const spans = mobileMenuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // ==========================================================================
  // 9. INTERACTIVE CONTACT FORM SUBMISSION
  // ==========================================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('btn-submit-form');
      const btnText = submitBtn.querySelector('span');
      const btnIcon = submitBtn.querySelector('svg');
      
      // Visual feedback loading state
      btnText.textContent = 'Sending Message...';
      submitBtn.style.opacity = '0.75';
      submitBtn.style.pointerEvents = 'none';
      btnIcon.style.transform = 'rotate(360deg)';
      btnIcon.style.transition = 'transform 1.5s linear';
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      
      // Perform client side validation check
      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'form-status error';
        
        // Reset button state
        btnText.textContent = 'Send Message';
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
        btnIcon.style.transform = 'none';
        return;
      }
      
      // Simulate API post request delay (1.5 seconds)
      setTimeout(() => {
        formStatus.textContent = `Thank you, ${name}! Your message was successfully sent. I will get back to you shortly.`;
        formStatus.className = 'form-status success';
        
        // Reset form controls
        contactForm.reset();
        
        // Reset button state
        btnText.textContent = 'Send Message';
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
        btnIcon.style.transform = 'none';
        btnIcon.style.transition = 'transform 0.2s ease';
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      }, 1500);
    });
  }
});
