/* ============================================================
   script.js — Cloud Innovators | Cloud Computing Practical Lab 1
   Handles: navbar scroll state, mobile menu, scroll-reveal,
            contact form submission with validation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar: scroll state ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---- Navbar: active page highlight ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Mobile menu toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ---- Scroll-reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ---- Contact form: validation & submission ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {

    // Real-time validation helper
    function validateField(input) {
      const value = input.value.trim();
      let valid = true;
      let msg = '';

      if (input.required && !value) {
        valid = false;
        msg = 'This field is required.';
      } else if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          valid = false;
          msg = 'Please enter a valid email address.';
        }
      } else if (input.name === 'name' && value && value.length < 2) {
        valid = false;
        msg = 'Name must be at least 2 characters.';
      } else if (input.name === 'message' && value && value.length < 10) {
        valid = false;
        msg = 'Message must be at least 10 characters.';
      }

      // Update error display
      let errorEl = input.parentElement.querySelector('.field-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'display:block; font-size:0.78rem; color:#E53E3E; margin-top:0.3rem;';
        input.parentElement.appendChild(errorEl);
      }

      errorEl.textContent = msg;
      input.style.borderColor = valid ? '' : '#E53E3E';

      return valid;
    }

    // Attach real-time validation to each input
    contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.style.borderColor === 'rgb(229, 62, 62)') validateField(input);
      });
    });

    // Form submit
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = contactForm.querySelectorAll('input[required], textarea[required]');
      let allValid = true;

      fields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) return;

      // Simulate submission — in production, replace with fetch() to your endpoint
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Show success state
        contactForm.style.display = 'none';
        const successEl = document.querySelector('.form-success');
        if (successEl) successEl.classList.add('show');
      }, 1400);
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});