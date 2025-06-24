// script.js — Encapsulated, debounced, and accessible

(() => {
  'use strict';

  const CONFIG = Object.freeze({
    showAfter: 300,         // px to scroll
    quoteInterval: 10000    // ms between quote swaps
  });

  const SELECTORS = {
    navLinks:      'nav a[href^="#"]',
    sections:      'main section[id]',
    backToTop:     '.back-to-top',
    quotesSection: '#quotes-section',
    quoteText:     '#quote-text',
    quoteAuthor:   '#quote-author',
    quotePrev:     '#prev',
    quoteNext:     '#next',
    gallery:       '.gallery',
    timelineItems: '.timeline li'
  };

  const QUOTES = [
    { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
    { text: 'Life is what happens when you’re busy making other plans.', author: 'John Lennon' },
    { text: 'Your time is limited, so don’t waste it living someone else’s life.', author: 'Steve Jobs' }
    // Add more quotes as needed
  ];

  document.addEventListener('DOMContentLoaded', () => {
    try {
      initSite();
    } catch (err) {
      console.error('Initialization error:', err);
    }
  });

  function initSite() {
    highlightCurrentNav();
    initBackToTop();
    initSectionReveals();
    initQuotesSlider();
    initGalleryLightbox();
    initTimeline();   
  }

  function highlightCurrentNav() {
    const sections = document.querySelectorAll(SELECTORS.sections);
    const links    = document.querySelectorAll(SELECTORS.navLinks);
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.target.id) return;
        const link = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting) {
          links.forEach(l => l.removeAttribute('aria-current'));
          link?.setAttribute('aria-current', 'page');
        }
      });
    }, { threshold: 0.6 });
    sections.forEach(s => io.observe(s));
  }

  function initTimeline() {
    const items = document.querySelectorAll(SELECTORS.timelineItems);
    if (!items.length) return;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    items.forEach(item => io.observe(item));
  }

  function initBackToTop() {
    const btn = document.querySelector(SELECTORS.backToTop);
    if (!btn) return;

    window.addEventListener('scroll', throttle(() => {
      btn.classList.toggle('show', window.scrollY > CONFIG.showAfter);
    }, 200));

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initSectionReveals() {
    const secs = document.querySelectorAll(SELECTORS.sections);
    secs.forEach(s => s.classList.add('fade-in'));
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('is-visible');
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.1 });
    secs.forEach(s => io.observe(s));
  }

  function initQuotesSlider() {
    const sec = document.querySelector(SELECTORS.quotesSection);
    if (!sec) return;
    const textEl   = sec.querySelector(SELECTORS.quoteText);
    const authorEl = sec.querySelector(SELECTORS.quoteAuthor);
    let index = 0;

    const showQuote = () => {
      const { text, author } = QUOTES[index];
      textEl.textContent   = `“${text}”`;
      authorEl.textContent = `— ${author}`;
    };

    const next = () => { index = (index + 1) % QUOTES.length; showQuote(); };
    const prev = () => { index = (index - 1 + QUOTES.length) % QUOTES.length; showQuote(); };

    showQuote();
    sec.querySelector(SELECTORS.quoteNext)?.addEventListener('click', next);
    sec.querySelector(SELECTORS.quotePrev)?.addEventListener('click', prev);
    textEl.addEventListener('animationiteration', next);

    new IntersectionObserver(([e]) => {
      const state = e.isIntersecting ? 'running' : 'paused';
      [textEl, authorEl].forEach(el => el.style.animationPlayState = state);
    }).observe(sec);

    sec.addEventListener('mouseenter', () => [textEl, authorEl].forEach(el => el.style.animationPlayState = 'paused'));
    sec.addEventListener('mouseleave', () => [textEl, authorEl].forEach(el => el.style.animationPlayState = 'running'));
  }

  function trapFocus(el) {
    const focusable = Array.from(el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return () => {};
    const first = focusable[0], last = focusable.at(-1);
    const handler = e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }

  function initGalleryLightbox() {
    
   document.body.addEventListener('click', e => {
  const imgEl = e.target.closest('img.timeline-img, .gallery img');
  if (imgEl) openLightbox(imgEl);
});

    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.role = 'dialog'; modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-hidden','true');
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label','Close');
    closeBtn.innerHTML = '&times;';
    const img = document.createElement('img');
    img.className = 'lightbox-image'; img.alt = '';
    img.setAttribute('aria-hidden','true');
    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';

    modal.append(closeBtn, img, caption);
    document.body.append(modal);

    let restoreFocus;
    function openLightbox(target) {
      document.querySelector('main')?.setAttribute('aria-hidden','true');
      restoreFocus = trapFocus(modal);
      img.src = target.src;
      caption.textContent = target.alt || '';
      img.setAttribute('aria-hidden','false');
      modal.setAttribute('aria-hidden','false');
      modal.classList.add('show');
      closeBtn.focus();
    }
    function closeLightbox() {
      modal.setAttribute('aria-hidden','true');
      modal.classList.remove('show');
      img.src = '';
      img.setAttribute('aria-hidden','true');
      document.querySelector('main')?.removeAttribute('aria-hidden');
      restoreFocus?.();
    }

    gallery.addEventListener('click', e => {
      const imgEl = e.target.closest('img');
      if (imgEl) openLightbox(imgEl);
    });
    closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', e => e.target === modal && closeLightbox());
    document.addEventListener('keydown', e => e.key === 'Escape' && modal.classList.contains('show') && closeLightbox());
  }

  function throttle(fn, wait = 100) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) { fn(...args); last = now; }
    };
  }

})();

// ───── Team Carousel Logic (Fixed) ─────
document.addEventListener('DOMContentLoaded', () => {
  let slideIndex = 0;
  const slides = document.querySelectorAll('.carousel-container .carousel-slide');
  const prevBtn = document.querySelector('.carousel-container .prev');
  const nextBtn = document.querySelector('.carousel-container .next');

  function showSlides(n) {
    if (!slides.length) return;
    slideIndex = (n + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.style.display = i === slideIndex ? 'block' : 'none';
    });
  }

  prevBtn?.addEventListener('click', () => showSlides(slideIndex - 1));
  nextBtn?.addEventListener('click', () => showSlides(slideIndex + 1));

  showSlides(slideIndex);
});
