/* =========================================
   BIESSESTO DIGITAL — script.js
   Animations, interactions, scroll effects
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------
     1. NAV — Scroll state + burger menu
  ---------------------------------------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = (open) => {
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => toggleMenu(true));
  mobileClose.addEventListener('click', () => toggleMenu(false));
  mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

  // Burger animated state
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
  });
  mobileClose.addEventListener('click', () => {
    burger.classList.remove('active');
  });

  if (nav) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY;
      nav.classList.toggle('scrolled', currentY > 40);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentY > lastScrollY && currentY > 80) {
            nav.classList.add('nav--hidden');
          } else {
            nav.classList.remove('nav--hidden');
          }
          lastScrollY = currentY <= 0 ? 0 : currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ----------------------------------------
     2. REVEAL ON SCROLL — Intersection Observer
  ---------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // Hero fires immediately on load
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
  }, 100);


  /* ----------------------------------------
     3. COUNTER ANIMATION
  ---------------------------------------- */
  const counters = document.querySelectorAll('.stats__num');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current < target) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));


  /* ----------------------------------------
     4. SCROLL TO TOP BUTTON
  ---------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ----------------------------------------
     5. SMOOTH SCROLL for nav links
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ----------------------------------------
     6. ACTIVE NAV LINK on scroll
  ---------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--white)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => activeObserver.observe(section));


  /* ----------------------------------------
     7. FORM SUBMISSION with loading state
  ---------------------------------------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    submitBtn.querySelector('i').className = 'fa fa-spinner fa-spin';

    // Simulate async send
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Success state
    btnText.textContent = 'Request Sent!';
    submitBtn.querySelector('i').className = 'fa fa-check';
    submitBtn.style.background = '#16a34a';
    submitBtn.style.borderColor = '#16a34a';

    // Ripple effect on success
    submitBtn.classList.add('success-pulse');

    // Reset after 3s
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      btnText.textContent = 'Send My Audit Request';
      submitBtn.querySelector('i').className = 'fa fa-arrow-right';
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
      submitBtn.classList.remove('success-pulse');
    }, 3000);
  });


  /* ----------------------------------------
     8. HOVER PARALLAX on hero
  ---------------------------------------- */
  const hero = document.getElementById('hero');
  const heroOverlay = hero.querySelector('.hero__overlay');

  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 12;
    const y = (e.clientY / innerHeight - 0.5) * 8;
    heroOverlay.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroOverlay.style.transform = '';
  });


  /* ----------------------------------------
     9. SERVICE CARD HOVER RIPPLE
  ---------------------------------------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(200,16,46,0.15);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out forwards;
        pointer-events: none;
      `;

      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });


  /* ----------------------------------------
     10. STAGGER service cards on scroll
  ---------------------------------------- */
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, i * 100);
        serviceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  serviceCards.forEach(card => serviceObserver.observe(card));


  /* ----------------------------------------
     11. PLACEHOLDER IMAGE TOOLTIP on hover
  ---------------------------------------- */
  document.querySelectorAll('.img-placeholder').forEach(placeholder => {
    placeholder.style.cursor = 'help';
    placeholder.title = placeholder.dataset.prompt
      ? `AI Prompt: ${placeholder.dataset.prompt}`
      : 'Image placeholder';
  });


  /* ----------------------------------------
     12. FORM INPUT FOCUS animation
  ---------------------------------------- */
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
      input.parentElement.style.transition = 'transform 0.2s ease';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = '';
    });
  });


  /* ----------------------------------------
     13. LOGO CLICK — back to top
  ---------------------------------------- */
  document.querySelector('.nav__logo').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ----------------------------------------
     14. PAGE LOAD ANIMATION sequence
  ---------------------------------------- */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

});