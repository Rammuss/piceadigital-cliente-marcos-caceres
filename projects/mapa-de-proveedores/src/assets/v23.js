/* V24 sync patch — reveals automáticos al llegar, sincronizados con la carga real de la imagen. */
'use strict';
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = [
    ...document.querySelectorAll('#chef .chef-photo-wrap'),
    ...document.querySelectorAll('#experiencia .case-image')
  ];
  const targets = [];

  const waitForImage = (img) => {
    if (!img) return Promise.resolve();
    img.loading = 'eager';
    img.decoding = 'async';
    if (img.complete && img.naturalWidth > 0) {
      if (img.decode) return img.decode().catch(() => {});
      return Promise.resolve();
    }
    return new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (img.decode) { img.decode().catch(() => {}).finally(resolve); }
        else resolve();
      };
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', finish, { once: true });
      // Safety fallback in case browser deprioritizes a below-fold image.
      window.setTimeout(finish, 2200);
    });
  };

  for (const el of elements) {
    const img = el.querySelector('img');
    if (!img) continue;
    const fromRight = el.classList.contains('chef-photo-wrap') || el.dataset.wipe === 'from-right';
    el.classList.remove('media-reveal-scroll', 'media-reveal-ready', 'media-reveal-done', 'media-reveal-from-right');
    el.classList.add('media-reveal-auto');
    if (fromRight) el.classList.add('media-reveal-from-right');
    if (!el.querySelector('.media-reveal-edge')) {
      const edge = document.createElement('span');
      edge.className = 'media-reveal-edge';
      edge.setAttribute('aria-hidden', 'true');
      el.appendChild(edge);
    }
    el.__imgReady = waitForImage(img);
    if (reduce) {
      el.classList.add('is-open');
      el.dataset.revealState = 'complete';
    } else {
      el.dataset.revealState = 'waiting';
      targets.push(el);
    }
  }
  if (!targets.length) return;

  const opening = new WeakSet();
  const prewarm = new WeakSet();
  const start = async (el) => {
    if (opening.has(el)) return;
    opening.add(el);
    el.dataset.revealState = 'preparing';
    await (el.__imgReady || Promise.resolve());
    el.dataset.revealState = 'opening';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.classList.add('is-opening');
      const img = el.querySelector('img');
      const done = () => {
        el.classList.add('is-open');
        el.dataset.revealState = 'complete';
        el.removeEventListener('transitionend', onEnd);
      };
      const onEnd = (event) => {
        if (event.target === img && event.propertyName === 'clip-path') done();
      };
      el.addEventListener('transitionend', onEnd);
      window.setTimeout(() => { if (el.dataset.revealState === 'opening') done(); }, 2300);
    }));
  };

  if ('IntersectionObserver' in window) {
    const preloadObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!prewarm.has(el)) {
            prewarm.add(el);
            el.__imgReady?.catch?.(() => {});
          }
          preloadObserver.unobserve(el);
        }
      }
    }, { rootMargin: '40% 0px 40% 0px', threshold: 0.01 });

    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          start(entry.target);
          revealObserver.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -16% 0px', threshold: 0.34 });

    targets.forEach(el => {
      preloadObserver.observe(el);
      revealObserver.observe(el);
    });
  } else {
    const check = () => {
      targets.forEach(el => {
        if (opening.has(el)) return;
        const r = el.getBoundingClientRect();
        const vh = innerHeight;
        if (r.top < vh * 1.2) { el.__imgReady?.catch?.(() => {}); }
        if (r.top < vh * 0.78 && r.bottom > vh * 0.18) start(el);
      });
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    check();
  }
})();
