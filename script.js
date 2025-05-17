// script.js

// Configuration object for magic numbers
const CONFIG = {
  showAfter: 300,
  throttleWait: 100
};

// Selectors
const SELECTORS = {
  navLinks: 'nav a',
  backToTopClass: 'back-to-top',
  quotesSection: '#quotes-section',
  galleryContainer: '.gallery'
};

// Quotes data
const QUOTES = [
  { text: 'Smile and keep on running.', author: 'Riccardo B.' },
  { text: 'Your limitation—it’s only your imagination.', author: 'Unknown' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  { text: 'Challenges are what make life interesting; overcoming them is what makes life meaningful.', author: 'Joshua J. Marine' },
  { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' }
];

// Initialize site once DOM is loaded
const initSite = () => {
  highlightCurrentNav();
  initBackToTop();
  initQuotesSlider();
  initGalleryLightbox();
};
document.addEventListener('DOMContentLoaded', initSite);

// Highlight active navigation link
const highlightCurrentNav = () => {
  const links = document.querySelectorAll(SELECTORS.navLinks);
  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    link.getAttribute('href') === current
      ? link.setAttribute('aria-current', 'page')
      : link.removeAttribute('aria-current');
  });
};

// Throttle utility
const throttle = (fn, wait = CONFIG.throttleWait) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      fn(...args);
      last = now;
    }
  };
};

// Back-to-top button with passive scroll listener
const initBackToTop = () => {
  const btn = document.createElement('button');
  btn.className = SELECTORS.backToTopClass;
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '⇧';
  document.body.appendChild(btn);

  const toggleVisibility = () => {
    btn.classList.toggle('show', window.scrollY > CONFIG.showAfter);
  };

  window.addEventListener('scroll', throttle(toggleVisibility), { passive: true });
  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
};

// Quotes slider with CSS-driven swap on animationiteration
const initQuotesSlider = () => {
  const section = document.querySelector(SELECTORS.quotesSection);
  if (!section) return;

  let index = 0;
  const textEl   = section.querySelector('#quote-text');
  const authorEl = section.querySelector('#quote-author');
  const prevBtn  = section.querySelector('#prev');
  const nextBtn  = section.querySelector('#next');

  function showQuote() {
    const { text, author } = QUOTES[index];
    textEl.textContent   = `“${text}”`;
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

  // Button controls
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Initial render
  showQuote();

  // Swap on CSS animation loop
  textEl.addEventListener('animationiteration', showNext);
};

// Create quote controls without innerHTML (if used elsewhere)
export const createControls = () => {
  const container = document.createElement('div');
  container.className = 'quote-controls';

  ['prev', 'next'].forEach(dir => {
    const btn = document.createElement('button');
    btn.className = dir;
    btn.setAttribute('aria-label', dir === 'prev' ? 'Previous quote' : 'Next quote');
    btn.textContent = dir === 'prev' ? '←' : '→';
    container.appendChild(btn);
  });

  return container;
};

// Create a lightbox once (factory)
export const createLightbox = () => {
  const modal = document.createElement('div');
  modal.className = 'lightbox-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.tabIndex = 0;
  closeBtn.textContent = '×';

  const imgEl = document.createElement('img');
  imgEl.className = 'lightbox-image';
  imgEl.alt = '';
  imgEl.setAttribute('aria-hidden', 'true');

  const captionEl = document.createElement('div');
  captionEl.className = 'lightbox-caption';

  modal.append(closeBtn, imgEl, captionEl);
  document.body.appendChild(modal);

  return { modal, img: imgEl, caption: captionEl, closeBtn };
};

// Focus trap utility
export const trapFocus = (element) => {
  const focusable = Array.from(
    element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleTab = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTab);
  return () => element.removeEventListener('keydown', handleTab);
};

// Initialize gallery lightbox with event delegation and accessibility
export const initGalleryLightbox = () => {
  const gallery = document.querySelector(SELECTORS.galleryContainer);
  if (!gallery) return;

  const { modal, img, caption, closeBtn } = createLightbox();
  let restoreFocus;
  let lastFocused;

  const openLightbox = (targetImg) => {
    lastFocused = document.activeElement;
    img.src = targetImg.src;
    caption.textContent = targetImg.alt || '';
    img.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'block';
    restoreFocus = trapFocus(modal);
    closeBtn.focus();
  };

  const closeLightbox = () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    img.src = '';
    img.setAttribute('aria-hidden', 'true');
    restoreFocus && restoreFocus();
    lastFocused && lastFocused.focus();
  };

  gallery.addEventListener('click', (e) => {
    const target = e.target.closest('img');
    if (!target) return;
    openLightbox(target);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) {
      closeLightbox();
    }
  });
};
