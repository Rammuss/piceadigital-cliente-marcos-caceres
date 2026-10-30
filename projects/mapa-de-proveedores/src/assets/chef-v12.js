/* V12: elegant, progressive reveal of career highlights. No JavaScript dependency required. */
(()=>{
  const cards=[...document.querySelectorAll('#chef .chef-credential')];
  if(!cards.length)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal=card=>card.classList.add('chef-shown');
  if(reduced || !('IntersectionObserver' in window)){
    cards.forEach(reveal);return;
  }
  document.getElementById('chef').classList.add('chef-v12-motion');
  const io=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{
      if(isIntersecting){reveal(target);io.unobserve(target);}
    });
  },{rootMargin:'0px 0px -9% 0px',threshold:.12});
  cards.forEach(card=>io.observe(card));
})();
