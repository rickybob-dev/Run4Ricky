// script.js

(() => {
  'use strict';

  const SELECTORS = {
    navLinks: 'nav a',
    backToTopClass: 'back-to-top',
    quotesSection: '#quotes-section',
    galleryImages: '.gallery img'
  };

  const QUOTES = [
    { text: 'Smile and keep on running.', author: 'Riccardo B.' },
    { text: 'Your limitation—it’s only your imagination.', author: 'Unknown' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
    { text: 'Challenges are what make life interesting; overcoming them is what makes life meaningful.', author: 'Joshua J. Marine' },
    { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    highlightCurrentNav();
    initBackToTop();
    initQuotesSlider();
    initGalleryLightbox();
  });

  // Highlight the active navigation link
  function highlightCurrentNav() {
    const links = document.querySelectorAll(SELECTORS.navLinks);
    const current = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
      if (link.getAttribute('href') === current) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Back-to-top button with throttled scroll handler
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = SELECTORS.backToTopClass;
    btn.setAttribute('aria-label', 'Back to top');
    btn.textContent = '⇧';
    document.body.appendChild(btn);

    const toggleVisibility = () => {
      btn.classList.toggle('show', window.scrollY > 300);
    };

    window.addEventListener('scroll', throttle(toggleVisibility, 100));
    btn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  // Simple throttle utility
  function throttle(fn, wait = 100) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        fn(...args);
        last = now;
      }
    };
  }

  // Quotes slider
  function initQuotesSlider() {
    const section = document.querySelector(SELECTORS.quotesSection);
    if (!section) return;

    let index = 0;
    const textEl = section.querySelector('#quote-text');
    const authorEl = section.querySelector('#quote-author');

    // Inject controls
    const controls = section.appendChild(createControls());
    const [prevBtn, nextBtn] = controls.querySelectorAll('button');

    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    // Auto-rotate
    setInterval(showNext, 10000);

    showQuote();

    function showQuote() {
      const { text, author } = QUOTES[index];
      textEl.textContent = `“${text}”`;
      authorEl.textContent = `— ${author}`;
    }
    function showNext() {
      index = (index + 1) % QUOTES.length;
      showQuote();
    }
    function showPrev() {
      index = (index - 1 + QUOTES.length) % QUOTES.length;
      showQuote();
    }
  }

  function createControls() {
    const container = document.createElement('div');
    container.className = 'quote-controls';

    ['prev', 'next'].forEach(dir => {
      const btn = document.createElement('button');
      btn.className = dir;
      btn.setAttribute('aria-label', dir === 'prev' ? 'Previous quote' : 'Next quote');
      container.appendChild(btn);
    });

    return container;
  }

  // Lightbox gallery
  function initGalleryLightbox() {
    const images = document.querySelectorAll(SELECTORS.galleryImages);
    if (!images.length) return;

    const modal = createModal();
    const modalImg = modal.querySelector('.lightbox-image');
    const caption = modal.querySelector('.lightbox-caption');

    images.forEach(img => {
      img.addEventListener('click', () => {
        modal.classList.add('show');
        modalImg.src = img.src;
        caption.textContent = img.alt || '';
      });
    });

    modal.addEventListener('click', e => {
      if (
        e.target.classList.contains('lightbox-modal') ||
        e.target.classList.contains('lightbox-close')
      ) {
        modal.classList.remove('show');
      }
    });
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <span class="lightbox-close" aria-label="Close">&times;</span>
      <img class="lightbox-image" alt="" />
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

})();
