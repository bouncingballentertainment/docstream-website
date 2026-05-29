/* DocStream PDF-Cloud — Marketing Website JS */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 50;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Smooth scroll for internal anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navbarHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });

  /* ---- Contact form with Formspree ---- */
  const form       = document.getElementById('contact-form');
  const statusDiv  = document.getElementById('form-status');
  const submitBtn  = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Warn if Formspree endpoint hasn't been configured yet
      if (form.action.includes('YOUR_FORM_ID')) {
        statusDiv.textContent =
          'Atenção: configure o ID do Formspree no arquivo index.html para ativar o envio de formulários. ' +
          'Registre-se gratuitamente em formspree.io';
        statusDiv.className = 'form-status form-status--error';
        return;
      }

      // Visual loading state
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Enviando...</span>';
      statusDiv.textContent = '';
      statusDiv.className   = 'form-status';

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          statusDiv.textContent = '✔ Mensagem enviada com sucesso! Entraremos em contato em breve.';
          statusDiv.className   = 'form-status form-status--success';
          form.reset();
        } else {
          const json = await response.json().catch(() => ({}));
          const msg  = json.errors
            ? json.errors.map(function (err) { return err.message; }).join(', ')
            : 'Não foi possível enviar a mensagem. Tente novamente.';
          statusDiv.textContent = '✖ ' + msg;
          statusDiv.className   = 'form-status form-status--error';
        }
      } catch (_err) {
        statusDiv.textContent = '✖ Erro de conexão. Verifique sua internet e tente novamente, ou entre em contato pelo WhatsApp.';
        statusDiv.className   = 'form-status form-status--error';
      } finally {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /* ---- Scroll-reveal animation (lightweight, no lib) ---- */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity .5s ease, transform .5s ease; }
      .reveal.visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    // Animate cards and section headers on scroll
    document.querySelectorAll('.card, .section-header, .stat, .benefits-list li, .screenshot-item')
      .forEach(function (el, i) {
        el.classList.add('reveal');
        // Stagger siblings within the same parent
        el.style.transitionDelay = ((i % 4) * 80) + 'ms';
        observer.observe(el);
      });
  }

})();
