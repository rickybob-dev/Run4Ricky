// Fully revised script.js

// Configuration
const CONFIG = {
  showAfter: 300,         // px scrolled before showing back-to-top
  quoteInterval: 10000    // ms between automatic quote swaps (via CSS animation)
};

// Selectors
const SELECTORS = {
  navLinks:        'nav a[href^="#"]',
  sections:        'main section[id]',
  backToTop:       '.back-to-top',
  fadeIn:          '.fade-in',
  quotesSection:   '#quotes-section',
  quoteText:       '#quote-text',
  quoteAuthor:     '#quote-author',
  quotePrev:       '#prev',
  quoteNext:       '#next',
  gallery:         '.gallery'
};

// Quotes data
const QUOTES = [
  { text: 'Smile and keep on running.', author: 'Riccardo B.' },
  { text: 'Your limitation—it’s only your imagination.', author: 'Unknown' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  { text: 'Challenges are what make life interesting; overcoming... is what makes life meaningful.', author: 'Joshua J. Marine' },
  { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' }
];

// Bootstrap
document.addEventListener('DOMContentLoaded', initSite);

function initSite() {
  highlightCurrentNav();
  initBackToTop();
  initSectionReveals();
  initQuotesSlider();
  initGalleryLightbox();
}

// Highlight nav links based on scroll position
function highlightCurrentNav() {
  const sections = document.querySelectorAll(SELECTORS.sections);
  const links    = document.querySelectorAll(SELECTORS.navLinks);

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.target.id) return;
      const link = document.querySelector(`nav a[href="#${entry.target.id}"]`);
      if (entry.isIntersecting) {
        links.forEach(l => l.removeAttribute('aria-current'));
        link && link.setAttribute('aria-current', 'page');
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(sec => io.observe(sec));
}

// Back-to-top button
function initBackToTop() {
  const btn = document.querySelector(SELECTORS.backToTop);
  if (!btn) return;

  // Sentinel to observe scroll
  const sentinel = document.createElement('div');
  sentinel.style.position = 'absolute';
  sentinel.style.top      = `${CONFIG.showAfter}px`;
  document.body.prepend(sentinel);

  const io = new IntersectionObserver(([e]) => {
    btn.classList.toggle('show', !e.isIntersecting);
  });
  io.observe(sentinel);

  btn.addEventListener('click', () => window.scrollTo({ top: 0 }));
}

// Reveal sections on scroll
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

// Quotes slider with CSS-driven animation
function initQuotesSlider() {
  const section = document.querySelector(SELECTORS.quotesSection);
  if (!section) return;

  const textEl   = section.querySelector(SELECTORS.quoteText);
  const authorEl = section.querySelector(SELECTORS.quoteAuthor);
  const prevBtn  = section.querySelector(SELECTORS.quotePrev);
  const nextBtn  = section.querySelector(SELECTORS.quoteNext);
  let index = 0;

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

  showQuote();
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);
  textEl.addEventListener('animationiteration', showNext);

  // Pause/resume on visibility
  const ioq = new IntersectionObserver(([e]) => {
    const paused = !e.isIntersecting;
    [textEl, authorEl].forEach(el => el.style.animationPlayState = paused ? 'paused' : 'running');
  });
  ioq.observe(section);

  // Pause/resume on hover
  section.addEventListener('mouseenter', () => [textEl, authorEl].forEach(el => el.style.animationPlayState = 'paused'));
  section.addEventListener('mouseleave', () => [textEl, authorEl].forEach(el => el.style.animationPlayState = 'running'));
}

// Accessibility: trap focus within an element
function trapFocus(element) {
  const focusable = Array.from(
    element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  );
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  function handleTab(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  element.addEventListener('keydown', handleTab);
  return () => element.removeEventListener('keydown', handleTab);
}

// Gallery lightbox
function initGalleryLightbox() {
  const gallery = document.querySelector(SELECTORS.gallery);
  if (!gallery) return;

  // Build modal
  const modal = document.createElement('div');
  modal.className = 'lightbox-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';

  const img     = document.createElement('img');
  img.className = 'lightbox-image';
  img.setAttribute('alt', '');
  img.setAttribute('aria-hidden', 'true');

  const caption = document.createElement('div');
  caption.className = 'lightbox-caption';

  modal.append(closeBtn, img, caption);
  document.body.appendChild(modal);

  let restoreFocus = null;

  function openLightbox(target) {
    restoreFocus = trapFocus(modal);
    img.src = target.src;
    caption.textContent = target.alt || '';
    img.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('show');
    closeBtn.focus();
  }

  function closeLightbox() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('show');
    img.src = '';
    img.setAttribute('aria-hidden', 'true');
    restoreFocus && restoreFocus();
  }

  gallery.addEventListener('click', e => {
    const imgEl = e.target.closest('img');
    imgEl && openLightbox(imgEl);
  });
  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', e => e.target === modal && closeLightbox());
  document.addEventListener('keydown', e => e.key === 'Escape' && modal.classList.contains('show') && closeLightbox());
}
