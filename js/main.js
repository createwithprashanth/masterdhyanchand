    (() => {
      'use strict';

      /* ── Nav scroll state ── */
      const nav = document.getElementById('nav');
      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 60);
      window.addEventListener('scroll', onScroll, { passive: true });

      /* ── Scroll reveal ── */
      const revealObs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            revealObs.unobserve(e.target);
          }
        }),
        { threshold: 0.12 }
      );
      document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

      /* ── Lightbox ── */
      const IMAGES = [
        { src: 'media/images/web/IMG_7824.jpg',    alt: 'Karate Medal Ceremony' },
        { src: 'media/images/web/IMG_7249.jpg',    alt: 'Night Adventure' },
        { src: 'media/images/web/IMG_7518.jpg',    alt: 'The Curious Student' },
        { src: 'media/images/web/IMG_7861_1.jpeg', alt: 'Explorer Mode' },
        { src: 'media/images/web/image1.JPG',      alt: 'With Sensei' },
        { src: 'media/images/web/IMG_4808.jpg',    alt: 'Always in Style' },
      ];

      const lb      = document.getElementById('lightbox');
      const lbImg   = document.getElementById('lb-img');
      const lbClose = document.getElementById('lb-close');
      const lbPrev  = document.getElementById('lb-prev');
      const lbNext  = document.getElementById('lb-next');
      let current = 0;
      let lastFocused = null;

      const setImage = idx => {
        current = (idx + IMAGES.length) % IMAGES.length;
        lbImg.src = IMAGES[current].src;
        lbImg.alt = IMAGES[current].alt;
      };

      const open = idx => {
        lastFocused = document.activeElement;
        setImage(idx);
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
      };

      const close = () => {
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lastFocused?.focus();
      };

      /* Gallery: event delegation (no inline handlers) */
      document.querySelector('.gallery__grid').addEventListener('click', e => {
        const item = e.target.closest('[data-index]');
        if (item) open(Number(item.dataset.index));
      });
      document.querySelector('.gallery__grid').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          const item = e.target.closest('[data-index]');
          if (item) { e.preventDefault(); open(Number(item.dataset.index)); }
        }
      });

      lbClose.addEventListener('click', close);
      lbPrev.addEventListener('click',  () => setImage(current - 1));
      lbNext.addEventListener('click',  () => setImage(current + 1));

      /* Close on backdrop click */
      lb.addEventListener('click', e => { if (e.target === lb) close(); });

      /* Keyboard: arrows + escape + focus trap */
      document.addEventListener('keydown', e => {
        if (lb.getAttribute('aria-hidden') === 'true') return;
        if (e.key === 'Escape')      close();
        if (e.key === 'ArrowRight')  setImage(current + 1);
        if (e.key === 'ArrowLeft')   setImage(current - 1);

        /* Focus trap */
        if (e.key === 'Tab') {
          const focusable = [lbClose, lbPrev, lbNext];
          const idx = focusable.indexOf(document.activeElement);
          if (e.shiftKey) {
            focusable[(idx - 1 + focusable.length) % focusable.length].focus();
          } else {
            focusable[(idx + 1) % focusable.length].focus();
          }
          e.preventDefault();
        }
      });

      /* Touch/swipe for lightbox */
      let touchStartX = 0;
      lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) setImage(dx < 0 ? current + 1 : current - 1);
      }, { passive: true });

    })();
