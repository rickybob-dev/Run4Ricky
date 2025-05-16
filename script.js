document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initBackToTop();
  initQuotesSlider();
  initGalleryLightbox();
});

// 1. Highlight the current navigation link
function setActiveNav() {
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// 2. Back-to-top button functionality
function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '&#8679;'; // Up arrow
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 3. Quotes slider with dynamic next/prev controls
function initQuotesSlider() {
  const section = document.getElementById('quotes-section');
  if (!section) return;

  const quotes = [
    { text: "Smile and keep on running.", author: "Riccardo B." },
    { text: "Your limitation—it’s only your imagination.", author: "Unknown" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Challenges are what make life interesting; overcoming them is what makes life meaningful.", author: "Joshua J. Marine" },
    { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" }
  ];

  let currentIndex = 0;
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAuthorEl = document.getElementById('quote-author');

  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'quote-controls';
  const prevBtn = document.createElement('button');
  prevBtn.id = 'prev';
  prevBtn.setAttribute('aria-label', 'Previous quote');
  prevBtn.textContent = '‹';
  const nextBtn = document.createElement('button');
  nextBtn.id = 'next';
  nextBtn.setAttribute('aria-label', 'Next quote');
  nextBtn.textContent = '›';
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  section.appendChild(controls);

  function showQuote() {
    const { text, author } = quotes[currentIndex];
    quoteTextEl.textContent = `“${text}”`;
    quoteAuthorEl.textContent = `— ${author}`;
  }

  // Automatic rotation every 10 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % quotes.length;
    showQuote();
  }, 10000);

  // Manual controls
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % quotes.length;
    showQuote();
  });
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    showQuote();
  });

  // Show the first quote immediately
  showQuote();
}

// 4. Lightbox gallery for images (unchanged logic, styles updated)
function initGalleryLightbox() {
  const images = document.querySelectorAll('.gallery img');
  if (!images.length) return;

  const modal = document.createElement('div');
  modal.className = 'lightbox-modal';
  modal.innerHTML = `
    <span class="lightbox-close" aria-label="Close">&times;</span>
    <img class="lightbox-image" alt="" />
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('.lightbox-image');
  const caption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close');

  images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      modal.classList.add('show');
      modalImg.src = img.src;
      caption.textContent = img.alt;
    });
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
  });
}
