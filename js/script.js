// Run4Ricky — interaction layer. Vanilla, accessible, reduced-motion aware.
(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    try {
      initNav();
      initReveal();
      initParallax();
      initQuotes();
      initLightbox();
      initCarousel();
    } catch (err) {
      console.error('init error:', err);
    }
  });

  /* ---- mobile nav ---- */
  function initNav() {
    const nav = $('.nav');
    const btn = $('.nav-toggle', nav);
    if (!nav || !btn) return;
    const set = (open) => {
      nav.dataset.open = String(open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => set(nav.dataset.open !== 'true'));
    $$('.nav-links a', nav).forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 760) set(false); });
  }

  /* ---- scroll reveal ---- */
  function initReveal() {
    // index each stagger group's children for CSS transition-delay
    $$('.stagger').forEach(group => {
      Array.from(group.children).forEach((child, n) => child.style.setProperty('--i', n));
    });
    const items = $$('.reveal');
    if (!items.length) return;
    if (reduce.matches || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    items.forEach(el => io.observe(el));
  }

  /* ---- hero parallax ---- */
  function initParallax() {
    const layers = $$('[data-parallax]');
    if (!layers.length || reduce.matches) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      layers.forEach(l => {
        const rate = parseFloat(l.dataset.parallax) || 0.15;
        l.style.transform = `translate3d(0, ${y * rate}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---- quotes ---- */
  const QUOTES = [
    { t: 'The only limit to our realization of tomorrow is our doubts of today.', a: 'Franklin D. Roosevelt' },
    { t: 'It always seems impossible until it is done.', a: 'Nelson Mandela' },
    { t: 'A hero is an ordinary individual who finds the strength to persevere in spite of overwhelming obstacles.', a: 'Christopher Reeve' },
    { t: 'Fall seven times, stand up eight.', a: 'Japanese proverb' },
    { t: 'Your time is limited, so do not waste it living someone else’s life.', a: 'Steve Jobs' },
    { t: 'Once you choose hope, anything is possible.', a: 'Christopher Reeve' }
  ];
  function initQuotes() {
    const sec = $('#quotes-section');
    if (!sec) return;
    const text = $('#quote-text', sec);
    const author = $('#quote-author', sec);
    let i = 0, timer = null;
    const show = () => {
      const q = QUOTES[i];
      text.textContent = `“${q.t}”`;
      author.textContent = `— ${q.a}`;
    };
    const go = (n) => { i = (n + QUOTES.length) % QUOTES.length; show(); };
    const start = () => { if (!reduce.matches) timer = setInterval(() => go(i + 1), 8000); };
    const stop = () => { clearInterval(timer); timer = null; };
    $('#next', sec)?.addEventListener('click', () => { go(i + 1); stop(); start(); });
    $('#prev', sec)?.addEventListener('click', () => { go(i - 1); stop(); start(); });
    sec.addEventListener('mouseenter', stop);
    sec.addEventListener('mouseleave', start);
    sec.addEventListener('focusin', stop);
    sec.addEventListener('focusout', start);
    show(); start();
  }

  /* ---- lightbox with gallery navigation (images + video) ---- */
  function initLightbox() {
    const modal = document.createElement('div');
    modal.className = 'lightbox';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<button class="lightbox-close" aria-label="Close">×</button>' +
      '<span class="lb-count" aria-hidden="true"></span>' +
      '<button class="lb-nav lb-prev" aria-label="Previous">‹</button>' +
      '<div class="lb-media"></div>' +
      '<button class="lb-nav lb-next" aria-label="Next">›</button>' +
      '<p class="lightbox-caption"></p>';
    document.body.appendChild(modal);

    const mediaBox = $('.lb-media', modal);
    const cap      = $('.lightbox-caption', modal);
    const count    = $('.lb-count', modal);
    const prevBtn  = $('.lb-prev', modal);
    const nextBtn  = $('.lb-next', modal);
    const closeBtn = $('.lightbox-close', modal);
    let group = [], gi = 0, lastFocus = null;

    // Turn a gallery .tile into a media item
    const itemFromTile = (t) => t.dataset.video
      ? { type: 'video', src: t.dataset.video, poster: t.dataset.poster || '',
          cap: t.getAttribute('aria-label') || t.querySelector('img')?.alt || '' }
      : { type: 'image', src: t.dataset.full || t.querySelector('img')?.src || '',
          cap: t.querySelector('img')?.alt || '' };

    const render = () => {
      const it = group[gi];
      if (!it) return;
      mediaBox.textContent = '';
      let node;
      if (it.type === 'video') {
        node = document.createElement('video');
        node.src = it.src;
        if (it.poster) node.poster = it.poster;
        node.controls = true; node.autoplay = true; node.playsInline = true;
      } else {
        node = document.createElement('img');
        node.src = it.src; node.alt = it.cap;
      }
      mediaBox.appendChild(node);
      cap.textContent = it.cap;
      const multi = group.length > 1;
      count.textContent = multi ? `${gi + 1} / ${group.length}` : '';
      prevBtn.hidden = nextBtn.hidden = !multi;
    };
    const go = (n) => { gi = (n + group.length) % group.length; render(); };
    const open = () => {
      lastFocus = document.activeElement;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      render();
      closeBtn.focus();
    };
    const close = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      mediaBox.textContent = '';   // stops any playing video
      lastFocus?.focus?.();
    };

    document.body.addEventListener('click', e => {
      const tile = e.target.closest('.gallery .tile');
      if (tile) {
        const tiles = Array.from(tile.closest('.gallery').querySelectorAll('.tile'));
        group = tiles.map(itemFromTile);
        gi = tiles.indexOf(tile);
        open();
        return;
      }
      const single = e.target.closest('.t-media img, .certificate-img, .give-aside img');
      if (single) {
        group = [{ type: 'image', src: single.currentSrc || single.src, cap: single.alt || '' }];
        gi = 0;
        open();
      }
    });

    prevBtn.addEventListener('click', () => go(gi - 1));
    nextBtn.addEventListener('click', () => go(gi + 1));
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => {
      if (!modal.classList.contains('show')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft'  && group.length > 1) go(gi - 1);
      else if (e.key === 'ArrowRight' && group.length > 1) go(gi + 1);
    });
  }

  /* ---- team carousel ---- */
  function initCarousel() {
    const car = $('.carousel');
    if (!car) return;
    const slides = $$('.carousel-slide', car);
    if (!slides.length) return;
    const dotsWrap = $('.car-dots', car);
    let idx = 0;

    const dots = slides.map((_, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Team member ${n + 1}`);
      b.addEventListener('click', () => go(n));
      dotsWrap?.appendChild(b);
      return b;
    });

    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
    };
    $('.car-prev', car)?.addEventListener('click', () => go(idx - 1));
    $('.car-next', car)?.addEventListener('click', () => go(idx + 1));
    car.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
    });
    go(0);
  }
})();
