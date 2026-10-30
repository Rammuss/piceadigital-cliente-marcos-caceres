/* GL&AS × Chiaramonte V13 | Scroll-guided categorization and metric reels */
(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const meters=[...document.querySelectorAll('[data-metric-target]')];
  function startMeter(el){
    if(el.classList.contains('is-counting'))return;
    const val=Number(el.dataset.metricTarget||0);
    el.style.setProperty('--reel-step',String(val));
    if(reduced){const strip=el.querySelector('.metric-v13-reel');if(strip)strip.style.transition='none';}
    // A frame before transition so movement is visually evident.
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('is-counting')));
  }
  if('IntersectionObserver'in window){
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){startMeter(e.target);io.unobserve(e.target);}})},{threshold:.32});
    meters.forEach(el=>io.observe(el));
  }else meters.forEach(startMeter);

  const root=document.getElementById('categorias');if(!root)return;
  const steps=[...root.querySelectorAll('[data-rating-story-level]')];
  if(!steps.length)return;
  const symbolsRoot=root.querySelector('#rating-v13-symbols');
  const cur=root.querySelector('#rating-v13-current');
  const type=root.querySelector('#rating-v13-category');
  const label=root.querySelector('#rating-v13-word');
  const progress=root.querySelector('#rating-v13-progress');
  const index=root.querySelector('#rating-v13-position');
  const tabs=[...root.querySelectorAll('[data-rating-jump]')];
  const signs={restaurant:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 4v12m8-12v12m8-12v12M12 16c0 5 3 8 8 8s8-3 8-8M20 24v12"/></svg>',bar:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M10 7h20l-2.5 10a8 8 0 0 1-15 0L10 7ZM20 25v8m-8 0h16"/></svg>'};
  let active=-1;let scrollFrame=0;let targetFromClick=-1;
  const setActive=(i)=>{
    i=Math.max(0,Math.min(i,steps.length-1));
    if(i===active)return;
    active=i;
    const item=steps[i],kind=item.dataset.ratingStoryKind,level=Number(item.dataset.ratingStoryLevel);
    const singular=kind==='restaurant'?'tenedor':'copa',plural=kind==='restaurant'?'tenedores':'copas';
    const fmt=String(level).padStart(2,'0');
    type.textContent=kind==='restaurant'?'RESTAURANTES':'BARES Y COCTELERÍAS';
    label.textContent=`${level} ${level===1?singular:plural}`;
    cur.classList.remove('is-popping');cur.textContent=fmt;
    if(!reduced){void cur.offsetWidth;cur.classList.add('is-popping');setTimeout(()=>cur.classList.remove('is-popping'),320)}
    symbolsRoot.innerHTML=Array.from({length:5},(_,j)=>`<span class="rating-v13-symbol ${j<level?'is-lit':''}">${signs[kind]}</span>`).join('');
    symbolsRoot.setAttribute('aria-label',`${level} de 5 ${plural}`);
    progress.style.width=`${((i+1)/steps.length)*100}%`;
    index.textContent=`${String(i+1).padStart(2,'0')} / 10`;
    steps.forEach((s,j)=>s.classList.toggle('is-active',i===j));
    tabs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ratingJump===kind)));
  };
  function recalc(){
    scrollFrame=0;
    // Responsive activation line lies below the sticky panel in small screens.
    const mobile=innerWidth<=700;
    const anchor=innerHeight*(mobile?.78:.52);
    let closest=0,distance=Infinity;
    steps.forEach((el,i)=>{
      const r=el.getBoundingClientRect();
      const center=r.top+r.height*.5;
      const d=Math.abs(center-anchor);
      if(d<distance){closest=i;distance=d;}
    });
    setActive(closest);
  }
  function onScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(recalc);}
  function goTo(i){
    const node=steps[i],r=node.getBoundingClientRect();
    const ratio=innerWidth<=700?.78:.52;
    const y=scrollY+r.top+r.height*.5-innerHeight*ratio;
    window.scrollTo({top:Math.max(0,y),behavior:reduced?'instant':'smooth'});
    setActive(i);
  }
  tabs.forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.ratingJump==='restaurant'?0:5)));
  // Keep existing click/touch naturally scrolling; no scroll hijacking, no pinning.
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  setActive(0);
  requestAnimationFrame(recalc);
})();
