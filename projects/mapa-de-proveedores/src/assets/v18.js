/* V18: motion for the four grounded European training references. */
(() => {
  const parent = document.querySelector('.heritage-v18');
  if (!parent) return;
  const elements = [...parent.querySelectorAll('[data-heritage-reveal]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced || !('IntersectionObserver' in window)) return;
  parent.classList.add('is-motion-ready');
  const observer = new IntersectionObserver((entries) => {
    for(const entry of entries){
      if(entry.isIntersecting){
        const index=elements.indexOf(entry.target);
        entry.target.style.transitionDelay=(Math.max(0,index)*85)+'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  },{rootMargin:'0px 0px -18px 0px',threshold:0.04});
  elements.forEach(el=>observer.observe(el));
})();
