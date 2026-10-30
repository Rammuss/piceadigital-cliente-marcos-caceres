/* V20 — show WhatsApp floating contact only when next section follows pinned hero. */
'use strict';
(() => {
  const floating = document.querySelector('.floating-contact');
  const next = document.querySelector('#propuesta-en-cifras') || document.querySelector('#inicio + section');
  if (!floating || !next) return;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    // Trigger only after the next section has visibly entered the viewport.
    // With a scroll-pinned hero, this happens after the full image reveal finishes.
    const show = next.getBoundingClientRect().top <= window.innerHeight * .70;
    floating.classList.toggle('is-visible', show);
    floating.setAttribute('aria-hidden', String(!show));
    if ('inert' in floating) floating.inert = !show;
  };
  const queue = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  };
  update();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('pageshow', queue);
})();
