/* ============================================================
   CKN Nonstop – main.js
   Sections:
     1. Mobile menu toggle
     2. Sticky header shadow on scroll
     3. Smooth scroll for anchor links
     4. Contact form validation & fake submit
     5. Scroll-reveal animation (Intersection Observer)
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────
   1. MOBILE MENU TOGGLE
   ──────────────────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  // Close menu when any mobile nav link is clicked
  const links = menu.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');

  function openMenu() {
    btn.classList.add('is-open');
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    btn.classList.remove('is-open');
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', function () {
    const isOpen = btn.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  links.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}());

/* ────────────────────────────────────────────
   2. STICKY HEADER – add shadow/blur on scroll
   ──────────────────────────────────────────── */
(function initStickyHeader() {
  var header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(10,10,15,0.95)';
    } else {
      header.style.background = 'rgba(10,10,15,0.8)';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}());

/* ────────────────────────────────────────────
   3. SMOOTH SCROLL FOR ANCHOR LINKS
      (Polyfill for browsers without native support)
   ──────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var headerHeight = document.getElementById('header')
        ? document.getElementById('header').offsetHeight
        : 68;

      var targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}());

/* ────────────────────────────────────────────
   4. CONTACT FORM VALIDATION & FAKE SUBMIT
   ──────────────────────────────────────────── */
(function initContactForm() {
  var form    = document.getElementById('contact-form');
  var btnSubmit = document.getElementById('form-submit-btn');
  var success = document.getElementById('form-success');
  var error   = document.getElementById('form-error');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name  = (document.getElementById('form-name')  || {}).value || '';
    var phone = (document.getElementById('form-phone') || {}).value || '';

    // Hide previous messages
    if (success) success.hidden = true;
    if (error)   error.hidden   = true;

    // Basic validation
    if (!name.trim() || !phone.trim()) {
      if (error) error.hidden = false;
      return;
    }

    if (btnSubmit) {
      btnSubmit.disabled    = true;
      btnSubmit.textContent = 'Odesílám…';
    }

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      if (response.status == 200) {
        if (success) success.hidden = false;
        form.reset();
      } else {
        if (error) error.hidden = false;
      }
    })
    .catch(err => {
      if (error) error.hidden = false;
    })
    .then(function() {
      if (btnSubmit) {
        btnSubmit.disabled    = false;
        btnSubmit.textContent = 'Odeslat poptávku';
      }
      setTimeout(() => {
        if (success) success.hidden = true;
      }, 5000);
    });
  });
}());

/* ────────────────────────────────────────────
   5. SCROLL-REVEAL ANIMATION
      Adds .is-visible class when elements enter viewport
   ──────────────────────────────────────────── */
(function initScrollReveal() {
  // Add reveal class to target elements
  var selectors = [
    '.service-card',
    '.step',
    '.pricing-card',
    '.ref-item',
    '.stat',
    '.contact-item',
    '.section-header',
    '.hero__badge',
    '.hero__stats',
    '.trust__logo',
    '.cta-banner__text',
    '.cta-banner__actions',
  ];

  var elements = document.querySelectorAll(selectors.join(', '));

  // Apply initial hidden state via inline style (keeps CSS clean)
  elements.forEach(function (el) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)';
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    elements.forEach(function (el) {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}());

/* ────────────────────────────────────────────
   6. HERO TYPING ANIMATION
   ──────────────────────────────────────────── */
(function initTypingAnimation() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const words = ["koberců", "čalounění", "podlah", "matrací", "interiérů aut"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 150;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 60;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before next word
    }

    setTimeout(type, typeSpeed);
  }

  // Clear initial content and start typing
  target.textContent = '';
  setTimeout(type, 1000);
}());
