document.addEventListener("DOMContentLoaded", () => {
  const quotes = [
    { text: "Smile and keep on running.", author: "Riccardo B." },
    { text: "Your limitation—it’s only your imagination.", author: "Unknown" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Challenges are what make life interesting; overcoming them is what makes life meaningful.", author: "Joshua J. Marine" },
    { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" }
  ];

  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const btnNext = document.getElementById("next");
  const btnPrev = document.getElementById("prev");
  let currentIndex = 0;

  // Fade settings
  const fadeDuration = 600; // in ms

  // Initialize styles for fade
  [quoteText, quoteAuthor].forEach(el => {
    el.style.opacity = 1;
    el.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
  });

  // Apply quote text + author
  function applyQuote(index) {
    const q = quotes[index];
    quoteText.textContent = `“${q.text}”`;
    quoteAuthor.textContent = `— ${q.author}`;
  }

  // Fade out current, update, then fade in
  function fadeToQuote(index) {
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;
    setTimeout(() => {
      applyQuote(index);
      quoteText.style.opacity = 1;
      quoteAuthor.style.opacity = 1;
    }, fadeDuration);
  }

  // Initial display
  applyQuote(currentIndex);

  // Auto-cycle every 10 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % quotes.length;
    fadeToQuote(currentIndex);
  }, 10000);

  // Button controls
  btnNext.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % quotes.length;
    fadeToQuote(currentIndex);
  });

  btnPrev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    fadeToQuote(currentIndex);
  });
});
