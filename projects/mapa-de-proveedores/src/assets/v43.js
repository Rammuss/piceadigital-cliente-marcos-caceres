// V43: reveal on entering the visual field; no scroll lock, safe fallback without GSAP.
(() => {
  const material = document.querySelector('.material-v43-reveal');
  if (!material || !('IntersectionObserver' in window)) return;
  const image = material.querySelector('.material-v41-frame img');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  let fired = false;
  const show = () => {
    if (fired) return;
    fired = true;
    if (image) { image.loading = "eager"; image.fetchPriority = "high"; }
    // Ensure the actual image is decoded BEFORE starting its reveal.
    const ready = image && image.decode ? image.decode().catch(() => {}) : Promise.resolve();
    const finish = () => requestAnimationFrame(() => requestAnimationFrame(() => material.classList.add('v43-is-visible')));
    Promise.resolve(ready).then(finish);
    // Never leave the artwork permanently hidden if a browser stalls image.decode().
    setTimeout(finish, 3500);
  };
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); show(); }
  }, {threshold: .20, rootMargin: '0px 0px -17% 0px'});
  // Enable masked start only once the observer has been installed.
  observer.observe(material);
  document.documentElement.classList.add('v43-ready');
  // If a user jumps directly to this section, ensure it always becomes visible.
  if (material.getBoundingClientRect().bottom < 0) show();
})();
